import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 数据持久化
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// https://echarts.apache.org/zh/tutorial.html#%E5%BC%82%E6%AD%A5%E6%95%B0%E6%8D%AE%E5%8A%A0%E8%BD%BD%E5%92%8C%E6%9B%B4%E6%96%B0
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { CandlestickChart, BarChart  } from 'echarts/charts';
import {
  VisualMapComponent,
  DataZoomComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';

use([
  VisualMapComponent,
  DataZoomComponent,
  GridComponent,
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent,

  BarChart,
  CandlestickChart,
])
  
const app = createApp(App);



const app1 = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app1.component(key, component)
}

app1.use(router)
.use(pinia)
.mount('#app')

