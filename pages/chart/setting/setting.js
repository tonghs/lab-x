// pages/metric/settting/setting.js
const req = require("../../../common/request")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    metricId: 0,
    chartTypes: [],
    activedType: "line",
    refValue: 0,
    unit: "",
    name: "",
    defaultSelected: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      metricId: options.metricId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.loadData()
  },

  loadData() {
    let _self = this;
    this.getChartTypes({
      success: function() {
        _self.getUserMetric()
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  changeDefaultSelected(e) {
    if (e.detail.value == "1") {
      req.request({
        url: "/chronic_disease/user_metric/" + this.data.metricId + "/deafult_selected/",
        method: "POST",
        success: function (res) {
          wx.vibrateShort({
            type: 'light',
          })
          this.loadData();
          const eventChannel = _self.getOpenerEventChannel()
          eventChannel.emit('backCallabck', { data: { needRefresh: true } });
        }
      })
    }
  },

  changeType(e) {
    let _self = this
    let typeName = e.currentTarget.dataset.type_name
    this.setData({
      activedType: typeName
    })
    req.request({
      url: "/chronic_disease/metric/" + this.data.metricId + "/chart_types/",
      method: "POST",
      data: {
        chart_type: typeName
      },
      success: function (res) {
        wx.vibrateShort({
          type: 'light',
        })
        const eventChannel = _self.getOpenerEventChannel()
        eventChannel.emit('backCallabck', { data: { needRefresh: true } });
      }
    })
  },

  getUserMetric() {
    let _self = this
    req.request({
      url: "/chronic_disease/user_metric/" + this.data.metricId + "/",
      method: "GET",
      success: function (res) {
        let content = res.data.content
        _self.setData({
          refValue: content.user_metric.ref_value,
          activedType: content.user_metric.chart_type,
          unit: content.user_metric.metric_unit,
          name: content.user_metric.metric_text,
          defaultSelected: content.user_metric.default_selected
        });
      }
    })
  },

  getChartTypes(opts) {
    let _self = this
    req.request({
      url: "/chronic_disease/metric/" + this.data.metricId + "/chart_types/",
      method: "GET",
      success: function (res) {
        let content = res.data.content
        _self.setData({
          chartTypes: content.chart_types,
          activedType: content.selected
        });
        if (typeof(opts) != "undefined" && 'success' in opts) {
          opts.success()
        }
      }
    })
  }
})