var app = getApp()
var alreadyLogin = function () {
  console.dir(app.globalData)
  if (app.globalData.isLogin) return true;
  if (wx.getStorageSync('token')) {
    app.globalData.isLogin = true
    app.globalData.hasUserInfo = true
    app.globalData.token = wx.getStorageSync('token')
    return true
  }
  return false
}

// pages/support/support.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'from': ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('  onLoad ,',options)
    // 判断是否已经
    if (!alreadyLogin()) {
      console.log('redirect to login page.')
      wx.redirectTo({
        url: '../login/login?next=../support/support',
      })
    } else {
      console.log('already login ', app.globalData.token)
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

  }
})