// pages/chart/index.js
const utils = require("../../common/utils.js")
const req = require("../../common/request")
const config = require("../../config")
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    docPackages: [],
    nextCursor: "",
    pageSize: 20,

    showActionsheet: false,
    actionGroups: [],
    slogan: config.slogan,

    apiUrl: {
      getListUrl: "/chronic_disease/doc_packages/",
      docPackagesUrl: '/chronic_disease/doc_package/'
    },

    navBarHeight: app.globalData.navBarHeight,
    menuWidth: app.globalData.menuWidth,
    menuRight: app.globalData.menuRight,
    menuHeight: app.globalData.menuHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self = this
    this.setData({
      nextCursor: null
    }, function () {
      req.request({
        url: _self.data.apiUrl.getListUrl,
        data: {user_id: wx.getStorageSync('userId'), cursor: this.data.nextCursor, size: this.data.pageSize},
        method: "GET",
        success: function(res) {
          var docPackages = res.data.content.doc_packages
          for (var i = 0; i < docPackages.length; i++){
            docPackages[i].ident_urls = utils.sliceArray(docPackages[i].ident_urls, 3)
          }
          _self.setData({
            docPackages: docPackages,
            nextCursor: res.data.content.next_cursor
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
    if (this.data.docPackages.length == 0) {
      this.onLoad()
    }
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
    this.onLoad()
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _self = this
    if (this.data.nextCursor !== "") {
      req.request({
        url: _self.data.apiUrl.docPackagesUrl,
        data: {user_id: wx.getStorageSync('userId'), cursor: this.data.nextCursor, size: this.data.pageSize},
        method: "GET",
        success: function(res) {
          var docPackages = res.data.content.doc_packages
          for (var i = 0; i < docPackages.length; i++){
            docPackages[i].ident_urls = utils.sliceArray(docPackages[i].ident_urls, 3)
            _self.data.docPackages.push(docPackages[i])
          }
          _self.setData({
            docPackages: _self.data.docPackages,
            nextCursor: res.data.content.next_cursor
          })
        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  navToUploader: function() {
    wx.navigateTo({
      url: '/pages/doc/upload/index',
    })
  },


  navToSearch: function() {
    wx.navigateTo({
      url: '/pages/doc/search/index',
    })
  },

  btnMenuClick: function (e) {
    var packageId = e.currentTarget.dataset.itemId

    this.setData({
      showActionsheet: true,
      actionGroups: [
        { text: '编辑', value: packageId },
        { text: '删除', type: 'warn', value: packageId }
      ]
    })
  },
  preview: function (e) {
    var packageId = e.currentTarget.dataset.itemId
    var docPackages = this.data.docPackages
    var urls = []
    for (var i = 0; i < docPackages.length; i++) {
      if (docPackages[i].id === packageId) {
        for (var m = 0; m < docPackages[i].ident_urls.length; m++) {
          for (var n = 0; n < docPackages[i].ident_urls[m].length; n++) {
            urls.push(docPackages[i].ident_urls[m][n])
          }
        }
        break
      }
    }
    var url = e.currentTarget.dataset.url
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  actionSheetItemClick: function(e) {
    var detail = e.detail
    var _self = this
    var packageId = parseInt(detail.value)
    if (detail.index === 0) {  // 编辑描述
      wx.navigateTo({
        url: '/pages/doc/edit/index?packageId=' + packageId,
      })
      this.setData({
        showActionsheet: false
      })
    } else if (detail.index === 1) {  // 删除
      wx.showModal({
        title: '提示',
        content: '确定要删除吗？',
        success: function (sm) {
          if (sm.confirm) {
              // 用户点击了确定 调用删除方法
              req.request({
                url: _self.data.apiUrl.docPackagesUrl,
                data: {"package_id": packageId},
                method: 'DELETE',
                success: () => {
                  _self.setData({
                    showActionsheet: false
                  }, function () {
                    this.onLoad()
                  })
                }
              })
            } else if (sm.cancel) {
              // console.log('用户点击取消')
              _self.setData({
                showActionsheet: false
              })
            }
          }
        })
    }
  },
})