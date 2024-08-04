import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useIndexStore = defineStore(
  'index',
  () => {
    const candles = reactive({ data: {}})

    return {
      candles
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'index',
          storage: localStorage 
        }
      ]
    }
  }
)
