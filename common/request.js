const config = require('../config.js')
const sha1 = require('./crypto.js');

const app = getApp()

function getUrl(route) {
  return `https://${config.host}${route}`
}

function refrehToken(options) {
  var data = {
    refresh_token: wx.getStorageSync('refreshToken')
  }
  data.sign = getSign(data)
  wx.request({
    url: getUrl('/account/refresh_token/'),
    method: 'POST',
    data: data,
    success(res) {
      if (res.statusCode === 200) {
        var ret = res.data.content
        var accessToken = ret.access_token
        var refreshToken = ret.refresh_token
        var userId = ret.user_id
        var userName = ret.user_name

        wx.setStorage({
          data: accessToken,
          key: 'accessToken',
        })
        wx.setStorage({
          data: refreshToken,
          key: 'refreshToken',
        })
        wx.setStorage({
          data: userId,
          key: 'userId',
        })
        wx.setStorage({
          data: userName,
          key: 'userName',
        })
        options.success()
      } else {
        app.globalData.loginRedirectUrl = "/" + getCurrentPages()[0].route;

        var page = getCurrentPages().pop();
        if (page != undefined || page != null) {
          page.setData({
            needRefresh: true
          });
        }
        wx.switchTab({
          url: '/pages/account/index'
        })
      }
    }
  })
}

function request(options) {
  wx.showLoading({
    title: '加载中',
  })
  options.data = options.data || {}
  options.data.sign = getSign(options.data)
  if (options.url.indexOf(config.host) === -1) {
    options.url = this.getUrl(options.url)
  }

  options.header = options.header || {}
  options.header.Auth = wx.getStorageSync('accessToken')
  options.header["content-type"] = "application/json"
  wx.request({
    ...options,
    success(res) {
      if (res.statusCode != 200) {
        var msg = ""
        if (res.data.code !== undefined && res.data.code === 1000) {
          refrehToken({
            success() {
              request(options)
            }
          })
        } else {
          if (res.data.msg !== undefined) {
            msg = res.data.msg
          } else {
            msg = '错误代码：' + res.statusCode
          }
          wx.hideLoading({
            success: (res) => {
                wx.showModal({
                title: '请求失败',
                content: msg
              })
              // if (options.fail !== undefined) {
              //   options.fail(res)
              // }
            },
          })
          
        }
      } else {
        if (options.success !== undefined) {
          options.success(res)
        }
        wx.hideLoading({
          success: (res) => { },
        })
      }
    }
  })
}

function getSign(params) {
  var secret = config.apiSecret
  if (typeof params == "string") {
    return paramsStrSort(params, secret);
  } else if (typeof params == "object") {
    var arr = [];
    for (var i in params) {
      if (i == "sign") {
        continue;
      }
      arr.push((i + "=" + params[i]));
    }
    return paramsStrSort(arr.join(("&")), secret);
  }
}

function paramsStrSort(paramsStr, secret) {
  var newParamStr = paramsStr.split("&").sort().join("&")
  return sha1.HmacSHA1(newParamStr, secret).toString();
}

module.exports = {
  getUrl: getUrl,
  refrehToken: refrehToken,
  request: request,
  getSign: getSign
}