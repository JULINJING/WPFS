<template>
    <div>
        <Echart :options="options" id="bottomRightChart" height="480px" width="100%"></Echart>
    </div>
</template>

<script>
import Echart from '../echart'
export default {
    data() {
        return {
            options: {},
            // 定义颜色
            colorList: {
                linearYtoG: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: '#f5b44d'
                        },
                        {
                            offset: 1,
                            color: '#28f8de'
                        }
                    ]
                },
                linearGtoB: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                        {
                            offset: 0,
                            color: '#43dfa2'
                        },
                        {
                            offset: 1,
                            color: '#28f8de'
                        }
                    ]
                },
                linearBtoG: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                        {
                            offset: 0,
                            color: '#1c98e8'
                        },
                        {
                            offset: 1,
                            color: '#28f8de'
                        }
                    ]
                },
                areaBtoG: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: 'rgba(35,184,210,.2)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(35,184,210,0)'
                        }
                    ]
                }
            }
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
                        subtext: newData.year + '/' + newData.weekCategory[6],
                        subtextStyle: {
                            color: '#fff',
                            fontSize: 16
                        },
                        top: 50,
                        left: 80
                    },
                    legend: {
                        top: 120,
                        left: 80,
                        orient: 'vertical',
                        itemGap: 15,
                        itemWidth: 12,
                        itemHeight: 12,
                        data: ['平均指标', '我的指标'],
                        textStyle: {
                            color: '#fff',
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    radar: {
                        center: ['68%', '27%'],
                        radius: '40%',
                        name: {
                            color: '#fff'
                        },
                        splitNumber: 8,
                        axisLine: {
                            lineStyle: {
                                color: this.colorList.linearYtoG,
                                opacity: 0.6
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: this.colorList.linearYtoG,
                                opacity: 0.6
                            }
                        },
                        splitArea: {
                            areaStyle: {
                                color: '#fff',
                                opacity: 0.1,
                                shadowBlur: 25,
                                shadowColor: '#000',
                                shadowOffsetX: 0,
                                shadowOffsetY: 5
                            }
                        },
                        indicator: [
                            {
                                name: '第一季度',
                                max: newData.maxData
                            },
                            {
                                name: '第二季度',
                                max: 10
                            },
                            {
                                name: '第三季度',
                                max: 12
                            },
                            {
                                name: '第四季度',
                                max: 3.5
                            }
                        ]
                    },
                    grid: {
                        left: 90,
                        right: 80,
                        bottom: 40,
                        top: '60%'
                    },
                    xAxis: {
                        type: 'category',
                        position: 'bottom',
                        axisLine: true,
                        axisLabel: {
                            color: 'rgba(255,255,255,.8)',
                            fontSize: 12
                        },
                        data: newData.weekCategory
                    },
                    // 下方Y轴
                    yAxis: {
                        name: '功率',
                        nameLocation: 'end',
                        nameGap: 24,
                        nameTextStyle: {
                            color: 'rgba(255,255,255,.5)',
                            fontSize: 14
                        },
                        max: newData.maxData,
                        splitNumber: 4,

                        axisLine: {
                            lineStyle: {
                                opacity: 0
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#fff',
                                opacity: 0.1
                            }
                        },
                        axisLabel: {
                            color: 'rgba(255,255,255,.8)',
                            fontSize: 12
                        }
                    },
                    series: [
                        {
                            name: '',
                            type: 'radar',
                            symbolSize: 0,
                            data: [
                                {
                                    value: newData.radarDataAvg[6],
                                    name: '平均指标',
                                    itemStyle: {
                                        normal: {
                                            color: '#f8d351'
                                        }
                                    },
                                    lineStyle: {
                                        normal: {
                                            opacity: 0
                                        }
                                    },
                                    areaStyle: {
                                        normal: {
                                            color: '#f8d351',
                                            shadowBlur: 25,
                                            shadowColor: 'rgba(248,211,81,.3)',
                                            shadowOffsetX: 0,
                                            shadowOffsetY: -10,
                                            opacity: 1
                                        }
                                    }
                                },
                                {
                                    value: newData.radarData[6],
                                    name: '我的指标',
                                    itemStyle: {
                                        normal: {
                                            color: '#43dfa2'
                                        }
                                    },
                                    lineStyle: {
                                        normal: {
                                            opacity: 0
                                        }
                                    },
                                    areaStyle: {
                                        normal: {
                                            color: this.colorList.linearGtoB,
                                            shadowBlur: 15,
                                            shadowColor: 'rgba(0,0,0,.2)',
                                            shadowOffsetX: 0,
                                            shadowOffsetY: 5,
                                            opacity: 0.8
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            name: '',
                            type: 'line',
                            smooth: true,
                            symbol: 'emptyCircle',
                            symbolSize: 8,
                            itemStyle: {
                                normal: {
                                    color: '#fff'
                                }
                            },
                            lineStyle: {
                                normal: {
                                    color: this.colorList.linearBtoG,
                                    width: 3
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: this.colorList.areaBtoG
                                }
                            },
                            data: newData.weekLineData,
                            lineSmooth: true,
                            markLine: {
                                silent: true,
                                data: [
                                    {
                                        type: 'average',
                                        name: '平均值'
                                    }
                                ],
                                precision: 0,
                                label: {
                                    normal: {
                                        formatter: '平均值: \n {c}'
                                    }
                                },
                                lineStyle: {
                                    normal: {
                                        color: 'rgba(248,211,81,.7)'
                                    }
                                }
                            },
                            tooltip: {
                                position: 'top',
                                formatter: '{c} m',
                                backgroundColor: 'rgba(28,152,232,.2)',
                                padding: 6
                            }
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
