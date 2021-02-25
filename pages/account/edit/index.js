// pages/account/update/index.js
const req = require("../../../common/request.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryUserId: 0,
    isMe: false,
    canEdit: false,
    userInfo: {}
  },

  getAppUserInfo: function() {
    var _self = this
    req.request({
      url: "/user/",
      data: {
        user_id: this.data.queryUserId
      },
      success(res) {
        _self.setData({
          userInfo: {
            user_id: res.data.content.user_id,
            user_name: res.data.content.user_name,
            is_admin: res.data.content.is_admin
          }
        })
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self = this
    var queryUserId = parseInt(options.user_id)
    var isMe = queryUserId == wx.getStorageSync('user_id')
    var canEdit = isMe || wx.getStorageSync('is_admin')

    this.setData({
      queryUserId: queryUserId,
      isMe: isMe,
      canEdit: canEdit
    }, () => {
      _self.getAppUserInfo()
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
  getInputValue (e) {
    this.setData({
      userInfo: {
        user_id: this.data.userInfo.user_id,
        user_name: e.detail.value
      }
    })
  },
  save: function(){
    var user_id = this.data.queryUserId
    var user_name = this.data.userInfo.user_name
    req.request({
      url: "/update_user/",
      method: "POST",
      data: {
        user_id: user_id,
        user_name: user_name
      },
      success() {
        wx.setStorageSync('user_name', user_name)
        wx.showToast({
          title: '修改成功',
        })
      }
    })
  }
})