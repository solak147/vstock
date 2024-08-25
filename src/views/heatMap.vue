<template>
  <div>
    <v-chart ref="chart" class="chart" :option="option" :loading="heatMap.loading" autoresize />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, nextTick, onUnmounted, provide, watch, computed } from 'vue'
import VChart, { THEME_KEY } from 'vue-echarts'
import { useIndexStore } from '@/store/modules/index.js'
import API from '@/apis'

const chart = ref(null)
const option = ref(null)

const upColor = '#FF5B5B';
const upBorderColor = '#ff3737';
const downColor = '#91F840';
const downBorderColor = '#6fda1a';

const heatMap = reactive({
    loading: true,
    data:{

    }
})

onMounted(async() => {
  heatMap.loading = true

  heatMap.data = await API.Stock.getStockHeatMap('IX0001')
  console.log(heatMap.data.data)
  
  heatMap.data.data[0].children = [ ...heatMap.data.data ]
  heatMap.data.data[0].children.splice(0, 1)
  heatMap.data.data[0].children = heatMap.data.data[0].children.filter((item) => item.type == 'INDEX')
  heatMap.data.data[0].children = heatMap.data.data[0].children.map(item => { return { ...item, value: [item.tradeValue, item.changePercent]} })
  heatMap.data.data.splice(1)

  console.log(heatMap.data.data)


  option.value = {
    series: [
        {
            type: 'treemap',
            data: heatMap.data.data,
            visualDimension: 1, // 基于第一个维度（涨跌幅度）调整颜色
        }
    ],
    visualMin: -10,    // 最小值
    visualMax: 10,     // 最大值
    visualMap: {
        type: 'continuous',
        min: -10, // 最小跌幅
        max: 10,  // 最大涨幅
        inRange: {
                color: [upColor, upBorderColor, '#5B5B5B', downBorderColor, downColor]
        },
        calculable: true // 显示视觉映射控制条
    }
  };

  heatMap.loading = false
})
</script>

<style lang="scss" scoped>
.chart{
    height: 100vh;
    width: 80vw;
}
</style>