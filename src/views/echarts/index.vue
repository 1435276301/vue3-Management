<script setup lang="ts">
import * as echarts from 'echarts'
import china from '@/assets/data-city.json'
import beijing from '@/assets/data-beijing.json'
import jiangxi from '@/assets/data-jiangxi.json'
import guangdong from '@/assets/data-guangdong.json'
import { onMounted, ref } from 'vue'
const charts = ref(null)
onMounted(() => {
  const myChart = echarts.init(charts.value)
  const option = {
    // 背景颜色
    backgroundColor: '#404a59',
    // 提示浮窗样式
    tooltip: {
      show: true,
      trigger: 'item',
      alwaysShowContent: false,
      backgroundColor: '#0c121c',
      borderColor: 'rgba(0,0,0,0.16);',
      hideDelay: 100,
      triggerOn: 'mousemove',
      enterable: true,
      textStyle: {
        color: '#dadada',
        fonsSize: '12',
        width: 20,
        height: 30,
        overflow: 'break'
      },
      showDelay: 100,
      formatter(params: { name: any; value: any[] }) {
        return `地区${params.name}</br>数值:${params.value[2] || 0}`
      }
    },
    // 地图配置
    geo: {
      map: 'china',
      // 禁止地图放大缩小
      roam: true,
      zoom: 1,
      label: {
        // 通常状态下的样式
        normal: {
          show: false,
          textStyle: {
            color: '#fff'
          }
        },
        // 鼠标放上去的样式
        emphasis: {
          show: true,
          textStyle: {
            color: '#640000'
          }
        }
      },
      // 地图区域的的样式设置
      itemStyle: {
        normal: {
          borderColor: 'rgba(147,235,248,1)',
          borderWidth: 1,
          areaColor: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.8,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(147,235,248,0)' // 0%处的颜色
              },
              {
                offset: 1,
                color: 'rgba(147,235,248,.2)' // 100%处的颜色
              }
            ],
            globalCoord: false // 缺省为false
          },
          shadowColor: 'rgba(128,217,248,1)',
          shadowOffsetX: -2,
          shadowOffsetY: 2,
          shadowBlur: 10
        },
        // 鼠标放上去高亮的样式
        emphasis: {
          areaColor: '#389bb7',
          borderWidth: 0
        }
      }
    },
    series: [
      {
        type: 'map',
        roam: true,
        zoom: 1,
        geoIndex: 0,
        label: {
          // 通常状态下的样式
          normal: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          },
          // 鼠标放上去的样式
          emphasis: {
            textStyle: {
              color: '#640000'
            }
          }
        },
        data: [
          { name: '西藏', value: [91.23, 29.5, 2333] },
          { name: '黑龙江', value: [128.03, 47.01, 1007] },
          { name: '江西', value: [115.892151, 28.676493] },
          { name: '广东', value: [113.280637, 23.125178] }
        ]
      },
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        effectType: 'ripple',
        showEffectOn: 'render',
        rippleEffect: {
          period: 10,
          scale: 10,
          brushType: 'fill'
        },

        hoverAnimation: true,
        itemStyle: {
          normal: {
            color: 'rgba(255, 235, 59, .7)',
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        zlevel: 1,
        data: [
          { name: '西藏', value: [91.23, 29.5, 2333] },
          { name: '黑龙江', value: [128.03, 47.01, 1007] },
          { name: '江西', value: [115.892151, 28.676493] },
          { name: '广东', value: [113.280637, 23.125178] }
        ]
      }
    ],
    graphic: [
      {
        // 水印类型
        type: 'text',
        // 相对于容器的位置
        left: '10%',
        top: '10%',
        // 样式设置
        style: {
          // 文本内容
          text: '中国',
          // 字体粗细、大小、字体
          font: 'bolder 1.5rem "Microsoft YaHei",sans-serif',
          // 字体颜色
          fill: '#fff'
        },
        onclick: () => {
          const name = option.graphic.map((item: any) => item.style.text)
          // 利用函数的作用域，可以直接拿上面的name来用
          const [mapName, mapJson] = getMap(name[0])
          const index = option.graphic.findIndex(
            (item: any) => item.style.text === name || '返回'
          )
          // 点击元素之后的所有元素全部删除
          option.graphic.splice(index + 1)
          option.geo.map = mapName
          echarts.registerMap(mapName, mapJson as any)
          myChart.setOption(option, true)
        }
      }
    ],
    visualMap: {
      // 是否展示左下角，即是是false，也仅是不显示，不影响数据的映射
      show: true,
      // 上下端文字
      text: ['高', '低'],
      // 最小值和最大值，必须指定
      min: 0,
      max: 6000,
      // 位置
      left: '8px',
      bottom: '25%',
      // 是否展示滑块
      calculable: true,
      // 指定映射的数据，对应的是option.series，这里根据自己的实际需要进行配置
      seriesIndex: [0],
      // 从下到上的颜色
      inRange: {
        color: ['#00467F', '#A5CC82']
      },
      //字体颜色
      textStyle: {
        color: '#fff',
        map: 'china'
      }
    }
  }

  const [mapName, mapJson] = getMap('中国')
  option.geo.map = mapName
  echarts.registerMap(mapName, mapJson as any)
  myChart.setOption(option)
  myChart.off()
  myChart.on('click', ({ name }) => {
    const index = option.graphic.findIndex((item) => item.style.text === name)
    if (!name || index !== -1) return
    const [mapName, mapJson] = getMap(name)
    option.geo.map = mapName
    option.geo.zoom = 0.8
    const idx = option.graphic.length + 1
    option.graphic.push({
      type: 'text',
      left: `${idx * 10}%`,
      top: '10%',
      style: {
        text: name,
        font: 'bolder 1.5rem "Microsoft YaHei",sans-serif',
        fill: '#fff'
      },
      onclick: () => {
        // 利用函数的作用域，可以直接拿上面的name来用
        const [mapName, mapJson] = getMap(name)
        const index = option.graphic.findIndex(
          (item: any) => item.style.text === name
        )
        // 点击元素之后的所有元素全部删除
        option.graphic.splice(index + 1)
        option.geo.map = mapName
        echarts.registerMap(mapName, mapJson as any)
        myChart.setOption(option, true)
      }
    }),
      echarts.registerMap(mapName, mapJson as any)
    myChart.setOption(option, true)
  })
})

const mapDict = {
  北京市: 'beijing',
  江西省: 'jiangxi',
  广东省: 'guangdong'
}
const mapData = {
  beijing,
  jiangxi,
  guangdong
}
function getMap(mapName: string) {
  const cityName = mapDict[mapName]
  if (cityName) {
    return [cityName, mapData[cityName]]
  }
  return ['china', china]
}
</script>
<template>
  <div>
    <div ref="charts" style="width: 100%; height: 100vh"></div>
  </div>
</template>

<style lang="scss" scoped>
.el-card__body {
  padding: 0;
  margin: 0;
}
</style>
