<template>
    <div class="solidBox" style="width: 480px; height: 300px;">
        <div id="solidHistogram" class="chartContainer"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import 'echarts-gl'

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

                for (let i = 0; i < variables.length; i++) {
                    this.scatterData[i] = [];
                    for (let j = 0; j < 12; j++) {
                        this.scatterData[i][j] = [i, j, 0]; // 初始化每个元素为[行号, 列号, 均值]
                    }
                }

                for (let month = 1; month <= 12; month++) {
                    let monthData = this.tableData.filter(item => {
                        const date = new Date(item.DATATIME);
                        return date.getMonth() + 1 === month;
                    });

                    // 检查 monthData 是否为空，如果为空则手动创建一个空的数据项
                    if (monthData.length === 0) {
                        continue;
                    }

                    // 计算每个变量的均值
                    const means = variables.map((variable, index) => {
                        const monthVariableData = monthData.map(item => variable[index]);
                        const mean = monthVariableData.reduce((sum, value) => sum + value, 0) / monthVariableData.length;
                        return mean;
                    });
                    // 填入scatterData中
                    means.forEach((mean, index) => {
                        const row = index % 9;
                        this.scatterData[row][month - 1] = [row, month - 1, mean];
                    });
                }

                this.scatterData = this.scatterData.flat();
            }
        },

        renderChart() {
            if (this.tableData && this.tableData.length > 0) {
                this.$nextTick(() => {
                    if (!this.chartInstance) {
                        this.chartInstance = echarts.init(document.getElementById('solidHistogram'));
                    }
                    var chartDom = document.getElementById('solidHistogram');
                    var myChart = echarts.init(chartDom);
                    var option;

                    // prettier-ignore
                    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


                    var variables = ['WINDSPEED', 'PREPOWER', 'WINDDIRECTION', 'TEMPERATURE', 'HUMIDITY',
                        'PRESSURE', 'ROUDN(A.WS,1)', 'ROUD(A.POWER,0)', 'YD15'];

                    var data = this.scatterData

                    option = {
                        tooltip: {},
                        visualMap: {
                            max: 50000,
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
                            }
                        },
                        xAxis3D: {
                            type: 'category',
                            data: months
                        },
                        yAxis3D: {
                            type: 'category',
                            data: variables
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
  