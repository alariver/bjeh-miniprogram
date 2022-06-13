// pages/login/login.js
const app = getApp()
const {
  $Toast
} = require('../../dist/base/index')
const {
  $Message
} = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'username': 'Hechzh',
    'phone': '',
    'password': '',
    'from': ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(' login onLoad ,',options)
    if (options.next) {
      this.setData({'from': options.next})
    }
    wx.getUserInfo({
      success: function (res) {
        console.dir(res)
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        console.log(nickName)
        app.globalData.userInfo = userInfo

      }
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

  //手机号登录
  mobileLogin(e) {
    // $Toast({
    //   content: '登录中...',
    //   type: 'loading',
    //   duration: 0,
    //   mask: false
    // });
    console.log('in mobile login ...')
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    wx.login({
      success: res => {
        console.log(res)
        //请求后端换取openid的接口
        wx.request({
          url: 'https://www.skyatlas.net/app/mobileLogin/',
          method: 'POST',
          data: {
            //将code和用户基础信息传到后端
            jscode: res.code,
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData,
            nickname: app.globalData.userInfo.nickName,
            avatar_url: app.globalData.userInfo.avatarUrl,
            gender: app.globalData.userInfo.gender
          },
          success: res => {
            //获取到openid作为账号
            console.log("res=============", res)
            console.log(app.globalData.userInfo)
            if (res.data.code == 200 && res.data.msg == "ok") {
              //this.reFreshUserProfile()
              wx.setStorageSync('token', res.data.token)
              app.globalData.isLogin = true
              app.globalData.hasUserInfo = true
              app.globalData.token = res.data.token
              // $Toast.hide();
              var to = '../support/support'
              if (this.data.from) {
                to = this.data.from
              }
              wx.redirectTo({
                url: to
              })
            } else {
              wx.showToast({
                title: '网络发生错误请稍后再试!',
                icon: 'error',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },
  //微信登录
  wxlogin() {
    $Toast({
      content: '登录中...',
      type: 'loading',
      duration: 0,
      mask: false
    });
    wx.login({
      success: res => {
        console.log(res)
        //请求后端换取openid的接口
        wx.request({
          url: 'https://www.skyatlas.net/app/wxlogin/',
          method: 'POST',
          data: {
            //将code传到后端
            jscode: res.code
          },
          success: res => {
            //获取到openid作为账号
            console.log("res=============", res)
            console.log(app.globalData.userInfo)
            if (res.data.code == 200 && res.data.msg == "ok") {
              //this.reFreshUserProfile()
              wx.setStorageSync('token', res.data.token)
              app.globalData.isLogin = true
              app.globalData.hasUserInfo = true
              app.globalData.token = res.data.token
              $Toast.hide();
              wx.redirectTo({
                url: '../index/index?id=1'
              })
            } else {
              wx.showToast({
                title: '登录失败请稍后再试!',
                icon: 'error',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },
  // 获取输入账号
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

 
  // 登录
  login: function () {
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'loading',
        duration: 2000
      })
    } else {
      console.log('in login ...')
      
      wx.login({
        success: res => {
          console.log(res)
          //请求后端换取openid的接口
          wx.request({
            url: 'https://www.skyatlas.net/app/elogin/',
            method: 'POST',
            header: {"content-type":"application/x-www-form-urlencoded"},
            data: {
              //将code和用户基础信息传到后端
              username: this.data.phone,
              password: this.data.password,
              jscode: res.code,
              
              nickname: app.globalData.userInfo.nickName,
              avatar_url: app.globalData.userInfo.avatarUrl,
              gender: app.globalData.userInfo.gender
            },
            success: res => {
              //获取到openid作为账号
              console.log("res=============", res)
              console.log(app.globalData.userInfo)
              if (res.data.code == 200 && res.data.msg == "ok") {
                //this.reFreshUserProfile()
                console.log(' status code 200...')
                wx.setStorageSync('token', res.data.token)
                app.globalData.isLogin = true
                app.globalData.hasUserInfo = true
                app.globalData.token = res.data.token
                // $Toast.hide();
                var to = '../support/support'
                if (this.data.from) {
                  to = this.data.from
                }
                wx.redirectTo({
                  url: to
                })
              } else {
                wx.showToast({
                  title: res.data.msg , 
                  icon: 'error',
                  duration: 2000 
                  
                })
              }
            }
          })
        }
      })
      // 这里修改成跳转的页面
      // wx.showToast({
      //   title: '登录成功',
      //   icon: 'success',
      //   duration: 2000
      // })
    }
  }

})