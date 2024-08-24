<template>

</template>

<script setup>
import { ref, onMounted, reactive, nextTick, onUnmounted, provide, watch, computed } from 'vue'
import VChart, { THEME_KEY } from 'vue-echarts'
import { useIndexStore } from '@/store/modules/index.js'
import API from '@/apis'

// const heatMap = reactive({
//     data:{
//         list: [],
//     }
// })

onMounted(async() => {
  console.log(await API.Stock.getStockHeatMap('IX0001'))

})


</script>