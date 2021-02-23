// pages/users/index.js
const req = require('../../common/request.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    users: [],
    nextCursor: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self = this
    req.request({
      url: req.getUrl('/users/'),
      method: 'GET',
      data: {},
      success(res) {
        _self.setData({
          "users": res.data.content.users,
          "nextCursor": res.data.content.next_cursor
        })
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  setOrClearAdmin: function (e) {
    var user_id = e.currentTarget.dataset.id
    console.log(user_id)
  }
})