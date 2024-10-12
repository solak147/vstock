<template>
    <div class="layout" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
        <el-row>
            <el-drawer v-model="drawer.show" title="I am the title" size="100%" :direction="direction"
                :before-close="handleDrawerClose">

            </el-drawer>

            <el-col :md="4" :sm="0" :xs="0">
                <el-menu router active-text-color="#f4af1c" background-color="#131313"
                    class="el-menu-vertical-demo menu" :default-active="getUrl()" text-color="#8b8a8a">

                    <el-menu-item index="/index">
                        <el-icon>
                            <HomeFilled />
                        </el-icon>
                        <span>主頁</span>
                    </el-menu-item>

                    <el-menu-item index="/heatMap">
                        <el-icon>
                            <HomeFilled />
                        </el-icon>
                        <span>類股表現</span>
                    </el-menu-item>

                    <el-sub-menu index="3">
                        <template #title>
                            <el-icon>
                                <location />
                            </el-icon>
                            <span>Navigator One</span>
                        </template>
                        <el-menu-item-group title="Group One">
                            <el-menu-item index="1-1">item one</el-menu-item>
                            <el-menu-item index="1-2">item two</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="Group Two">
                            <el-menu-item index="1-3">item three</el-menu-item>
                        </el-menu-item-group>
                        <el-sub-menu index="1-4">
                            <template #title>item four</template>
                            <el-menu-item index="1-4-1">item one</el-menu-item>
                        </el-sub-menu>
                    </el-sub-menu>

                </el-menu>
            </el-col>
            <el-col :md="20" :sm="24" :xs="24">
                <router-view></router-view>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { DrawerProps } from 'element-plus'

const drawer = reactive({
    show: false,
    touchStartX: 0,
    touchEndX: 0,
})
const direction = ref<DrawerProps['direction']>('ltr')

const onTouchStart = (event: any) => {
    drawer.touchStartX = event.changedTouches[0].screenX; // 记录起始触摸点
}

const onTouchMove = (event: any) => {
    drawer.touchEndX = event.changedTouches[0].screenX; // 记录移动中的触摸点
}

const onTouchEnd = () => {
    // 检测从左往右滑动并且滑动距离超过 50px
    if (drawer.touchEndX > drawer.touchStartX && (drawer.touchEndX - drawer.touchStartX) > 200) {
        drawer.show = true;
    }

    if (drawer.touchEndX < drawer.touchStartX && (drawer.touchEndX - drawer.touchStartX) < 200) {
        drawer.show = false;
    }
}

const handleDrawerClose = (done: () => void) => {
    done()
}

const getUrl = () => {
    // console.log(location.hash.replace('#', ''))
    return location.hash.replace('#', '')
}
</script>

<style lang="scss" scoped>
.layout {
    .menu {
        height: 100vh;
        border-right: 1px solid #1d1d1d
    }
}
</style>