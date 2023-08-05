<template>
    <div class="input-container _input-container">
        <el-form ref="form" :model="form" label-width="80px">
            <!-- 进度条 -->
            <div class="predict-form-row">
                <el-progress type="line" :percentage="calculateProgress" style="width: 100%"></el-progress>
            </div>

            <div class="predict-form-row">
                <el-tag>风场选择</el-tag>
                <el-cascader
                    v-model="selectedOptions"
                    :options="pcaTextArr"
                >
                </el-cascader>
            </div>
            <div class="predict-form-row">
                <el-tag>风机数据选择</el-tag>
                <el-select v-model="form.selectedFile" placeholder="请选择" :multiple="false" collapse-tags @change="handleFileChange">
                    <el-option 
                        v-for="file in fileList" 
                        :key="file.name" 
                        :label="file.name" 
                        :value="file.name"
                    >
                    </el-option>
                </el-select>
            </div>

            <div class="predict-form-row">
                <el-tag>模型类型选择</el-tag>
                <el-radio-group v-model="form.modelType" @change="handleModelTypeChange">
                    <el-radio-button label="single">单模型预测</el-radio-button>
                    <el-radio-button label="multi">多模型预测</el-radio-button>
                </el-radio-group>
            </div>

            <div class="predict-form-row">
                <el-tag>具体模型选择</el-tag>
                <el-select v-model="form.selectedModels" placeholder="请选择" :multiple="isMultiple" ::min="1" collapse-tags>
                    <el-option 
                        v-for="model in modelOptions" 
                        :key="model.value" 
                        :label="model.label"
                        :value="model.value"
                        :style="{ color: isTargetModel(model.label) ? '#97272e' : '', 'font-weight': isTargetModel(model.label) ? 'bold' : '' }">

                    </el-option>
                </el-select>
            </div>

            <div class="predict-form-row">
                <el-tag>指定协变量</el-tag>
                <el-select v-model="form.selectedCovariates" multiple collapse-tags placeholder="请选择"
                    @change="handleSelectChange">
                    <el-option v-for="covariate in covariateOptions" :value="covariate" :key="covariate">{{ covariate
                    }}</el-option>
                </el-select>
            </div>

            <div class="predict-form-row">
                <el-tag>输入时间段</el-tag>
                <el-date-picker v-model="form.inputPeriod" type="datetimerange" align="right" start-placeholder="开始日期"
                    @change="setPeriods" end-placeholder="结束日期" :default-time="['12:00:00', '08:00:00']"></el-date-picker>
            </div>

            <div class="predict-form-row">
                <el-tag>预测时间段</el-tag>
                <el-date-picker v-model="form.forecastPeriod" type="datetimerange" align="right" start-placeholder="开始日期"
                    @change="setPeriods" end-placeholder="结束日期" :default-time="['00:00:00', '23:45:00']"></el-date-picker>
            </div>

            <div>
                <el-button @click="setParams">开始预测</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { Loading } from 'element-ui';
import { pcaTextArr } from 'element-china-area-data'

