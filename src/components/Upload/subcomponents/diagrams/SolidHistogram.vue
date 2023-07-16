<template>
    <div id="solidHistogram" class="chartContainer" style="width: 100%;height: 100%;"></div>
</template>

<script>
import * as echarts from 'echarts';
import 'echarts-gl'
import { mapState } from 'vuex';

export default {
    // props: {
    //     tableData: Array,
    // },
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
    // watch: {
    //     tableData: {
    //         handler(newTableData) {
    //             this.scatterData = []; // 清空之前的散点图数据
    //             this.processData(); // 重新处理数据
    //             this.renderChart(); // 重新渲染散点图
    //         },
    //         immediate: true, // 立即执行watch处理函数
    //     },
    // },
    computed: {
        ...mapState('global', ['obtainedJsonData']),
    },
    methods: {
        processData() {
            // if (this.tableData && this.tableData.length > 0) {
                // console.log(this.$store.state.global.obtainedJsonData);
                this.tableData = this.$store.state.global.obtainedJsonData;
                const windspeed = this.tableData.map(item => parseFloat(item.WINDSPEED));
                const prepower = this.tableData.map(item => parseFloat(item.PREPOWER));
                const winddirection = this.tableData.map(item => parseFloat(item.WINDDIRECTION));
                const temperature = this.tableData.map(item => parseFloat(item.TEMPERATURE));
                const humidity = this.tableData.map(item => parseFloat(item.HUMIDITY));
                const pressure = this.tableData.map(item => parseFloat(item.PRESSURE));
                const ws = this.tableData.map(item => parseFloat(item.AWS));
                const power = this.tableData.map(item => parseFloat(item.APOWER));
                const yd15 = this.tableData.map(item => parseFloat(item.YD15));

                const variables = [windspeed, prepower, winddirection, temperature, humidity, pressure, ws, power, yd15];

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

                for (let i = 0; i < variables.length; i++) {
                    this.scatterData[i] = [];
                    for (let j = 0; j < 12; j++) {
                        this.scatterData[i][j] = [i, j, 0];
                    }
                }

                for (let month = 1; month <= 12; month++) {
                    let monthData = this.tableData.filter(item => {
                        const date = new Date(item.DATATIME);
                        return date.getMonth() + 1 === month;
                    });

                    if (monthData.length === 0) {
                        continue;
                    }

                    const means = normalizedVariables.map((variable, index) => {
                        const monthVariableData = monthData.map(item => variable[index]);
                        const mean = monthVariableData.reduce((sum, value) => sum + value, 0) / monthVariableData.length;
                        return mean;
                    });

                    means.forEach((mean, index) => {
                        const row = index % 9;
                        this.scatterData[row][month - 1] = [row, month - 1, mean];
                    });
                }

                this.scatterData = this.scatterData.flat();
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

                    // prettier-ignore
                    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


                    var variables = ['WINDSPEED', 'PREPOWER', 'WINDDIRECTION', 'TEMPERATURE', 'HUMIDITY',
                        'PRESSURE', 'ROUDN(A.WS,1)', 'ROUD(A.POWER,0)', 'YD15'];

                    var data = this.scatterData;

                    option = {
                        tooltip: {
                            formatter: function (params) {
                                var month = params.value[0];
                                var variable = params.value[1];
                                var value = params.value[2];
                                
                                var min = this.varMin[variable];
                                var max = this.varMax[variable];
                                var realValue = value * (max - min) + min;

                                return '月份: ' + months[month] + '<br>' +
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
                            data: months
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
                                    opacity: 0.8
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
  