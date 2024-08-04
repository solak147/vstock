<template>
  <div class="easy-image" :style="{ height: heightUnit }">
    <img
      v-if="realUrl"
      v-show="status == 2"
      :src="realUrl"
      alt=""
      :style="{ objectFit: props.fit }"
      @load="onLoad"
      @error="onError"
    />

    <transition name="van-fade">
      <img v-if="status == 1" src="data:image/jpeg;base64,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" class="loading" />
      <!-- <div v-if="status == 1" class="flex cl-grey"><van-loading type="spinner" />图片加载中...</div> -->
    </transition>
    <div v-if="status == 0" class="error">
      <span v-if="!props.disabledError">加载失败</span>
    </div>
    
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'

const props = defineProps({
  url: {
    type: String,
    default: null
  },
  fit: {
    type: String,
    default: 'fit'
  },
  height: {
    type: String || Number,
    default: '100%'
  },
  disabledError: {
    type: Boolean,
    default: false
  }
})

const status = ref(1)
const height = ref('')
const realUrl = ref('')

onMounted(() => {
  realUrl.value = props.url
  height.value = props.height
})

const heightUnit = computed(() => {
  if (height.value && !isNaN(height.value)) {
    return `${height.value}px`
  } else {
    return height.value
  }
})

const onLoad = () => {
  status.value = 2
}

const onError = () => {
  status.value = 0
}
</script>

<style lang="scss" scoped>
.easy-image {
  position: relative;
  overflow: hidden;

  img {
    display: block;
    height: 100%;
    width: 100%;
  }

  .error,
  .loading {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    font-size: 13px;
    justify-content: center;
    align-items: center;
    color: #fff;
    background: #393f63;
    object-fit: fill;
  }
}
</style>
