<template>
    <div>
        <Echart :options="options" id="centreLeft1Chart" width="300%" height="200%"></Echart>
    </div>
</template>

<script>
import Echart from '../echart'
export default {
    data() {
        return {
            options: {},
        };
    },
    components: {
        Echart,
    },
    props: {
        cdata: {
            type: Object,
            default: () => ({})
        },
    },
    watch: {
        cdata: {
            handler(newData) {
                this.options = {
                    title: {
                        show: false
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        right: '15%',
                        top: 10,
                        icon: 'circle',
                        itemWidth: 8,
                        itemHeight: 8,
                        itemGap: 37,
                        textStyle: {
                            fontSize: 12,
                            fontFamily: 'Microsoft YaHei',
                            fontWeight: 'normal',
                            color: '#82DAF7'
                        }
                    },
                    grid: {
                        x: '5%',
                        x2: '5%',
                        y2: '15%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            interval: 0,
                            textStyle: {
                                fontSize: 18,
                                fontFamily: 'Alibaba PuHuiTi',
                                fontWeight: 400,
                                color: '#82DAF7',
                                padding: [5, 0, 0, 0]
                            }
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#294462',
                                opacity: 0.3
                            }
                        },
                        data: ['1月', '2月', '3月', '4月', '5月']
                    },
                    yAxis: {
                        type: 'value',
                        minInterval: 5,
                        name: '',
                        nameTextStyle: {
                            fontSize: 18,
                            fontFamily: 'CenturyGothic',
                            color: '#ffffff',
                            padding: [0, 0, 0, 30]
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#06304C'
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                fontSize: 14,
                                fontFamily: 'CenturyGothic',
                                fontWeight: 'normal',
                                color: '#82DAF7',
                                padding: [0, 5, 0, 0]
                            }
                        }
                    },
                    dataZoom: [
                        {
                            // x轴没有具体的数值
                            type: 'inside', // 图形内部的滚动条
                            xAxisIndex: [0], // 明确指定滚动的轴
                            minValueSpan: 1, // x轴最小的index
                            maxValueSpan: 3, // x轴最大的index
                            zoomOnMouseWheel: false // 关闭鼠标滚轮缩放
                        }
                    ],
                    series: [{
                        name: '运行设备',
                        type: 'bar',
                        barWidth: 10,
                        barGap: '80%',
                        itemStyle: {
                            borderWidth: 1,
                            borderRadius: [3, 3, 0, 0],
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#A5ADFF' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#9B69EC' // 100% 处的颜色
                                }]
                            }
                        },
                        data: [87, 60, 124, 20, 432]
                    }, {
                        name: '新增设备',
                        type: 'bar',
                        barWidth: 10,
                        barGap: '80%',
                        itemStyle: {
                            borderWidth: 1,
                            borderRadius: [3, 3, 0, 0],
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#E1B031' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#FF8143' // 100% 处的颜色
                                }]
                            }
                        },
                        data: [90, 66, 174, 100, 430]
                    }]
                }
            },
            immediate: true,
            deep: true
        }
    }
};
</script>
  
<style lang="scss" scoped></style>