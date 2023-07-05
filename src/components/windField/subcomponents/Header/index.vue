<template>
    <div class="layout">
        <div class="layout-header">{{ appName }}</div>
    </div>
</template>
<script setup lang="ts">
const appName = '风场风机可视化平台'
</script>
<style lang="scss" scoped>
.layout {
    width: 100vw;
    // height: 100vh;
    height: 1px;
    background-color: #000;

    .layout-header {
        position: absolute;
        top: 0;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 64px;
        padding-bottom: 10px;
        font-size: 24px;
        font-weight: bold;
        color: #fff;
        background: url('@/assets/images/largeTitle.png');
        background-repeat: no-repeat;
        background-size: 100% 64px;
    }
}
</style>
