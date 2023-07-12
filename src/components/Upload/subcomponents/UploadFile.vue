<template>
  <div class="totalinfocontainer _totalinfocontainer">
    <div>
      <!-- <div v-if="!showTable"> -->
      <div>
        <!-- Form -->
        <el-upload class="upload-demo" 
          drag multiple 
          :action="'http://' + serverIp + ':7070/file/upload'"
          :on-success="handleUploadSuccess" 
          :on-error="handleUploadError" 
          :before-upload="beforeUpload" 
          :limit="10"
          :on-exceed="handleExceed" 
          :file-list="fileList" 
          :on-preview="handlePreview" 
          accept=".csv"
        >

        <i slot="default" class="el-icon-plus"/>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>

      <div class="input-container">
        <el-dialog title="设置预处理预测参数" :visible.sync="dialogFormVisible" class="dialog-box">

          <div class="form-row">
            <el-tag>选择异常检测方法</el-tag>
            <el-radio-group v-model="outlierRadio">
              <el-radio-button label="孤立森林" class="bordered-checkbox" border></el-radio-button>
              <el-radio-button label="KNN" class="bordered-checkbox" border></el-radio-button>
              <el-radio-button label="DBSCAN" class="bordered-checkbox" border></el-radio-button>
              <el-radio-button label="PCA" class="bordered-checkbox" border></el-radio-button>
            </el-radio-group>
          </div>

          <div class="form-row">
            <el-tag>缺失值处理方法</el-tag>
            <el-radio-group v-model="missingRadio">
              <el-radio-button label="简单填充" class="bordered-checkbox" border></el-radio-button>
              <el-radio-button label="线性插值" class="bordered-checkbox" border></el-radio-button>
              <el-radio-button label="Lightgbm" class="bordered-checkbox" border></el-radio-button>
              <el-radio-button label="XgBoost" class="bordered-checkbox" border></el-radio-button>
            </el-radio-group>
          </div>

          <div slot="footer" class="dialog-footer">
            <el-button class="cancelButton" @click="dialogFormVisible = false" :round="true">取 消</el-button>
            <el-button class="confirmButton" type="primary" @click="handleDialogConfirm" :round="true">确 定</el-button>
          </div>
        </el-dialog>
      </div>

      <div v-if="showTable" class="form-container">
        <el-table :data="tableData" stripe style="width: 100%" max-height="300">
          <el-table-column fixed prop="DATATIME" label="DATATIME" width="150">
          </el-table-column>
          <el-table-column prop="WINDSPEED" label="WINDSPEED" width="150">
          </el-table-column>
          <el-table-column prop="PREPOWER" label="PREPOWER" width="150">
          </el-table-column>
          <el-table-column prop="WINDDIRECTION" label="WINDDIRECTION" width="150">
          </el-table-column>
          <el-table-column prop="TEMPERATURE" label="TEMPERATURE" width="150">
          </el-table-column>
          <el-table-column prop="HUMIDITY" label="HUMIDITY" width="150">
          </el-table-column>
          <el-table-column prop="PRESSURE" label="PRESSURE" width="150">
          </el-table-column>
          <el-table-column prop="WS" label="ROUND(A.WS,1)" width="150">
          </el-table-column>
          <el-table-column prop="POWER" label="ROUND(A.POWER,0)" width="150">
          </el-table-column>
          <el-table-column prop="YD15" label="YD15" width="150">
          </el-table-column>
        </el-table>
      </div>

    </div>
  </div>
</template>
  
<script>
import { serverIp } from "../../../../public/config.js"
import axios from 'axios';
import { mapMutations } from 'vuex';

