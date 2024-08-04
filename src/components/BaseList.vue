<template>
    <van-pull-refresh v-model="isRefreshing" :disabled="!useRefresh" @refresh="onRefresh" success-text="刷新成功">
        <van-list v-model="isLoading" 
            @load="loadData" 
            :finished="isFinished"
            :error.sync="isError" 
            finished-text="没有更多了"
            :style="{ minHeight }"
            :immediate-check="false" :direction="reverse ? 'up' : 'down'" :offset="reverse ? 50 : 300">
            <slot v-bind:listData="listData" />
            <template #error>
                加载失败
            </template>
        </van-list>
    </van-pull-refresh>
</template>

<script setup>
import { onMounted, ref, reactive, computed, nextTick } from 'vue'
import { get } from '@/apis/request'
import Utils from '@/utils'

const emit = defineEmits(['loaded', 'success'])

const props = defineProps({
    api: {
        type: String,
        default: ''
    },
    params: {
        type: Object,
        default() {
            return {}
        },
    },
})

const page = ref(0)
let listData = reactive({
    data:[]
})
const isLoading = ref(false)
const isRefreshing = ref(false)
const isError = ref(false)
const isFinished = ref(false)
const useRefresh = ref(true)
const reverse = ref(false)
const minHeight = ref(0)

onMounted(() =>{
    loadData()
})

//test api: https://juejin.cn/post/7041461420818432030 
const loadData = async () => {

    if(isLoading.value){
        return
    }

    let reqPage = page.value + 1

    if (isRefreshing.value) {
        reqPage = 1
    } else {
        isLoading.value = true
    }

    let reqParams = Utils.deepClone(props.params, { page: reqPage })

    try {
        let resList = await get(props.api, reqParams)

        if (!resList || !Array.isArray(resList)) {
            isError.value = true
            isRefreshing.value = false
            isLoading.value = false
            return false
        }

        if (isRefreshing.value) {
            isRefreshing.value = false
            listData.data = []
            
            await nextTick()
            listData.data = resList
        
            isFinished.value = false
            page.value = 1
        } else {
            isLoading.value = false
            if (reverse.value) {
                listData.data = resList.reverse().concat(listData.data)           
            } else {
                listData.data = listData.data.concat(resList)
            }
            page.value++
            emit('loaded')
            emit('success', listData.data)

            if (resList.length === 0) {
                isFinished.value= true
            }
        }

        console.log(resList)      
    }catch (error) {
        isLoading.value = false
        isRefreshing.value = false
        isError.value = true
    }
}

const onRefresh = () => {
    isRefreshing.value = true
    loadData()
}


</script>