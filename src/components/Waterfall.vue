<!-- 瀑布流 -->
<template>
  <van-row type="flex" gutter="8">
    <van-col span="12">
      <div v-for="(item, index) in list1" :key="index" class="img-border">
        <div class="aspect-ratio" :style="{ paddingTop: `${(1 / item.ratio) * 100}%` }">
          <div class="aspect-ratio-content animate__animated animate__zoomIn" @click="emit('click', item)">
            <EasyImage :url="item.imageUrl"></EasyImage>      
          </div>
        </div>
        <div class="cl-grey py-5 text-center">{{ item.name }}</div>
      </div>
    </van-col>
    <van-col span="12">
      <div v-for="(item, index) in list2" :key="index" class="img-border">
        <div class="aspect-ratio" :style="{ paddingTop: `${(1 / item.ratio) * 100}%` }">
          <div class="aspect-ratio-content animate__animated animate__zoomIn" @click="emit('click', item)">
            <EasyImage :url="item.imageUrl"></EasyImage>
          </div>       
        </div>
        <div class="cl-grey py-5 text-center ">{{ item.name }}</div>
      </div>
    </van-col>
  </van-row>
</template>

<script setup>
import EasyImage from '@/components/EasyImage.vue'
import { onMounted, ref, watch } from 'vue'

const emit = defineEmits(['click'])

const props = defineProps({
  list: {
    type: Object,
    // default() {
    //   return []
    // }
  }
})

const list1 = ref([])
const list2 = ref([])
const list1heigth = ref(0)
const list2heigth = ref(0)

watch(props.list, (nowData, oldData) => {
  let now = nowData?.data
  let old = oldData?.data
  if (!now || !now.length) return;

  if (now.length === 0) {
    clearData();
    return;
  }
  if (old && now.length <= old.length) {
    clearData();
  }

  const len = list1.value.length + list2.value.length;
  const arr = now.slice(len);

  arr.forEach((e, i) => {
    const h = isNaN(Number(e.imageHeight)) ? 0 : Number(e.imageHeight)
    const w = isNaN(Number(e.imageWidth)) ? 0 : Number(e.imageWidth)

    let ratio
    if ((h !== 0 && w !== 0)) {
      ratio = h / w
      if (ratio > 1.4) ratio = 1.4    
    } else {
      ratio = 9 / 16
    }

    e.ratio = 1 / ratio
    if (list1heigth.value <= list2heigth.value) {
      list1.value.push(e)
      list1heigth.value += ratio + 0.3656
    } else {
      list2.value.push(e)
      list2heigth.value += ratio + 0.3656
    }
  })
},
{
  immediate: true,
})

const clearData = () => {
  list1.value = [];
  list2.value = [];
  list1heigth.value = 0;
  list2heigth.value = 0;
}

onMounted(() => {

})
</script>

<style lang="scss" scoped>
.aspect-ratio {
  position: relative;
  width: 100%;
  overflow: hidden;
  pointer-events: auto;
  margin-top: 0.5rem;
  .aspect-ratio-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    & * {
      width: 100%;
      height: 100%;
    }
  }
  .overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    a {
      pointer-events: auto;
    }
  }
}

.van-col--12 {
  padding: 4px;
}

.img-border{
  border-radius: 8px;
  box-shadow: 0 0.02rem 0.02rem 0 rgba(0,0,0,.5);
}
</style>
