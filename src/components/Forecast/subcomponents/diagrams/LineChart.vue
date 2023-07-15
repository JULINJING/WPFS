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
            lineData: [
                {
                    "DATATIME": "2021-11-01 00:00:00",
                    "WINDSPEED": "6.0",
                    "PREPOWER": "44224.0",
                    "WINDDIRECTION": "270",
                    "TEMPERATURE": "3.9",
                    "HUMIDITY": "45",
                    "PRESSURE": "842",
                    "AWS": "3.3",
                    "APOWER": "17959.0",
                    "YD15": "13819.0"
                },
                {
                    "DATATIME": "2021-11-01 00:15:00",
                    "WINDSPEED": "5.8",
                    "PREPOWER": "43591.0",
                    "WINDDIRECTION": "274",
                    "TEMPERATURE": "3.6",
                    "HUMIDITY": "46",
                    "PRESSURE": "842",
                    "AWS": "3.9",
                    "APOWER": "25930.0",
                    "YD15": "20435.0"
                },
                {
                    "DATATIME": "2021-11-01 00:30:00",
                    "WINDSPEED": "5.7",
                    "PREPOWER": "42842.0",
                    "WINDDIRECTION": "281",
                    "TEMPERATURE": "3.3",
                    "HUMIDITY": "47",
                    "PRESSURE": "842",
                    "AWS": "4.1",
                    "APOWER": "31287.0",
                    "YD15": "25376.0"
                },
                {
                    "DATATIME": "2021-11-01 00:45:00",
                    "WINDSPEED": "5.5",
                    "PREPOWER": "42093.0",
                    "WINDDIRECTION": "289",
                    "TEMPERATURE": "3.0",
                    "HUMIDITY": "48",
                    "PRESSURE": "842",
                    "AWS": "4.3",
                    "APOWER": "32626.0",
                    "YD15": "25669.0"
                },
                {
                    "DATATIME": "2021-11-01 01:00:00",
                    "WINDSPEED": "5.4",
                    "PREPOWER": "41344.0",
                    "WINDDIRECTION": "296",
                    "TEMPERATURE": "2.7",
                    "HUMIDITY": "49",
                    "PRESSURE": "842",
                    "AWS": "3.7",
                    "APOWER": "24645.0",
                    "YD15": "24036.0"
                },
                {
                    "DATATIME": "2021-11-01 01:15:00",
                    "WINDSPEED": "5.3",
                    "PREPOWER": "39691.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "2.4",
                    "HUMIDITY": "50",
                    "PRESSURE": "842",
                    "AWS": "2.9",
                    "APOWER": "13230.0",
                    "YD15": "17085.0"
                },
                {
                    "DATATIME": "2021-11-01 01:30:00",
                    "WINDSPEED": "5.2",
                    "PREPOWER": "37135.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "2.2",
                    "HUMIDITY": "51",
                    "PRESSURE": "842",
                    "AWS": "2.1",
                    "APOWER": "4200.0",
                    "YD15": "4606.0"
                },
                {
                    "DATATIME": "2021-11-01 01:45:00",
                    "WINDSPEED": "5.1",
                    "PREPOWER": "34579.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "2.0",
                    "HUMIDITY": "52",
                    "PRESSURE": "841",
                    "AWS": "1.5",
                    "APOWER": "30.0",
                    "YD15": "0.0"
                },
                {
                    "DATATIME": "2021-11-01 02:00:00",
                    "WINDSPEED": "5.0",
                    "PREPOWER": "32023.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "1.8",
                    "HUMIDITY": "53",
                    "PRESSURE": "841",
                    "AWS": "1.3",
                    "APOWER": "206.0",
                    "YD15": "0.0"
                },
                {
                    "DATATIME": "2021-11-01 02:15:00",
                    "WINDSPEED": "4.9",
                    "PREPOWER": "29671.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "1.6",
                    "HUMIDITY": "54",
                    "PRESSURE": "841",
                    "AWS": "1.2",
                    "APOWER": "-223.0",
                    "YD15": "-754.0"
                },
                {
                    "DATATIME": "2021-11-01 02:30:00",
                    "WINDSPEED": "4.8",
                    "PREPOWER": "27522.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "1.4",
                    "HUMIDITY": "55",
                    "PRESSURE": "841",
                    "AWS": "1.3",
                    "APOWER": "-117.0",
                    "YD15": "-754.0"
                },
                {
                    "DATATIME": "2021-11-01 02:45:00",
                    "WINDSPEED": "4.7",
                    "PREPOWER": "25373.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "1.1",
                    "HUMIDITY": "56",
                    "PRESSURE": "841",
                    "AWS": "1.3",
                    "APOWER": "-98.0",
                    "YD15": "-754.0"
                },
                {
                    "DATATIME": "2021-11-01 03:00:00",
                    "WINDSPEED": "4.6",
                    "PREPOWER": "23224.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "0.9",
                    "HUMIDITY": "57",
                    "PRESSURE": "841",
                    "AWS": "0.8",
                    "APOWER": "-94.0",
                    "YD15": "-754.0"
                },
                {
                    "DATATIME": "2021-11-01 03:15:00",
                    "WINDSPEED": "4.6",
                    "PREPOWER": "21521.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "0.7",
                    "HUMIDITY": "57",
                    "PRESSURE": "841",
                    "AWS": "1.1",
                    "APOWER": "-94.0",
                    "YD15": "-754.0"
                },
                {
                    "DATATIME": "2021-11-01 03:30:00",
                    "WINDSPEED": "4.5",
                    "PREPOWER": "20266.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "0.5",
                    "HUMIDITY": "58",
                    "PRESSURE": "841",
                    "AWS": "1.2",
                    "APOWER": "-97.0",
                    "YD15": "-754.0"
                },
                {
                    "DATATIME": "2021-11-01 03:45:00",
                    "WINDSPEED": "4.5",
                    "PREPOWER": "19011.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "0.4",
                    "HUMIDITY": "58",
                    "PRESSURE": "841",
                    "AWS": "1.7",
                    "APOWER": "-110.0",
                    "YD15": "-754.0"
                },
                {
                    "DATATIME": "2021-11-01 04:00:00",
                    "WINDSPEED": "4.4",
                    "PREPOWER": "17756.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "0.2",
                    "HUMIDITY": "59",
                    "PRESSURE": "841",
                    "AWS": "2.1",
                    "APOWER": "-117.0",
                    "YD15": "0.0"
                },
                {
                    "DATATIME": "2021-11-01 04:15:00",
                    "WINDSPEED": "4.4",
                    "PREPOWER": "16870.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "0.1",
                    "HUMIDITY": "59",
                    "PRESSURE": "841",
                    "AWS": "2.8",
                    "APOWER": "408.0",
                    "YD15": "-754.0"
                },
                {
                    "DATATIME": "2021-11-01 04:30:00",
                    "WINDSPEED": "4.3",
                    "PREPOWER": "16354.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "0.0",
                    "HUMIDITY": "60",
                    "PRESSURE": "841",
                    "AWS": "2.9",
                    "APOWER": "10650.0",
                    "YD15": "2764.0"
                },
                {
                    "DATATIME": "2021-11-01 04:45:00",
                    "WINDSPEED": "4.3",
                    "PREPOWER": "15838.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "-0.1",
                    "HUMIDITY": "61",
                    "PRESSURE": "841",
                    "AWS": "2.6",
                    "APOWER": "9179.0",
                    "YD15": "8878.0"
                },
                {
                    "DATATIME": "2021-11-01 05:00:00",
                    "WINDSPEED": "4.2",
                    "PREPOWER": "15322.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "-0.2",
                    "HUMIDITY": "62",
                    "PRESSURE": "841",
                    "AWS": "2.5",
                    "APOWER": "8995.0",
                    "YD15": "7873.0"
                },
                {
                    "DATATIME": "2021-11-01 05:15:00",
                    "WINDSPEED": "4.2",
                    "PREPOWER": "14611.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "-0.3",
                    "HUMIDITY": "62",
                    "PRESSURE": "841",
                    "AWS": "2.2",
                    "APOWER": "3118.0",
                    "YD15": "4941.0"
                },
                {
                    "DATATIME": "2021-11-01 05:30:00",
                    "WINDSPEED": "4.1",
                    "PREPOWER": "13706.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "-0.4",
                    "HUMIDITY": "63",
                    "PRESSURE": "841",
                    "AWS": "2.0",
                    "APOWER": "308.0",
                    "YD15": "0.0"
                },
                {
                    "DATATIME": "2021-11-01 05:45:00",
                    "WINDSPEED": "4.1",
                    "PREPOWER": "12801.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "-0.5",
                    "HUMIDITY": "64",
                    "PRESSURE": "841",
                    "AWS": "2.0",
                    "APOWER": "-54.0",
                    "YD15": "0.0"
                },
                {
                    "DATATIME": "2021-11-01 06:00:00",
                    "WINDSPEED": "4.0",
                    "PREPOWER": "11896.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "-0.6",
                    "HUMIDITY": "65",
                    "PRESSURE": "841",
                    "AWS": "2.3",
                    "APOWER": "-85.0",
                    "YD15": "0.0"
                },
                {
                    "DATATIME": "2021-11-01 06:15:00",
                    "WINDSPEED": "4.0",
                    "PREPOWER": "10907.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "-0.7",
                    "HUMIDITY": "66",
                    "PRESSURE": "841",
                    "AWS": "2.3",
                    "APOWER": "-79.0",
                    "YD15": "0.0"
                },
                {
                    "DATATIME": "2021-11-01 06:30:00",
                    "WINDSPEED": "4.0",
                    "PREPOWER": "9835.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "-0.8",
                    "HUMIDITY": "67",
                    "PRESSURE": "841",
                    "AWS": "2.5",
                    "APOWER": "112.0",
                    "YD15": "0.0"
                },
                {
                    "DATATIME": "2021-11-01 06:45:00",
                    "WINDSPEED": "4.0",
                    "PREPOWER": "8762.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "-1.0",
                    "HUMIDITY": "68",
                    "PRESSURE": "841",
                    "AWS": "2.4",
                    "APOWER": "819.0",
                    "YD15": "0.0"
                },
                {
                    "DATATIME": "2021-11-01 07:00:00",
                    "WINDSPEED": "4.0",
                    "PREPOWER": "7690.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "-1.1",
                    "HUMIDITY": "69",
                    "PRESSURE": "841",
                    "AWS": "2.2",
                    "APOWER": "1062.0",
                    "YD15": "0.0"
                },
                {
                    "DATATIME": "2021-11-01 07:15:00",
                    "WINDSPEED": "4.0",
                    "PREPOWER": "6719.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "-1.3",
                    "HUMIDITY": "70",
                    "PRESSURE": "841",
                    "AWS": "2.4",
                    "APOWER": "1275.0",
                    "YD15": "0.0"
                },
                {
                    "DATATIME": "2021-11-01 07:30:00",
                    "WINDSPEED": "4.0",
                    "PREPOWER": "5850.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "-1.5",
                    "HUMIDITY": "71",
                    "PRESSURE": "841",
                    "AWS": "2.3",
                    "APOWER": "867.0",
                    "YD15": "0.0"
                },
                {
                    "DATATIME": "2021-11-01 07:45:00",
                    "WINDSPEED": "4.0",
                    "PREPOWER": "4981.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "-1.8",
                    "HUMIDITY": "73",
                    "PRESSURE": "841",
                    "AWS": "2.3",
                    "APOWER": "682.0",
                    "YD15": "0.0"
                },
                {
                    "DATATIME": "2021-11-01 08:00:00",
                    "WINDSPEED": "4.0",
                    "PREPOWER": "4112.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "-2.0",
                    "HUMIDITY": "74",
                    "PRESSURE": "841",
                    "AWS": "2.4",
                    "APOWER": "1213.0",
                    "YD15": "0.0"
                },
                {
                    "DATATIME": "2021-11-01 08:15:00",
                    "WINDSPEED": "4.0",
                    "PREPOWER": "3638.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "-1.9",
                    "HUMIDITY": "74",
                    "PRESSURE": "841",
                    "AWS": "2.4",
                    "APOWER": "1253.0",
                    "YD15": "0.0"
                },
                {
                    "DATATIME": "2021-11-01 08:30:00",
                    "WINDSPEED": "4.0",
                    "PREPOWER": "3559.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "-1.6",
                    "HUMIDITY": "73",
                    "PRESSURE": "841",
                    "AWS": "2.4",
                    "APOWER": "894.0",
                    "YD15": "0.0"
                },
                {
                    "DATATIME": "2021-11-01 08:45:00",
                    "WINDSPEED": "4.0",
                    "PREPOWER": "3480.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "-1.3",
                    "HUMIDITY": "72",
                    "PRESSURE": "842",
                    "AWS": "2.4",
                    "APOWER": "660.0",
                    "YD15": "0.0"
                },
                {
                    "DATATIME": "2021-11-01 09:00:00",
                    "WINDSPEED": "4.0",
                    "PREPOWER": "3401.0",
                    "WINDDIRECTION": "300",
                    "TEMPERATURE": "-1.0",
                    "HUMIDITY": "71",
                    "PRESSURE": "842",
                    "AWS": "2.6",
                    "APOWER": "1134.0",
                    "YD15": "0.0"
                },
                {
                    "DATATIME": "2021-11-01 09:15:00",
                    "WINDSPEED": "4.0",
                    "PREPOWER": "3955.0",
                    "WINDDIRECTION": "296",
                    "TEMPERATURE": "-0.5",
                    "HUMIDITY": "69",
                    "PRESSURE": "842",
                    "AWS": "2.7",
                    "APOWER": "2044.0",
                    "YD15": "0.0"
                },
                {
                    "DATATIME": "2021-11-01 09:30:00",
                    "WINDSPEED": "4.0",
                    "PREPOWER": "5144.0",
                    "WINDDIRECTION": "289",
                    "TEMPERATURE": "0.2",
                    "HUMIDITY": "66",
                    "PRESSURE": "842",
                    "AWS": "2.6",
                    "APOWER": "1634.0",
                    "YD15": "0.0"
                }
            ]
        };
    },
    mounted() {
        if (this.lineData !== null) {
            this.processData();
            this.renderChart();
        }
    },
    // watch: {
    //     tableData: {
    //         handler(newTableData) {
    //             if (newTableData !== null) {
    //                 this.lineData = [];
    //                 this.processData();
    //                 this.renderChart();
    //             }
    //         },
    //         immediate: true, // 立即执行watch处理函数
    //     },
    // },
    methods: {
        processData() {
            // if (this.tableData && this.tableData.length > 0) {

            // this.lineData = this.tableData.map(item => ({
            //     DATATIME: item.DATATIME,
            //     PREPOWER: item.PREPOWER,
            //     POWER: item.APOWER,
            //     YD15: item.YD15
            // }));
            // }
        },

        renderChart() {
            // if (this.tableData && this.tableData.length > 0) {
            this.$nextTick(() => {
                if (!this.chartInstance) {
                    this.chartInstance = echarts.init(document.getElementById('linechart'));
                    window.addEventListener("resize", () => {
                        this.chartInstance.resize()
                    })
                }

                if (this.lineData && this.lineData.length > 0) {
                    const xAxisData = this.lineData.map(item => item.DATATIME);
                    const seriesData = [];
                    for (const key in this.lineData[0]) {
                        if (key !== 'DATATIME') {
                            seriesData.push({
                                name: key,
                                type: 'line',
                                data: this.lineData.map(item => item[key])
                            });
                        }
                    }

                    const option = {
                        // backgroundColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        //     offset: 0,
                        //     color: '#c86589'
                        // },
                        // {
                        //     offset: 1,
                        //     color: '#06a7ff'
                        // }
                        // ], false),
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
                            data: ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
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
                        yAxis: [{
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
                        }],
                        series: [{
                            name: '预测功率YD15',
                            type: 'line',
                            smooth: true, //是否平滑曲线显示
                            showAllSymbol: true,
                            symbol: 'circle',
                            symbolSize: 6,
                            lineStyle: {
                                normal: {
                                    color: "gray", // 线条颜色
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
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
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
                            data: [393, 438, 485, 631, 689, 824, 987, 1000, 1100, 1200]
                        }]
                    };

                    option && this.chartInstance.setOption(option);
                }

            });
            // }
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