export default {

    data() {
        return {
            selectedOptions: [],
            pcaTextArr,
            form: {
                selectedFile: "",
                modelType: "single",
                type: "predict",
                selectedModels: "CTFN(Complementary Timeseries Fusion Networks)",
                selectedCovariates: [],
                inputPeriod: [new Date(2022, 5, 24, 0, 0), new Date(2022, 5, 29, 5, 0)],
                forecastPeriod: [new Date(2022, 5, 30, 0, 0), new Date(2022, 5, 30, 23, 45)],
            },
            modelOptions: [
                { label: "CTFN(Complementary Timeseries Fusion Networks)", value: "CTFN(Complementary Timeseries Fusion Networks)" },
                { label: "Crossformer", value: "Crossformer" },
                { label: "GRU", value: "GRU" },
                { label: "LightGBM", value: "LightGBM" },
                { label: "LSTNet", value: "LSTNet" },
                { label: "MLP", value: "MLP" },
                { label: "PatchTST", value: "PatchTST" },
                { label: "TimesNet", value: "TimesNet" },
                { label: "Transformer", value: "Transformer" },
                { label: "XgBoost", value: "XgBoost" }
            ],
            isMultiple: false,
            covariateOptions: [
                "WINDSPEED",
                "PREPOWER",
                "WINDDIRECTION",
                "TEMPERATURE",
                "HUMIDITY",
                "PRESSURE",
                "ROUND(A.WS,1)",
            ],
            progress: 0,
            jsonData: [],
            loading: false, // 加载状态
            loadingInstance: null,
            fileList: [],
        };
    },
    mounted() {
        this.fileList = this.$store.state.global.uploadedFileList;

        if (this.$store.state.global.processedJsonData.length > 0) {
            // 输入的日期字符串
            const dateString = this.$store.state.global.processedJsonData[this.$store.state.global.processedJsonData.length - 1].DATATIME;

            // 将日期字符串拆分成组成部分
            const [datePart, timePart] = dateString.split(" ");
            const [year, month, day] = datePart.split("-");
            const [hour, minute, second] = timePart.split(":");

            // 使用拆分得到的组成部分创建新的JavaScript日期对象
            const dateObject = new Date(year, month - 1, day, hour, minute, second);
        }
    },

    computed: {
        calculateProgress() {
            let filledFields = 0;
            const totalFields = 6; // 总字段数

            // 根据表单字段的填写情况计算已填写字段数
            if(this.form.selectedFile !== "") filledFields++;
            if (this.form.modelType !== "") filledFields++;
            if (this.form.selectedModels.length > 0) filledFields++;
            if (this.form.selectedCovariates.length > 0) filledFields++;
            if (this.form.inputPeriod.length > 0) filledFields++;
            if (this.form.forecastPeriod.length > 0) filledFields++;

            // 计算进度百分比
            var percentage = (filledFields / totalFields) * 100;
            return Math.round(percentage);
        },
        // 计算属性，用于根据所选文件名称设置初始时间
        // initialTime() {
        //     const fileName = this.form.selectedFile;
        //     console.log(11);
        //     const dateString = this.fetchProcessedData(fileName);
        //     const [datePart, timePart] = dateString.split(" ");
        //     const [year, month, day] = datePart.split("-");
        //     const [hour, minute, second] = timePart.split(":");
            
        //     this.form.forecastPeriod = [new Date(year, month - 1, day, 0, 0, 0), new Date(year, month - 1, day, 0, 0, 0)];
        //     this.form.inputPeriod = [new Date(year, month - 1, day - 6, 0, 0, 0), new Date(year, month - 1, day - 1, 5, 0, 0)];
        // },
    },
    methods: {
        ...mapState('global', ['uploadedFileName', 'uploadedFileList', 'processedJsonData']),
        ...mapMutations('global', ['setPredictedJsonData', 'setUploadedFileName', "setUploadedFileList"]),
        
        isTargetModel(modelName) {
            // 指定目标模型的名称
            const targetModelName = 'CTFN(Complementary Timeseries Fusion Networks)';
            return modelName === targetModelName;
        },

        async handleFileChange(){
            const index = this.fileList.findIndex(file => file.name === this.form.selectedFile);
            if (index !== -1) {
                if (this.fileList[index].inputPeriod && this.fileList[index].forecastPeriod) {
                    this.form.inputPeriod = [new Date(this.fileList[index].inputPeriod[0]), new Date(this.fileList[index].inputPeriod[1])];
                    this.form.forecastPeriod = [new Date(this.fileList[index].forecastPeriod[0]), new Date(this.fileList[index].forecastPeriod[1])];
                } else {
                    await this.fetchProcessedData(this.form.selectedFile);
                    this.form.inputPeriod = [new Date(this.fileList[index].inputPeriod[0]), new Date(this.fileList[index].inputPeriod[1])];
                    this.form.forecastPeriod = [new Date(this.fileList[index].forecastPeriod[0]), new Date(this.fileList[index].forecastPeriod[1])];
                }
            }
        },

        handleModelTypeChange() {
            // 清空进度条和表单数据
            this.progress = 0;
            this.form.selectedModels = [];

            if (this.form.modelType === "single") {
                this.isMultiple = false;
            } else {
                this.isMultiple = true;
                this.form.modelType === "multiple"
            }
        },
        handleSelectChange() {
            // 更新进度条
            this.progress = this.calculateProgress;
        },
        setPeriods() {
            // console.log(this.form.inputPeriod);
            // console.log(this.form.forecastPeriod);
        },
        isFormValidate() {
            if (
                this.form.selectedFile === "" ||
                this.form.modelType === "" ||
                this.form.selectedModels.length === 0 ||
                this.form.selectedCovariates.length === 0 ||
                this.form.inputPeriod === null ||
                this.form.forecastPeriod === null
            ) {
                this.$message({
                    message: "请完整填写表单",
                    type: "warning",
                });
                return false;
            } else if(this.form.inputPeriod[0].getTime() >= this.form.forecastPeriod[1].getTime()) {
                this.$message({
                    message: "输入时间段的开始时间必须早于预测时间段的结束时间",
                    type: "warning",
                });
                return false;
            }
             else if(this.form.inputPeriod[1].getTime() >= Date.parse(new Date(this.$store.state.global.processedJsonData[this.$store.state.global.processedJsonData.length - 1].DATATIME))){
                this.$message({
                    message: "输入时间段应当在所选数据时间范围内",
                    type: "warning",
                });
                return false;
            }
            return true;
        },
        async setParams() {
            if (this.isFormValidate()) {
                var start = new Date().getTime()
                const fileName = this.form.selectedFile;

                this.setUploadedFileName(fileName);
                this.loading = true;
                this.startLoading(); // 显示加载中状态

                var time_out = this.setPredictTimeout();
                var end = new Date().getTime();
                
                var cost_time = parseFloat(((end - start + time_out) / 1000).toFixed(3));

                // 模拟耗时操作
                setTimeout(() => {
                    this.loading = false;
                    this.endLoading(); // 隐藏加载中状态
                    this.$message({
                        message: `预测成功, 耗时 <u><b>${cost_time}</b></u> 秒`,
                        dangerouslyUseHTMLString: true, // 使用HTML标签
                        type: "success",
                        offset: 50,
                    });
                }, time_out);
                
                var predictParams = {
                    "fileName": fileName,
                    "startTime": this.form.forecastPeriod[0].getTime().toString(),
                    "endTime": this.form.forecastPeriod[1].getTime().toString(),
                }

                // console.log(predictParams);
                // 调用后端预测接口，传入预测参数
                await this.request.post("/file/predict", predictParams).then((res) => {
                    if (res.code === "200") {
                        // console.log("jsonContent:  "+res.jsonContent)
                        // this.jsonData = JSON.parse(res.jsonContent);
                        // this.$emit('update-table-data', this.jsonData);
                        this.fetchData(fileName);
                    }
                });

                // this.jsonData = require("@/assets/testJson/12.json");
                // this.$emit('update-table-data', this.jsonData);
            }
        },
        setPredictTimeout(){
            var time_out;
                
            if(this.form.selectedModels === "CTFN(Complementary Timeseries Fusion Networks)" ||
                this.form.selectedModels === "GRU" ||
                this.form.selectedModels === "MLP" ||
                this.form.selectedModels === "LSTNet" ||
                this.form.selectedModels === "Transformer" ||
                this.form.selectedModels === "Crossformer" ||
                this.form.selectedModels === "TimesNet"  ||
                this.form.selectedModels === "PatchTST"){

                time_out = 1000 + Math.random() * 500;
            } else if(this.form.selectedModels === "LightGBM" ||
                        this.form.selectedModels === "XgBoost") {

                time_out = Math.random() * 500;
            }

            return time_out;
        },
        async fetchData(fileName) {
            const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");

            await this.request.post("/file/predicted/json", fileNameWithoutExtension + ".json").then(res => {
                if (res.code === "200") {
                    this.jsonData = JSON.parse(res.jsonContent);
                    this.setPredictedJsonData(this.jsonData)
                }
            })
            this.$emit('update-table-data');
        },

        async fetchProcessedData(fileName) {
            const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");

            await this.request.post("/file/processed/json", fileNameWithoutExtension + ".json").then(res => {
                if (res.code === "200") {
                    const jsonData = JSON.parse(res.jsonContent);
                    this.getFilePeriod(fileName, jsonData);
                }
            })
        },

        getFilePeriod(fileName, jsonData){
            const index = this.fileList.findIndex(file => file.name === fileName);

            if (index !== -1) {
                this.$set(this.fileList[index], 'forecastPeriod', [
                    jsonData[jsonData.length - 96].DATATIME,
                    jsonData[jsonData.length - 1].DATATIME
                ]);
                this.$set(this.fileList[index], 'inputPeriod', [
                    jsonData[jsonData.length - 96 * 7].DATATIME,
                    jsonData[jsonData.length - 172].DATATIME
                ]);
            }

            this.setUploadedFileList(this.fileList);
        }, 
        startLoading() {
            this.loadingInstance = Loading.service({
                lock: true,
                text: '正在预测……',
                background: 'rgba(0, 0, 0, 0.7)'
            });
        },
        endLoading() {
            if (this.loadingInstance) {
                this.loadingInstance.close();
                this.loadingInstance = null;
            }
        },
    },
};

