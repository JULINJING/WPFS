<template>
    <div>
        <div class="form-container">
            <el-table :data="tableData" stripe style="width: 100%" max-height="300">
                <el-table-column fixed prop="datatime" label="DATATIME" width="150">
                </el-table-column>
                <el-table-column prop="windspeed" label="WINDSPEED" width="150">
                </el-table-column>
                <el-table-column prop="prepower" label="PREPOWER" width="150">
                </el-table-column>
                <el-table-column prop="winddirection" label="WINDDIRECTION" width="150">
                </el-table-column>
                <el-table-column prop="temperature" label="TEMPERATURE" width="150">
                </el-table-column>
                <el-table-column prop="humidity" label="HUMIDITY" width="150">
                </el-table-column>
                <el-table-column prop="pressure" label="PRESSURE" width="150">
                </el-table-column>
                <el-table-column prop="trueYD15" label="True YD15" width="150">
                </el-table-column>
                <el-table-column prop="predictiveYD15" label="Predictive YD15" width="150">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            tableData: [{
                datatime: '2021/11/1  0:00:00',
                windspeed: 6,
                prepower: 44224,
                winddirection: 270,
                temperature: 3.9,
                humidity: 45,
                pressure: 842,
                trueYD15: 13819,
                predictiveYD15: 12914
            }, {
                datatime: '2021/11/1  0:15:00',
                windspeed: 5.8,
                prepower: 43591,
                winddirection: 274,
                temperature: 3.6,
                humidity: 46,
                pressure: 842,
                trueYD15: 25930,
                predictiveYD15: 25017
            }]
        }
    },
    methods: {
        deleteRow(index, rows) {
            rows.splice(index, 1);
        }
    }
}
</script>

<style>
.form-container{
    margin-top: 10px;
    width: 60%;
    margin-left: 20%;
    margin-right: 20%;
}
</style>