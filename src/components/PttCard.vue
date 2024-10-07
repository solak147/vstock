<template>
    <div class="pttCard" v-loading="pttArr.slice((currentPage - 1) * pageSize, currentPage * pageSize).length == 0"
        element-loading-background="transparent">
        <h4 class="text-left pl-20">PTT批踢踢</h4>
        <div class="articleWrap">
            <div v-for="(item, key) in pttArr.slice((currentPage - 1) * pageSize, currentPage * pageSize)" :key="key"
                class="flex justify-between mb-10">
                <a :href="item.url" target="blank" class="cl-white">{{ item.title }}</a>
                <span class="cl-grey">{{ item.user_id }} {{ Utils.dateFormate(item.timestamp, 'yymmdd') }}
                </span>
            </div>
        </div>
        <el-pagination layout="prev, pager, next, slot" background :total="pttArr.length" :pageSize="pageSize"
            v-model:current-page="currentPage" @change="pageChg" class="mb-10 pl-20">

            <template #default>
                <el-button @click="nextClick">
                    <el-icon>
                        <DArrowRight />
                    </el-icon>
                </el-button>
            </template>
        </el-pagination>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, nextTick, onUnmounted, provide, watch, computed } from 'vue'
import Utils from '@/utils'
import API from '@/apis'

const props = defineProps({
    symbol: {
        type: String,
        default: ''
    },
})

// watch(
//     () => props.pttArr,
//     () => {
//         pttArr.value = props.pttArr.slice(0, 10)
//     },
//     {
//         deep: true,
//     }
// )

const pttArr = ref([])
const currentPage = ref(1)
const pageSize = ref(12)
const weekFrom = ref(0)

onMounted(async () => {
    let res = await API.Stock.getFcnt('FCNT000073', props.symbol)
    pttArr.value = res.data.content.rawContent
})

// const pageChg = async (currentPage, pageSize) => {

// }

const nextClick = async () => {
    currentPage.value += 1

    if (pttArr.value.length < currentPage.value * pageSize.value) {
        let date = new Date(pttArr.value[pttArr.value.length - 1].timestamp)
        date.setDate(date.getDate())
        let res = await API.Stock.getFcnt('FCNT000073', props.symbol, date.getTime() - 1)
        pttArr.value = pttArr.value.concat(res.data.content.rawContent)
    }
}
</script>

<style scoped>
/* .el-pagination {
    --el-pagination-bg-color: transparent;
} */

.pttCard {
    height: fit-content;
    min-height: 60vh;
    width: 40vw;
    background-color: #131313;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;


    .articleWrap {
        min-height: 47vh;
        padding: 0 20px;
    }
}

@media screen and (max-width: 768px) {
    .pttCard {
        width: 95vw;
    }
}
</style>