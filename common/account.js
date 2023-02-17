const req = require('./request.js')
var app = getApp()

module.exports = {
  login(options) {
    wx.getUserProfile({
      desc: '完善用户信息',
      fail: function (err) {
        wx.showModal({
          title: '登录失败',
          content: err
        })
      },
      success: res => {
        app.globalData.userInfo = res.userInfo
        console.log(res)

        wx.showLoading({
          title: '登录中',
        });
        wx.login({
          success(res) {
            let data = {
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
                success(res) {
                  if (res.statusCode != 200) {
                    var msg = ""
                    if (res.data.msg !== undefined) {
                      msg = res.data.msg
                    } else {
                      msg = '错误代码：' + res.statusCode
                    }
                    wx.hideLoading({
                      success: (res) => { },
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

                    wx.setStorageSync('accessToken', ret.access_token)
                    wx.setStorageSync('refreshToken', ret.refresh_token)
                    wx.setStorageSync('userId', ret.user_id)
                    wx.setStorageSync('userName', ret.user_name)
                    wx.setStorageSync('isAdmin', ret.is_admin)
                    wx.setStorageSync('avatarUrl', ret.avatar_url)
                    wx.setStorageSync('isLogined', true)

                    if (options.success !== undefined) {
                      options.success(ret)
                    }

                    wx.hideLoading({
                      success: (res) => { },
                    })
                  }
                },
                fail(res) {
                  wx.showToast({
                    title: '登录失败',
                  })
                  wx.hideLoading({
                    success: (res) => { },
                  })
                }
              })
            } else {
              wx.showToast({
                title: '登录失败！' + res.errMsg,
              })
              wx.hideLoading({
                success: (res) => { },
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
  }
}