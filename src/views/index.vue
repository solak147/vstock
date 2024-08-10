<template>
    <div class="index">
        <div class="flex ml-10 bolder fz-18">
            <div>{{ indexStore.info.data.name }}</div>
            <div :class="colorConfition" class="ml-10">{{ candles.data.closePrice }}</div>
            <div :class="colorConfition" class="ml-10">{{ `${candles.data.priceUp > 0 ? '+':'-'}${candles.data.priceUp}` }}</div>
            <div :class="colorConfition" class="ml-10">{{ `${candles.data.priceUp > 0 ? '+':'-'}${candles.data.percent}%` }}</div>
        </div>

        <el-row :gutter="20" class="row">
            <el-col :span="10">
                <!-- :update-options="{notMerge:true}"  https://juejin.cn/post/7329476133325193251 -->
                <v-chart ref="chart" class="chart" :option="option" autoresize />
            </el-col>
            <el-col :span="12">

                11
            </el-col>
        </el-row>

    
    </div>
</template>
  
<script setup>
import { ref, onMounted, reactive, nextTick, onUnmounted, provide } from 'vue'
import VChart, { THEME_KEY } from 'vue-echarts'
import { useIndexStore } from '@/store/modules/index.js'

provide(THEME_KEY, 'dark')
const indexStore = useIndexStore()
const chart = ref(null);

const candles = reactive({
    data: {
        list:[],
        volume: [],          
        category:[],
        closePrice: '',  //收盤價
        priceUp: '',     //上漲點數
        percent: '',     //上漲幅度     
    }
})

const colorConfition = { 
    red: candles.data.closePrice > indexStore.info.data.previousClose,
    green: candles.data.closePrice < indexStore.info.data.previousClose,
}

const upColor = '#FF5B5B';
const upBorderColor = '#ff3737';
const downColor = '#91F840';
const downBorderColor = '#6fda1a';

const option = ref(null)

const isshow= ref(false)
onMounted(async () => { 

    candles.data.list = indexStore.candles.data.data.map(item => [item.open, item.close, item.low, item.high])
    
    let previousVol 
    candles.data.volume = indexStore.candles.data.data.map((item, key) =>{
        
        let color = 1
        if (previousVol) {
            if(item.close > previousVol){
                color = 1
            }else{
                color = -1
            }
        }

        previousVol = item.close

        return [key, item.volume, color]  
    })

    candles.data.category = indexStore.candles.data.data.map(item => dateFormate(item.date, 'hhmm'))
    candles.data.closePrice = candles.data.list[candles.data.list.length - 1][1]
    candles.data.priceUp = (candles.data.closePrice - indexStore.info.data.previousClose).toFixed(2)
    candles.data.percent =  (candles.data.priceUp / indexStore.info.data.previousClose * 100).toFixed(2)

    option.value = {
        backgroundColor: '#131313', 
        title: {
            text: '即時走勢',
            left: 10,
            top: 10,
            bottom: 10,
            textStyle: {
              fontSize: 16,
                fontWeight: 'normal',  
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            backgroundColor: 'rgba(0,0,0,0.3)',
            textStyle: {
                color: '#FFF', 
            },
            formatter: function(params) {
             
                let k = params.filter(item => item.axisIndex == 0)[0]
                let v = params.filter(item => item.axisIndex == 1)[0]
                let up = (k.value[2] - candles.data.list[k.dataIndex-1][1]).toFixed(2)

                return  '<div style=" text-align: left;">' +
                            params[0].name + '<br/>' +
                            '開 :<span style="margin-left: 20px"> ' + k.value[1] + '</span><br/>' +
                            '收 :<span style="margin-left: 20px"> ' + k.value[2] + '</span><br/>' +
                            '低 :<span style="margin-left: 20px"> ' + k.value[3] + '</span><br/>' +
                            '高 :<span style="margin-left: 20px"> ' + k.value[4] + '</span><br/>' + 
                            `<span style="color:${up>0 ? upColor : downColor}">${up>0 ? '漲':'跌'} :<span style="margin-left: 20px">${up}</span></span><br/>` + 
                            '量 :<span style="margin-left: 20px"> ' + (v.value[1]/100000000).toFixed(3) + '億元</span><br/>' + 
                       '</div>';
            },  
            position: function (pos, params, el, elRect, size) {
          const obj = {
            top: 10
          };
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
          return obj;
        }
        },
        axisPointer: {
            link: [
            {
                xAxisIndex: 'all'
            }
            ],
            label: {
                backgroundColor: '#777'
            }
        },
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: [0, 1],
                start: 80,
                end: 100
            },
            {
                show: true,
                xAxisIndex: [0, 1],
                type: 'slider',
                top: '85%',
                start: 80,
                end: 100
            }
        ],
        visualMap: {
            show: false,
            seriesIndex: 1,
            dimension: 2,
            pieces: [
                {
                    value: -1,
                    color: downColor
                },
                {
                    value: 1,
                    color: upColor
                }
            ]
        },
        // legend: {
        //   orient: 'vertical',
        //   left: 'left',
        //   data: ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines'],
        // },

        series: [
            {
                name: '一分K',
                type: 'candlestick',
                data: candles.data.list,
                itemStyle: {
                    color: upColor,
                    color0: downColor,
                    borderColor: upBorderColor,
                    borderColor0: downBorderColor
                },
                tooltip: {
                    formatter: function (param) {
                        return param.name + '<br>' + (param.data.coord || '');
                    }
                },
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                  },
                },
            },
            {
                name: 'Volume',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: candles.data.volume
            },
        ],
        grid: [
            {
                left: '10%',
                right: '8%',
                height: '50%'
            },
            {
                left: '10%',
                right: '8%',
                top: '63%',
                height: '16%'
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: candles.data.category,
                boundaryGap: false,
                axisLine: { onZero: false },
                splitLine: { show: false },
                min: 'dataMin',
                max: 'dataMax',
            },
            {
                type: 'category',
                gridIndex: 1,
                data: candles.data.category,
                boundaryGap: false,
                axisLine: { onZero: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                min: 'dataMin',
                max: 'dataMax'
            }
        ],
        yAxis:[
            {
                scale: true,
                splitArea: {
                    show: true
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',  // 設置分隔線為虛線
                        color: '#ccc',   // 設置分隔線顏色
                        width: 1         // 設置分隔線寬度
                    }
                }
            },
            {
                scale: true,
                gridIndex: 1,
                splitNumber: 2,
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            }
        ],
    }

})


//2024-08-02T10:25:00.000+08:00 -> 2024-08-02 09:00:00
const dateFormate = (str, format) => {
    let isoDateString = str;
    let date = new Date(isoDateString);

    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    let day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');

    if(format = 'hhmm'){
        return `${hours}:${minutes}`
    }

    return`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

</script>

<style lang="scss" scoped>
.index{
    padding: 30px 10px;
}

.chart{
    height: 500px;
}

.row{
    margin-top: 20px;
}

.title{
    display: flex;

}

.red{
    color:#ff3737;
}

.green{
    color:#6fda1a;
}
</style>
  