<template>
    <div id="radarChart" class="chartContainer" style="width: 100%;height: 100%;"></div>
</template>

<script>
import * as echarts from 'echarts';


export default {
    props: {
        tableData: Array,
    },
    data() {
        return {
            radarData: []
        };
    },
    mounted() {
        this.processData();
        this.renderChart();
    },
    watch: {
        tableData: {
            handler(newTableData) {
                this.radarData = []; // 清空之前的散点图数据
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
                    const month = new Date(item.DATATIME).getMonth();
                    const windSpeed = item.WINDSPEED;
                    const prepower = item.PREPOWER;
                    const windDirection = item.WINDDIRECTION;
                    const temperature = item.TEMPERATURE;
                    const humidity = item.HUMIDITY;
                    const pressure = item.PRESSURE;

                    // 根据月份将数据分配到对应的季节数组中
                    if (month >= 2 && month <= 4) {
                        // 春季
                        this.radarData.push([windSpeed, prepower, windDirection, temperature, humidity, pressure, '春']);
                    } else if (month >= 5 && month <= 7) {
                        // 夏季
                        this.radarData.push([windSpeed, prepower, windDirection, temperature, humidity, pressure, '夏']);
                    } else if (month >= 8 && month <= 10) {
                        // 秋季
                        this.radarData.push([windSpeed, prepower, windDirection, temperature, humidity, pressure, '秋']);
                    } else {
                        // 冬季
                        this.radarData.push([windSpeed, prepower, windDirection, temperature, humidity, pressure, '冬']);
                    }
                }
            }
        },

        renderChart() {
            if (this.tableData && this.tableData.length > 0) {
                this.$nextTick(() => {
                    if (!this.chartInstance) {
                        this.chartInstance = echarts.init(document.getElementById('radarChart'));
                        window.addEventListener("resize", ()=> {
                            this.chartInstance.resize()
                        })
                    }

                    const schema = [
                        { name: 'WINDSPEED', index: 1, text: 'WINDSPEED' },
                        { name: 'PREPOWER', index: 2, text: 'PREPOWER' },
                        { name: 'WINDDIRECTION', index: 3, text: 'WINDDIRECTION' },
                        { name: 'TEMPERATURE', index: 4, text: 'TEMPERATURE' },
                        { name: 'HUMIDITY', index: 5, text: 'HUMIDITY' },
                        { name: 'PRESSURE', index: 6, text: 'PRESSURE' },
                    ];
                    const rawData = this.radarData;
                    const CATEGORY_DIM_COUNT = 6;
                    const GAP = 3;
                    const BASE_LEFT = 0;
                    const BASE_TOP = 12;
                    // const GRID_WIDTH = 220;
                    // const GRID_HEIGHT = 220;
                    const GRID_WIDTH = (100 - BASE_LEFT - GAP) / CATEGORY_DIM_COUNT - GAP;
                    const GRID_HEIGHT = (100 - BASE_TOP - GAP) / CATEGORY_DIM_COUNT - GAP;
                    const CATEGORY_DIM = 6;
                    const SYMBOL_SIZE = 4;
                    function retrieveScatterData(data, dimX, dimY) {
                        let result = [];
                        for (let i = 0; i < data.length; i++) {
                            let item = [data[i][dimX], data[i][dimY]];
                            item[CATEGORY_DIM] = data[i][CATEGORY_DIM];
                            result.push(item);
                        }
                        return result;
                    }
                    function generateGrids() {
                        let index = 0;
                        const grid = [];
                        const xAxis = [];
                        const yAxis = [];
                        const series = [];
                        for (let i = 0; i < CATEGORY_DIM_COUNT; i++) {
                            for (let j = 0; j < CATEGORY_DIM_COUNT; j++) {
                                if (CATEGORY_DIM_COUNT - i + j >= CATEGORY_DIM_COUNT) {
                                    continue;
                                }
                                grid.push({
                                    left: BASE_LEFT + i * (GRID_WIDTH + GAP) + '%',
                                    top: BASE_TOP + j * (GRID_HEIGHT + GAP) + '%',
                                    width: GRID_WIDTH + '%',
                                    height: GRID_HEIGHT + '%'
                                });
                                xAxis.push({
                                    splitNumber: 2,
                                    position: 'top',
                                    axisLine: {
                                        show: j === 0,
                                        onZero: false
                                    },
                                    axisTick: {
                                        show: j === 0,
                                        inside: true
                                    },
                                    axisLabel: {
                                        show: j === 0,
                                        hideOverlap: true
                                    },
                                    type: 'value',
                                    gridIndex: index,
                                    scale: true
                                });
                                yAxis.push({
                                    splitNumber: 2,
                                    position: 'right',
                                    axisLine: {
                                        show: i === CATEGORY_DIM_COUNT - 1,
                                        onZero: false
                                    },
                                    axisTick: {
                                        show: i === CATEGORY_DIM_COUNT - 1,
                                        inside: true
                                    },
                                    axisLabel: {
                                        show: i === CATEGORY_DIM_COUNT - 1
                                    },
                                    type: 'value',
                                    gridIndex: index,
                                    scale: true
                                });
                                series.push({
                                    type: 'scatter',
                                    symbolSize: SYMBOL_SIZE,
                                    xAxisIndex: index,
                                    yAxisIndex: index,
                                    data: retrieveScatterData(rawData, i, j)
                                });
                                index++;
                            }
                        }
                        return {
                            grid,
                            xAxis,
                            yAxis,
                            series
                        };
                    }
                    const gridOption = generateGrids();
                    const option = {
                        animation: false,
                        brush: {
                            brushLink: 'all',
                            xAxisIndex: gridOption.xAxis.map(function (_, idx) {
                                return idx;
                            }),
                            yAxisIndex: gridOption.yAxis.map(function (_, idx) {
                                return idx;
                            }),
                            inBrush: {
                                opacity: 1
                            }
                        },
                        visualMap: {
                            type: 'piecewise',
                            categories: ['春', '夏', '秋', '冬'],
                            dimension: CATEGORY_DIM,
                            orient: 'horizontal',
                            top: 0,
                            left: 'center',
                            inRange: {
                                color: ['#51689b', '#ce5c5c', '#fbc357']
                            },
                            outOfRange: {
                                color: '#ddd'
                            },
                            seriesIndex: gridOption.series.map(function (_, idx) {
                                return idx;
                            })
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        parallelAxis: [
                            { dim: 0, name: schema[0].text },
                            { dim: 1, name: schema[1].text },
                            { dim: 2, name: schema[2].text },
                            { dim: 3, name: schema[3].text },
                            { dim: 4, name: schema[4].text },
                            { dim: 5, name: schema[5].text }
                        ],
                        parallel: {
                            bottom: '5%',
                            left: '5%',
                            height: '30%',
                            width: '55%',
                            parallelAxisDefault: {
                                type: 'value',
                                name: '指数',
                                nameLocation: 'end',
                                nameGap: 20,
                                splitNumber: 3,
                                nameTextStyle: {
                                    fontSize: 14
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: '#555'
                                    }
                                },
                                axisTick: {
                                    lineStyle: {
                                        color: '#555'
                                    }
                                },
                                splitLine: {
                                    show: false
                                },
                                axisLabel: {
                                    color: '#555'
                                }
                            }
                        },
                        xAxis: gridOption.xAxis,
                        yAxis: gridOption.yAxis,
                        grid: gridOption.grid,
                        series: [
                            {
                                name: '值',
                                type: 'parallel',
                                smooth: true,
                                lineStyle: {
                                    width: 1,
                                    opacity: 0.3
                                },
                                data: rawData
                            },
                            ...gridOption.series
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
  