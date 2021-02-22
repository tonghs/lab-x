const config = require('../config.js')

function getUrl(route){
  return `https://${config.host}${route}`
}

function refrehToken(options){
  var refresh_token = wx.getStorageSync('refresh_token')
  wx.request({
    url: getUrl('/account/refresh_token/'),
    method: 'POST',
    data: {
      refresh_token: refresh_token
    },
    success(res) {
      if (res.statusCode === 200) {
        var ret = res.data.content
        var access_token = ret.access_token
        var refresh_token = ret.refresh_token
        var user_id = ret.user_id
        var user_name = ret.user_name

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
        options.success()
      } else {
        wx.showModal({
          title: '请退出后重新登录',
        })
      }
    }
  })
}

function request(options){
  options.data = options.data || {}
  var access_token = wx.getStorageSync('access_token')
  options.header = {Auth: access_token}
  wx.request({
    ...options,
    success (res) {
      if (res.statusCode != 200) {
        var msg = ""
        if (res.data.code !== undefined && res.data.code === 1000) {
          refrehToken({
            success() {
              request(options)
            }
          })

        } else {
          if (res.data.msg !== undefined ) {
            msg = res.data.msg
          } else {
            msg = '错误代码：' + res.statusCode
          }
          wx.showModal({
            title: '请求失败',
            content: msg
          })
        }
      } else {
        wx.showToast({
          title: 'ok'
        })
      }
    }
  })
}

module.exports = {
  getUrl: getUrl,
  refrehToken: refrehToken,
  request: request
}