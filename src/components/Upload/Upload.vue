<!-- eslint-disable vue/valid-template-root -->
<template>
    <div class="uploadContainer _uploadContainer">
        <NavTop/>
        <UploadFile/>
        <DataAnalysis/>
        <!-- <MusicTotalinfo/> -->
        <!-- <GoodsBriefInfo :isnew="'yes'" :goodinfo="'妙得不同凡响。'" :goodname="'AirPods Pro'" :imgsrc="require('./imgs/airpods_pro.jpg')"/>\ -->
        <!-- <Device/> -->
        <!-- <ProfessApp/> -->
        <!-- <FinalMusic/> -->
        
    </div>
</template>

<script>
import NavTop from '../baseComponents/NavTop'
import UploadFile from './subcomponents/UploadFile.vue'
import DataAnalysis from './subcomponents/DataAnalysis.vue'
import MusicTotalinfo from './subcomponents/MusicTotalinfo'
import GoodsBriefInfo from './subcomponents/GoodsBriefInfo'
import Device from './subcomponents/Device'
import ProfessApp from './subcomponents/ProfessApp'
import FinalMusic from './subcomponents/FinalMusic'
export default {
    name: 'upload',
    components: {
        NavTop, UploadFile, DataAnalysis, MusicTotalinfo, GoodsBriefInfo, Device, ProfessApp, FinalMusic
    }
}
</script>

<style lang="less" scoped>

// 大于800px
@media only screen and (min-width: 800px){
    .uploadContainer{

    }
}

// 小于800px
@media only screen and (max-width: 800px){
    ._uploadContainer{
    }
}
</style>
