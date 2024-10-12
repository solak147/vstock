<template>
    <div class="index">
        <div class="flex ml-10 bolder fz-18">
            <div>{{ indexStore.info.data.name }}</div>
            <div :class="colorConfition" class="ml-10">{{ todayData.close }}</div>
            <div :class="colorConfition" class="ml-10">{{ `${todayData.change > 0 ? '+' :
                '-'}${todayData.change}`
                }}</div>
            <div :class="colorConfition" class="ml-10">{{ `${todayData.change_rate > 0 ?
                '+' : '-'}${todayData.change_rate}%` }}</div>
        </div>

        <div class="flex justify-around flex-wrap">
            <transition-group name="fade">
                <div>
                    <KChart symbol="IX0001" :style="{ order: order[0] }" @reOrder="reOrder" class="mb-10">
                    </KChart>

                    <LegalPersonChart symbol="IX0001" :style="{ order: order[4] }" @reOrder="reOrder" class="mb-10">
                    </LegalPersonChart>

                </div>

                <div>
                    <RealTimeChart symbol="IX0001" :style="{ order: order[1] }" @reOrder="reOrder" class="mb-10">
                    </RealTimeChart>

                    <HistoryChart symbol="IX0001" :style="{ order: order[2] }" @reOrder="reOrder" class="mb-10">
                    </HistoryChart>

                    <PttCard symbol="IX0001" :style="{ order: order[3] }" class="mb-10"></PttCard>

                    <div style="width: 40vw; order:5"></div>
                </div>
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
import KChart from '@/components/KChart.vue'
import API from '@/apis'
import Utils from '@/utils'

provide(THEME_KEY, 'dark')
const indexStore = useIndexStore()
let todayData = reactive({
    close: 0,
    change: 0,
    change_rate: 0,
})

const colorConfition = computed(() => {
    return {
        red: todayData.close > indexStore.info.data.previousClose,
        green: todayData.close < indexStore.info.data.previousClose,
    }
})

onMounted(async () => {
    let yestodayIdx = indexStore.tec5Years.data.day.findIndex(item => Utils.dateFormate(item.date, 'yymmdd') == indexStore.info.data.date)
    todayData.close = indexStore.tec5Years.data.day[yestodayIdx].close
    todayData.change = indexStore.tec5Years.data.day[yestodayIdx].change
    todayData.change_rate = indexStore.tec5Years.data.day[yestodayIdx].change_rate
})

const order = ref([1, 2, 3, 4, 5])
const reOrder = (isBig, key) => {
    // if (isBig) {
    //     order.value = order.value.map((item, k) => {
    //         if (k < key) {
    //             return item + 1
    //         } else if (k == key) {
    //             return 1
    //         } else {
    //             return item
    //         }
    //     })
    //     console.log(order.value)
    // }
}
</script>

<style lang="scss" scoped>
.index {
    position: relative;
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