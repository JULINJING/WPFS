<template>
    <div id="heatmapChart" class="chartContainer" style="width: 100%;height: 100%;"></div>
</template>
  
<script>
import * as echarts from 'echarts';
import { mapState } from 'vuex';


export default {
    // props: {
    //     tableData: Array,
    // },
    data() {
        return {
            heatmapData: [],
            tableData: []
        };
    },
    // watch: {
    //     tableData: {
    //         handler(newTableData) {
    //             if (newTableData !== null) {
    //                 this.heatmapData = []; // 清空之前的数据
    //                 this.processData();
    //                 this.renderChart(); // 重新渲染
    //             }
    //         },
    //         immediate: true, // 立即执行watch处理函数
    //     },
    // },
    computed: {
        ...mapState('global', ['obtainedJsonData']),
    },
    mounted() {
        this.processData();
        this.renderChart();
    },
    methods: {
        processData() {
            // if (this.tableData && this.tableData.length > 0) {
                this.tableData = this.$store.state.global.obtainedJsonData;
                this.heatmapData = this.tableData;
            // }
        },
        calculateCorrelation(data) {
            // 提取需要计算相关性的数值序列
            const windspeed = data.map(item => parseFloat(item.WINDSPEED));
            const prepower = data.map(item => parseFloat(item.PREPOWER));
            const winddirection = data.map(item => parseFloat(item.WINDDIRECTION));
            const temperature = data.map(item => parseFloat(item.TEMPERATURE));
            const humidity = data.map(item => parseFloat(item.HUMIDITY));
            const pressure = data.map(item => parseFloat(item.PRESSURE));
            const ws = data.map(item => parseFloat(item.AWS));
            const power = data.map(item => parseFloat(item.APOWER));
            const yd15 = data.map(item => parseFloat(item.YD15));

            // 计算相关性矩阵
            const variables = [windspeed, prepower, winddirection, temperature, humidity, pressure, ws, power, yd15];
            const n = windspeed.length;
            const correlationMatrix = [];

            for (let i = 0; i < variables.length; i++) {
                const row = [];
                for (let j = 0; j < variables.length; j++) {
                    const xi = variables[i];
                    const xj = variables[j];
                    const sumXi = xi.reduce((sum, value) => sum + value, 0);
                    const sumXj = xj.reduce((sum, value) => sum + value, 0);
                    const sumXiXj = xi.reduce((sum, value, index) => sum + value * xj[index], 0);
                    const sumXiSquared = xi.reduce((sum, value) => sum + value * value, 0);
                    const sumXjSquared = xj.reduce((sum, value) => sum + value * value, 0);

                    const correlation = (n * sumXiXj - sumXi * sumXj) /
                        Math.sqrt((n * sumXiSquared - sumXi * sumXi) * (n * sumXjSquared - sumXj * sumXj));

                    row.push(parseFloat(correlation.toFixed(2)));
                }
                correlationMatrix.push(row);
            }

            const correlationArray = [];

            for (let i = 0; i < correlationMatrix.length; i++) {
                for (let j = 0; j < correlationMatrix[i].length; j++) {
                    correlationArray.push([i, j, correlationMatrix[i][j]]);
                }
            }
            return correlationArray;
        },
        renderChart() {
            if (this.tableData && this.tableData.length > 0) {
                this.$nextTick(() => {
                    if (!this.chartInstance) {
                        this.chartInstance = echarts.init(document.getElementById('heatmapChart'));
                        window.addEventListener("resize", ()=> {
                            this.chartInstance.resize()
                        })
                    }

                    if (this.heatmapData && this.heatmapData.length > 0) {

                        const X = ['WINDSPEED', 'PREPOWER', 'WINDDIRECTION', 'TEMPERATURE', 'HUMIDITY',
                            'PRESSURE', 'ROUDN(A.WS,1)', 'ROUD(A.POWER,0)', 'YD15'];
                        const Y = ['WINDSPEED', 'PREPOWER', 'WINDDIRECTION', 'TEMPERATURE', 'HUMIDITY',
                            'PRESSURE', 'ROUDN(A.WS,1)', 'ROUD(A.POWER,0)', 'YD15'];

                        const data = this.calculateCorrelation(this.heatmapData)
                        const option = {
                            tooltip: {
                                position: 'top'
                            },
                            grid: {
                                top: '5%',
                                left: '20%',
                                height: '80%'
                            },
                            xAxis: {
                                type: 'category',
                                data: X,
                                splitArea: {
                                    show: true
                                },
                                axisLabel: {
                                    interval: 1
                                }
                            },
                            yAxis: {
                                type: 'category',
                                data: Y,
                                splitArea: {
                                    show: true
                                }
                            },
                            visualMap: {
                                min: -1,
                                max: 1,
                                calculable: true,
                                orient: 'vertical',
                                right: '0',
                                bottom: '5%'
                            },
                            series: [{
                                name: 'Correlation Coefficient',
                                type: 'heatmap',
                                data: data,
                                label: {
                                    show: true
                                },
                                emphasis: {
                                    itemStyle: {
                                        shadowBlur: 10,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }]
                        };

                        option && this.chartInstance.setOption(option);
                    }
                });
            }
        }
    }
}
</script>
  
<style>
.chartContainer {
    width: 100%;
    height: 100%;
}
</style>
  