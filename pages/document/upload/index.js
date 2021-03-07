// pages/chart/index.js
const cos = require("../../../common/cos.js")
const req = require("../../../common/request.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    uploadedFileUrls: [],
    uploadedKeys: [],
    desc: ""
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
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            that.setData({
                files: that.data.files.concat(res.tempFilePaths)
            });
        }
    })
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
      var _self = this
      // console.log('upload files', files)
      // 文件上传的函数，返回一个promise
      return new Promise((resolve, reject) => {
        for (var i = 0; i < files.tempFilePaths.length; i++) {
          cos.uploadFile({
            path: files.tempFilePaths[i],
            success: (res) => {
              _self.data.uploadedKeys.push(res.key)  // 存储 key
              _self.data.uploadedFileUrls.push({url: res.url + "?imageView2/q/85"})
              if (_self.data.uploadedFileUrls.length >= files.tempFilePaths.length) {
                resolve({
                  urls: files.tempFilePaths
                })
              }
            },
            fail: () => {
              reject(res)
            }
          })
        }
      })
  },
  uploadError(e) {
      // console.log('upload error', e.detail)
      wx.showModal({title: '图片尺寸过大！', showCancel: false, });
  },
  uploadSuccess(e) {
      // console.log('upload success', e.detail)
      // wx.showModal({title: '上传成功', showCancel: false});
    // console.log(this.data.uploadedKeys)
    this.setData({
      files: this.data.uploadedFileUrls  // 替换 tmp 路径为线上 url
    })
  },
  save: function() {
    req.request({
      url: "/chronic_condition/doc_package/",
      data: {
        idents: this.data.uploadedKeys,
        desc: this.data.desc
      },
      method: 'POST',
      success: function() {
        wx.navigateBack({
          delta: 1,
        })
      }
    })
    
  }
})