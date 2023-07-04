<template>
    <div class="blockContainer" :style="' background-color:'+String(backgroundColor)">
        <BlockTitle :blockTitle="blockTitle" :blockInfo="blockInfo" :fontColor="fontColor" :blockName="blockName"/>
        <img :src="imgSrc">
    </div>
</template>

<script>
import BlockTitle from '../../baseComponents/BlockTitle'

export default {
    name: 'blockbriefinfo',
    components: {
        BlockTitle
    },
    props: ['blockTitle', 'blockInfo', 'fontColor', 'imgSrc', 'backgroundColor', 'blockName']
}
</script>

<style lang="less" scoped>
.blockContainer{
    position: relative;
    width: 100%;
    display: flex;
    flex-direction:column-reverse;
    justify-content: center;
    align-items: center;
    min-height: 500px;
    font-size: 1em;
    padding-top:10%;
    margin-bottom: 13px;
    img{
        width:400px;
        height: auto;
    }
    img:hover {
        cursor: pointer;
    }
}
</style>
