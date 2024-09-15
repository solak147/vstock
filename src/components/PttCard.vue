<template>
    <div class="pttCard">
        <h4 class="text-left">PTT批踢踢</h4>
        <div v-for="(item, key) in pttArr" :key="key" class="flex justify-between mb-10">
            <a :href="item.url" target="blank" class="cl-white">{{ item.title }}</a>
            <spna class="cl-grey">{{ item.user_id }} {{ Utils.dateFormate(item.timestamp, 'yymmdd') }}
            </spna>
        </div>
        <el-pagination layout="prev, pager, next" :total="props.pttArr.length" @change="pageChg" />
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, nextTick, onUnmounted, provide, watch, computed } from 'vue'
import Utils from '@/utils'

const props = defineProps({
    pttArr: {
        type: Array,
        default: []
    },
})

watch(
    () => props.pttArr,
    () => {
        pttArr.value = props.pttArr.slice(0, 10)
    },
    {
        deep: true,
    }
)

const pttArr = ref([])

onMounted(() => {

})

const pageChg = (currentPage, pageSize) => {
    pttArr.value = props.pttArr.slice((currentPage - 1) * 10, currentPage * 10)

}
</script>

<style scoped>
.pttCard {
    height: 550px;
    width: 40vw;
    background-color: #131313;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 0 20px;
}
</style>