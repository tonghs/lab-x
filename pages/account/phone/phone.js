// pages/account/phone.js
const req = require("../../../common/request.js")

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    action: "login",
    btnGetCodeDisabled: true,
    btnLoginDisabled: true,
    phoneNumber: "",
    code: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const action = options.action
    if (action != undefined) {
      this.setData({
        action: action
      });
    }
    if (action == "bind") {
      wx.setNavigationBarTitle({
        title: '绑定手机号',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '使用手机登录',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  getPhoneNumberValue(e) {
    const phone = e.detail.value;
    if (phone.length == 11) {
      this.setData({
        btnGetCodeDisabled: false,
        phoneNumber: phone
      })
    }
  },

  getCodeValue(e) {
    const code = e.detail.value;
    if (code.length == 4) {
      this.setData({
        code: code,
        btnLoginDisabled: false
      })
    }
  },

  login() {
    req.request({
      url: "/account/signin_via_phone/",
      method: "POST",
      data: {
        phone: this.data.phoneNumber,
        auth_code: this.data.code
      },
      success(res) {
        const ret = res.data.content
        wx.setStorageSync('accessToken', ret.access_token)
        wx.setStorageSync('refreshToken', ret.refresh_token)
        wx.setStorageSync('userId', ret.user_id)
        wx.setStorageSync('userName', ret.user_name)
        wx.setStorageSync('isAdmin', ret.is_admin)
        wx.setStorageSync('avatarUrl', ret.avatar_url)
        wx.setStorageSync('isLogined', true)
        var loginRedirectUrl = app.globalData.loginRedirectUrl
        app.globalData.loginRedirectUrl = null
        wx.hideLoading({
          success: (res) => {
            if (loginRedirectUrl !== null) {
              wx.switchTab({
                url: loginRedirectUrl,
              })
            } else {
              wx.navigateBack({
                delta: 0,
              })
            }
          },
        })
      }
    })
  },

  bindPhone() {
    req.request({
      url: "/account/bind_phone/",
      method: "POST",
      data: {
        phone: this.data.phoneNumber,
        auth_code: this.data.code
      },
      success(res) {
        wx.hideLoading({
          success: (res) => {
            wx.navigateBack({
              delta: 0,
            })
          }
        })
      }
    })
  },
  getCode() {
    req.request({
      url: "/auth/sms_auth_code/",
      method: "POST",
      data: {
        phone: this.data.phoneNumber
      },
      success(res) {
        wx.showModal({
          title: '短信发送成功',
          content: "请注意查收"
        })
        wx.hideLoading({
          success: (res) => {},
        })
      },
      fail(res) {
        wx.showModal({
          title: '短信发送失败',
          content: res
        })
      }
    })
  }
})