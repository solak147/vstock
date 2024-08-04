<template>
    <div class="index">
        <!-- :update-options="{notMerge:true}"  https://juejin.cn/post/7329476133325193251 -->
        <v-chart ref="chart" class="chart" :option="option"  autoresize />
        <button @click="opotion= null" style="width: 20px; height: 20px;">11111111</button>
    </div>
</template>
  
<script setup>
import { ref, onMounted, reactive, nextTick, onUnmounted, provide } from 'vue'
import VChart, { THEME_KEY } from 'vue-echarts'
import { useIndexStore } from '@/store/modules'

provide(THEME_KEY, 'dark')
const indexStore = useIndexStore()
const chart = ref(null);

const candles = reactive({
    data: {
        list:[],
        category:[]
    }
})

const upColor = '#ec0000';
const upBorderColor = '#8A0000';
const downColor = '#00da3c';
const downBorderColor = '#008F28';

const option = ref(null)

const isshow= ref(false)
onMounted(async () => { 


    candles.list = indexStore.candles.data.data.map(item => [item.open, item.close, item.low, item.high])
    candles.category = indexStore.candles.data.data.map(item => dateFormate(item.date).split(' ')[1])
    console.log(candles.list)
    console.log(candles.category)

    option.value = {
        title: {
            text: '台積電 2330',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        dataZoom: [
            {
                type: 'inside',
                start: 50,
                end: 100
            },
            {
                show: true,
                type: 'slider',
                top: '90%',
                start: 50,
                end: 100
            }
        ],
        // legend: {
        //   orient: 'vertical',
        //   left: 'left',
        //   data: ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines'],
        // },

        series: [
            {
                name: '一分K',
                type: 'candlestick',
                data: candles.list,
                itemStyle: {
                    color: upColor,
                    color0: downColor,
                    borderColor: upBorderColor,
                    borderColor0: downBorderColor
                },
                // tooltip: {
                //     formatter: function (param) {
                //         return param.name + '<br>' + (param.data.coord || '');
                //     }
                // }
                // emphasis: {
                //   itemStyle: {
                //     shadowBlur: 10,
                //     shadowOffsetX: 0,
                //     shadowColor: 'rgba(0, 0, 0, 0.5)',
                //   },
                // },
            },
        ],
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: candles.category,
            boundaryGap: false,
            axisLine: { onZero: false },
            splitLine: { show: false },
            min: 'dataMin',
            max: 'dataMax'
        },
        yAxis: {
            scale: true,
            splitArea: {
                show: true
            }
        },
    }

})


//2024-08-02T10:25:00.000+08:00 -> 2024-08-02 09:00:00
const dateFormate = (str) => {
    let isoDateString = str;
    let date = new Date(isoDateString);

    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    let day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');

    return`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

</script>

<style scoped>
.chart {
height: 100vh;
}
</style>
  