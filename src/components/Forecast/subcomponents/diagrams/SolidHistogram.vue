<template>
    <div id="solidHistogram" class="chartContainer" style="width: 100%;height: 100%;"></div>
</template>

<script>
import * as echarts from 'echarts';
import 'echarts-gl'
import { mapState } from 'vuex';

export default {

    data() {
        return {
            tableData: [],
            scatterData: [],
            varMax: [],
            varMin: [],
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
            // if (this.tableData && this.tableData.length > 0) {
            this.tableData = this.$store.state.global.predictedJsonData;

            const prepower = this.tableData.map(item => parseFloat(item.PREPOWER));
            const power = this.tableData.map(item => parseFloat(item.APOWER));
            const trueYD15 = this.tableData.map(item => parseFloat(item.trueYD15));
            const predictYD15 = this.tableData.map(item => parseFloat(item.predictYD15));

            const variables = [prepower, power, trueYD15, predictYD15];

            // 取出最大小值
            const variableMin = variables.map(variable => Math.min(...variable));
            const variableMax = variables.map(variable => Math.max(...variable));
            this.varMax = variableMax;
            this.varMin = variableMin;

            // 归一化数据
            const normalizedVariables = variables.map((variable, index) => {
                const min = variableMin[index];
                const max = variableMax[index];
                return variable.map(value => (value - min) / (max - min));
            });

            for (let hour = 1; hour <= 24; hour++) {
                let monthData = this.tableData.filter(item => {
                    const date = new Date(item.DATATIME);
                    return date.getHours() + 1 === hour;
                });
                if (monthData.length === 0) {
                    continue;
                }

                const means = normalizedVariables.map((variable, index) => {
                    const monthVariableData = monthData.map(item => variable[this.tableData.indexOf(item)]);
                    const mean = monthVariableData.reduce((sum, value) => sum + value, 0) / monthVariableData.length;
                    return mean;
                });

                means.forEach((mean, index) => {
                    const row = index % 4;
                    const col = hour - 1;
                    this.scatterData.push([row, col, mean]);
                });
            }
            // }
        },

        renderChart() {
            if (this.tableData && this.tableData.length > 0) {
                this.$nextTick(() => {
                    if (!this.chartInstance) {
                        this.chartInstance = echarts.init(document.getElementById('solidHistogram'));
                        window.addEventListener("resize", () => {
                            this.chartInstance.resize()
                        })
                    }
                    var chartDom = document.getElementById('solidHistogram');
                    var myChart = echarts.init(chartDom);
                    var option;

                    var hours = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
                        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
                        '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];


                    var variables = ['PREPOWER','ROUND(A.POWER, 0)','trueYD15', 'predictYD15'];

                    var data = this.scatterData;

                    option = {
                        tooltip: {
                            formatter: function (params) {
                                var hour = params.value[0];
                                var variable = params.value[1];
                                var value = params.value[2];

                                var min = this.varMin[variable];
                                var max = this.varMax[variable];
                                var realValue = value * (max - min) + min;

                                return '时间: ' + hours[hour] + '<br>' +
                                    '变量: ' + variables[variable] + '<br>' +
                                    '均值: ' + realValue.toFixed(2);
                            }.bind(this)
                        },
                        visualMap: {
                            max: 1,
                            inRange: {
                                color: [
                                    '#313695',
                                    '#4575b4',
                                    '#74add1',
                                    '#abd9e9',
                                    '#e0f3f8',
                                    '#ffffbf',
                                    '#fee090',
                                    '#fdae61',
                                    '#f46d43',
                                    '#d73027',
                                    '#a50026'
                                ]
                            },
                            bottom: '5%'
                        },
                        xAxis3D: {
                            type: 'category',
                            data: hours
                        },
                        yAxis3D: {
                            type: 'category',
                            data: variables,
                            axisLabel: {
                                interval: 0
                            }
                        },
                        zAxis3D: {
                            type: 'value'
                        },
                        grid3D: {
                            boxWidth: 200,
                            boxDepth: 80,
                            light: {
                                main: {
                                    intensity: 1.2
                                },
                                ambient: {
                                    intensity: 0.3
                                }
                            }
                        },
                        series: [
                            {
                                type: 'bar3D',
                                data: data.map(function (item) {
                                    return {
                                        value: [item[1], item[0], item[2]]
                                    };
                                }),
                                shading: 'color',
                                label: {
                                    show: false,
                                    fontSize: 16,
                                    borderWidth: 1
                                },
                                itemStyle: {
                                    opacity: 1.0
                                },
                                emphasis: {
                                    label: {
                                        fontSize: 20,
                                        color: '#900'
                                    },
                                    itemStyle: {
                                        color: '#900'
                                    }
                                }
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
  