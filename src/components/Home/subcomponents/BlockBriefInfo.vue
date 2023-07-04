<template>
    <div class="blockContainer" :style="' background-color:'+String(backgroundColor)">
        <BlockTitle :blockTitle="blockTitle" :blockInfo="blockInfo" :fontColor="fontColor" :blockName="blockName"/>
        <img :src="imgSrc" @click="routerpush('/'+ blockName)">
    </div>
</template>

<script>
import BlockTitle from '../../baseComponents/BlockTitle'

export default {
    name: 'blockbriefinfo',
    components: {
        BlockTitle
    },
    props: ['blockTitle', 'blockInfo', 'fontColor', 'imgSrc', 'backgroundColor', 'blockName'],
    methods: {
        routerpush (to) {
            this.$router.push(to)
        }
    }
}
</script>

<style lang="less" scoped>
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
            border: 1px rgb(134, 134, 134) solid;
            box-shadow:-8px 0px 8px rgba(134, 134, 134, 0.8),   /*左边阴影*/
            0px -8px 8px rgba(134, 134, 134, 0.8),  /*上边阴影*/
            8px 0px 8px rgba(134, 134, 134, 0.8),  /*右边阴影*/
            0px 8px 8px rgba(134, 134, 134, 0.8); /*下边阴影*/
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
