<template>
    <div>
        <div>
            <el-tag>指定时间列</el-tag>
            <el-input v-model="timeCol" placeholder="DATATIME"></el-input>
        </div>

        <div>
            <el-tag>指定协变量</el-tag>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="covariate in covariates" :label="covariate" :key="covariate">{{ covariate
                }}</el-checkbox>
            </el-checkbox-group>
        </div>

        <div>
            <el-tag>输入时间段</el-tag>
            <div class="block">
                <el-date-picker v-model="forecastPeriod" type="datetimerange" align="right" start-placeholder="开始日期"
                    end-placeholder="结束日期" :default-time="['12:00:00', '08:00:00']">
                </el-date-picker>
            </div>
        </div>

        <div>
            <el-tag>预测时间段</el-tag>
            <div class="block">
                <el-date-picker v-model="forecastPeriod" type="datetimerange" align="right" start-placeholder="开始日期"
                    end-placeholder="结束日期" :default-time="['00:00:00', '23:45:00']">
                </el-date-picker>
            </div>
        </div>

    </div>
</template>
<script>

const covariateOptions = ['WINDSPEED', 'PREPOWER', 'WINDDIRECTION', 'TEMPERATURE',
    'HUMIDITY', 'PRESSURE', 'ROUND(A.WS,1)'];
1
export default {
    data() {
        return {
            timeCol: '',
            checkAll: false,
            checkedCovariates: [],
            covariates: covariateOptions,
            isIndeterminate: true,
            inputPeriod: [new Date(2021, 10, 10, 10, 10), new Date(2021, 10, 11, 10, 10)],
            forecastPeriod: [new Date(2022, 10, 10, 10, 10), new Date(2021, 10, 11, 10, 10)],
        };
    },
    methods: {
        handleCheckAllChange(val) {
            this.checkedCovariates = val ? covariateOptions : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.covariates.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.covariates.length;
        }
    }
};
</script>