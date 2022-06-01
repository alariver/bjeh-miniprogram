//dvol1.js
//获取应用实例
// const app = getApp()
import * as echarts from '../../ec-canvas/echarts';

import {
  cities
} from './city';

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
    v3id: '',
    v3name: '',
  },

  //事件处理函数

  
  
 


  onLoad: function (options) {
    var inst = this;
    if (options.vol3name && options.vol3id) {
      this.setData({
        'v3id': options.vol3id,
        'v3name': options.vol3name
      })

    }
    else{
      console.log(' required parameter lost...');
      return;
    }
    if (options.vol3name.match(/^[>见另]/)) {
      console.log('见、另见、化学药剂、肿瘤 不跳转...');
      return;
    }
    {
      console.log('options',options);
      console.log('inst.data',inst.data);
      console.log('this.data',this.data)
      // not local cached.
      console.log(' root names not cached local ...');
      wx.showLoading({
        title: '数据传递中...',
      });
      // 获取所有疾病索引主导词
      wx.request({
        url: `https://www.skyatlas.net/webAppICD/api/d3/children?id=${inst.data.v3id}`,
        header: {
          Accept: 'text/json;charset=utf-8'
        },
        method: 'GET',
        success: function (res) {
          wx.hideLoading({
            success: (res) => {},
          })
          var names = res.data.data;
          if (names.length == 0) {
            console.log(' no data found , go back...');
            wx.showToast({
              title: '没有进一步数据,返回上一页...',
              duration: 3500
            });
            wx.navigateBack({
              delta: 1,
            });
            return;
          }
          console.log(' names size: ' + names.length);
          console.log(names);
          inst.setData({
            names: names
          });
          let storeCity = new Array(26);
          const words = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
          words.forEach((item, index) => {
            storeCity[index] = {
              key: item,
              list: []
            }
          })
          // console.log('names:', inst.data.names);
          inst.data.names.forEach((item) => {
            item.pinyin = item.pinyin.replace(/[^a-zA-Z]/g, '');
            // item.pinyin=item.pinyin.replace('>','');
            let firstName = item.pinyin.substring(0, 1).toUpperCase();
            // console.log('firstName:',firstName);
            let index = words.indexOf(firstName);
            storeCity[index].list.push({
              name: item.name,
              key: firstName,
              id: item.id,
              hasChildren: item.hasChildren,
            });
          })
          // console.log('onReady names:', storeCity);
          inst.data.cities = storeCity;
          inst.setData({
            cities: inst.data.cities
          })
          
        },
        fail: function (err) {
          console.log(err);
        },
        complete: function () {
          console.log('completed.')
        }
      })

    }

  },
  onChange(event) {
    console.log(event.detail, 'click right menu callback data')
  },
  onselect(e) {
    console.log('onselect', e);
    let vol3name = e.target.dataset.city.name;
    let vol3id = e.target.dataset.city.id;
    if (e.target.dataset.city.hasChildren) {
      wx.navigateTo({
        url: `../dvol3-next/dvol3?vol3name=${vol3name}&vol3id=${vol3id}`,
      })
    }
    else {
      wx.showToast({
        title: '没有下级数据了...',
        duration: 2000,
      })
    }
    
  },
  onReady: function () {

  }
})