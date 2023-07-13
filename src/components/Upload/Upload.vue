<!-- eslint-disable vue/valid-template-root -->
<template>
    <div class="uploadContainer _uploadContainer">
        <NavTop/>
        <br>
        <UploadFile :tableData="tableData" @update-table-data="updateTableData"/>
        <DataAnalysis :tableData="tableData"/>
    </div>
</template>

<script>
import NavTop from '../baseComponents/NavTop'
import UploadFile from './subcomponents/UploadFile.vue'
import DataAnalysis from './subcomponents/DataAnalysis.vue'

export default {
    data(){
        return {
            tableData: [],
        }
    },
    name: 'upload',
    components: {
        NavTop, UploadFile, DataAnalysis
    },

    methods: {
        updateTableData(data){
            this.tableData = data;
        }
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
