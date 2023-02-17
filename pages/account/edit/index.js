// pages/account/update/index.js
const req = require("../../../common/request.js")
const cos = require("../../../common/cos.js")

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
            userId: res.data.content.user_id,
            userName: res.data.content.user_name,
            isAmin: res.data.content.is_admin,
            avatarUrl: "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0",
            avatarIdent: ""
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
    var queryUserId = parseInt(options.userId)
    var isMe = queryUserId == wx.getStorageSync('userId')
    var canEdit = isMe || wx.getStorageSync('isAdmin')

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
        userId: this.data.userInfo.userId,
        userName: e.detail.value
      }
    })
  },
  onChooseAvatar: function(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      "userInfo.avatarUrl": avatarUrl
    });
  },
  uploadFile: function(options) {
    var _self = this

    cos.uploadFile({
      path: _self.data.userInfo.avatarUrl,
      success: (res) => {
        _self.setData({
          "userInfo.avatarUrl": res.url + "?imageView2/2/w/1024/q/85",
          "userInfo.avatarIdent": res.key
        }, function() {
          if (options.success !== undefined) {
            options.success()
          }
        })
      },
      fail: (res) => {
        console.log(res);
        wx.showModal({title: '上传失败', content: "头像上传失败，请稍候重试", showCancel: false});
        wx.hideLoading({
          success: (res) => {},
        });
      }
    });
  },
  
  save: function(){
    var _self = this
    this.uploadFile({
      success: function() {
        var userId = _self.data.queryUserId
        var userName = _self.data.userInfo.userName
        var userIdent = _self.data.userInfo.avatarIdent
        req.request({
          url: "/update_user/",
          method: "POST",
          data: {
            user_id: userId,
            user_name: userName,
            user_ident: userIdent
          },
          success() {
            wx.setStorageSync('userName', userName)
            wx.showToast({
              title: '修改成功',
            });
            wx.navigateBack({
              delta: 1,
              success: function() {
                let page = getCurrentPages().pop()
                if(page == undefined || page == null){
                    return;
                }
                page.onLoad()
              }
            });
          }
        })
      }
    })
  }
})