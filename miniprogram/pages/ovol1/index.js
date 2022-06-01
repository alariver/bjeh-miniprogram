//dvol1.js
//获取应用实例
// const app = getApp()
import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
const bgcolors = {
  "章": "black",
  "节": "purple",
  "类目": "red",
  "亚目": "blue",
  "包含": "green",
  "包括": 'grey',
  "不包括": '#538EA6',
  "另编码": '#F2D1B3',
  "星剑": '#F2B8A2',
  "other": '#F28C8C',
  "组": "#FF9F7F"
};

// not used.
function vol1tooltip(item) {
  var label = [];
  if (item.refRelations) {
    var ref_types = Object.keys(item.refRelations);
    for (let ref_type in ref_types) {
      ref_type = ref_types[ref_type];
      console.log('------- ref_type :', ref_type);
      console.log('----- keys check: ', ref_types);
      var ref_objs = item.refRelations[ref_type];
      label.push('{hr|}');
      label.push('{bginfo|' + ref_type + '}')
      for (let _item in ref_objs) {
        _item = ref_objs[_item];
        label.push(_item.relationContentCh);

      }
    }
  }
  return label.join('\n');
};

// 为 核对 node 生产 label
function vol1Label(item) {
  // console.log('----- vol1Label ------');
  // console.log(item);
  var label = [
    '{bgtitle' + '|' + (item.codeNameCh.match(/.{1,6}/g)).join('\n') + '}',


  ];

  // 包括、不包括、另编码、星剑
  if (item.refRelations) {
    var ref_types = Object.keys(item.refRelations);
    for (let ref_type in ref_types) {
      ref_type = ref_types[ref_type];
      console.log('------- ref_type :', ref_type);
      console.log('----- keys check: ', ref_types);
      var ref_objs = item.refRelations[ref_type];
      label.push('{hr|}');
      label.push('{bginfo|' + ref_type + '}')
      for (let _item in ref_objs) {
        _item = ref_objs[_item];
        label=label.concat(_item.relationContentCh.match(/.{1,10}/g));
        if (_item.referenceCode) label.push(`[ ${_item.referenceCode} ]`);
      }
    }
  }


  label.push('{hr|}');
  label.push('编码 ' + item.icdCode + ' ' + item.codeType);
  label.push('{hr|}');
  // label.push(item.starCode ? '星码:' + item.starCode + ' 剑码:' + item.swordCode : '');
  // label.push('{hr|}');
  label.push('P' + item.page);

  return label.join('\n');
};