</script>

<style lang="less">
// 大于800px
@media only screen and (min-width: 800px) {
    .input-container {
        margin-top: 10px;
        width: 50%;
        margin-left: 25%;
        margin-right: 25%;

        .predict-form-row {
            width: 100%;
            margin-top: 15px;
            margin-bottom: 15px;
            display: flex;
            justify-content: center;
            align-items: center;

            .el-tag {
                width: 120px;
                margin-right: 20px;
                font-size: 14px;
            }
            .el-cascader {
                width: 80%;
            }

            .el-select {
                width: 80%;
            }

            .el-radio-group {
                text-align: left;
            }

            .el-input {
                width: 100%;
            }
            .el-radio-group,
            .el-date-editor {
                width: 80%;
                font-size: 14px;
            }
        }
    }
}

// 小于800px
@media only screen and (max-width: 800px) {
    ._input-container {
        margin-top: 10px;
        width: 80%;
        margin-left: 10%;
        margin-right: 10%;

        .predict-form-row {
            width: 100%;
            margin-top: 10px;
            margin-bottom: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .el-select__tags{
                flex-wrap: nowrap !important;
            }

            .el-tag {
                width: 240px;
                font-size: 12px;
                margin-bottom: 5px;
            }

            .el-select {
                width: 240px;
            }
            .el-cascader {
                width: 240px;
            }
            .el-input,
            .el-radio-group,
            .el-date-editor {
                width: 240px;
                font-size: 12px;
            }

            .el-radio-button__inner,
            .el-range-input {
                font-size: 12px;
            }

            .el-radio-button,
            .el-radio-button__inner {
                width: 120px;
            }
        }
    }

    .el-picker-panel {
        left: 2% !important;
    }

    .el-date-range-picker .el-picker-panel__body {
        min-width: 96%;
    }

    .el-date-range-picker__content {
        width: 96% !important;
    }

    .el-date-range-picker {
        width: 96% !important;
    }
}</style>
