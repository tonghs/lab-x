// pages/metric/metric.js
const req = require("../../common/request")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    metrics: []
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
    this.getServerData()
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


  selectOrClear(e) {
    const metricId = e.currentTarget.dataset.metric_id;
    const value = e.detail.value;
    console.log(metricId, value);
    const method = value ? "POST" : "DELETE"
    req.request({
      url: "/chronic_disease/user_metric/" + metricId + "/",
      method: method,
      success() {
        wx.vibrateShort({
          type: 'light',
        })
      }
    })
  },

  getServerData() {
    const _self = this
    req.request({
      url: "/chronic_disease/metrics/",
      method: "GET",
      success(res) {
        const data = res.data.content.metrics
        _self.setData({
          metrics: data
        })
      }
    })
  }
})