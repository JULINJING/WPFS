<!-- eslint-disable vue/valid-template-root -->
<template>
  <div class="uploadContainer _uploadContainer">
    <WPFGPT @custom-event="PreviewFile"></WPFGPT>
    <NavTop/>
    <br>
    <UploadFile @update-table-data="updateTableData"/>
    <DataAnalysis v-if="isChartVisible"/>
    <Footer></Footer>
    <el-dialog :title="titles" :visible.sync="dialogVisible" width="95%" class="filebox">
      <div ref="childRef" class="childRef" v-if="wordShow"></div>
    </el-dialog>
  </div>
</template>

<script>
import WPFGPT from '../wpfGPT/WPFGPT.vue'
import NavTop from '../baseComponents/NavTop'
import Footer from '../baseComponents/Footer.vue'
import UploadFile from './subcomponents/UploadFile.vue'
import DataAnalysis from './subcomponents/DataAnalysis.vue'
import {renderAsync} from "docx-preview";

export default {
  data() {
    return {
      fileUrl: "",
      dialogVisible: false,
      titles: "",
      excelShow: false,
      wordShow: false,
      // tableData: [],
      isChartVisible: false,
    }
  },
  name: 'upload',
  components: {
    NavTop, UploadFile, DataAnalysis, Footer, WPFGPT
  },

  methods: {
    PreviewFile(docFile) {//点击预览事件的时候拿到当前对应的一个文件属性
      this.dialogVisible = true;
      this.excelShow = false;
      this.wordShow = true;
      this.titles = "报表预览";
      this.$nextTick(() => {
        fetch(docFile.docFile)
            .then((response) => {
              console.log("docx文件预览")
              let docData = response.blob(); //将文件转换成bolb形式
              //选择要渲染的元素
              let childRef = document.getElementsByClassName("childRef");
              //用docx-preview渲染
              renderAsync(docData, childRef[0]).then((res) => {
                console.log(res)
              });

            })
            .catch((error) => {
              console.log(error);
            });
      });
    },
    updateTableData() {
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
@media only screen and (min-width: 800px) {
  .uploadContainer {

  }
}

// 小于800px
@media only screen and (max-width: 800px) {
  ._uploadContainer {
  }
}
</style>
