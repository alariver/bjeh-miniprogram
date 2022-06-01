//dvol1.js
//获取应用实例
// const app = getApp()
import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

var chart = undefined;
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

function equipVol1Data(item) {
  return {
    'name': item.codeNameCh,
    'abbreviationCh': item.abbreviationCh,
    'codeType': item.codeType,
    'fullDesc': item.diseaseFullDescription,
    'id': 'dvol1-' + item.id,
    'page': item.page,
    'parentid': item.parentID,
    'starCode': item.starCode,
    'swordCode': item.swordCode,
    'icdCode': item.icdCode,
    'hasChildren': item.hasChildren,
    'zlevel': 10,
    'label': {
      'normal': {
        'formatter': [
          '{bgtitle' + '|' + (item.codeNameCh.match(/.{1,6}/g)).join('\n') + '}',

          '编码 ' + item.icdCode + ' ' + item.codeType,
          '{hr|}',
          item.starCode ? '星码:' + item.starCode + ' 剑码:' + item.swordCode : '',
          '{hr|}',
          'P' + item.page
        ].join('\n'),
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

function equipVol3Data(item, path, index) {
  let hash = path.pathHashCode;
  return {
    'name': item.shortDesc,

    'fullDesc': item.shortDesc,
    'id': 'dvol3-' + item.id,

    'parentid': 'dvol3-' + item.parentID,

    'icdCode': item.icdCode,

    'mcode': item.mcode,

    'zlevel': 10,
    'label': {
      'normal': {
        'formatter': [
          (item.shortDesc.match(/.{1,12}/g)).join('\n'),


        ].join('\n'),
        show: true,
        backgroundColor: index == 0 ? '#F28C8C' : 'purple',
        borderColor: '#555',
        borderWidth: 1,
        borderRadius: 5,
        color: '#000',
        fontSize: 14,
        zlevel: 0,
        // opacity: 0.4,
        rich: {
          'bgtitle': {
            backgroundColor: 'purple',
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



function initChart(canvas, width, height, dpr) {
  console.log('---------- echart initializing ----------');

  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  // chart.showLoading();
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
    icdKey: '',
    pathHashCode: '',
    ec: {
      onInit: initChart
    }
  },

  preparePathData: function (paths, nodes, links) {
    // let count = 0;
    let inst = this;
    echarts.util.each(paths, function (path) {
      // 处理每一条 路径
      if (path.pathHashCode == inst.data.pathHashCode) {
        console.log('Found matched pathHashCode path: ' + path.pathHashCode, path);
        echarts.util.each(path.nodeList, function (node, idx) {
          nodes.push(equipVol3Data(node, path, idx));
          if (idx > 0) {
            // first get parent node
            let parentNode = path.nodeList[idx - 1];
            let relation_type = '包含';
            if (node.parentID != parentNode.id) {
              relation_type = '见|另见';
            }
            links.push({
              source: 'dvol3-' + parentNode.id,
              target: 'dvol3-' + node.id,
              symbolSize: [10, 10],
              label: {
                formatter: relation_type,
                show: true,
                // position: 'end'
              },
              lineStyle: {
                color: relation_type == '包含' ? 'green' : 'orange',
                curveness: 0.2,
                type: 'dashed',
                zlevel: 5
              }
            })
          }
        })
        // 增加 terminal 节点以及连接
        if (path.terminal) {
          let terminal = equipVol1Data(path.terminal);
          nodes.push(terminal);
          let last_v3_node = path.nodeList[path.nodeList.length - 1];
          console.log('last_v3_node', last_v3_node);
          links.push({
            source: 'dvol3-' + last_v3_node.id,
            target: terminal.id,
            symbolSize: [10, 10],
            label: {
              formatter: '指向',
              show: true,
              // position: 'center'
            },
            lineStyle: {
              color: 'blue',
              // curveness: 0.2,
              type: 'dashed',
              zlevel: 5
            }
          })
        }

      }
    })
  },
  //事件处理函数

  onLoad: function (options) {
    if (options.icdKey && options.pathHashCode) {
      this.setData({
        icdKey: options.icdKey,
        pathHashCode: options.pathHashCode,
      });



    } else {
      wx.showToast({
        title: '无效输入',
        duration: 1500,
        icon: 'success'
      })
    }

  },

  onReady: function () {
    let inst = this;
    let byCode = false;
    if (this.data.icdKey.match(/^[a-zA-Z]/)) {
      byCode = true;
    }
    let url = '';
    if (byCode) {
      url = `https://www.skyatlas.net/webAppICD/api/data/prtpathIndexstr?icd=${inst.data.icdKey}&type=1`
    } else {
      url = `https://www.skyatlas.net/webAppICD/api/icd/autocode?diagName=${inst.data.icdKey}`
    }
    setTimeout(function () {
      chart.showLoading();
      wx.request({
        url: url,
        header: {
          Accept: 'text/json;charset=utf-8'
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data)
          let paths = res.data.data
          var path_nodes = [],
            path_links = [];
          inst.preparePathData(paths, path_nodes, path_links);
          console.log('path_nodes:');
          console.log(path_nodes);
          console.log('path_links:');
          console.log(path_links);
          var option = {
            color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
            title: {
              text: '反查路径'
            },
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
              symbolSize: 10,
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
              data: path_nodes,
              links: path_links,
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