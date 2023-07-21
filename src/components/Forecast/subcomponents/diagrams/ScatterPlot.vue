<template>
    <div id="scatterChart" class="chartContainer" style="width: 100%;height: 100%;"></div>
</template>

<script>
import * as echarts from 'echarts';
import { mapState } from 'vuex';


export default {
    data() {
        return {
            scatterData: [],
            tableData: []
        };
    },
    mounted() {
        this.processData();
        this.renderChart();
    },
    computed: {
        ...mapState('global', ['predictedJsonData']),
    },
    // watch: {
    //     predictedJsonData: {
    //         handler(newData) {
    //             this.processData();
    //             this.renderChart();
    //         },
    //         deep: true 
    //     }
    // },
    methods: {
        processData() {
            // if (this.tableData && this.tableData.length > 0) {
                this.tableData = this.$store.state.global.predictedJsonData;

                // 遍历 jsonData 数组
                for (let i = 0; i < this.tableData.length; i++) {
                    const item = this.tableData[i];
                    const predictYD15 = item.predictYD15;
                    const trueYD15 = item.trueYD15;

                    // 检查 predictYD15 和 trueYD15 是否存在
                    if (predictYD15 !== undefined && trueYD15 !== undefined) {
                        // 将 predictYD15 和 trueYD15 的值存储为散点图数据的格式
                        this.scatterData.push([predictYD15, trueYD15]);
                    }
                }
            // }
        },

        renderChart() {
            if (this.tableData && this.tableData.length > 0) {
                this.$nextTick(() => {
                    if (!this.chartInstance) {
                        this.chartInstance = echarts.init(document.getElementById('scatterChart'));
                        window.addEventListener("resize", ()=> {
                            this.chartInstance.resize()
                        })
                    }
                    const option = {
                        xAxis: {
                            scale: true
                        },
                        yAxis: {
                            scale: true,
                        },
                        grid: {
                            top: '10%',
                            bottom: '10%'
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
            }
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
  