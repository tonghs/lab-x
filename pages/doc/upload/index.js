// pages/chart/index.js
const cos = require("../../../common/cos.js")
const req = require("../../../common/request.js")
const config = require("../../../config")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    uploadedFileUrls: [],
    uploadedKeys: [],
    desc: "",
    btnDisabled: true,
    slogan: config.slogan
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
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
  previewImage: function(e){
      wx.previewImage({
          current: e.currentTarget.id, // 当前显示图片的http链接
          urls: this.data.uploadedFileUrls // 需要预览的图片http链接列表
      })
  },
  selectFile(files) {
      // console.log('files', files)
      // 返回false可以阻止某次文件上传
  },
  uplaodFile(files) {
      this.setData({
        btnDisabled: true
      })
      var _self = this
      // 文件上传的函数，返回一个promise
      return new Promise((resolve, reject) => {
        for (var i = 0; i < files.tempFilePaths.length; i++) {
          cos.uploadFile({
            path: files.tempFilePaths[i],
            success: (res) => {
              _self.data.uploadedKeys.push(res.key)  // 存储 key
              _self.data.uploadedFileUrls.push({url: res.url + "?imageView2/2/w/1024/q/85"})
              if (_self.data.uploadedFileUrls.length >= files.tempFilePaths.length) {
                resolve({
                  urls: files.tempFilePaths
                })
              }
            },
            fail: (res) => {
              reject(res)
            }
          })
        }
      }).catch((e) => { });
  },
  uploadError(e) {
      wx.showModal({title: e.detail.errMsg, showCancel: false, });
  },

  uploadSuccess(e) {
    this.setData({
      files: this.data.uploadedFileUrls,  // 替换 tmp 路径为线上 url
      btnDisabled: false
    })
  },

  bindInput(e) {
    this.setData({
      desc: e.detail.value
    });
  },

  save: function() {
    console.log(this.data.desc)
    req.request({
      url: "/chronic_disease/doc_package/",
      data: {
        idents: this.data.uploadedKeys,
        desc: this.data.desc
      },
      method: 'POST',
      success: function() {
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
  },
  deletePic: function (e) {
    var index = e.detail.index
    this.data.files.splice(index, 1)
    this.data.uploadedKeys.splice(index, 1)
    this.data.uploadedFileUrls.splice(index, 1)
  }
})