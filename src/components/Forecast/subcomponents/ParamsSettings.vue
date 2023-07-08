<template>
    <div>
        <div class="input-container">
            <el-form ref="form" :model="form" label-width="80px">
                <!-- 进度条 -->
                <div class="form-row">
                    <el-progress type="line" :percentage="calculateProgress" style="width: 800px;"></el-progress>
                </div>

                <div class="form-row">
                    <el-tag>模型类型选择</el-tag>
                    <el-radio-group v-model="form.modelType" @change="handleModelTypeChange">
                        <el-radio-button label="single">单模型预测</el-radio-button>
                        <el-radio-button label="multi">多模型预测</el-radio-button>
                    </el-radio-group>
                </div>

                <div class="form-row">
                    <el-tag>具体模型选择</el-tag>
                    <el-select v-model="form.selectedModels" placeholder="请选择" :multiple="isMultiple" ::min="minModelNum" collapse-tags>
                        <el-option v-for="model in modelOptions" :key="model.value" :label="model.label"
                            :value="model.value"></el-option>
                    </el-select>
                </div>

                <div class="form-row">
                    <el-tag>指定协变量</el-tag>
                    <el-select v-model="form.selectedCovariates" multiple collapse-tags placeholder="请选择"
                        @change="handleSelectChange">
                        <el-option v-for="covariate in covariateOptions" :value="covariate" :key="covariate">{{ covariate
                        }}</el-option>
                    </el-select>
                </div>

                <div class="form-row">
                    <el-tag>输入时间段</el-tag>
                    <div class="block">
                        <el-date-picker v-model="form.inputPeriod" type="datetimerange" align="right"
                            start-placeholder="开始日期" @change="setPeriods" end-placeholder="结束日期"
                            :default-time="['12:00:00', '08:00:00']"></el-date-picker>
                    </div>
                </div>

                <div class="form-row">
                    <el-tag>预测时间段</el-tag>
                    <div class="block">
                        <el-date-picker v-model="form.forecastPeriod" type="datetimerange" align="right"
                            start-placeholder="开始日期" @change="setPeriods" end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:45:00']"></el-date-picker>
                    </div>
                </div>

                <div>
                    <el-button type="primary" @click="setParams">确认</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            form: {
                modelType: 'single',
                selectedModels: [],
                selectedCovariates: [],
                inputPeriod: [],
                forecastPeriod: []
            },
            modelOptions: [
                { label: 'GRU', value: 'model1' },
                { label: 'MLP', value: 'model2' },
                { label: 'LSTNet', value: 'model3' },
                { label: 'Transformer', value: 'model4' },
                { label: 'Crossformer', value: 'model5' },
                { label: 'LightGBM', value: 'model6' },
                { label: 'XgBoost', value: 'model7' },
            ],
            isMultiple: false,
            covariateOptions: ['WINDSPEED', 'PREPOWER', 'WINDDIRECTION', 'TEMPERATURE',
                'HUMIDITY', 'PRESSURE', 'ROUND(A.WS,1)'],
            progress: 0
        };
    },
    computed: {
        calculateProgress() {
            let filledFields = 0;
            const totalFields = 5; // 总字段数

            // 根据表单字段的填写情况计算已填写字段数
            if (this.form.modelType !== '') filledFields++;
            if (this.form.selectedModels.length > 0) filledFields++;
            if (this.form.selectedCovariates.length > 0) filledFields++;
            if (this.form.inputPeriod.length > 0) filledFields++;
            if (this.form.forecastPeriod.length > 0) filledFields++;

            // 计算进度百分比   
            var percentage = (filledFields / totalFields) * 100;
            return Math.round(percentage);
        }
    },
    methods: {
        handleModelTypeChange() {
            // 清空进度条和表单数据
            this.progress = 0;
            this.form.selectedModels = [];

            if (this.form.modelType === 'single') {
                this.isMultiple = false;
            } else {
                this.isMultiple = true;
            }
        },
        handleSelectChange() {
            // 更新进度条
            this.progress = this.calculateProgress;
        },
        setPeriods() {
            console.log(this.form.inputPeriod);
        },
        setParams() {
            if (this.form.modelType === "" || this.form.selectedModels.length === 0 || this.form.selectedCovariates.length === 0 || this.form.inputPeriod === null || this.form.forecastPeriod === null) {
                this.$message({
                    message: '请完整填写表单',
                    type: 'warning'
                });
            } else {
                console.log(this.form);
                // TODO
            }
        }
    }
};
</script>

<style>
.input-container {
    margin-top: 10px;
    width: 40%;
    margin-left: 30%;
    margin-right: 30%;
}

</style>