import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useIndexStore = defineStore(
  'index',
  () => {
    const info = reactive( { data: {} })
    const candles = reactive({ data: {}})

    return {
      info,
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
