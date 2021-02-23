// index.js
// 获取应用实例
const req = require('../../common/request.js')
const app = getApp()

Page({
  data: {
    motto: '探索未知实验室',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    is_logined: false,
    appUserInfo: {}
  },

  onLoad() {
    if (app.globalData.appUserInfo) {
      this.setData({
          appUserInfo: app.globalData.appUserInfo,
      })
    }

    if (app.globalData.is_logined) {
      this.setData({
        is_logined: app.globalData.is_logined
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
    wx.showLoading({
      title: '登录中',
    })
    var _self = this
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: req.getUrl('/account/wxapp/login/'),
            method: 'POST',
            data: {
              code: res.code,
              user_name: app.globalData.userInfo.nickName
            },
            success (res) {
              if (res.statusCode != 200) {
                var msg = ""
                if (res.data.msg !== undefined ) {
                  msg = res.data.msg
                } else {
                  msg = '错误代码：' + res.statusCode
                }
                wx.hideLoading({
                  success: (res) => {},
                })
                wx.showModal({
                  title: '登录失败',
                  content: msg
                })
              } else {
                var ret = res.data.content
                wx.showToast({
                  title: '登录成功',
                })
                var access_token = ret.access_token
                var refresh_token = ret.refresh_token
                var user_id = ret.user_id
                var user_name = ret.user_name
                var is_admin = ret.is_admin
                _self.setData({
                  is_logined: true,
                  appUserInfo: {
                    user_id: user_id,
                    user_name: user_name,
                    is_admin: is_admin
                  }
                })
                app.globalData.appUserInfo = {
                  user_id: user_id,
                  user_name: user_name,
                  is_admin: is_admin
                }
                app.globalData.is_logined = true

                wx.setStorage({
                  data: access_token,
                  key: 'access_token',
                })
                wx.setStorage({
                  data: refresh_token,
                  key: 'refresh_token',
                })

                wx.hideLoading({
                  success: (res) => {},
                })
              }
            },
            fail (res) {
              wx.showToast({
                title: '登录失败',
              })
              wx.hideLoading({
                success: (res) => {},
              })
            }
          })
        } else {
          wx.showToast({
            title: '登录失败！' + res.errMsg,
          })
          wx.hideLoading({
            success: (res) => {},
          })
        }
      }
    })
    
  },
  logout(e) {
    wx.clearStorage({
      success: (res) => {
        wx.showToast({
          title: '退出成功',
        })
        this.setData({
          appUserInfo: {},
          userInfo: {},
          hasUserInfo: false,
          is_logined: false
        })
        app.globalData.appUserInfo = {}
        app.globalData.userInfo = {}
        app.globalData.hasUserInfo = false
        app.globalData.is_logined = false
      },
    })
  },
  getUsers(e){
    wx.navigateTo({
      url: '/pages/users/index',
    })
  }
})
