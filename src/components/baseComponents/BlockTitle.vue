<template>
    <div class="blockTitleContainer" :style="'color:'+String(fontColor)">
        <el-tooltip class="item" effect="light" content="点击图片或下方进一步查看" placement="top">
            <div class="blockTitle">
                <i class="iconfont" style="font-size: 1em;" v-html="blockIcon"></i>&nbsp;
                {{blockTitle}}
            </div>
        </el-tooltip>
        <div class="blockInfo">
            <h1>
                <i class="iconfont" v-html="blockInfo"></i>
                <i class="iconfont" v-html="blockInfo"></i>
                <i class="iconfont" v-html="blockInfo"></i>
                <i class="iconfont" v-html="blockInfo"></i>
                <i class="iconfont" v-html="blockInfo"></i>
                <i class="iconfont" v-html="blockInfo"></i>
                <i class="iconfont" v-html="blockInfo"></i>
                <i class="iconfont" v-html="blockInfo"></i>
                <i class="iconfont other" v-html="blockInfo"></i>
                <i class="iconfont other" v-html="blockInfo"></i>
                <i class="iconfont other" v-html="blockInfo"></i>
                <i class="iconfont other" v-html="blockInfo"></i>
            </h1>
            <br/>
        </div>
        <div class="blockGuide">
            <div @click="routerpush('/'+ blockName)" id="pointTitle">
                进一步了解
                <br/>
                查看{{ blockName }} <i class="iconfont">&#xe6d6;</i>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';
export default {
    name: 'blocktitle',
    components: {
    },
    props: ['blockTitle', 'blockInfo', 'fontColor', 'blockName', 'blockIcon'],
    methods: {
        routerpush (to) {
            this.$router.push(to)
        },
        initAnimate() {
            $(".blockTitle").addClass("animated zoomIn")
            $(".blockInfo").addClass("animated zoomIn")
            $(".blockGuide").addClass("animated zoomIn")
        }
    },
    mounted() {
        this.initAnimate()
    }
}
</script>

<style lang="less" scoped>
*{
    user-select: none;
}
@media only screen and (min-width: 800px) {
    .blockTitleContainer{
        position: absolute;
        top: 25%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 0;
        font-size: 2.5em;
        z-index: 999;
        .item {
            margin: 4px;
        }
        .blockTitle{
            display: flex;
            // flex-direction: column;
            align-items: center;
            font-size: 2em;
            font-weight: 800;
        }
        .blockInfo{
            h1{
                font-size: 1.5em ;
                // color: white;
            }
        }
        .blockGuide{
            div{
                font-size: 1em;
                color: white;
            }
        }
    }
    #pointTitle:hover{
        cursor: pointer;
        color: rgba(0,255,255,0.8);
    }
}
@media only screen and (max-width: 800px){
    .blockTitleContainer{
        position: absolute;
        top: 15%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 0;
        font-size: 2.5em;
        z-index: 999;
        .blockTitle{
            display: flex;
            // flex-direction: column;
            align-items: center;
            font-size: 2em;
            font-weight: 800;
        }
        .blockInfo{
            h1{
                font-size: 1.5em ;
                // color: white;
            }
            .other{
                display: none;
            }
        }
        .blockGuide{
            div{
                font-size: 1em;
                color: white;
            }
        }
    }
}
</style>
