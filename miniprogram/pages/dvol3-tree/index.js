//dvol1.js
//获取应用实例
// const app = getApp()
import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
var chart = undefined;
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


function equipVol3Data(item) {
  return {
    'name': item.nameCh,
    'abbreviationCh': item.abbreviationCh,
    'codeType': item.codeType,
    'fullDesc': item.pathStr,
    'id': 'dvol3-' + item.id,
    'page': item.page,
    'parentid': item.parentID,
    'starCode': item.starCode||'-',
    'swordCode': item.swordCode||'-',
    'icdCode': item.icdCode,
    'hasChildren': item.hasChildren,
    'starCodeID': item.starCodeID,
    'swordCodeID': item.swordCodeID,
    'seeCondition': item.seeCondition,
    'seeAlsoCondition': item.seeAlsoCondition,
    'mcode': item.mcode,
    'tumer': item.tumer,
    'phar': item.phar,
    'indexType': item.indexType,
    'referID': item.referID,
    'referAlsoID': item.referAlsoID,
    'oCode': item.oCode,
    'zlevel': 10,
    'label': {
      'normal': {
        // 'formatter': [
        //   '{bgtitle' + '|' + (item.nameCh.match(/.{1,6}/g)).join('\n') + '}',

        //   '编码 ' + item.icdCode||'-' + ' 第[' + item.indexType+']索引',
        //   '{hr|}',
        //   item.starCode ? '星码:' + item.starCode + ' 剑码:' + item.swordCode||'-' : '',
        //   '{hr|}',
        //   'P' + item.page
        // ].join('\n'),
        show: true,
        backgroundColor: '#ddd',
        borderColor: '#555',
        borderWidth: 1,
        borderRadius: 5,
        color: '#000',
        fontSize: 14,
        zlevel: 0,
        // opacity: 0.4,
        rich: {
          'bgtitle': {
            backgroundColor: bgcolors['' + item.indexType],
            height: 30,
            borderRadius: [5, 5, 0, 0],
            padding: [0, 10, 0, 10],
            width: '100%',
            color: '#eee'
          },
          tc: {
            align: 'center',
            color: '#eee'
          },
          hr: {
            borderColor: '#777',
            width: '100%',
            borderWidth: 0.5,
            height: 0
          }
        }
      }
    }
  };
}

function make_tree_data(idx) {
  idx.name = idx.shortDesc;
  // rename subIndexes to children
  if (!idx.children) {
    idx.children = idx.subIndexes;
    
    delete idx.subIndexes;
    echarts.util.each(idx.children, function (item) {
      item.name=item.shortDesc;
    })
  }
  return idx;
}

function prepareVol3Data(current, parent, datas, links) {
  // 1. 添加 current 节点, current 节点与 parent 节点的 edge

  var node = equipVol3Data(current);
  datas.push(node);
  if (parent) {
    links.push({
      source: 'dvol3-' + parent.id,
      target: 'dvol3-' + current.id,
      symbolSize: [10, 10],
      label: {
        formatter: '包含',
        show: true,
        position: 'end'
      },
      lineStyle: {
        color: 'orange',
        curveness: 0.2,
        type: 'dashed',
        zlevel: 5
      }
    })
  }
  // 2. 添加 current 的 ref 节点，以及 current 与 ref 之间的 edge
  // var ref_types = Object.keys(current.refRelations);
  // for (let ref_type in ref_types) {
  //   ref_type = ref_types[ref_type];
  //   console.log('------- ref_type :', ref_type);
  //   console.log('----- keys check: ',Object.keys(current.refRelations));
  //   var ref_objs = current.refRelations[ref_type];
  //   for (let item in ref_objs) {
  //     item = ref_objs[item];
  //     datas.push({
  //       // ref obj node
  //       'name': item.relationContentCh,
  //       'codeType': item.relationType,
  //       'id': 'dvol1ref-' + item.id,
  //       'page': item.page,
  //       'parentid': item.parentID,
  //       'icdCode': item.referenceCode,
  //       'referenceid': item.referenceID,
  //       'mainid': item.mainID,
  //       'hasChildren': item.hasChildren,
  //       'label': {
  //         'normal': {
  //           'formatter': [
  //             '{bgtitle' + '|' + (item.relationContentCh.match(/.{1,6}/g)).join('\n') + '}',
  //             '类型 ' + item.referenceCode,
  //             '{hr|}',
  //             'P' + item.page
  //           ].join('\n'),
  //           show: true,
  //           backgroundColor: '#ddd',
  //           borderColor: '#555',
  //           borderWidth: 1,
  //           borderRadius: 5,
  //           color: '#000',
  //           fontSize: 14,
  //           rich: {
  //             'bgtitle': {
  //               backgroundColor: bgcolors[ref_type],
  //               height: 30,
  //               borderRadius: [5, 5, 0, 0],
  //               padding: [0, 10, 0, 10],
  //               width: '100%',
  //               color: '#eee'
  //             },
  //             tc: {
  //               align: 'center',
  //               color: '#eee'
  //             },
  //             hr: {
  //               borderColor: '#777',
  //               width: '100%',
  //               borderWidth: 0.5,
  //               height: 0
  //             }
  //           }
  //         }
  //       }
  //     });
  //     links.push({
  //       source: 'dvol1-'+current.id,
  //       target: 'dvol1ref-' + item.id,
  //       label: {
  //         formatter: ref_type,
  //         show: true,
  //         align: 'end'
  //       },
  //       lineStyle: {
  //         color: bgcolors[ref_type]
  //       }
  //     })
  //   }
  // }

  // 3. 对每个children 递归调用 prepareVol1Data
  if (current.hasChildren && current.subIndexes.length > 0) {
    for (let _item in current.subIndexes) {
      prepareVol3Data(current.subIndexes[_item], current, datas, links);
    }
  } else {
    return;
  }
}


