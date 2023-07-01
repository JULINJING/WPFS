<template>
    <div class="blockTitleContainer" :style="'color:'+String(fontColor)">
        <div class="blockTitle">{{blockTitle}}</div>
        <div class="blockInfo">
            <h1>{{blockInfo}}</h1>
            <br/>
        </div>
        <div class="blockGuide">
            <div @click="routerpush('/'+ blockName)" id="pointTitle">
                进一步了解 >
                <br/>
                查看{{ blockName }} ></div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'blocktitle',
    components: {
    },
    props: ['blockTitle', 'blockInfo', 'fontColor', 'blockName'],
    methods: {
        routerpush (to) {
            this.$router.push(to)
            console.log(1)
        }
    }
}
</script>

<style lang="less" scoped>
    .blockTitleContainer{
        position: absolute;
        top: 10%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 0;
        font-size: 2em;
        z-index: 999;
        .blockTitle{
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 2.5em;
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
                color: rgb(40, 151, 255);
            }
        }
    }
    #pointTitle:hover{
        cursor: pointer;
    }

@media only screen and (max-width: 800px){

}
</style>
