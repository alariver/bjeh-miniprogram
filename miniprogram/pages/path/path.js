//path.js
//获取应用实例
// const app = getApp()

const app = getApp();







Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    current: 'dvol1',
    data: [],
    icdKey: ''
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  icdEnter: function(e){
    this.setData({
      icdKey: e.detail.value
    })
  },
  handleClick: function(e) {
    console.log('===>',this.data.icdKey);
    if (!this.data.icdKey) {
      wx.showToast({
        title: '无效输入',
        icon: 'none',
        duration: 1500
      })
    }
    else {
      console.log(' input icdKey: '+this.data.icdKey);
      wx.navigateTo({
        url: `../path-list/index?icdKey=${this.data.icdKey}`,

      })
    }
  },

  onLoad: function () {
    
    
  },
  
})