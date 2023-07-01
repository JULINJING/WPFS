<template>
    <div class="homeContainer _homeContainer">
        <div class="subdiv _subdiv">
        <div class="left"><BlockBriefInfo :blockTitle="'上传 预测'" :blockInfo="'----------------------------------------------'" :backgroundColor="'rgb(250, 250, 250)'" :fontColor="'black'" :imgSrc="require('./imgs/airpodspro.jpg')" :blockName="'upload'" /></div>
        <div class="right"><BlockBriefInfo :blockTitle="'风机 异常'" :blockInfo="'----------------------------------------------'" :fontColor="'white'" :backgroundColor="'rgb(19, 18, 25)'" :imgSrc="require('./imgs/macbookpro.jpg')" :blockName="'windland'" /></div>
        </div>
        <div class="subdiv _subdiv">
        <div class="left"><BlockBriefInfo :blockTitle="'风场 模型'" :blockInfo="'----------------------------------------------'" :backgroundColor="'rgb(0, 0, 0)'" :fontColor="'white'" :imgSrc="require('./imgs/wwdc20.jpg')" :blockName="'windfield'" /></div>
        <div class="right"><BlockBriefInfo :blockTitle="'风机 建模'" :blockInfo="'----------------------------------------------'" :fontColor="'black'" :backgroundColor="'rgb(251, 251, 253)'" :imgSrc="require('./imgs/watch.jpg')" :blockName="'turbine'" /></div>
        </div>
    </div>
</template>

<script>
import BlockBriefInfo from './subcomponents/BlockBriefInfo'

export default {
    name: 'home',
    components: {
        BlockBriefInfo
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
