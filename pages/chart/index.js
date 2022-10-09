// pages/chart/index.js
const req = require("../../common/request.js")
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    metricName: "",
    limit: 15,
    unit: "",
    avgData: {
      avg15: 0,
      avg7: 0,
      v: 0
    },

    chartData: {
      series: []
    },
    //您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
    opts: {
      padding: [15, 5, 0, 5],
      enableMarkLine: true,
      legend: {},
      xAxis: {
        disableGrid: true,
        rotateLabel: true,
        rotateAngle: -45
      },
      yAxis: {
        disabled: true
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
    this.getServerData()
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
  add: function () {
    wx.navigateTo({
      url: '/pages/chart/measure/measure',
    })
  },
  getServerData: function () {
    let _self = this
    req.request({
      url: "/chronic_disease/metric_measures/",
      data: {
        metric_id: 1,
        limit: this.data.limit
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
              data: data
            }
          ]
        };
        let maxWidth = 35
        let minWidth = 10
        let maxDataLength = 15
        let minDataLength = 1
        let columnWidth = maxWidth - ((maxWidth - minWidth) / (maxDataLength - minDataLength)) * (dataLength - minDataLength)
        _self.setData({
          chartData: JSON.parse(JSON.stringify(chartData)),
          metricName: content.metric_text,
          unit: content.metric_unit,
          avgData: content.avg_data,
          ['opts.extra.markLine.data']: [{value: content.ref_value}],
          ['opts.extra.column.width']: columnWidth
        });
        wx.stopPullDownRefresh()
      }
    })
  }
})