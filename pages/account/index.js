// index.js
// 获取应用实例
const req = require('../../common/request.js')
const accountUtils = require('../../common/account.js')
const account = require('../../common/account.js')
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    is_logined: false,
    appUserInfo: {}
  },

  onLoad() {
    var user_id = wx.getStorageSync("user_id")
    var user_name = wx.getStorageSync("user_name")
    var is_admin = wx.getStorageSync("is_admin")

    if (user_id !== "" && user_name !== "") {
      this.setData({
          appUserInfo: {
            user_id: user_id,
            user_name: user_name,
            is_admin: is_admin
          }
      })
    }

    var is_logined = wx.getStorageSync("is_logined")
    if (is_logined) {
      this.setData({
        is_logined: is_logined
      })
    }

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  login(e) {
    var _self = this
    accountUtils.login({
      success(res) {
        _self.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true,
          is_logined: true,
          appUserInfo: {
            user_id: res.user_id,
            user_name: res.user_name,
            is_admin: res.is_admin
          }
        })
      }
    })
  },
  logout(e) {
    var _self = this
    accountUtils.logout({
      success() {
        wx.showToast({
          title: '退出成功',
        })
        _self.setData({
          appUserInfo: {},
          userInfo: {},
          hasUserInfo: false,
          is_logined: false
        })
        app.globalData.userInfo = {}
        app.globalData.hasUserInfo = false
      }
    })
  },
  navTo(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  }
})
