<template>
    <div>
        <div class="form-container">
            <el-table :data="tableData" stripe style="width: 100%" max-height="300" ref="rw_table"
                @mouseenter.native="mouseEnter" @mouseleave.native="mouseLeave">

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
            rolltimer: '',
            // 测试数据
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
            }, {
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
            }, {
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
            }, {
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
        },
        autoRoll(stop) {
            const table = this.$refs.rw_table
            const divData = table.$refs.bodyWrapper

            if (stop) {
                //再通过事件监听，监听到 组件销毁 后，再执行关闭计时器。
                window.clearInterval(this.rolltimer)
            } else {
                this.rolltimer = window.setInterval(() => {
                    // 元素自增距离顶部50像素
                    divData.scrollTop += 2
                    // 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
                    if (
                        divData.clientHeight + divData.scrollTop ==
                        divData.scrollHeight
                    ) {
                        // 重置table距离顶部距离
                        divData.scrollTop = 0
                        // 重置table距离顶部距离。值=(滚动到底部时，距离顶部的大小) - 整个高度/2
                        // divData.scrollTop = divData.scrollTop - divData.scrollHeight / 2
                    }
                }, 50)
            }
        },
        // 鼠标进入
        mouseEnter() {
            // 鼠标进入停止滚动和切换的定时任务
            this.autoRoll(true)
        },
        // 鼠标离开
        mouseLeave() {
            // 开启
            this.autoRoll()
        },
    }
}
</script>

<style>
.form-container {
    margin-top: 10px;
    width: 60%;
    margin-left: 20%;
    margin-right: 20%;
}
.el-tag{
    width: 140px;
}
</style>