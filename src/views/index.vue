<template>
    <div class="index">
        <div class="flex ml-10 bolder fz-18">    
            <div>{{ indexStore.info.data.name }}</div>
            <div :class="colorConfition" class="ml-10">{{ candles.data.closePrice }}</div>
            <div :class="colorConfition" class="ml-10">{{ `${candles.data.priceUp > 0 ? '+':'-'}${candles.data.priceUp}` }}</div>
            <div :class="colorConfition" class="ml-10">{{ `${candles.data.priceUp > 0 ? '+':'-'}${candles.data.percent}%` }}</div>
        </div>

        <div class="flex justify-around flex-wrap">
            <transition-group name="fade">
                <RealTimeChart :candles="candles" 
                    :style="{ order: order[0] }" 
                    @reOrder="reOrder"
                    class="mb-10 orderAnimate">
                </RealTimeChart>
                <HistoryChart 
                    :candles="candlesHistory"
                    :style="{ order: order[1] }"
                    @reOrder="reOrder"
                    class="mb-10 orderAnimate">
                </HistoryChart>
            </transition-group>
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, reactive, nextTick, onUnmounted, provide, watch, computed } from 'vue'
import VChart, { THEME_KEY } from 'vue-echarts'
import { useIndexStore } from '@/store/modules/index.js'
import RealTimeChart from '@/components/RealTimeChart.vue'
import HistoryChart from '@/components/HistoryChart.vue'
import API from '@/apis'
import Utils from '@/utils'

provide(THEME_KEY, 'dark')
const indexStore = useIndexStore()
const chart = ref(null)
const order = ref([1, 2])
const reOrder= (isBig, key) => {
    if(isBig){
        order.value = order.value.map(item => item + 1)
        order.value[key] = 1
    }
}

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

const candlesHistory = reactive({
    data: {
        trend: [],
        category:[],
        lastClose: 0, //去年,月收盤均價
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

    let nowDate  = new Date()
    let lastYearDate  = new Date()
    lastYearDate.setFullYear(nowDate.getFullYear() -1)
    lastYearDate.setDate(lastYearDate.getDate() +1)

    let res = await API.Stock.getStockHistory('IX0001', 'D', Utils.dateFormate(lastYearDate, 'yymmdd'), Utils.dateFormate(nowDate, 'yymmdd'))
    candlesHistory.data.trend = res.data.map(item => { return { value: [ item.date, item.close]} }).reverse() 
    candlesHistory.data.category = res.data.map(item => item.date).reverse() 

    nowDate  = new Date()
    nowDate.setFullYear(nowDate.getFullYear() -1)
    lastYearDate  = new Date()
    lastYearDate.setFullYear(nowDate.getFullYear() -1)
    lastYearDate.setDate(lastYearDate.getDate() +1)
    res = await API.Stock.getStockHistory('IX0001', 'M', Utils.dateFormate(lastYearDate, 'yymmdd'), Utils.dateFormate(nowDate, 'yymmdd'))
   
    candlesHistory.data.lastClose = Number((res.data.reduce((accumulator, item) => {
          return accumulator + item.close  
      }, 0) / 12).toFixed(2))

})

const setInfo = () => {
    candles.data.priceUp = (candles.data.closePrice - indexStore.info.data.previousClose).toFixed(2)
    candles.data.percent =  (candles.data.priceUp / indexStore.info.data.previousClose * 100).toFixed(2)
}

const setCandles = () => {
    candles.data.list = indexStore.candles.data.data.map(item => [item.open, item.close, item.low, item.high])
    candles.data.trend = indexStore.candles.data.data.map(item => { return { value: [Utils.dateFormate(item.date, 'hhmm'), item.close]} }) 
    
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

    candles.data.category = indexStore.candles.data.data.map(item => Utils.dateFormate(item.date, 'hhmm'))
    candles.data.closePrice = candles.data.list[candles.data.list.length - 1][1]
    candles.data.openPrice = candles.data.list[0][0]

 
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

.fade-move,
.fade-enter-active, .fade-leave-active {
	transition: all 1.5s ease;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
	opacity: 0;
	transform: translateX(-20px);
}

.fade-leave-active {
  position: absolute;
}
</style>
  