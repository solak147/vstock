<template>
    <!-- <EasyImage :url="url"></EasyImage> -->
  
    <BaseList api="http://jsonplaceholder.typicode.com/posts">
      <template #default="{ listData }">
        {{ listData.data.length }}
         <Waterfall :list="listData" ></Waterfall>
      </template>
    </BaseList>
</template>

<script setup>
import BaseList from '@/components/BaseList.vue'
import EasyImage from '@/components/EasyImage.vue'
import Waterfall from '@/components/Waterfall.vue'

const url = 'https://thumb.ac-illust.com/0c/0c3c64e631df8b99256cf6de8fa8f12f_w.jpeg'


</script>