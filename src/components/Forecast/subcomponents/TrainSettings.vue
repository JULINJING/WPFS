<template>
    <div class="input-container _input-container">
        <el-form ref="form" :model="form" label-width="80px">
            <!-- 进度条 -->
            <div class="train-form-row">
                <el-progress type="line" :percentage="calculateProgress" style="width: 100%"></el-progress>
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
                <el-button @click="setParams">开始训练</el-button>
            </div>
            <el-loading v-if="loading" text="加载中..." :fullscreen="true"></el-loading>
        </el-form>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { Loading } from 'element-ui';

export default {
    data() {
        return {
            form: {
                type: "train",
                selectedModels: [],
                batchSize: "32",
                learningRate: "0.001",
                inputLen: "384",
                predLen: "172",
                loading: false, // 加载状态
            },
            modelOptions: [
                { label: "CTFN(Complementary Timeseries Fusion Networks)", value: "model1" },
                { label: "GRU", value: "model2" },
                { label: "MLP", value: "model3" },
                { label: "LSTNet", value: "model4" },
                { label: "Transformer", value: "model5" },
                { label: "Crossformer", value: "model6" },
                { label: "LightGBM", value: "model7" },
                { label: "XgBoost", value: "model8" },
                { label: "PatchTST", value: "model9" },
                { label: "TimesNet", value: "model10" }
            ],
            loading: false, // 加载状态
            loadingInstance: null,
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
                    message: "请输入有效的训练参数",
                    type: "warning",
                    offset: "50"
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
                    message: "请完整填写训练参数",
                    type: "warning",
                    offset: 50
                });
            } else if (this.validateInput()) {
                // const fileName = this.$store.state.global.uploadedFileName;

                // // 调用后端预测接口，传入表单数据
                // this.request.post("/file/train", fileName).then((res) => {
                //     if (res.code === "200") {
                //         this.$message.success("操作成功");

                //     } else {
                //         this.$message.error("操作失败");
                //     }
                // });
                this.loading = true;
                this.startLoading(); // 显示加载中状态
                // 模拟耗时操作
                setTimeout(() => {
                    this.loading = false;
                    this.endLoading(); // 隐藏加载中状态
                    this.$message({
                        message: "训练成功",
                        type: "success",
                        offset: 50,
                    });
                }, 10000); // 延迟10秒后隐藏加载状态


            }
        },

        startLoading() {
            this.loadingInstance = Loading.service({
                lock: true,
                text: '正在训练……',
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

        .train-form-row {
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

            .el-select {
                width: 80%;
            }

            .el-input {
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

        .train-form-row {
            width: 100%;
            margin-top: 10px;
            margin-bottom: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .el-tag {
                width: 240px;
                font-size: 12px;
                margin-bottom: 5px;
            }

            .el-select {
                width: 240px;
            }

            .el-input {
                width: 240px;
                font-size: 12px;
            }
        }
    }
}
</style>
