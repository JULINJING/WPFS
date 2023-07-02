<template>
  <div class="totalinfocontainer _totalinfocontainer">
    <div>
      <div>
        <!-- Form -->
        <el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple
          :on-success="handleUploadSuccess" :before-remove="handleBeforeRemove">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>


      <div class="input-container">
        <el-dialog title="设置预处理预测参数" :visible.sync="dialogFormVisible" class="dialog-box">

          <div class="form-row">
            <el-tag>选择异常检测方法</el-tag>
            <el-radio-group v-model="radio1">
              <el-radio-button label="孤立森林" class="bordered-checkbox" border></el-radio-button>
              <el-radio-button label="KNN" class="bordered-checkbox" border></el-radio-button>
              <el-radio-button label="DBSCAN" class="bordered-checkbox" border></el-radio-button>
              <el-radio-button label="PCA" class="bordered-checkbox" border></el-radio-button>
            </el-radio-group>
          </div>

          <div class="form-row">
            <el-tag>缺失值处理方法</el-tag>
            <el-radio-group v-model="radio2">
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

    </div>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      // TODO
      dialogFormVisible: true,
      radio1: '',
      radio2: ''
    };
  },
  methods: {
    handleBeforeRemove(file, fileList) {
      console.log('文件上传前', file, fileList);
    },
    handleUploadSuccess(response, file, fileList) {
      console.log('文件上传成功', response, file, fileList);
      this.dialogFormVisible = true;
    },
    handleDialogConfirm() {
      if (this.radio1 !== '' && this.radio2 !== '') {
        console.log(this.radio1); // 获取选中的复选框的值
        // TODO
      } else {
        console.log('请至少选择一个预处理方法');
      }
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

.el-tag{
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
}</style>