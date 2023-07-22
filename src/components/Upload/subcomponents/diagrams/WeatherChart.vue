<template>
    <div id="weatherChart" class="chartContainer" style="width: 100%;height: 100%;"></div>
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
            scatterData: [],
            tableData: []
        };
    },
    mounted() {
        this.processData();
        this.renderChart();
    },
    computed: {
        ...mapState('global', ['processedJsonData']),
    },
    watch: {
        processedJsonData: {
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
            this.tableData = this.$store.state.global.processedJsonData
            this.scatterData = this.tableData;
        },

        renderChart() {
            if (this.tableData && this.tableData.length > 0) {
                this.$nextTick(() => {
                    if (!this.chartInstance) {
                        this.chartInstance = echarts.init(document.getElementById('weatherChart'));
                        window.addEventListener("resize", ()=> {
                            this.chartInstance.resize()
                        })
                    }

                    // 风向 风速图
                    const directionMap = {};
                    // 风向对象
                    const windDirection = ['W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE', 'E', 'ENE', 'NE', 'NNE', 'N', 'NNW', 'NW', 'WNW']
                    windDirection.forEach(function (name, index) {
                        directionMap[name] = Math.PI / 8 * index;
                    });
                    const data = this.scatterData.map(function (entry) {
                        // 找出与风向数值最接近的方向
                        let closestDirection = 'W'; // 默认值
                        let smallestDifference = Math.abs(Number(entry.WINDDIRECTION) - directionMap[closestDirection] / Math.PI * 180);
                        for (var direction in directionMap) {
                            let difference = Math.abs(Number(entry.WINDDIRECTION) - directionMap[direction] / Math.PI * 180);
                            if (difference < smallestDifference) {
                                smallestDifference = difference;
                                closestDirection = direction;
                            }
                        }
                        // 时间转换
                        let date = new Date(entry.DATATIME);
                        let isoFormat = date.toISOString();
                        return [isoFormat, closestDirection, Number(entry.WINDSPEED), Number(entry.AWS)];
                    });

                    // 索引
                    const dims = {
                        DATATIME: 0,
                        WINDDIRECTION: 1,
                        WINDSPEED: 2,
                        AWS: 3
                    };
                    // 箭头图标大小
                    const arrowSize = 18;
                    const renderArrow = function (param, api) {
                        const point = api.coord([
                            api.value(dims.DATATIME),
                            api.value(dims.AWS)
                        ]);
                        return {
                            type: 'path',
                            shape: {
                                pathData: 'M31 16l-15-15v9h-26v12h26v9z',
                                x: -arrowSize / 2,
                                y: -arrowSize / 2,
                                width: arrowSize,
                                height: arrowSize
                            },
                            rotation: directionMap[api.value(dims.WINDDIRECTION)],
                            position: point,
                            style: api.style({
                                stroke: '#555',
                                lineWidth: 1
                            })
                        };
                    };
                    const option = {
                        tooltip: {
                            trigger: 'axis',
                            formatter: function (params) {
                                return [
                                    echarts.format.formatTime(
                                        'yyyy-MM-dd',
                                        params[0].value[dims.DATATIME]
                                    ) +
                                    ' ' +
                                    echarts.format.formatTime('hh:mm', params[0].value[dims.DATATIME]),
                                    '风向：' + params[0].value[dims.WINDDIRECTION],
                                    '预测风速：' + params[0].value[dims.WINDSPEED],
                                    '实际风速：' + params[0].value[dims.AWS]
                                ].join('<br>');
                            }
                        },
                        grid: {
                            top: 10,
                            bottom: 80
                        },
                        xAxis: {
                            type: 'time',
                            minInterval: 3600 * 1000 * 0.4,
                            maxInterval: 3600 * 1000 * 24,
                        },
                        yAxis: [
                            {
                                name: '实际风速',
                                nameLocation: 'middle',
                                nameGap: 30,
                                nameTextStyle: {
                                    fontSize: 11
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: '#666'
                                    }
                                },
                                splitLine: {
                                    lineStyle: {
                                        olor: '#ddd'
                                    }
                                }
                            },
                            {
                                name: '预测风速',
                                nameLocation: 'middle',
                                nameGap: 30,
                                nameTextStyle: {
                                    fontSize: 11
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: 'rgb(64, 158, 255)'
                                    }
                                },
                                splitLine: { show: false }
                            },
                            {
                                axisLine: { show: false },
                                axisTick: { show: false },
                                axisLabel: { show: false },
                                splitLine: { show: false }
                            }
                        ],
                        visualMap: {
                            type: 'piecewise',
                            // show: false,
                            orient: 'horizontal',
                            left: 'center',
                            bottom: 0,
                            pieces: [
                                {
                                    gte: 6,
                                    color: '#18BF12',
                                    label: '大风'
                                },
                                {
                                    gte: 3,
                                    lt: 6,
                                    color: '#f4e9a3',
                                    label: '中风'
                                },
                                {
                                    lt: 3,
                                    color: '#D33C3E',
                                    label: '微风'
                                }
                            ],
                            seriesIndex: 1,
                            dimension: 3
                        },
                        dataZoom: [
                            {
                                type: 'inside',
                                xAxisIndex: 0,
                                minSpan: 2
                            },
                            {
                                type: 'slider',
                                xAxisIndex: 0,
                                minSpan: 2,
                                bottom: 30,
                                height: 20,
                                handleStyle: {
                                    borderWidth: 2
                                }
                            }
                        ],
                        series: [
                            {
                                type: 'line',
                                yAxisIndex: 1,
                                showSymbol: false,
                                emphasis: {
                                    scale: false
                                },
                                symbolSize: 10,
                                areaStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        global: false,
                                        colorStops: [
                                            {
                                                offset: 0,
                                                color: 'rgba(88,160,253,1)'
                                            },
                                            {
                                                offset: 0.5,
                                                color: 'rgba(88,160,253,0.7)'
                                            },
                                            {
                                                offset: 1,
                                                color: 'rgba(88,160,253,0)'
                                            }
                                        ]
                                    }
                                },
                                lineStyle: {
                                    color: 'rgba(88,160,253,1)'
                                },
                                itemStyle: {
                                    color: 'rgba(88,160,253,1)'
                                },
                                encode: {
                                    x: dims.DATATIME,
                                    y: dims.WINDSPEED
                                },
                                data: data,
                                z: 2
                            },
                            {
                                type: 'custom',
                                renderItem: renderArrow,
                                encode: {
                                    x: dims.DATATIME,
                                    y: dims.AWS
                                },
                                data: data,
                                z: 10
                            },
                            {
                                type: 'line',
                                symbol: 'none',
                                encode: {
                                    x: dims.DATATIME,
                                    y: dims.AWS
                                },
                                lineStyle: {
                                    color: '#aaa',
                                    type: 'dotted'
                                },
                                data: data,
                                z: 1
                            }
                        ]
                    };
                    this.chartInstance.setOption(option)
                    window.addEventListener("resize", ()=> {
                        this.chartInstance.resize()
                    })
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
  