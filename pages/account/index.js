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
    logined: wx.getStorageSync('access_token') && wx.getStorageSync('user_id'),
    appUserInfo: {"user_id": wx.getStorageSync('user_id'), "user_name": wx.getStorageSync('user_name')}
  },
  // 事件处理函数
  // bindViewTap() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
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
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  login(e) {
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
              console.log(res)
              if (res.statusCode != 200) {
                var msg = ""
                if (res.data.msg !== undefined ) {
                  msg = res.data.msg
                } else {
                  msg = '错误代码：' + res.statusCode
                }
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
                  key: 'user_id',
                })
                wx.setStorage({
                  data: user_name,
                  key: 'user_name',
                })
              }
            },
            fail (res) {
              wx.showToast({
                title: '登录失败',
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
          canIUser: false,
          logined: false
        })
      },
    })
  },
  getUsers(e){
    req.request({
      url: req.getUrl('/users/'),
      method: 'GET',
      data: {
      }
    })
  }
})
