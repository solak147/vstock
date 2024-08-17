<template>
    <div class="layout">
        <el-row>
            <el-col :span="4">
                <el-menu
                    active-text-color="#f4af1c"
                    background-color="#131313"
                    class="el-menu-vertical-demo menu"
                    default-active="1"
                    text-color="#8b8a8a"
                    @open="handleOpen"
                    @close="handleClose"
                >
                
                    <el-menu-item index="1">
                        <el-icon><HomeFilled /></el-icon>
                        <span>主頁</span>
                    </el-menu-item>

                    <el-sub-menu index="2">
                        <template #title>
                            <el-icon><location /></el-icon>
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

<script lang="ts" setup>
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

</script>

<style lang="scss" scoped>
.layout{
    .menu{
        height: 100vh;
        border-right: 1px solid #1d1d1d
    }
}
</style>