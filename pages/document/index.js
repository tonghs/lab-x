// pages/chart/index.js
const cos = require("../../common/cos.js")
const utils = require("../../common/utils.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "previewImgs": []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  uploadDoc: function() {
    var _self = this
    cos.uploadFile({
      prefix: "document/",
      preview: (res) => {
        _self.setData({
          previewImgs: utils.sliceArray(res.imgs, 3)
        })
      },
      success: (res) => {
        
      }
    })
  }
})