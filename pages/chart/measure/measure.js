// pages/chart/measure.js
const req = require("../../../common/request.js")
const config = require("../../../config")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: "",
    date: null,
    time: null,
    btnDisabled: false,
    labels: [],
    activedLabel: ""
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
    let now = new Date((new Date).getTime() + 8 * 3600000).toISOString()
    this.setData({
      date: now.slice(0, 10),
      time: now.slice(11, 16)
    })
    this.getMetricLabels()
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

  bindTimeChange(e) {
    this.setData({time: e.detail.value})
  },

  bindDateChange(e) {
    this.setData({date: e.detail.value})
  },

  bindValueChange(e) {
    var value = e.detail.value
    if (value != "") {
      this.setData({
        btnDisabled: false,
        value: value
      })
    } else {
      this.setData({
        btnDisabled: true
      })
    }
  },

  getMetricLabels() {
    let _self = this
    req.request({
      url: "/chronic_disease/metric/1/labels/",
      method: "GET",
      success: function(res) {
        _self.setData({
          labels: res.data.content.metric_labels,
          activedLabel: res.data.content.metric_labels[0].name
        })
      }
    })
  },

  changeLabel(e) {
    let labelName = e.currentTarget.dataset.label_name
    this.setData({
      activedLabel: labelName
    })
  },

  save() {
    let _self = this
    req.request({
      url: "/chronic_disease/metric_measure/",
      data: {
        metric_id: 1,
        value: this.data.value,
        metric_label: this.data.activedLabel,
        created_at: this.data.date + " " + this.data.time
      },
      method: "POST",
      success: function() {
        const eventChannel = _self.getOpenerEventChannel()
        eventChannel.emit('backCallabck', {data: {needRefresh: true}});

        wx.navigateBack({
          delta: 1,
          success: function() {
            let page = getCurrentPages().pop()
            if(page == undefined || page == null){
                return;
            }
            page.onLoad()
          }
        })
      }
    })
  }
})