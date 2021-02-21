// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: '探索未知实验室',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    logined: false,
    appUserInfo: {},
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
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
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  login(e) {
    var _self = this
    var data = wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://web.net.motn.top/account/wxapp/login/',
            method: 'POST',
            data: {
              code: res.code,
              user_name: app.globalData.userInfo.nickName
            },
            success (res) {
              // console.log(res.data)
              var ret = res.data.content
              wx.showToast({
                title: '登录成功',
              })
              var access_token = ret.access_token
              var refresh_token = ret.refresh_token
              var user_id = ret.user_id
              var user_name = ret.user_name

              _self.setData({"logined": true, "appUserInfo": {"user_id": user_id, "user_name": user_name}})
              wx.setStorage({
                data: access_token,
                key: 'access_token',
              })
              wx.setStorage({
                data: refresh_token,
                key: 'refresh_token',
              })
              wx.setStorage({
                data: user_id,
                key: 'user-id',
              })
              wx.setStorage({
                data: user_name,
                key: 'user_name',
              })
            }
          })
        } else {
          wx.showToast({
            title: '登录失败！' + res.errMsg,
          })
        }
      }
    })
    
  }
})
