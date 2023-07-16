<template>
    <div>
        <Echart :options="options" id="bottomRightChart" height="300%"></Echart>
    </div>
</template>

<script>
import Echart from '../echart'

export default {
    data() {
        return {
            options: {},
        }
    },
    components: {
        Echart
    },
    props: {
        cdata: {
            type: Object,
            default: () => ({})
        }
    },
    watch: {
        cdata: {
            handler(newData) {
                this.options = {
                    title: {
                        text: '',
                        textStyle: {
                            color: '#D3D6DD',
                            fontSize: 24,
                            fontWeight: 'normal'
                        },
                        top: 50,
                        left: 80
                    },
                    legend: {
                        top: 10,
                        left: 100,
                        orient: 'vertical',
                        data: ['功率损耗', '实际损耗'],
                        textStyle: {
                            color: '#90979c',
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: "shadow",
                            textStyle: {
                                color: "#fff"
                            }
                        }
                    },
                    grid: {
                        x: '10%',
                        x2: '5%',
                        y2: '10%',
                        y: '10%',
                        borderWidth: 0
                    },
                    xAxis: {
                        type: 'category',
                        position: 'bottom',
                        axisLine: {
                            lineStyle: {
                                color: "rgba(204,187,225,0.5)"
                            }
                        },
                        axisLabel: {
                            color: 'rgba(255,255,255,.8)',
                            fontSize: 12
                        },
                        axisTick: {
                            show: false
                        },
                        data: newData.xdata
                    },
                    // 下方Y轴
                    yAxis: {
                        max: 1000,
                        type: "value",
                        axisLine: {
                            show: true,
                            lineStyle: {
                                opacity: 1,
                                color: "rgba(204,187,225,0.5)",
                            }
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            color: 'rgba(255,255,255,.8)',
                            fontSize: 12
                        }
                    },
                    series: [
                        {
                            name: '功率损耗',
                            type: 'line',
                            itemStyle: {
                                color: "#6f7de3",
                            },
                            showSymbol:false,
                            data: newData.ydata[0],
                        },
                        {
                            name: "实际损耗",
                            type: "line",
                            itemStyle: {
                                color: '#c257F6'
                            },
                            showSymbol:false,
                            data: newData.ydata[1],
                        }
                    ]
                }
            },
            immediate: true,
            deep: true
        }
    }
}
</script>
