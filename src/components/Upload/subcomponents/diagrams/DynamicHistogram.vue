<template>
    <div id="DynamicHistogram" class="chartContainer" style="width: 100%;height: 100%;"></div>
</template>

<script>
import * as echarts from 'echarts';


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
                this.scatterData = [];
                this.processData();
                this.renderChart();
            },
            immediate: true,
        },
    },
    methods: {
        processData() {
            if (this.tableData && this.tableData.length > 0) {
                var temp = [[], [], []];
                for (let i = 0; i < this.tableData.length; i++) {
                    const item = this.tableData[i];
                    const datatime = item.DATATIME;
                    const prepower = item.PREPOWER;
                    const power = item.APOWER;

                    if (power !== undefined) {
                        temp[0].push(datatime);
                        temp[1].push(prepower);
                        temp[2].push(power);
                    }
                }
                this.scatterData = temp;
            }
        },

        getData(index) {

        },

        renderChart() {
            if (this.tableData && this.tableData.length > 0) {
                this.$nextTick(() => {
                    var chartDom = document.getElementById('DynamicHistogram');
                    var myChart = echarts.init(chartDom);
                    window.addEventListener("resize", ()=> {
                        myChart.resize()
                    })

                    const rawData = this.scatterData;
                    const dataTime = rawData[0].slice(0, 10);
                    const prepowerData = rawData[1].slice(0, 10);
                    const powerData = rawData[2].slice(0, 10);

                    var categories2 = (function () {
                        let res = [];
                        let len = 10;
                        while (len--) {
                            res.push(10 - len - 1);
                        }
                        return res;
                    })();

                    var option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                label: {
                                    backgroundColor: '#283b56'
                                }
                            }
                        },
                        legend: {
                            top: '3%'
                        },
                        dataZoom: {
                            show: false,
                            start: 0,
                            end: 100
                        },
                        xAxis: [
                            {
                                type: 'category',
                                boundaryGap: true,
                                data: dataTime
                            },
                            {
                                type: 'category',
                                boundaryGap: true,
                                data: categories2
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                scale: true,
                                name: '预测功率',
                                max: 100000,
                                min: 0,
                                boundaryGap: [0.2, 0.2]
                            },
                            {
                                type: 'value',
                                scale: true,
                                name: '实际功率',
                                max: 80000,
                                min: 0,
                                boundaryGap: [0.2, 0.2]
                            }
                        ],
                        series: [
                            {
                                name: 'PREPOWER',
                                type: 'bar',
                                xAxisIndex: 1,
                                yAxisIndex: 1,
                                data: prepowerData
                            },
                            {
                                name: 'ROUDA(A.POWER, 1)',
                                type: 'line',
                                data: powerData
                            }
                        ]
                    };
                    var index = 10;
                    app.count = 11;
                    setInterval(function () {
                        if (rawData[0][index] !== undefined) {

                            dataTime.shift();
                            dataTime.push(rawData[0][index]);
                            prepowerData.shift();
                            prepowerData.push(rawData[1][index]);
                            powerData.shift();
                            powerData.push(rawData[2][index]);
                            categories2.shift();
                            categories2.push(app.count++);

                            index++;

                            myChart.setOption({
                                xAxis: [
                                    {
                                        data: dataTime
                                    },
                                    {
                                        data: categories2
                                    }
                                ],
                                series: [
                                    {
                                        data: prepowerData
                                    },
                                    {
                                        data: powerData
                                    }
                                ]
                            });
                        }
                    }, 2100);

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
  