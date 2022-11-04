// pages/chart/index.js
const req = require("../../common/request.js")
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    metricExtra: {},
    navBarHeight: app.globalData.navBarHeight,
    size: 15,
    needRefresh: false,
    userMetrics: [],
    //您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
    opts: {
      color: ["#1890FF"],
      padding: [20, 0, 0, 0],
      enableMarkLine: false,
      legend: {},
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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getServerData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.needRefresh) {
      this.getServerData()
      this.data.needRefresh = false
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

  add() {
    let _self = this
    wx.navigateTo({
      url: '/pages/chart/measure/measure',
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
    console.log(metricId);
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
      success: function(res) {
        var userMetrics = res;
        for (var i = 0; i < userMetrics.length; i++) {
          _self.getMeasureData(userMetrics[i].metric_id)
        }
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
              color: data[data.length - 1].color
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
        wx.vibrateShort({
          type: 'light',
        })
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
        _self.setData({
          userMetrics: userMetrics
        });

        if (typeof(opts) != "undefined" && 'success' in opts) {
          opts.success(userMetrics)
        }
      }
    })
  }
})