// 处理 request 返回数据，为单个 手术核对 对象生成节点
function equipVol1Data(item) {
  return {
    'name': item.codeNameCh,
    'abbreviationCh': item.abbreviationCh,
    'codeType': item.codeType,
    'fullDesc': item.fullName,
    'id': 'ovol1-' + item.id,
    'page': item.page,
    'parentid': item.parentID,
    // 'starCode': item.starCode,
    // 'swordCode': item.swordCode,
    'icdCode': item.icdCode,
    'hasChildren': item.hasChildren,
    'zlevel': 10,
    // 'tooltip': {
    //   // show: true,
    //   'normal': {
    //   formmater: vol1tooltip(item)
    //   }
      
    // },
    'label': {
      
      'normal': {
        'formatter': vol1Label(item),
        
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
            backgroundColor: bgcolors[item.codeType],
            height: 30,
            // borderRadius: [5, 5, 0, 0],
            padding: [0, 10, 0, 10],
            width: '100%',
            color: '#eee'
          },
          'bginfo': {
            backgroundColor: 'grey',
            height: 30,
            // borderRadius: [5, 5, 0, 0],
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

// 点击（click）事件 调用 request 后，使用此函数对数据进行处理，生产nodes，links
function prepareVol1Data(current, parent, datas, links) {
  // 1. 添加 current 节点, current 节点与 parent 节点的 edge

  var node = equipVol1Data(current);
  datas.push(node);
  if (parent) {
    links.push({
      source: 'ovol1-' + parent.id,
      target: 'ovol1-' + current.id,
      symbolSize: [10, 10],
      label: {
        formatter: '包含',
        show: true,
        position: 'end'
      },
      lineStyle: {
        color: 'blue',
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
  if (current.hasChildren && current.children.length > 0) {
    for (let _item in current.children) {
      prepareVol1Data(current.children[_item], current, datas, links);
    }
  } else {
    return;
  }
}
// 切除多余的节点、分支，小程序内不能显示过多的node (如果在后台已经切除，则不需要重复调用此函数)
function _cutDiseaseSeries(dis, id, parent) {
  var found = false;
  if (dis.id == id) {
    found = true;
    if (dis.hasChildren) {
      // cut off grand-son
      for (let _idx = 0; _idx < dis.children.length; _idx++) {
        let children = dis.children[_idx];
        children.children = [];
      }
    }
    // if (parent) {
    //   // cut off sibling's children
    //   for (let _idx=0, len=parent.children.length; _idx<len; _idx++) {
    //     let sibling = parent.children[_idx];
    //     if (sibling.id == dis.id) {
    //       continue;
    //     }
    //     sibling.children = [];
    //   }
    // }
    return found;
  } else {
    var to_be_delete_idx = [];
    for (let _idx = 0, len = dis.children.length; _idx < len; _idx++) {
      let children = dis.children[_idx];
      if (_cutDiseaseSeries(children, id, dis)) {
        found = true;
      } else {
        // cut off this branch..
        to_be_delete_idx.push(children.id);
        // return false;
      }
    }
    // delete to_be_delete_idx
    for (let len = to_be_delete_idx.length, _idx = len - 1; _idx >= 0; _idx--) {
      let delete_id = to_be_delete_idx[_idx];
      for (let _idx2 = 0; _idx2 < dis.children.length; _idx2++) {
        if (dis.children[_idx2].id == delete_id) {
          dis.children.splice(_idx2, 1);
          break;
        }
      }
    }
    return found;
  }
  // return false;
}

// event handler: 选中 vol1 条目后(调用时提供 id)，显示其祖先条目 + 儿子条目
function selectVol1Series(id, chart) {
  chart.showLoading();
  wx.request({
    url: `https://www.skyatlas.net/webAppICD/api/o1/getSeries?id=${id}`,
    header: {
      Accept: 'text/json;charset=utf-8'
    },
    method: 'GET',
    success: function (res) {
      chart.hideLoading();
      var datas = [];
      var edges = [];
      // initial x,y
      var icd = res.data.data;
      // console.log('before cut off:');
      console.log('o1/getSeries',icd);
      // _cutDiseaseSeries(icd, id, null);
      // console.log('after cut off:');
      // console.log(icd);
      icd.x = 10;
      icd.y = 10;
      prepareVol1Data(icd, null, datas, edges);
      // console.log('--------- datas:');
      // console.log(datas);
      // console.log('--------- links:');
      // console.log(edges);
      // TODO: setOption...
      var option = {
        color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
        title: {
          text: '疾病核对'
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [{
          type: 'graph',
          layout: 'force',
          lableLayout: {
            'draggable': true
          },
          force: {
            edgeLength: 50,
            repulsion: 2000,
            gravity: 0.1
          },
          symbolSize: 20,
          roam: true,
          label: {
            show: true,
            normal: {
              position: 'right',
              distance: 6,
            },
            zlevel: 0,
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
          data: datas,

          links: edges,

          lineStyle: {
            normal: {
              opacity: 0.9,
              width: 2,
              curveness: 0
            }
          }
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

function initChart(canvas, width, height, dpr) {
  console.log('---------- echart initializing ----------');

  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  chart.showLoading();
  wx.request({
    url: 'https://www.skyatlas.net/webAppICD/api/o1/chapters',
    header: {
      Accept: 'text/json;charset=utf-8'
    },
    method: 'GET',
    success: function (res) {
      console.log(res.data);
      let chapters = res.data.data;
      // equipment graph nodes.
      chapters = chapters.map(equipVol1Data);
      console.log(chapters);
      // draw chart
      var option = {
        color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
        title: {
          text: '手术核对'
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
          data: chapters,

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

        if (params.componentType == 'series' &&
          params.componentSubType == 'graph' &&
          params.dataType == 'node') {
          wx.showToast({
            title: '获取后台数据...',
            icon: 'success',
            duration: 1500
          });
          selectVol1Series(params.data.id.replace('ovol1-', ''), chart);
        }
      });
    },
    fail: function (err) {
      console.error(' get disease vol1 chapters error.');
      wx.showToast({
        title: '访问后台数据错误(疾病核对 章)'
      });
    },
    complete: function () {
      console.log('wx.request call completed...');
    }
  })




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
  onLoad: function () {
    // wx.request({
    //   url: 'https://www.skyatlas.net/webAppICD/api/o1/chapters',
    //   method: 'GET',
    //   success: function (res) {
    //     console.log('chapters:',res.data)
    //     let chapters = res.data.data

    //   },
    //   fail: function (err) {
    //     console.error(' get disease vol1 chapters error.')
    //     wx.showToast({
    //       title: '访问后台数据错误(手术核对 章)'
    //     })
    //   },
    //   complete: function () {
    //     console.log('wx.request call completed...')
    //   }
    // })

  }
})