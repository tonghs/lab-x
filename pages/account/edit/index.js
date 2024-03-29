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
    avatarEditState: false,
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
        var avatarUrl = res.data.content.avatar_url
        if (!avatarUrl) {
          avatarUrl = "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0"
        }
        _self.setData({
          userInfo: {
            userId: res.data.content.user_id,
            userName: res.data.content.user_name,
            isAmin: res.data.content.is_admin,
            avatarUrl: avatarUrl,
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
      "userInfo.userName": e.detail.value
    })
  },
  onChooseAvatar: function(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      avatarEditState: true,
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
        wx.hideLoading({
          success: (res) => {},
        });
      }
    });
  },
  
  save: function(){
    var _self = this
    var fn = function() {
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
        success(ret) {
          wx.setStorageSync('userName', ret.data.content.user_name)
          wx.setStorageSync('avatarUrl', ret.data.content.avatar_url)
          wx.showToast({
            title: '修改成功',
          });
          let page = getCurrentPages()[0]
          wx.navigateBack({
            delta: 1,
            success: function() {
              if(page == undefined || page == null){
                  return;
              }
              page.onLoad()
            }
          });
        }
      })
    }
    if (this.data.avatarEditState) {
      this.uploadFile({
        success: fn
      })
    } else {
      fn()
    }
  }
})