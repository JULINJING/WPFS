<template>
    <div>
        <Echart :options="options" id="bottomLeftChart" height="320%" width="100%"></Echart>
    </div>
</template>

<script>
import Echart from '@/components/Watch/subcomponents/echart'
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
                    tooltip: {
                        trigger: "axis",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        axisPointer: {
                            type: "shadow",
                            label: {
                                show: true,
                                backgroundColor: "#7B7DDC"
                            }
                        }
                    },
                    legend: {
                        data: ["预测功率", "实际功率", "实际风速"],
                        textStyle: {
                            color: "#B4B4B4"
                        },
                        top: "0%"
                    },
                    grid: {
                        x: "8%",
                        width: "88%",
                        y: "4%",
                        y2: "10%"
                    },
                    xAxis: {
                        data: newData.category,
                        axisLine: {
                            lineStyle: {
                                color: "#B4B4B4"
                            }
                        },
                        axisTick: {
                            show: true
                        }
                    },
                    yAxis: [
                        {
                            splitLine: { show: false },
                            axisLine: {
                                lineStyle: {
                                    color: "#B4B4B4"
                                }
                            },

                            axisLabel: {
                                formatter: "{value} "
                            }
                        },
                        {
                            splitLine: { show: false },
                            axisLine: {
                                lineStyle: {
                                    color: "#B4B4B4"
                                }
                            },
                            axisLabel: {
                                formatter: "{value} "
                            }
                        }
                    ],
                    series: [
                        {
                            name: "实际风速",
                            type: "line",
                            smooth: true,
                            showAllSymbol: true,
                            symbol: "emptyCircle",
                            symbolSize: 8,
                            yAxisIndex: 1,
                            itemStyle: {
                                normal: {
                                    color: "#F02FC2"
                                }
                            },
                            data: newData.rateData
                        },
                        {
                            name: "预测功率",
                            type: "bar",
                            barWidth: 10,
                            itemStyle: {
                                normal: {
                                    barBorderRadius: 5,
                                    color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: "#956FD4" },
                                        { offset: 1, color: "#3EACE5" }
                                    ])
                                }
                            },
                            data: newData.barData
                        },
                        {
                            name: "实际功率",
                            type: "bar",
                            barGap: "-100%",
                            barWidth: 10,
                            itemStyle: {
                                normal: {
                                    barBorderRadius: 5,
                                    color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: "rgba(156,107,211,0.8)" },
                                        { offset: 0.2, color: "rgba(156,107,211,0.5)" },
                                        { offset: 1, color: "rgba(156,107,211,0.2)" }
                                    ])
                                }
                            },
                            z: -12,
                            data: newData.lineData
                        }
                    ]
                }
            },
            immediate: true,
            deep: true
        },
    },
}
</script>