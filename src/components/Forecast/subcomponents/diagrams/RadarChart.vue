<template>
    <div id="radarChart" class="chartContainer" style="width: 100%;height: 100%;"></div>
</template>

<script>
import * as echarts from 'echarts';
import 'echarts-gl'
import { mapState } from 'vuex';

export default {
    data() {
        return {
            tableData: [],
            varMax: [],
            varMin: [],
            varMean: [],
        };
    },
    mounted() {
        this.processData();
        this.renderChart();
    },

    computed: {
        ...mapState('global', ['predictedJsonData']),
    },
    watch: {
        predictedJsonData: {
            handler(newData) {
                this.processData();
                this.renderChart();
            },
            deep: true
        }
    },
    methods: {
        processData() {
            this.tableData = this.$store.state.global.predictedJsonData;

            if (this.tableData.length > 0) {
                const prepower = this.tableData.map(item => parseFloat(item.PREPOWER));
                const power = this.tableData.map(item => parseFloat(item.APOWER));
                const trueYD15 = this.tableData.map(item => parseFloat(item.trueYD15));
                const predictYD15 = this.tableData.map(item => parseFloat(item.predictYD15));

                const variables = [prepower, power, trueYD15, predictYD15];

                // 取出最大小值
                const variableMin = variables.map(variable => Math.min(...variable));
                const variableMax = variables.map(variable => Math.max(...variable));
                const variableMean = variables.map(variable => variable.reduce((sum, value) => sum + value, 0) / variable.length);

                this.varMax = variableMax;
                this.varMin = variableMin;
                this.varMean = variableMean;
            }
        },

        renderChart() {
            if (this.tableData && this.tableData.length > 0) {
                this.$nextTick(() => {
                    if (!this.chartInstance) {
                        this.chartInstance = echarts.init(document.getElementById('radarChart'));
                        window.addEventListener("resize", () => {
                            this.chartInstance.resize()
                        })
                    }
                    var chartDom = document.getElementById('radarChart');
                    var myChart = echarts.init(chartDom);
                    var option;

                    option = {
                        color: ['#67F9D8', '#FFE434', '#56A3F1', '#FF917C'],
                        legend: {},
                        radar: [
                            {
                                indicator: [
                                    { text: 'PREPOWER' },
                                    { text: 'ROUND(A.POWER, 0)' },
                                    { text: 'trueYD15' },
                                    { text: 'predictYD15' },
                                ],
                                center: ['50%', '50%'],
                                radius: 120,
                                startAngle: 90,
                                splitNumber: 4,
                                shape: 'circle',
                                axisName: {
                                    formatter: '【{value}】',
                                    color: '#428BD4'
                                },
                                splitArea: {
                                    areaStyle: {
                                        color: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
                                        shadowColor: 'rgba(0, 0, 0, 0.2)',
                                        shadowBlur: 10
                                    }
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: 'rgba(211, 253, 250, 0.8)'
                                    }
                                },
                                splitLine: {
                                    lineStyle: {
                                        color: 'rgba(211, 253, 250, 0.8)'
                                    }
                                }
                            },

                        ],
                        series: [
                            {
                                type: 'radar',
                                emphasis: {
                                    lineStyle: {
                                        width: 4
                                    }
                                },
                                data: [
                                    {
                                        value: this.varMax,
                                        name: '最大值',
                                        areaStyle: {
                                            color: 'rgba(255, 228, 52, 0.6)'
                                        }
                                    },
                                    {
                                        value: this.varMin,
                                        name: '最小值',
                                        areaStyle: {
                                            color: 'rgba(255, 228, 52, 0.6)'
                                        }
                                    },
                                    {
                                        value: this.varMean,
                                        name: '均值',
                                        areaStyle: {
                                            color: 'rgba(255, 228, 52, 0.6)'
                                        }
                                    }
                                ]
                            }
                        ]
                    };

                    option && myChart.setOption(option);
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
  