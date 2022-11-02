// pages/chart/measures/measures.js
const req = require("../../../common/request")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showActionSheet: false,
    actionGroups: [],
    metricId: 1,
    size: 15,
    cursor: "",
    chartTypes: [],
    activedType: "line",
    data: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getMetricMeasure()
    this.getChartTypes()
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
        const eventChannel = _self.getOpenerEventChannel()
        eventChannel.emit('backCallabck', { data: { needRefresh: true } });
      }
    })
  },

  onItemLongTap(e) {
    let measureId = e.currentTarget.dataset.rid
    this.setData({
      showActionSheet: true,
      actionGroups: [
        { text: "删除", type: "warn", value: measureId }
      ]
    })
  },

  actionSheetItemClick(e) {
    let id = e.detail.value
    let _self = this
    req.request({
      url: "/chronic_disease/metric_measure/" + id,
      data: {},
      method: "DELETE",
      success: function (e) {
        _self.getMetricMeasure()
        _self.setData({
          showActionSheet: false
        })
        const eventChannel = _self.getOpenerEventChannel()
        eventChannel.emit('backCallabck', { data: { needRefresh: true } });
      }
    })
  },

  getMetricMeasure() {
    let _self = this
    req.request({
      url: "/chronic_disease/metric_measures/",
      data: {
        metric_id: this.data.metricId,
        cursor: this.data.cursor,
        size: this.data.size
      },
      method: "GET",
      success: function (res) {
        let content = res.data.content

        _self.setData({
          data: content.datas,
          activedType: content.chart_type,
          cursor: content.next_cursor
        })
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
          chartTypes: content.chart_types
        });
        if (typeof(opts) != "undefined" && 'success' in opts) {
          opts.success()
        }
      }
    })
  }
})
