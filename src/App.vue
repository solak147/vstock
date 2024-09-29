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
  const socket = new WebSocket('wss://api.fugle.tw/marketdata/v1.0/stock/streaming');

  socket.onopen = () => {
    socket.send(
      JSON.stringify({
        event: 'auth',
        data: {
          apikey: 'YzY2MTY5OWQtMWQ3OC00OTMzLThiZTYtYzViMDA2ZmIzZTg3IDA1ZjEzNDc3LTMzYjAtNDY0OC1hMjVmLWJjODgzNTBkNTRlZQ==',
        },
      }),
    );

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);

      if (data.event === 'authenticated') {
        socket.send(
          JSON.stringify({
            event: 'subscribe',
            data: {
              channel: 'candles',
              symbol: 'IX0001',
            },
          }),
        );
      }

      if (data.event === 'snapshot') {
        indexStore.candles.data = data.data
      }

      // console.log(data);
    };
  };

  //加權指數
  indexStore.info.data = await API.Stock.getStockInfo('IX0001')
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