export default {
  props: {
    tableData: Array,
  },
  data() {
    return {
      serverIp: serverIp,
      dialogFormVisible: false,
      showTable: false,
      fileList: [],
      outlierRadio: '',
      missingRadio: '',
    };
  },
  methods: {
    ...mapMutations('global', ['setUploadedFileName']),

    // 上传文件成功
    handleUploadSuccess(response, file, fileList) {
      this.$message.success("上传成功")

      // 上传成功后，1.5秒后显示对话
      setTimeout(() => {
        this.dialogFormVisible = true;
      }, 1500)

      // TODO: 处理返回的数据，渲染表格
      this.fetchData(file);

      this.setUploadedFileName(file.name);

    },

    // 上传文件之前的钩子
    beforeUpload(file) {
      console.log(file.type);
      const isCSV = file.type === 'text/csv';

      if (!isCSV) {
        this.$message.error('上传的数据只能是 csv 格式!');
      }

      return isCSV;
    },


    fetchData(file) {
      const fileResponse = JSON.stringify(file.response);
      console.log(typeof fileResponse);
      const dotIndex = fileResponse.lastIndexOf('/');
      const jsonFolder = fileResponse.substring(0, dotIndex) + "/origin/json/";
      const fileName = fileResponse.substring(fileResponse.lastIndexOf("/") + 1);
      const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
      const jsonFile = jsonFolder + fileNameWithoutExtension + ".json";


      axios.get(jsonFile)
        .then(response => {
          const newTableData = response.data;
          this.$emit('update-table-data', newTableData);
        })
        .catch(error => {
          console.error(error);
        });
        const newTableData = this.jsonData;
        console.log(newTableData);

        const jsonData = require('@/assets/testJson/11.json');
        this.$emit('update-table-data', jsonData);  
    },

    // 上传文件失败
    handleUploadError(err, file, fileList) {
      this.$message.error("上传失败")
      console.log(err);
    },

    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handlePreview(file) {
      this.fetchData(file);
    },

    handleDialogConfirm() {
      if (this.outlierRadio !== '' && this.missingRadio !== '') {
        console.log(this.outlierRadio); // 获取选中的复选框的值
        this.dialogFormVisible = false;
        this.showTable = true;
        this.sendPreprocessParams();
        
      } else {
        this.$message({
          message: '请至少选择一个预处理方法',
          type: 'warning'
        });
      }
    },

    // TODO: 发送预处理参数
    sendPreprocessParams() {

    },
  },
};
</script>
  

<style>
.input-container {
  margin-top: 10px;
}

.form-row {
  display: flex;
  align-items: center;
  margin: 10px;
}

.el-tag {
  font-size: 15px;
  margin-right: 10px;
}

.checkbox-container {
  /* margin-top: 10px; */
  margin: 10px;
}

.bordered-input {
  margin: 10px;
}


.input-period {
  margin: 10px;
}

.forecast-period {
  margin: 10px;
}

.confirmButton,
.confirmButton *,
.confirmButton :after,
.confirmButton :before,
.confirmButton:after,
.confirmButton:before {
  border: 0 solid;
  box-sizing: border-box;
}

.confirmButton {
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: button;
  background-color: #000;
  background-image: none;
  color: #fff;
  cursor: pointer;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
    Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  font-size: 100%;
  font-weight: 900;
  line-height: 1.5;
  margin: 0;
  -webkit-mask-image: -webkit-radial-gradient(#000, #fff);
  padding: 0;
  text-transform: uppercase;
}

.confirmButton:disabled {
  cursor: default;
}

.confirmButton:-moz-focusring {
  outline: auto;
}

.confirmButton svg {
  display: block;
  vertical-align: middle;
}

.confirmButton [hidden] {
  display: none;
}

.confirmButton {
  border-radius: 99rem;
  border-width: 2px;
  padding: 0.8rem 3rem;
  z-index: 0;
}

.btn-18 .text-container,
.confirmButton {
  overflow: hidden;
  position: relative;
}

.btn-18 .text-container {
  display: block;
}

.btn-18 .text {
  display: block;
  mix-blend-mode: difference;
  position: relative;
}

.btn-18:hover .text {
  -webkit-animation: move-up-alternate 0.3s forwards;
  animation: move-up-alternate 0.3s forwards;
}

@-webkit-keyframes move-up-alternate {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(80%);
  }

  51% {
    transform: translateY(-80%);
  }

  to {
    transform: translateY(0);
  }
}

.confirmButton span {
  mix-blend-mode: difference;
}

