const req = require('./request.js')
var app = getApp()

module.exports = {
  login(options) {
    wx.showLoading({
      title: '登录中',
    })
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        
        wx.login({
          success (res) {
            var data = {
              code: res.code,
              user_name: app.globalData.userInfo.nickName
            }
            data.sign = req.getSign(data)            
            if (res.code) {
              //发起网络请求
              wx.request({
                url: req.getUrl('/account/wxapp/login/'),
                method: 'POST',
                header: {
                  'content-type': 'application/json'
                },
                data: data,
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
                        
                    wx.setStorageSync('access_token', access_token)
                    wx.setStorageSync('refresh_token', refresh_token)
                    wx.setStorageSync('user_id', user_id)
                    wx.setStorageSync('user_name', user_name)
                    wx.setStorageSync('is_admin', is_admin)
                    wx.setStorageSync('is_logined', true)

                    if (options.success !== undefined) {
                      options.success(ret)
                    }
    
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
        
      }
    })
  },
  logout(options) {
    wx.clearStorage({
      success: (res) => {
        if (options.success !== undefined) {
          options.success(res)
        }
      },
    })
  },
  getUserInfo() {

  }
}