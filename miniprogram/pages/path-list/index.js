//dvol1.js
//获取应用实例
// const app = getApp()


const app = getApp();
const bgcolors = {
  "1": "black",
  "2": "purple",
  "3": "red",
  "亚目": "blue",
  "包含": "green",
  "包括": 'grey',
  "不包括": '#538EA6',
  "另编码": '#F2D1B3',
  "星剑": '#F2B8A2',
  "other": '#F28C8C',
  "组": "#FF9F7F"
};





Page({
  data: {
    cities: [],
    level0: '阑尾炎',
    names: [],
    icdKey: '',
    paths: [],
  },

  //事件处理函数

  
  
 


  onLoad: function (options) {
    if (options.icdKey) {
      this.setData({
        icdKey: options.icdKey
      });



    } else {
      wx.showToast({
        title: '无效输入',
        duration: 1500,
        icon: 'success'
      })
    }

  },
  onChange(event) {
    console.log(event.detail, 'click right menu callback data')
  },
  onselect(e) {
    console.log('onselect', e);
    let pathHashCode = e.target.dataset.path.pathHashCode;
    // let vol3id = e.target.dataset.city.id;
    
      wx.navigateTo({
        url: `../path-show/index?icdKey=${this.data.icdKey}&pathHashCode=${pathHashCode}`,
      })
    
    
  },
  onReady: function () {
    let inst = this;
    let byCode = false;
    if (this.data.icdKey.match(/^[a-zA-Z]/)) {
      byCode = true;
    }
    let url = '';
    console.log('icdKey:',inst.data.icdKey);
    console.log('byCode:',byCode);
    if (byCode) {
      url = `https://www.skyatlas.net/webAppICD/api/data/prtpathIndexstr?icd=${inst.data.icdKey}&type=1`
    } else {
      url = `https://www.skyatlas.net/webAppICD/api/icd/autocode?diagName=${inst.data.icdKey}`
    }
    setTimeout(function () {
      wx.showLoading({
        title: '数据查询中...',
      })
      wx.request({
        url: url,
        header: {
          Accept: 'text/json;charset=utf-8'
        },
        method: 'GET',
        success: function (res) {
          wx.hideLoading({
            success: (res) => {},
          })
          console.log(res.data)
          let paths = res.data.data
          inst.setData({
            paths: paths
          })
          if (paths.length==0) {
            wx.showToast({
              title: '无符合条件结果',
              duration: 4500,
              icon: 'none',
              success: function(res) {
                console.log('----- no path found -------');
                wx.navigateBack({
                  delta: 1,
                });
              }
            });
            
          }
          
        },
        fail: function (err) {
          console.error(' reverse query error.')
          wx.showToast({
            title: '访问后台数据错误'
          })
        },
        complete: function () {
          console.log('wx.request call completed...')
        }
      })

    }, 1500);
  }
})