<!-- eslint-disable vue/valid-template-root -->
<template>
    <div class="uploadContainer _uploadContainer">
        <NavTop/>
        <br>
        <UploadFile @update-table-data="updateTableData"/>
        <DataAnalysis v-if="isChartVisible"/>
        <Footer></Footer>
    </div>
</template>

<script>
import NavTop from '../baseComponents/NavTop'
import Footer from '../baseComponents/Footer.vue'
import UploadFile from './subcomponents/UploadFile.vue'
import DataAnalysis from './subcomponents/DataAnalysis.vue'

export default {
    data(){
        return {
            // tableData: [],
            isChartVisible: false,
        }
    },
    name: 'upload',
    components: {
        NavTop, UploadFile, DataAnalysis,Footer
    },

    methods: {
        updateTableData(){
            // this.tableData = data;
            console.log("updateTableData");
            this.isChartVisible = true;
        }
    },
    mounted() {
        this.$on('update-table-data', this.updateTableData);
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
