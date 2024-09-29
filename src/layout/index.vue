<template>
    <div class="layout">
        <el-row>
            <el-col :span="4">
                <el-menu router active-text-color="#f4af1c" background-color="#131313"
                    class="el-menu-vertical-demo menu" :default-active="getUrl()" text-color="#8b8a8a"
                    @open="handleOpen" @close="handleClose">

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
            <el-col :span="20">
                <router-view></router-view>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
// import { useRouter } from 'vue-router'

// const router = useRouter()

const handleOpen = (key, keyPath) => {
    // console.log(key, keyPath)
}

const handleClose = (key, keyPath) => {
    // console.log(key, keyPath)
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