<template>
    <div id="linechart" class="chartContainer" style="width: 100%;height: 100%;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    props: {
        tableData: Array,
    },
    data() {
        return {
            lineData: []
        };
    },
    mounted() {
        if (this.lineData !== null) {
            this.processData();
            this.renderChart();
        }
    },
    watch: {
        tableData: {
            handler(newTableData) {
                if (newTableData !== null) {
                    this.lineData = [];
                    this.processData();
                    this.renderChart();
                }
            },
            immediate: true, // 立即执行watch处理函数
        },
    },
    methods: {
        processData() {
            if (this.tableData && this.tableData.length > 0) {

            this.lineData = this.tableData.map(item => ({
                DATATIME: item.DATATIME,
                predictYD15: item.predictYD15,
                trueYD15: item.trueYD15
            }));
            }
        },

        renderChart() {
            this.$nextTick(() => {
                if (!this.chartInstance) {
                    this.chartInstance = echarts.init(document.getElementById('linechart'));
                    window.addEventListener("resize", () => {
                        this.chartInstance.resize()
                    })
                }

                if (this.lineData && this.lineData.length > 0) {
                    const xAxisData = this.lineData.map(item => item.DATATIME);
                    const yAxisData1 = this.lineData.map(item => item.trueYD15);
                    const yAxisData2 = this.lineData.map(item => item.predictYD15);

                    const option = {
                        legend: {
                            left: '65%',
                            top: '0%'
                        },
                        grid: {
                            top: '10%',
                            left: '10%',
                            right: '10%',
                            bottom: '0%',
                            containLabel: true,
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: xAxisData,
                            axisLabel: {
                                margin: 30,
                                color: '#ffffff63'
                            },
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: true,
                                length: 25,
                                lineStyle: {
                                    color: "#ffffff1f"
                                }
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: '#ffffff1f'
                                }
                            }
                        },
                        yAxis: [
                            {
                                type: 'value',
                                position: 'right',
                                axisLabel: {
                                    margin: 20,
                                    color: '#ffffff63'
                                },
                                axisTick: {
                                    show: true,
                                    length: 15,
                                    lineStyle: {
                                        color: "#ffffff1f",
                                    }
                                },
                                splitLine: {
                                    show: true,
                                    lineStyle: {
                                        color: '#ffffff1f'
                                    }
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: '#fff',
                                        width: 2
                                    }
                                }
                            },
                            {
                                type: 'value',
                                position: 'left',
                                axisLabel: {
                                    margin: 20,
                                    color: '#ffffff63'
                                },
                                axisTick: {
                                    show: true,
                                    length: 15,
                                    lineStyle: {
                                        color: "#ffffff1f",
                                    }
                                },
                                splitLine: {
                                    show: true,
                                    lineStyle: {
                                        color: '#ffffff1f'
                                    }
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: '#fff',
                                        width: 2
                                    }
                                }
                            }
                        ],
                        series: [
                            {
                                name: '预测功率YD15',
                                type: 'line',
                                smooth: true,
                                showAllSymbol: true,
                                symbol: 'circle',
                                symbolSize: 6,
                                lineStyle: {
                                    normal: {
                                        color: "gray",
                                    },
                                },
                                label: {
                                    show: true,
                                    position: 'top'
                                },
                                itemStyle: {
                                    color: "red",
                                    borderColor: "#fff",
                                    borderWidth: 3
                                },
                                areaStyle: {
                                    normal: {
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                            {
                                                offset: 0,
                                                color: '#eb64fb'
                                            },
                                            {
                                                offset: 1,
                                                color: '#3fbbff0d'
                                            }
                                        ], false),
                                    }
                                },
                                data: yAxisData2,
                                yAxisIndex: 0 // Use the first y-axis
                            },
                            {
                                name: '另一个系列',
                                type: 'line',
                                smooth: true,
                                showAllSymbol: true,
                                symbol: 'circle',
                                symbolSize: 6,
                                lineStyle: {
                                    normal: {
                                        color: "blue",
                                    },
                                },
                                label: {
                                    show: true,
                                    position: 'top'
                                },
                                itemStyle: {
                                    color: "green",
                                    borderColor: "#fff",
                                    borderWidth: 3
                                },
                                areaStyle: {
                                    normal: {
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                            {
                                                offset: 0,
                                                color: '#00ff00'
                                            },
                                            {
                                                offset: 1,
                                                color: '#00ff001f'
                                            }
                                        ], false),
                                    }
                                },
                                data: yAxisData1,
                                yAxisIndex: 1
                            }
                        ]
                    };

                    this.chartInstance.setOption(option);
                }
            });
        }


    }
};
</script>

<style>
.chartContainer {
    width: 100%;
    height: 100%;
}
</style>
