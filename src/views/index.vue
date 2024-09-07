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
                <RealTimeChart :candles="candles"></RealTimeChart>
            </el-col>
            <el-col :span="12">

                11
            </el-col>
        </el-row>

    </div>
</template>
  
<script setup>
import { ref, onMounted, reactive, nextTick, onUnmounted, provide, watch, computed } from 'vue'
import VChart, { THEME_KEY } from 'vue-echarts'
import { useIndexStore } from '@/store/modules/index.js'
import RealTimeChart from '@/components/RealTimeChart.vue';

provide(THEME_KEY, 'dark')
const indexStore = useIndexStore()
const chart = ref(null);

const candles = reactive({
    data: {
        list:[],        //k棒
        volume: [],     //量
        trend: [],      //走勢   
        category:[],
        openPrice: '',
        closePrice: '',  //收盤價
        priceUp: '',     //上漲點數
        percent: '',     //上漲幅度
        
        width: '',
        isBig: false,    //是否放大
        currentSel: '走勢'   //目前圖表     
    }
})

const colorConfition = computed(() => {
	return { 
        red: candles.data.closePrice > indexStore.info.data.previousClose,
        green: candles.data.closePrice < indexStore.info.data.previousClose,
    }
})

watch(
	() => indexStore.candles.data,
	() => {
        setCandles()
        setInfo()
	},
	{
		deep: true,
	}
)

onMounted(async () => { 

    if(Object.keys(indexStore.candles.data).length === 0 || Object.keys(indexStore.info.data).length === 0){
        return
    }
    
    setCandles()
    setInfo()
})

const setInfo = () => {
    candles.data.priceUp = (candles.data.closePrice - indexStore.info.data.previousClose).toFixed(2)
    candles.data.percent =  (candles.data.priceUp / indexStore.info.data.previousClose * 100).toFixed(2)
}

const setCandles = () => {
    candles.data.list = indexStore.candles.data.data.map(item => [item.open, item.close, item.low, item.high])
    candles.data.trend = indexStore.candles.data.data.map(item => { return { value: [dateFormate(item.date, 'hhmm'), item.close]} }) 
    
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
    candles.data.openPrice = candles.data.list[0][0]

 
}

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
  