//index.js
//获取应用实例
// const app = getApp()
import * as echarts from '../../ec-canvas/echarts';

const app = getApp();




Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pagesCanbeDisplay: [
      {
        id: 'dvol1',
        index: 'dvol1',
        name: 'ICD 疾病核对卷1'
      },
      {
        id: 'dvol3',
        index: 'dvol3',
        name: 'ICD 疾病索引1-卷3',
        params: {
          'indexType': 1
        }
      },
      {
        id: 'dvol3',
        index: 'dvol3',
        name: 'ICD 疾病索引2-卷3',
        params: {
          'indexType': 2
        }
      },
      {
        id: 'dvol3',
        index: 'dvol3',
        name: 'ICD 疾病索引3-卷3',
        params: {
          'indexType': 3
        }
      },
      {
        id: 'ovol1',
        index: 'index',
        name: 'ICD 手术核对卷',
      },
      {
        id: 'ovol3',
        index: 'index',
        name: 'ICD 手术索引卷',
        params: {
          'indexType': 1
        }
      },
      {
        id: 'path',
        index: 'path',
        name: 'ICD 疾病路径'
      }
    ]
  },
  open: function (e) {
    let url = '../' + e.target.dataset.chart.id + '/' + e.target.dataset.chart.index;
    console.log('url:',url);
    let params = [];
    if (e.target.dataset.chart.params) {
      for (let key in e.target.dataset.chart.params) {
        let val = e.target.dataset.chart.params[key];
        params.push(`${key}=${val}`);
      }
      params = params.join('&');
      params = '?'+params;
      url += params;
    }
    wx.navigateTo({
      url: url
    });
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
