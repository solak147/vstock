<template>
  <div class="app cl-white">
    <Layout></Layout>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, nextTick, onUnmounted, onBeforeMount } from 'vue'
import { useIndexStore } from '@/store/modules'
import Layout from '@/layout/index.vue'
import Utils from './utils'
import API from './apis'

const indexStore = useIndexStore()

onMounted(async () => {
  indexStore.fetchData()
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
