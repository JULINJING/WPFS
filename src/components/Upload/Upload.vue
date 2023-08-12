<!-- eslint-disable vue/valid-template-root -->
<template>
  <div class="uploadContainer _uploadContainer">
    <WPFGPT @custom-event="PreviewFile"></WPFGPT>
    <NavTop/>
    <br>
    <UploadFile @update-table-data="updateTableData"/>
    <DataAnalysis v-if="isChartVisible"/>
    <Footer></Footer>
    <el-dialog :visible.sync="dialogVisible" top="10vh" width="60%" class="filebox">
      <a id="dl" @click="downloadDocxFile">下载<i class="iconfont">&#xe602;</i></a>
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
import {serverIp} from "../../../public/config";

export default {
  data() {
    return {
      fileUrl: "",
      dialogVisible: false,
      titles: "",
      excelShow: false,
      wordShow: false,
      docxFile: "",
      // tableData: [],
      isChartVisible: false,
    }
  },
  name: 'upload',
  components: {
    NavTop, UploadFile, DataAnalysis, Footer, WPFGPT
  },

  methods: {
    downloadDocxFile(){
      window.open(this.docxFile)
    },
    PreviewFile(data) {//点击预览事件的时候拿到当前对应的一个文件属性
      this.docxFile = data.docxFile;
      this.dialogVisible = true;
      this.excelShow = false;
      this.wordShow = true;
      this.$nextTick(() => {
        fetch(data.docxFile)
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
    :deep(.el-dialog){
      .el-dialog__header{
        padding-top: 8px !important;
      }
      .el-dialog__body {
        // text-align: left !important;
        padding-top: 0;
        #dl {
          text-align: center !important;
          text-decoration: underline;
          color: #2c3e50;
          cursor: pointer;
          font-size: 14px;
          font-weight: 200;
        }
        #dl:hover {
          color: #409EFF;
        }
        .docx-wrapper{
          padding: 0;
          .docx{
            width: 100% !important;
            margin: 0;
            article {
              text-align: left !important;
              padding: 5px !important;
              .docx_table{
                width: 100% !important;
              }
            }
          }
        }
      }
    }
  }
}

// 小于800px
@media only screen and (max-width: 800px) {
  ._uploadContainer {
    :deep(.el-dialog){
      .el-dialog__header{
        padding-top: 8px !important;
      }
      .el-dialog__body {
        // text-align: left !important;
        padding-top: 0;
        #dl {
          text-align: center !important;
          text-decoration: underline;
          color: #2c3e50;
          cursor: pointer;
          font-size: 14px;
          font-weight: 200;
        }
        #dl:hover {
          color: #409EFF;
        }
        .docx-wrapper{
          padding: 0;
          .docx{
            width: 100% !important;
            margin: 0;
            article {
              text-align: left !important;
              padding: 5px !important;
              .docx_table{
                width: 100% !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>
