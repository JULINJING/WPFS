<template>
    <div class="homeContainer _homeContainer">
        <NavTop></NavTop>
        <div class="subdiv _subdiv">
            <div class="left"><BlockBriefInfo :blockTitle="'上传 原始数据可视化'" :blockInfo="'----------------------------------------------'" :backgroundColor="'rgb(250, 250, 250)'" :fontColor="'black'" :imgSrc="require('./imgs/1.jpg')" :blockName="'upload'" /></div>
            <div class="right"><BlockBriefInfo :blockTitle="'模型预测'" :blockInfo="'----------------------------------------------'" :fontColor="'white'" :backgroundColor="'rgb(19, 18, 25)'" :imgSrc="require('./imgs/6.jpg')" :blockName="'forecast'" /></div>
        </div>
        <div class="subdiv _subdiv">
            <div class="left"><BlockBriefInfo :blockTitle="'mars3d大屏'" :blockInfo="'----------------------------------------------'" :backgroundColor="'rgb(0, 0, 0)'" :fontColor="'white'" :imgSrc="require('./imgs/4.jpg')" :blockName="'windfield'" /></div>
            <div class="right"><BlockBriefInfo :blockTitle="'监测大屏'" :blockInfo="'----------------------------------------------'" :backgroundColor="'rgb(250, 250, 250)'" :fontColor="'black'" :imgSrc="require('./imgs/5.jpg')" :blockName="'watch'" /></div>
        </div>
        <div class="subdiv _subdiv">
            <div class="left"><BlockBriefInfo :blockTitle="'风机异常大屏'" :blockInfo="'----------------------------------------------'" :fontColor="'black'" :backgroundColor="'rgb(251, 251, 253)'" :imgSrc="require('./imgs/3.jpg')" :blockName="'turbine'" /></div>
            <div class="right"><BlockBriefInfo :blockTitle="'three风机'" :blockInfo="'----------------------------------------------'" :fontColor="'white'" :backgroundColor="'rgb(19, 18, 25)'" :imgSrc="require('./imgs/2.jpg')" :blockName="'windland'" /></div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
import BlockBriefInfo from './subcomponents/BlockBriefInfo'
import NavTop from '../baseComponents/NavTop.vue';
import Footer from '../baseComponents/Footer.vue'

export default {
    name: 'home',
    components: {
        BlockBriefInfo,
        NavTop,
        Footer
    }
}
</script>

<style lang="less" scoped>

// 大于800px
@media only screen and (min-width: 800px){
    .homeContainer{
        font-size: 1vw;
        .subdiv{
            width: 100%;
            display: flex;
            justify-content: space-around;
            font-size: .5em;
            .left{
                width: 48%;
                height: 100%;
                font-size: .8em;
            }
            .right{
                width: 48%;
                height: 100%;
                font-size: .8em;
            }
        }
    }
}

// 小于800px
@media only screen and (max-width: 800px){
    ._homeContainer{
        font-size: 1vw;
        ._subdiv{
            width: 100%;
            display: flex;
            flex-direction: column;
            // justify-content: space-around;
            font-size: .5em;
            .left{
                width: 100%;
                height: 100%;
                font-size: .8em;
            }
            .right{
                width: 100%;
                height: 100%;
                font-size: .8em;
            }
        }
    }
}
</style>
