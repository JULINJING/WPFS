<template>
    <div class="form-container">
        <h1 style="margin-top: 20px;margin-bottom: 10px;">预测结果数据</h1>
        <el-table :data="curData" stripe highlight-current-row style="width: 98%;margin-bottom: 20px" size="mini" max-height="300" ref="rw_table"
            @mouseenter.native="mouseEnter" @mouseleave.native="mouseLeave" :cell-style="rowStyle">

            <el-table-column fixed prop="DATATIME" label="DATATIME" width="150" align="center">
            </el-table-column>
            <el-table-column prop="WINDSPEED" label="WINDSPEED" width="150" align="center">
            </el-table-column>
            <el-table-column prop="PREPOWER" label="PREPOWER" width="150" align="center">
            </el-table-column>
            <el-table-column prop="WINDDIRECTION" label="WINDDIRECTION" width="150" align="center">
            </el-table-column>
            <el-table-column prop="TEMPERATURE" label="TEMPERATURE" width="150" align="center">
            </el-table-column>
            <el-table-column prop="HUMIDITY" label="HUMIDITY" width="150" align="center">
            </el-table-column>
            <el-table-column prop="PRESSURE" label="PRESSURE" width="150" align="center">
            </el-table-column>
            <el-table-column prop="AWS" label="ROUND(A.WS,1)" width="150" align="center">
            </el-table-column>
            <el-table-column prop="APOWER" label="ROUND(A.POWER,0)" width="150" align="center">
            </el-table-column>
            <el-table-column prop="trueYD15" label="True YD15" width="150" align="center">
            </el-table-column>
            <el-table-column prop="predictYD15" label="Predictive YD15" width="150" align="center">
            </el-table-column>
        </el-table>
    </div>
</template>
  
<script>
import rawData from '../../../assets/testJson/12.json'
import { mapState } from 'vuex';

export default {
    data() {
        return {
            rolltimer: '',
            // 测试数据
            curData: [],
        }
    },
    computed: {
        ...mapState('global', ['predictedJsonData']), // 将predictedJsonData和curData从全局模块映射到组件的计算属性中
    },
    watch: {
        predictedJsonData(newData) {
            this.curData = newData;
        },
    },
    mounted(){
        this.curData = JSON.parse(JSON.stringify(rawData));
    },
    methods: {
        rowStyle() {
            return "text-align:center";
        },
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

<style lang="less">
// 大于800px
@media only screen and (min-width: 800px) {
    .form-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        h1 {
            font-size: 18px;
            font-weight: 800;
            letter-spacing: 5px;
        }
    }
}

// 小于800px
@media only screen and (max-width: 800px) {
    .form-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        h1 {
            font-size: 18px;
            font-weight: 800;
            letter-spacing: 5px;
        }
    }
}
</style>