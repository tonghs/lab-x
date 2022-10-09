// pages/chart/index.js
const cos = require("../../common/cos.js")
const utils = require("../../common/utils.js")
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,

    chartData: {},
    //您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
    opts: {
      color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
        padding: [15,5,0,5],
        enableMarkLine: true,
        legend: {},
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          data: [
            {
              min: 0
            }
          ]
        },
        extra: {
          column: {
            type: "group",
            width: 20,
            activeBgColor: "#000000",
            activeBgOpacity: 0.08,
            seriesGap: 5,
            barBorderRadius: [
              6,
              6,
              6,
              6
            ]
          },
          markLine: {
            data: [
              {
                value: 21,
                showLabel: true
              }
            ]
          }
        }
      }
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
    this.getServerData();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  add: function() {
    // wx.navigateTo({
    //   url: '/pages/document/upload/index',
    // })
  },
  getServerData() {
    //模拟从服务器获取数据时的延时
    setTimeout(() => {
      //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
      let res = {
        categories: ["2016","2017","2018","2019","2020","2021"],
        series: [
          {
            name: "血糖",
            data: [18,27,{"value":21,"color":"#EE6666"},24,6,28]
          }
        ]
      };
    this.setData({ chartData: JSON.parse(JSON.stringify(res)) });
  }, 500);
  }
})