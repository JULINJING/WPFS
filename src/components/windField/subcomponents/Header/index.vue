<template>
    <div class="header">
        <div class="header-title">{{ appName }}</div>
    </div>
</template>
<script lang="js">
import $ from 'jquery'
export default {
    data() {
        return{
            appName:'风 力 发 电 数 字 孪 生 仿 真 平 台'
        }
    },
    methods: {
        initTitle() {
            setTimeout(function () {
                $(".header-title").css("display","block")
                $(".header-title").addClass("animated bounceIn")
            }, 2000)
        }
    },
    mounted() {
        this.initTitle()
    }
}
</script>
<style lang="scss" scoped>
.header {
    width: 100vw;
    // height: 100vh;
    height: 1px;
    background-color: #000;

    .header-title {
        position: absolute;
        top: 0;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: 64px;
        padding-top: 20px;
        font-size: 24px;
        font-weight: bold;
        color: #fff;
        background: url('@/assets/images/largeTitle.png');
        background-repeat: no-repeat;
        background-size: 100% 64px;
        display: none;
        user-select: none;
        // text-shadow:0px 1px 0px #c0c0c0,
        //     0px 2px 0px #b0b0b0,
        //     0px 3px 0px #a0a0a0,
        //     0px 4px 0px #909090,
        //     0px 5px 10px rgba(0, 0, 0, .9);
    }
}
</style>
