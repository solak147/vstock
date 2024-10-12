<template>
  <div class="app cl-white">
    <Layout></Layout>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, nextTick, onUnmounted } from 'vue'
import { useIndexStore } from '@/store/modules'
import Layout from '@/layout/index.vue'
import Utils from './utils'
import API from './apis'

const indexStore = useIndexStore()

onMounted(async () => {
  //加權指數
  indexStore.info.data = await API.Stock.getStockInfo('IX0001')

  const today = Utils.dateFormate(new Date(), 'yymmdd')

  if (!indexStore.tec5Years.data.day) {
    indexStore.tec5Years.data = (await API.Stock.getFcnt('FCNT000099', 'IX0001')).data.content.rawContent
  } else {
    const tecDate = Utils.dateFormate(indexStore.tec5Years.data.day[indexStore.tec5Years.data.day.length - 1].date, 'yymmdd')

    if (today != tecDate) {
      indexStore.tec5Years.data = (await API.Stock.getFcnt('FCNT000099', 'IX0001')).data.content.rawContent
    }
  }

})

</script>

<style lang='scss'>
@import '@/assets/style/global.scss';
</style>

<style lang="scss" scoped>
.app {
  background-color: #292929;
}
</style>
