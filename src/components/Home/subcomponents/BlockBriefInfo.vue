<template>
    <div class="blockContainer" :style="' background-color:'+String(backgroundColor)">
        <span class="line-top"></span>
        <span class="line-right"></span>
        <span class="line-bottom"></span>
        <span class="line-left"></span>
        <BlockTitle :blockIcon="blockIcon" :blockTitle="blockTitle" :blockInfo="blockInfo" :fontColor="fontColor" :blockName="blockName"/>
        <img class="blockImg" :src="imgSrc" @click="routerpush('/'+ blockName)">
    </div>
</template>

<script>
import $ from 'jquery';
import BlockTitle from '../../baseComponents/BlockTitle'

export default {
    name: 'blockbriefinfo',
    components: {
        BlockTitle
    },
    props: ['blockTitle', 'blockInfo', 'fontColor', 'imgSrc', 'backgroundColor', 'blockName', 'blockIcon'],
    methods: {
        routerpush (to) {
            this.$router.push(to)
        },
        initAnimate() {
            $(".blockImg").addClass("animated bounceIn")
        }
    },
    mounted() {
        this.initAnimate()
    }
}
</script>

<style lang="less" scoped>
.line-top {
    position: absolute;
    width: 80px;
    height: 1px;
    top: -1px;
    left: 0;
    background: linear-gradient(to right, rgba(233,231,239,0.4), #fff);
    border-radius: 50%;
    animation: left_to_right 4s 0s linear infinite;
}

.line-top::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 16px;
    background: linear-gradient(to right, transparent, rgba(233,231,239,0.4), #fff);
    left: 0;
    top: -5px;
    filter: blur(4px);
    z-index: -1;
}

.line-right {
    position: absolute;
    width: 1px;
    height: 0;
    top: 0;
    right: -1px;
    background: linear-gradient(rgba(233,231,239,0.4), #fff);
    animation: top_to_bottom 4s 0s linear infinite;
}

.line-right::before {
    content: "";
    position: absolute;
    width: 16px;
    height: 100%;
    background: linear-gradient(to bottom, transparent, rgba(233,231,239,0.4), #fff);
    left: -5px;
    top: 0;
    filter: blur(4px);
    z-index: -1;
}

.line-bottom {
    position: absolute;
    width: 0;
    height: 1px;
    bottom: -1px;
    right: 0;
    background: linear-gradient(to left, rgba(233,231,239,0.4), #fff);
    border-radius: 50%;
    animation: right_to_left 4s 0s linear infinite;
}

.line-bottom::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 16px;
    background: linear-gradient(to left, transparent, rgba(233,231,239,0.4), #fff);
    left: 0;
    top: -5px;
    filter: blur(4px);
    z-index: -1;
}

.line-left {
    position: absolute;
    width: 1px;
    height: 0;
    bottom: 0;
    left: -1px;
    background: linear-gradient(to top, rgba(233,231,239,0.4), #fff);
    animation: bottom_to_top 4s 0s linear infinite;
}

.line-left::before {
    content: "";
    position: absolute;
    width: 16px;
    height: 100%;
    background: linear-gradient(to top, transparent, rgba(233,231,239,0.4), #fff);
    left: -5px;
    top: 0;
    filter: blur(4px);
    z-index: -1;
}


@keyframes left_to_right {
    0% {
        width: 0;
        left: 0;
    }

    25% {
        left: 0;
        width: 80px;
    }

    75% {
        left: calc(100% - 80px);
        width: 80px;
    }

    100% {
        left: 100%;
        width: 0;
    }
}

@keyframes top_to_bottom {
    0% {
        top: 0;
        height: 0;
    }

    25% {
        top: 0;
        height: 80px;
    }

    75% {
        top: calc(100% - 80px);
        height: 80px;
    }

    100% {
        top: 100%;
        height: 0;
    }
}

@keyframes right_to_left {
    0% {
        right: 0;
    }

    25% {
        width: 80px;
        right: 0;
    }

    75% {
        width: 80px;
        right: calc(100% - 80px);
    }

    100% {
        right: 100%;
        width: 0;
    }
}

@keyframes bottom_to_top {
    0% {
        bottom: 0;
    }

    25% {
        bottom: 0;
        height: 80px;
    }

    75% {
        height: 80px;
        bottom: calc(100% - 80px);
    }


    100% {
        bottom: 100%;
        height: 0;
    }
}
@media only screen and (min-width: 800px){
    .blockContainer{
        position: relative;
        width: 100%;
        display: flex;
        flex-direction:column-reverse;
        justify-content: center;
        align-items: center;
        min-height: 350px;
        font-size: 1em;
        // padding-top:10%;
        margin-bottom: 13px;
        img{
            width:100%;
            height: auto;
        }
        img:hover {
            cursor: pointer;
            // 渐变
            transition: all 0.5s linear;
            // border: 1px rgb(134, 134, 134) solid;
            box-shadow:-10px 0px 10px rgba(134, 134, 134, 0.8),   /*左边阴影*/
            0px -10px 10px rgba(134, 134, 134, 0.8),  /*上边阴影*/
            10px 0px 10px rgba(134, 134, 134, 0.8),  /*右边阴影*/
            0px 10px 10px rgba(134, 134, 134, 0.8); /*下边阴影*/
        }
    }
}

@media only screen and (max-width: 800px){
    .blockContainer{
        position: relative;
        width: 100%;
        display: flex;
        flex-direction:column-reverse;
        justify-content: center;
        align-items: center;
        min-height: 280px;
        font-size: 1em;
        // padding-top:10%;
        margin-bottom: 10px;
        img{
            width: 100%;
            height: auto;
        }
    }
}
</style>
