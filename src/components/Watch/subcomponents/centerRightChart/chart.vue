<template>
    <div>
        <Echart :options="options" id="centreRight2Chart1" height="220%"></Echart>
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

                let index = newData.indicatorData.map((obj, index) => {
                    return obj.name
                })
                let value = newData.indicatorData.map((obj, index) => {
                    return obj.value
                })
                this.options = {
                    grid: {
                        top: '10%',
                        y2: '10%',
                        left: '15%',
                    },
                    xAxis: {
                        max: 'dataMax',
                        axisLine: {
                            lineStyle: {
                                color: '#4790ea'
                            }
                        },
                        //x轴的分割线
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: index,
                        inverse: true,
                        axisLabel: {
                            show: true,
                            interval: 0
                        },
                        animationDuration: 3000,
                        animationDurationUpdate: 500,
                        max: 5,
                    },
                    series: [
                        {
                            realtimeSort: true,
                            name: "各风机近一个月发电量",
                            type: "bar",
                            data: value,
                            label: {
                                show: true,
                                position: 'right',
                                valueAnimation: true,
                                color: '#fff'
                            },
                            barWidth: 5,
                            itemStyle: {
                                borderRadius: [0, 10, 10, 0],
                                color: new this.$echarts.graphic.LinearGradient(1, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: '#f72f48'
                                    },
                                    {
                                        offset: 0.5,
                                        color: '#f44279'
                                    },
                                    {
                                        offset: 1,
                                        color: '#8815f9'
                                    }
                                ])
                            },
                        }],
                    legend: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    animationDuration: 0,
                    animationDurationUpdate: 3000,
                    animationEasing: 'linear',
                    animationEasingUpdate: 'linear'
                }
            },
            immediate: true,
            deep: true
        }
    }
};
</script>