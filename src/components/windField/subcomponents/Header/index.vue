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
            appName:'风场风机可视化平台'
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
        padding-top: 10px;
        font-size: 24px;
        font-weight: bold;
        color: #fff;
        background: url('@/assets/images/largeTitle.png');
        background-repeat: no-repeat;
        background-size: 100% 64px;
        display: none;
    }
}
</style>
