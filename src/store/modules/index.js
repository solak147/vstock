import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useIndexStore = defineStore(
  'index',
  () => {
    const info = reactive( { data: {} })
    const candles = reactive({ data: {}})
    const tec5Years = reactive({ data: {}}) //最近5年股價+技術指標+即時

    return {
      info,
      candles,
      tec5Years    
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
