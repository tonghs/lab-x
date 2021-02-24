// pages/users/index.js
const req = require('../../common/request.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    users: [],
    currentCursor: '',
    nextCursor: '',
    refreshing: false,
    loginedUserId: 0
  },

  getData() {
    var _self = this
    if ((this.data.nextCursor !== "" || this.data.currentCursor === "") && !this.data.refreshing) {
      this.setData({
        currentCursor: this.data.nextCursor,
        refreshing: true
      }, () => {
        req.request({
          url: req.getUrl('/users/'),
          method: 'GET',
          data: {
            size: 20,
            cursor: this.data.currentCursor
          },
          success(res) {
            _self.setData({
              users: _self.data.users.concat(res.data.content.users),
              nextCursor: res.data.content.next_cursor,
              refreshing: false
            })
            wx.hideLoading({
              success: (res) => {},
            })
          }
        })
      })
      
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      loginedUserId: wx.getStorageSync('user_id')
    })
    this.getData()
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
  },
  lower: function() {
    this.getData()
  }
})