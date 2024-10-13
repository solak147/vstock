import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import API from '@/apis'
import Utils from '@/utils'

export const useIndexStore = defineStore(
  'index',
  () => {
    const info = reactive( { data: {} })
    const tec5Years = reactive({ data: {}}) //最近5年股價+技術指標+即時

    const fetchData = async () => {
      //加權指數
      info.data = await API.Stock.getStockInfo('IX0001')

      const date = new Date()
      const today = Utils.dateFormate(date, 'yymmdd')

      if (!tec5Years.data.day) {
        tec5Years.data = (await API.Stock.getFcnt('FCNT000099', 'IX0001')).data.content.rawContent
      } else {
        const tecDate = Utils.dateFormate(tec5Years.data.day[tec5Years.data.day.length - 1].date, 'yymmdd')
        const dayOfWeek =  date.getDay() == 0 || date.getDay() == 6

        if (today != tecDate && !dayOfWeek) {
          tec5Years.data = (await API.Stock.getFcnt('FCNT000099', 'IX0001')).data.content.rawContent
        }
      }
    }



    return {
      info,
      tec5Years,
      fetchData,          
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
