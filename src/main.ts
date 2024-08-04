import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// 数据持久化
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// https://echarts.apache.org/zh/tutorial.html#%E5%BC%82%E6%AD%A5%E6%95%B0%E6%8D%AE%E5%8A%A0%E8%BD%BD%E5%92%8C%E6%9B%B4%E6%96%B0
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { CandlestickChart } from 'echarts/charts';
import {
    DataZoomComponent,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
} from 'echarts/components';

use([
    DataZoomComponent,
    GridComponent,
    CanvasRenderer,
    CandlestickChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
])
  
createApp(App)
.use(router)
.use(pinia)
.mount('#app')
