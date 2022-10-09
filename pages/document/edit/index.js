// pages/document/edit/index.js
const req = require('../../../common/request')
const config = require('../../../config')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    packageId: 0,
    docPackage: {},
    slogan: config.slogan
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self = this
    var packageId = parseInt(options.packageId)
    this.setData({
      packageId: packageId
    }, function() {
      req.request({
        url: "/chronic_disease/doc_package/",
        data: {
          package_id: packageId,
        },
        method: 'GET',
        success: function(res) {
          _self.setData({
            docPackage: res.data.content.doc_package
          })
        }
      })
    })
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

  inputChage: function(e) {
    this.data.docPackage.desc = e.detail.value
  },

  deleteImg: function(e) {
    var index = e.currentTarget.dataset.index
    var value = e.currentTarget.dataset.value
    this.data.docPackage.idents.splice(index, 1)
    this.data.docPackage.ident_urls.splice(index, 1)
    this.setData({
      docPackage: this.data.docPackage
    })
  },

  save: function() {
    req.request({
      url: '/chronic_disease/update_doc_package/',
      method: 'POST',
      data: this.data.docPackage,
      success: function(res) {
        wx.navigateBack({
          delta: 1,
          success: function() {
            let page = getCurrentPages().pop()
            if(page == undefined || page == null){
                return;
            }
            page.onLoad()
          }
        })
      }
    })
  }
})