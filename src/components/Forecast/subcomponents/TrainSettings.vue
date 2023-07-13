<template>
    <div>
        <div class="input-container">
            <el-form ref="form" :model="form" label-width="80px">

            </el-form>
            <el-form ref="form" :model="form" label-width="80px">
                <!-- 进度条 -->
                <div class="train-form-row">
                    <el-progress type="line" :percentage="calculateProgress" style="width: 800px"></el-progress>
                </div>

                <div class="train-form-row">
                    <el-tag>具体模型选择</el-tag>
                    <el-select v-model="form.selectedModels" placeholder="请选择" :multiple="false" collapse-tags>
                        <el-option v-for="model in modelOptions" :key="model.value" :label="model.label"
                            :value="model.value"></el-option>
                    </el-select>
                </div>

                <div class="train-form-row">
                    <el-tag>训练样本数量</el-tag>
                    <el-input v-model="form.batchSize" placeholder="请输入训练样本数量(1~2048)" clearable></el-input>
                </div>

                <div class="train-form-row">
                    <el-tag>学习率</el-tag>
                    <el-input v-model="form.learningRate" placeholder="请输入学习率(0~1)" clearable></el-input>
                </div>

                <div class="train-form-row">
                    <el-tag>输入长度</el-tag>
                    <el-input v-model="form.inputLen" placeholder="请输入输入长度(96~2048)" clearable></el-input>
                </div>

                <div class="train-form-row">
                    <el-tag>预测长度</el-tag>
                    <el-input v-model="form.predLen" placeholder="请输入预测长度(96~2048)" clearable></el-input>
                </div>

                <div>
                    <el-button type="primary" @click="setParams">开始训练</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>
    
<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            form: {
                type: "train",
                selectedModels: [],
                batchSize: "",
                learningRate: "",
                inputLen: "",
                predLen: ""
            },
            modelOptions: [
                { label: "GRU", value: "model1" },
                { label: "MLP", value: "model2" },
                { label: "LSTNet", value: "model3" },
                { label: "Transformer", value: "model4" },
                { label: "Crossformer", value: "model5" },
                { label: "LightGBM", value: "model6" },
                { label: "XgBoost", value: "model7" },
            ],

            progress: 0,
        };
    },

    computed: {
        ...mapState('global', ['uploadedFileName']),

        calculateProgress() {
            let filledFields = 0;
            const totalFields = 5; // 总字段数

            // 根据表单字段的填写情况计算已填写字段数
            if (this.form.selectedModels.length > 0) filledFields++;
            if (this.form.batchSize !== "") filledFields++;
            if (this.form.learningRate !== "") filledFields++;
            if (this.form.inputLen !== "") filledFields++;
            if (this.form.predLen !== "") filledFields++;

            // 计算进度百分比
            var percentage = (filledFields / totalFields) * 100;
            return Math.round(percentage);
        },
    },
    methods: {
        handleSelectChange() {
            // 更新进度条
            this.progress = this.calculateProgress;
        },

        validateInput() {
            if (
                !/^\d+$/.test(this.form.batchSize) || !/^\d+$/.test(this.form.inputLen) ||
                !/^\d+$/.test(this.form.predLen) || parseFloat(this.form.learningRate) >= 1 ||
                parseFloat(this.form.learningRate) <= 0 || parseInt(this.form.batchSize) <= 1 ||
                parseInt(this.form.inputLen) <= 1 || parseInt(this.form.predLen) <= 1 ||
                parseInt(this.form.batchSize) >= 2048 || parseInt(this.form.inputLen) >= 2048 ||
                parseInt(this.form.predLen) >= 2048
            ) {
                this.$message({
                    message: "请输入有效的表单数据",
                    type: "warning",
                });
                return false;
            }
            return true;
        },

        setParams() {
            if (
                this.form.batchSize === "" ||
                this.form.selectedModels.length === 0 ||
                this.form.inputLen === "" ||
                this.form.learningRate === "" ||
                this.form.predLen === ""
            ) {
                this.$message({
                    message: "请完整填写表单",
                    type: "warning",
                });
            } else if (this.validateInput()) {
                // console.log(this.form);
                const fileName = this.$store.state.global.uploadedFileName;
                console.log(fileName);

                // 调用后端预测接口，传入表单数据
                this.request.post("/file/forecast", fileName).then((res) => {
                    if (res.code === "200") {
                        this.$message.success("操作成功");
                    }
                });
            }
        },
    },
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