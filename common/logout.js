module.exports = {
  logout(options) {
    wx.clearStorage({
      success: (res) => {
        if (options.success !== undefined) {
          options.success(res)
        }
      },
    })
  }
}