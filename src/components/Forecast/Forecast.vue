<template>
  <div class="forecastContainer _forecastContainer" ref="forecast">
    <WPFGPT ref="wpfgpt" @custom-event="PreviewFile"></WPFGPT>
    <NavTop/>
    <div id="tabBox">
      <el-tabs v-model="activeName" type="border-card"
               style="height:100%;width:96%;margin-bottom: 20px;margin-top: 20px;">
        <el-tab-pane name="train">
          <span slot="label"><i class="iconfont">&#xe628;</i> 训练</span>
          <TrainSettings/>
        </el-tab-pane>
        <el-tab-pane name="forecast">
          <span slot="label"><i class="iconfont">&#xe6df;</i> 预测</span>
          <PredictSettings @update-table-data="updateTableData"/>
          <ForecastDisplay/>
          <ChartsDisplay v-if="isChartDisplay"/>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- <el-row style="border-bottom: 3px #D9D9D9 dotted;width: 96%;margin-bottom: 5px;">
        <el-button class="tabButton" @click="showTrainSettings">训练</el-button>
        <el-button class="tabButton" @click="showPredictSettings">预测</el-button>
    </el-row> -->
    <Footer/>
    <el-dialog :visible.sync="dialogVisible" top="10vh" width="60%" class="filebox" @close="panelSwitch">
      <a id="dl" @click="downloadDocxFile">下载<i class="iconfont">&#xe602;</i></a>
      <div ref="childRef" class="childRef" v-if="wordShow"></div>
    </el-dialog>
  </div>
</template>

<script>
import WPFGPT from '../wpfGPT/WPFGPT.vue'
import NavTop from '../baseComponents/NavTop';
import PredictSettings from './subcomponents/PredictSettings.vue';
import ForecastDisplay from './subcomponents/ForecastDisplay.vue';
import TrainSettings from './subcomponents/TrainSettings.vue';
import ChartsDisplay from './subcomponents/ChartsDisplay.vue';
import Footer from '../baseComponents/Footer.vue';
import {renderAsync} from "docx-preview";

export default {
  name: 'forecast',
  components: {
    NavTop, PredictSettings, ForecastDisplay, TrainSettings, ChartsDisplay, Footer, WPFGPT
  },
  data() {
    return {
      fileUrl: "",
      dialogVisible: false,
      titles: "",
      excelShow: false,
      wordShow: false,
      docxFile: "",
      activeName: 'train',
      isChartDisplay: false
    };
  },
  mounted() {
    this.$on('update-table-data', this.updateTableData);
  },
  methods: {
    panelSwitch() {
      this.$refs.wpfgpt.panelSwitch();
    },
    downloadDocxFile() {
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
      console.log("Update predict table data");
      this.isChartDisplay = true;
    }
  }
}
</script>

<style lang="less" scoped>
#forecastContainer {
  margin: 0;
  padding: 0;
  overscroll-behavior: none;
  overflow: hidden;
}

// 大于800px
@media only screen and (min-width: 800px) {
  .forecastContainer {
    :deep(.el-dialog) {
      .el-dialog__header {
        padding-top: 16px !important;
      }

      .el-dialog__body {
        // text-align: left !important;
        padding-top: 0;
        margin: auto 5px;

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

        .docx-wrapper {
          padding: 0;

          .docx {
            width: 100% !important;
            margin: 0;

            article {
              text-align: left !important;
              padding: 5px !important;
              margin: 10px !important;

              .docx_table {
                width: 100% !important;
              }
            }
          }
        }
      }
    }
    #tabBox {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

// 小于800px
@media only screen and (max-width: 800px) {
  ._forecastContainer {
    :deep(.el-dialog) {
      .el-dialog__header {
        padding-top: 16px !important;
      }

      .el-dialog__body {
        // text-align: left !important;
        padding-top: 0;
        margin: auto 5px;

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

        .docx-wrapper {
          padding: 0;

          .docx {
            width: 100% !important;
            margin: 0;

            article {
              text-align: left !important;
              padding: 5px !important;
              margin: 10px !important;

              .docx_table {
                width: 100% !important;
              }
            }
          }
        }
      }
    }
    #tabBox {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
