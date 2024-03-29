// pages/chart/index.js
const req = require("../../common/request.js")
const config = require("../../config")

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    slogan: config.slogan,
    metricExtra: {},
    navBarHeight: app.globalData.navBarHeight,
    size: 15,
    needRefresh: false,
    userMetrics: [],
    defaultMetricId: 0,
    actionGroups: [],
    //您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
    opts: {
      color: ["#1890FF"],
      canvas2d: true,
      animation: false,
      duration: 500,
      padding: [20, 0, 0, 0],
      enableMarkLine: false,
      legend: {},
      update:true, 
      xAxis: {
        disableGrid: true,
        rotateLabel: true,
        rotateAngle: -45,
        fontSize: 10,
        fontColor: "#cdcdcd"
      },
      yAxis: {
        disabled: true,
        disableGrid: true
      },
      legend: {
        show: false
      },
      extra: {
        column: {
          type: "group",
          width: 10,
          activeBgColor: "#000000",
          activeBgOpacity: 0.08,
          seriesGap: 5,
          barBorderRadius: [
            6,
            6,
            6,
            6
          ]
        },
        markLine: {
          type: 'dash',
          data: []
        }
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getServerData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var isLogined = wx.getStorageSync("isLogined")
    if (isLogined) {
      if (this.data.needRefresh) {
        this.getServerData()
        this.data.needRefresh = false
      }
    } else {
      req.refrehToken()
      this.data.needRefresh = true
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getServerData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  navToMetricsPage() {
    let _self = this
    wx.navigateTo({
      url: '/pages/metric/metric',
      events: {
        backCallabck: (data) => {
          _self.setData({
            needRefresh: data.data.needRefresh
          })
        }
      }
    })
  },

  add() {
    let _self = this
    wx.navigateTo({
      url: '/pages/chart/measure/measure?metricId=' + this.data.defaultMetricId,
      events: {
        backCallabck: (data) => {
          _self.setData({
            needRefresh: data.data.needRefresh
          })
        }
      }
    })
  },

  addMore() {
      var arr = new Array()
      for (var i = 0; i < this.data.userMetrics.length; i++) {
        arr.push({
          text: this.data.userMetrics[i].metric_text,
          type: "info",
          value: this.data.userMetrics[i].metric_id
        })
      };
      this.setData({
        showActionSheet: true,
        actionGroups: arr
      })
  },

  actionSheetItemClick(e) {
    let metricId = e.detail.value
    this.setData({
      showActionSheet: false,
    })
    let _self = this
    wx.navigateTo({
      url: '/pages/chart/measure/measure?metricId=' + metricId,
      events: {
        backCallabck: (data) => {
          _self.setData({
            needRefresh: data.data.needRefresh
          })
        }
      }
    })
  },

  toSetting(e) {
    let _self = this
    var metricId = e.currentTarget.dataset.metric_id;
    wx.navigateTo({
      url: '/pages/chart/setting/setting?metricId=' + metricId,
      events: {
        backCallabck: (data) => {
          _self.setData({
            needRefresh: data.data.needRefresh
          })
        }
      }
    })
  },

  viewAll(e) {
    const metric_id = e.currentTarget.dataset.metric_id;
    let _self = this
    wx.navigateTo({
      url: '/pages/chart/measures/measures?metricId=' + metric_id,
      events: {
        backCallabck: (data) => {
          _self.setData({
            needRefresh: data.data.needRefresh
          })
        }
      }
    })
  },

  getServerData() {
    const _self = this;
    this.getUserMetrics({
      success: function (res) {
        var userMetrics = res;
        for (var i = 0; i < userMetrics.length; i++) {
          _self.getMeasureData(userMetrics[i].metric_id)
        };
      }
    });
  },

  getMeasureData(metricId) {
    let _self = this
    req.request({
      url: "/chronic_disease/metric_measures/recent",
      data: {
        metric_id: metricId,
        size: this.data.size
      },
      method: 'GET',
      success: function (res) {
        let content = res.data.content
        let data = content.datas
        let dataLength = data.length
        var categories = new Array()
        for (let i in data) {
          categories.push(data[i].created_at)
        }


        let chartData = {
          categories: categories,
          series: [
            {
              name: content.metric_text,
              data: data,
              color: data.length > 0 ? data[data.length - 1].color : ""
            }
          ]
        };

        let maxWidth = 35
        let minWidth = 10
        let maxDataLength = 15
        let minDataLength = 1
        let columnWidth = maxWidth - ((maxWidth - minWidth) / (maxDataLength - minDataLength)) * (dataLength - minDataLength)
        var opts = JSON.parse(JSON.stringify(_self.data.opts))
        opts.extra.column.width = columnWidth
        if (content.ref_value != null) {
          opts.extra.markLine.data = [{ value: content.ref_value }];
          opts.enableMarkLine = true;
        }

        _self.setData({
          ['data.' + metricId]: JSON.parse(JSON.stringify(chartData)),
          ['chartType.' + metricId]: content.chart_type,
          ['metricExtra.' + metricId]: {
            chartType: content.chart_type,
            metricText: content.metric_text,
            unit: content.metric_unit,
            refValue: content.ref_value,
            opts: opts,
            avgData: content.avg_data
          }
        });
        wx.stopPullDownRefresh()
      }
    })
  },

  getUserMetrics(opts) {
    const _self = this
    req.request({
      url: "/chronic_disease/user_metrics/",
      method: "GET",
      success(res) {
        var userMetrics = res.data.content.user_metrics;
        let defaultMetricId;
        for (var i = 0; i < userMetrics.length; i++) {
          if (userMetrics[i].default_selected == 1) {
            defaultMetricId = userMetrics[i].metric_id;
          }
        }
        _self.setData({
          userMetrics: userMetrics
        });

        if (defaultMetricId !== undefined) {
          _self.setData({
            defaultMetricId: defaultMetricId
          });
        }

        if (typeof (opts) != "undefined" && 'success' in opts) {
          opts.success(userMetrics)
        }
      }
    })
  }
})