.confirmButton .text-container {
  display: block;
  overflow: hidden;
  position: relative;
}

.confirmButton .text {
  display: block;
  mix-blend-mode: difference;
  position: relative;
}

.confirmButton:hover .text {
  -webkit-animation: move-up-alternate 0.3s forwards;
  animation: move-up-alternate 0.3s forwards;
}

@keyframes move-up-alternate {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(80%);
  }

  51% {
    transform: translateY(-80%);
  }

  to {
    transform: translateY(0);
  }
}

.confirmButton:after,
.confirmButton:before {
  background: linear-gradient(90deg,
      #fff 25%,
      transparent 0,
      transparent 50%,
      #fff 0,
      #fff 75%,
      transparent 0);
  content: "";
  inset: 0;
  position: absolute;
  transform: translateY(var(--progress, 100%));
  transition: transform 0.2s ease;
}

.confirmButton:after {
  --progress: -100%;
  background: linear-gradient(90deg,
      transparent 0,
      transparent 25%,
      #fff 0,
      #fff 50%,
      transparent 0,
      transparent 75%,
      #fff 0);
  z-index: -1;
}

.confirmButton:hover:after,
.confirmButton:hover:before {
  --progress: 0;
}

.cancelButton,
.cancelButton *,
.cancelButton :after,
.cancelButton :before,
.cancelButton:after,
.cancelButton:before {
  border: 0 solid;
  box-sizing: border-box;
}

.cancelButton {
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: button;
  background-color: #000;
  background-image: none;
  color: #fff;
  cursor: pointer;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
    Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  font-size: 100%;
  font-weight: 900;
  line-height: 1.5;
  margin: 0;
  -webkit-mask-image: -webkit-radial-gradient(#000, #fff);
  padding: 0;
  text-transform: uppercase;
}

.cancelButton:disabled {
  cursor: default;
}

.cancelButton:-moz-focusring {
  outline: auto;
}

.cancelButton svg {
  display: block;
  vertical-align: middle;
}

.cancelButton [hidden] {
  display: none;
}

.cancelButton {
  border-radius: 99rem;
  border-width: 2px;
  padding: 0.8rem 3rem;
  z-index: 0;
}

.btn-18 .text-container,
.cancelButton {
  overflow: hidden;
  position: relative;
}

.btn-18 .text-container {
  display: block;
}

.btn-18 .text {
  display: block;
  mix-blend-mode: difference;
  position: relative;
}

.btn-18:hover .text {
  -webkit-animation: move-up-alternate 0.3s forwards;
  animation: move-up-alternate 0.3s forwards;
}

@-webkit-keyframes move-up-alternate {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(80%);
  }

  51% {
    transform: translateY(-80%);
  }

  to {
    transform: translateY(0);
  }
}

.cancelButton span {
  mix-blend-mode: difference;
}

.cancelButton .text-container {
  display: block;
  overflow: hidden;
  position: relative;
}

.cancelButton .text {
  display: block;
  mix-blend-mode: difference;
  position: relative;
}

.cancelButton:hover .text {
  -webkit-animation: move-up-alternate 0.3s forwards;
  animation: move-up-alternate 0.3s forwards;
}

@keyframes move-up-alternate {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(80%);
  }

  51% {
    transform: translateY(-80%);
  }

  to {
    transform: translateY(0);
  }
}

.cancelButton:after,
.cancelButton:before {
  background: linear-gradient(90deg,
      #fff 25%,
      transparent 0,
      transparent 50%,
      #fff 0,
      #fff 75%,
      transparent 0);
  content: "";
  inset: 0;
  position: absolute;
  transform: translateY(var(--progress, 100%));
  transition: transform 0.2s ease;
}

.cancelButton:after {
  --progress: -100%;
  background: linear-gradient(90deg,
      transparent 0,
      transparent 25%,
      #fff 0,
      #fff 50%,
      transparent 0,
      transparent 75%,
      #fff 0);
  z-index: -1;
}

.cancelButton:hover:after,
.cancelButton:hover:before {
  --progress: 0;
}
</style>