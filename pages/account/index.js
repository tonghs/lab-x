// index.js
// 获取应用实例
const accountUtils = require('../../common/account.js')
const logout = require('../../common/logout.js')
const config = require("../../config")
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isLogined: false,
    appUserInfo: {},

    slogan: config.slogan,
  },

  onLoad() {
    const userId = wx.getStorageSync("userId")
    const userName = wx.getStorageSync("userName")
    const isAdmin = wx.getStorageSync("isAdmin")
    const avatarUrl = wx.getStorageSync("avatarUrl")

    if (userId !== "" && userName !== "") {
      this.setData({
          appUserInfo: {
            userId: userId,
            userName: userName,
            isAdmin: isAdmin
          }
      })
    }

    if (avatarUrl !== "") {
      this.setData({
        "appUserInfo.avatarUrl": avatarUrl
      })
    }

    var isLogined = wx.getStorageSync("isLogined")
    if (isLogined) {
      this.setData({
        isLogined: isLogined
      })
    }
  },

  getUserInfo(e) {
    app.globalData.userInfo = e.detail.userInfo
  },

  login() {
    var _self = this
    accountUtils.login({
      success(res) {
        var loginRedirectUrl = app.globalData.loginRedirectUrl
        app.globalData.loginRedirectUrl = null
        _self.setData({
          isLogined: true,
          appUserInfo: {
            userId: res.user_id,
            userName: res.user_name,
            isAdmin: res.is_admin,
            avatarUrl: res.avatar_url
          },
        }, function() {
          wx.switchTab({
            url: loginRedirectUrl,
          })
        })
        _self.onLoad()
      }
    })
  },

  logout() {
    var _self = this
    logout.logout({
      success() {
        wx.showToast({
          title: '退出成功',
        })
        _self.setData({
          appUserInfo: {},
          hasUserInfo: false,
          isLogined: false
        })
      }
    })
  },

  navTo(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },

  navToLoginByPhone() {
    wx.navigateTo({
      url: '/pages/account/phone/phone',
    })
  },

  onShow() {
    this.onLoad()
  }
})
