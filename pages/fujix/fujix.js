// pages/fujix.js
const config = require('../../config.js')
const req = require('../../common/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    error: "",
    rules: [
      {
        name: "name",
        rules: { required: true, message: '[名称]必填' },
      },
      {
        name: "film_simulation",
        rules: { required: true, message: '[胶片模拟]必填' },
      },
      {
        name: "dynamic_range",
        rules: { required: false, message: '' },
      },
      {
        name: "grain_effect",
        rules: { required: false, message: '' },
      },
      {
        name: "color_chrome_effect",
        rules: { required: false, message: '' },
      },
      {
        name: "color_chrome_effect_blue",
        rules: { required: false, message: '' },
      },
      {
        name: "white_balance",
        rules: { required: false, message: '' },
      },
      {
        name: "highlight",
        rules: { required: false, message: '' },
      },
      {
        name: "shadow",
        rules: { required: false, message: '' },
      },
      {
        name: "color",
        rules: { required: false, message: '' },
      },
      {
        name: "sharpness",
        rules: { required: false, message: '' },
      },
      {
        name: "noise_reduction",
        rules: { required: false, message: '' },
      },
      {
        name: "clarity",
        rules: { required: false, message: '' },
      },
      {
        name: "iso",
        rules: { required: false, message: '' },
      },
      {
        name: "exposure_compensation",
        rules: { required: false, message: '' },
      }
    ],
    metadata: {
      "name": "",
      "film_simulation": "",
      "dynamic_range": "",
      "grain_effect": "",  // 颗粒效果
      "color_chrome_effect": "",  // 彩色效果
      "color_chrome_effect_blue": "",  // 彩色FX蓝色
      "white_balance": "",
      "highlight": "",
      "shadow": "",
      "color": "",
      "sharpness": "",  // 锐度
      "noise_reduction": "",  // 降噪（高 ISO 降噪）
      "clarity": "",  // 清晰度
      "iso": "",
      "exposure_compensation": ""  // 曝光补偿
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  chooseMedia() {
    var _self = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        const tempFiles = res.tempFiles
        req.uploadImage({
          url: req.getUrl('/fujix/ocr/'),
          filePath: tempFiles[0].tempFilePath,
          data: {
            "user": "test"
          },
          success: function (res) {
            let content = JSON.parse(res.data).content;
            if (content == undefined) {
              return
            }
            content.name = ""
            _self.setData({
              metadata: content
            });
          }
        })
      }
    })
  },

  save() {
    this.selectComponent('#form').validate((valid, errors) => {
      if (!valid) {
        let errMsg = ""
        for (var i = 0; i < errors.length; i++) {
          errMsg = errMsg + "\n*" + errors[i].message
        }
        this.setData({
          error: errMsg
        }, () => {
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 300
          })
        })
      } else {
        console.log(this.data.metadata);
      }
    })
  },

  inputChange(e) {
    const id = e.currentTarget.id;
    let key = "metadata." + id
    const value = e.detail.value;
    this.setData({
      [key]: value
    })
  }
})