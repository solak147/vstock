<template>
  <div class="app">
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
              symbol: '2330',
            },
          }),
        );
      }

      if (data.event === 'snapshot') {
        indexStore.candles.data = data.data
      }

      console.log(data);
    };
  };
})

</script>

<style scoped>
.app{
}

.chart {
  height: 100vh;
}
</style>
