<template>
    <div class="scatterBox" style="width: 480px; height: 300px;">
        <div id="scatterChart" class="chartContainer"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts';


export default {
    props: {
        tableData: Array,
    },
    data() {
        return {
            scatterData: []
        };
    },
    mounted() {
        this.processData();
        this.renderChart();
    },
    watch: {
        tableData: {
            handler(newTableData) {
                this.scatterData = []; // 清空之前的散点图数据
                this.processData(); // 重新处理数据
                this.renderChart(); // 重新渲染散点图
            },
            immediate: true, // 立即执行watch处理函数
        },
    },
    methods: {
        processData() {
            if (this.tableData && this.tableData.length > 0) {

                // 遍历 jsonData 数组
                for (let i = 0; i < this.tableData.length; i++) {
                    const item = this.tableData[i];
                    const power = item.POWER;
                    const yd15 = item.YD15;

                    // 检查 POWER 和 YD15 是否存在
                    if (power !== undefined && yd15 !== undefined) {
                        // 将 POWER 和 YD15 的值存储为散点图数据的格式
                        this.scatterData.push([power, yd15]);
                    }
                }
            }
        },

        renderChart() {
            this.$nextTick(() => {
                if (!this.chartInstance) {
                    this.chartInstance = echarts.init(document.getElementById('scatterChart'));
                }
                const option = {
                    xAxis: {
                        scale: true
                    },
                    yAxis: {
                        scale: true
                    },
                    series: [
                        {
                            type: 'effectScatter',
                            symbolSize: 20,
                            data: [
                                [172.7, 105.2],
                                [153.4, 42]
                            ]
                        },
                        {
                            type: 'scatter',
                            data: this.scatterData
                        }
                    ]
                };
                option && this.chartInstance.setOption(option);
            });
        },
    }
};
</script>
  
<style>
.chartContainer {
    width: 100%;
    height: 100%;
}
</style>
  