// 选中 vol3 条目后，显示其祖先条目 + 儿子条目
function selectVol3Series(id, chart) {
  chart.showLoading();
  wx.request({
    url: `https://www.skyatlas.net/webAppICD/api/d3/getSeries?id=${id}`,
    header: {
      Accept: 'text/json;charset=utf-8'
    },
    method: 'GET',
    success: function (res) {
      chart.hideLoading();
      
      var icd = res.data.data;
      var tree_data = make_tree_data(icd);
      
      var option = {
        color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
        title: {
          text: '疾病索引'
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [{
          type: 'tree',
          data: [tree_data],
          top: "1%",
          left: '5%',
          bottom: '1%',
          right: '20%',
          symbolSize: 7,
          label: {
            
            position: 'right',
            verticalAlign: 'middle',
            align: 'left',
            fontSize: 9
          },
          leaves: {
            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right'
            }
          },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750
        }]
      };
      chart.setOption(option);
    },
    fail: function (err) {
      console.err('访问后台数据错误。');
    },
    complete: function () {
      console.log('后台数据访问结束.');
    }
  })
};

// init chart 后，完成 主导词 级别的数据装载
function initChart(canvas, width, height, dpr) {
  console.log('---------- echart initializing ----------');

  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  app.globalData.echart_ok = true;

  return chart;
}


Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    current: 'dvol1',
    data: [],
    level0: '',
    ec: {
      onInit: initChart
    }
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onReady: function () {
    console.log(' onReady function.');
    // while (!app.globalData.echart_ok) {
    //   console.log(' waiting for echarts initialized...');
    //   sleep(2);
    // }
    var inst = this;
    setTimeout(function () {
      chart.showLoading();
      wx.request({
        url: `https://www.skyatlas.net/webAppICD/api/disease3/search0Dis?type=1&name=${inst.data.level0}`,
        header: {
          Accept: 'text/json;charset=utf-8'
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data);
          let indexes = res.data.data;
          // equipment graph nodes.
          indexes = indexes.map(equipVol3Data);
          console.log(indexes);
          // draw chart
          var option = {
            color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
            title: {
              text: '疾病索引'
            },
            tooltip: {},
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [{
              type: 'graph',
              layout: 'force',
              force: {
                edgeLength: 300,
                repulsion: 2000,
                gravity: 0.8
              },
              symbolSize: 40,
              roam: true,
              label: {
                show: true,
              },
              edgeSymbol: ['circle', 'arrow'],
              edgeSymbolSize: [4, 10],
              edgeLabel: {
                normal: {
                  textStyle: {
                    fontSize: 20
                  }
                }
              },
              data: indexes,

              lineStyle: {
                normal: {
                  opacity: 0.9,
                  width: 2,
                  curveness: 0
                }
              }
            }]
          };
          chart.hideLoading();
          chart.setOption(option);

          // 设置点击事件处理
          chart.on('click', function (params) {
            console.log('--------- click event triggered ---------')
            console.log(params)

            if (params.componentType == 'series' 
              && params.componentSubType == 'graph'
              && params.dataType == 'node') {
              wx.showToast({
                title: '获取后台数据...',
                icon: 'success',
                duration: 1000
              });
              selectVol3Series(params.data.id.replace('dvol3-',''), chart);
            }
          });
        },
        fail: function (err) {
          console.error(' get disease vol1 chapters error.');
          wx.showToast({
            title: '访问后台数据错误(疾病索引 章)'
          });
        },
        complete: function () {
          console.log('wx.request call completed...');
        }
      })

    }, 1500);
  },
  onLoad: function (options) {
    if (options.level0) {
      this.setData({
        'level0': options.level0
      })

    }


  },

})