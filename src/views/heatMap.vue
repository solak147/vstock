<template>
  <div style="height: 100%;">

    <div class="mt-20 mb-20">
      <el-radio-group v-model="market" size="large" @change="heatMapChg">
        <el-radio-button label="上市" value="IX0001" />
        <el-radio-button label="上櫃" value="IX0043" />
      </el-radio-group>

      <el-radio-group v-model="groupType" size="large" class="ml-5" @change="heatMapChg">
        <el-radio-button label="產業" value="industry" />
        <el-radio-button label="個股" value="stock" />
      </el-radio-group>

      <el-radio-group v-model="timeRange" size="large" class="ml-5" @change="heatMapChg">
        <el-radio-button label="盤中即時" value="" />
        <el-radio-button label="一週" value="1w" />
        <el-radio-button label="一月" value="1m" />
        <el-radio-button label="三月" value="3m" />
        <el-radio-button label="六月" value="6m" />
        <el-radio-button label="一年" value="1y" />
        <el-radio-button label="年初至今" value="ytd" />
      </el-radio-group>
    </div>

    <div style="width: 100%; height: 80% ;">
      <v-chart ref="chart" :option="option" :loading="heatMap.loading" autoresize/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, nextTick, onUnmounted, provide, watch, computed } from 'vue'
import VChart, { THEME_KEY } from 'vue-echarts'
import { useIndexStore } from '@/store/modules/index.js'
import { industryConfig } from '@/config'
import API from '@/apis'

const chart = ref(null)
const option = ref(null)

const market = ref('IX0001')
const groupType = ref('industry')
const timeRange = ref('')

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
  heatMapChg()
})

const heatMapChg = async () => {
  heatMap.loading = true
  let path = market.value
  if(timeRange.value){
    path += `?period=${timeRange.value}`
  } 
  heatMap.data = await API.Stock.getStockHeatMap(path)

  //依產業
  if(groupType.value == 'industry'){
    heatMap.data.data.splice(0, 1)
    heatMap.data.data = heatMap.data.data.filter((item) => item.type == 'INDEX')
    heatMap.data.data = heatMap.data.data.map(
      item => { 
        return { ...item, name: `${item.name.replace('指數','').replace('櫃買','')}\n${item.changePercent}%`, value: [item.tradeValue, item.changePercent]} 
      })

  }else{
    //依個股
    let data = heatMap.data.data.filter((item) => item.type == 'EQUITY')
    heatMap.data.data = []

    industryConfig.forEach(item => {
      let filterObj = data.filter((itm) => item.value == itm.industry)
      let weight = filterObj.reduce((accumulator, item) => {
          return accumulator + item.marketValueWeight  
      }, 0)
      let parent = { name: item.label, value: weight }
      parent.children = [...filterObj]
      parent.children = parent.children.map(
        item => { 
          return { ...item, name: `${item.name}\n${item.changePercent}%`, value: [item.marketValueWeight, item.changePercent]} 
        })
      heatMap.data.data.push(parent)
    })
  }

  option.value = {
    series: [
        {
          name: '發行量加權股價指數',
          type: 'treemap',
          data: heatMap.data.data,
          visualDimension: 1, // 基于第一个维度（涨跌幅度）调整颜色'

          upperLabel: {
            show: true,
            height: 30,
            backgroundColor: '#131313',  // 设置背景为透明
            textStyle: {
                color: '#ffffff',
                fontSize: 14,     
            }
          },
          itemStyle: {
            borderColor: '#fff',
            gapWidth: 0.5,
          },
        }
    ],
    visualMap: {
        type: 'continuous',
        min: timeRange.value ? -30 : -10, // 最小跌幅
        max: timeRange.value ? 30 : 10,  // 最大涨幅
        inRange: {
                color: [downColor, downBorderColor, '#007500', '#3C3C3C', '#750000', upBorderColor, upColor]
        },
        calculable: true, // 显示视觉映射控制条
        orient: 'horizontal', // 设置为水平布局
        left: '10%', // 水平居中
 
    }
  };

  heatMap.loading = false
}

</script>

<style lang="scss" scoped>
.heatMap{
    height: 100vh;
    width: 80vw;
}
</style>