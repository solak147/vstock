<template>
    <div class="index">
        <div class="flex ml-10 bolder fz-18">
            <div>{{ indexStore.info.data.name }}</div>
            <div :class="colorConfition" class="ml-10">{{ candles.data.closePrice }}</div>
            <div :class="colorConfition" class="ml-10">{{ `${candles.data.priceUp > 0 ? '+' :
                '-'}${candles.data.priceUp}`
                }}</div>
            <div :class="colorConfition" class="ml-10">{{ `${candles.data.priceUp > 0 ?
                '+' : '-'}${candles.data.percent}%` }}</div>
        </div>

        <div class="flex justify-around flex-wrap">
            <transition-group name="fade">
                <RealTimeChart :candles="candles" :style="{ order: order[0] }" @reOrder="reOrder" class="mb-10">
                </RealTimeChart>

                <HistoryChart :candles="candlesHistory" :style="{ order: order[1] }" @reOrder="reOrder"
                    @chgLegend="chgHistoryLegend" class="mb-10">
                </HistoryChart>

                <LegalPersonChart symbol="IX0001" :style="{ order: order[2] }" @reOrder="reOrder" class="mb-10">
                </LegalPersonChart>

                <PttCard symbol="IX0001" :style="{ order: order[3] }" class="mb-10"></PttCard>

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
import LegalPersonChart from '@/components/LegalPersonChart.vue'
import PttCard from '@/components/PttCard.vue'
import API from '@/apis'
import Utils from '@/utils'

provide(THEME_KEY, 'dark')
const indexStore = useIndexStore()
const chart = ref(null)
const order = ref([1, 2, 3, 4])
const reOrder = (isBig, key) => {
    if (isBig) {
        order.value = order.value.map((item, k) => {
            if (k < key) {
                return item + 1
            } else if (k == key) {
                return 1
            } else {
                return item
            }
        })
        console.log(order.value)
    }
}

const candles = reactive({
    data: {
        list: [],        //k棒
        volume: [],     //量
        trend: [],      //走勢   
        category: [],
        low: '',
        high: '',
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
        category: [],
        lastClose: 0, //去年,月收盤均價
        currentSel: '1Y'  //目前圖表     
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

    if (Object.keys(indexStore.candles.data).length === 0 || Object.keys(indexStore.info.data).length === 0) {
        return
    }

    //即時走勢
    setCandles()
    setInfo()

    //歷史走勢
    serHistoryCandles('1Y')
})

const setInfo = () => {
    candles.data.priceUp = (candles.data.closePrice - indexStore.info.data.previousClose).toFixed(2)
    candles.data.percent = (candles.data.priceUp / indexStore.info.data.previousClose * 100).toFixed(2)
}

const setCandles = () => {
    candles.data.list = indexStore.candles.data.data.map(item => [item.open, item.close, item.low, item.high])
    candles.data.trend = indexStore.candles.data.data.map(item => { return { value: [Utils.dateFormate(item.date, 'hhmm'), item.close] } })

    let previousVol
    candles.data.volume = indexStore.candles.data.data.map((item, key) => {

        let color = 1
        if (previousVol) {
            if (item.close > previousVol) {
                color = 1
            } else {
                color = -1
            }
        }

        previousVol = item.close

        return [key, item.volume, color]
    })

    candles.data.category = indexStore.candles.data.data.map(item => Utils.dateFormate(item.date, 'hhmm'))
    candles.data.closePrice = candles.data.list[candles.data.list.length - 1][1]
    candles.data.low = candles.data.list.reduce((prev, curr) => (prev[1] < curr[1] ? prev : curr))[2]
    candles.data.high = candles.data.list.reduce((prev, curr) => (prev[1] > curr[1] ? prev : curr))[3]
}

const serHistoryCandles = async (during) => {
    let res
    let nowDate = new Date()
    let lastDate = new Date()

    if (during == '1Y') {
        lastDate.setFullYear(nowDate.getFullYear() - 1)
        lastDate.setDate(lastDate.getDate() + 1)
    } else if (during == '6M') {
        lastDate.setMonth(nowDate.getMonth() - 6)
        lastDate.setDate(lastDate.getDate() + 1)
    } else if (during == '1M') {
        lastDate.setMonth(nowDate.getMonth() - 1)
        lastDate.setDate(lastDate.getDate() + 1)
    }

    res = await API.Stock.getStockHistory('IX0001', 'D', Utils.dateFormate(lastDate, 'yymmdd'), Utils.dateFormate(nowDate, 'yymmdd'))
    candlesHistory.data.trend = res.data.map(item => { return { value: [item.date, item.close] } }).reverse()
    candlesHistory.data.category = res.data.map(item => item.date).reverse()

    nowDate = new Date()
    lastDate = new Date()

    //找上次平均收盤價,markLine顯示用
    if (during == '1Y') {
        lastDate.setFullYear(nowDate.getFullYear() - 1)
        lastDate.setDate(lastDate.getDate() + 1)
    } else if (during == '6M') {
        lastDate.setMonth(nowDate.getMonth() - 6)
        lastDate.setDate(lastDate.getDate() + 1)
    } else if (during == '1M') {
        lastDate.setMonth(nowDate.getMonth() - 1)
        lastDate.setDate(lastDate.getDate() + 1)
    }

    res = await API.Stock.getStockHistory('IX0001', 'M', Utils.dateFormate(lastDate, 'yymmdd'), Utils.dateFormate(nowDate, 'yymmdd'))
    candlesHistory.data.lastClose = res.data[0].close


}

const chgHistoryLegend = (legend) => {
    serHistoryCandles(legend)
}

</script>

<style lang="scss" scoped>
.index {
    padding: 30px 10px;
    height: calc(100vh - 60px);
    overflow-y: auto;
}

.index::-webkit-scrollbar {
    display: none;
    /* 適用於 Webkit 瀏覽器 (Chrome, Safari) */
}

.row {
    margin-top: 20px;
}

.title {
    display: flex;

}

.red {
    color: #ff3737;
}

.green {
    color: #6fda1a;
}

.fade-move,
.fade-enter-active,
.fade-leave-active {
    transition: all 1.5s ease;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
    {
    opacity: 0;
    transform: translateX(-20px);
}

.fade-leave-active {
    position: absolute;
}
</style>