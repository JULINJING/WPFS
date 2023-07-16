<template>
    <div id="boxplotChart" class="chartContainer" style="width: 100%;height: 100%;"></div>
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
            boxData: [],
            tableData: []
        };
    },
    mounted() {
        this.processData();
        this.renderChart();
    },
    computed: {
        ...mapState('global', ['obtainedJsonData']),
    },
    // watch: {
    //     tableData: {
    //         handler(newTableData) {
    //             this.boxData = [];
    //             this.processData();
    //             this.renderChart();
    //         },
    //         immediate: true, // 立即执行watch处理函数
    //     },
    // },
    methods: {
        processData() {
            // if (this.tableData && this.tableData.length > 0) {
                this.tableData = this.$store.state.global.obtainedJsonData;
                this.boxData = this.tableData.map(item => ({
                    DATATIME: item.DATATIME,
                    PREPOWER: item.PREPOWER,
                    APOWER: item.APOWER,
                    YD15: item.YD15
                }));
            // }
        },
        getBoxplotData() {
            const groupedData = new Array(3).fill(0).map(() => new Array(12).fill(0).map(() => new Array(31).fill(0)));
            
            this.boxData.forEach((item, index) => {
                const month = new Date(item.DATATIME).getMonth();
                index = index % 31;
                groupedData[0][month][index] = item.PREPOWER;
                groupedData[1][month][index] = item.APOWER;
                groupedData[2][month][index] = item.YD15;
            });

            return groupedData;
        },
        renderChart() {
            if (this.tableData && this.tableData.length > 0) {
                this.$nextTick(() => {
                    if (!this.chartInstance) {
                        this.chartInstance = echarts.init(document.getElementById('boxplotChart'));
                        window.addEventListener("resize", ()=> {
                            this.chartInstance.resize()
                        })
                    }
                    if (this.boxData && this.boxData.length > 0) {
                        const data = this.getBoxplotData();
                        console.log(data);
                        const option = {
                            dataset: [
                                {
                                    source: data[0]
                                },
                                {
                                    source: data[1]
                                },
                                {
                                    source: data[2]
                                },
                                {
                                    fromDatasetIndex: 0,
                                    transform: { type: 'boxplot' }
                                },
                                {
                                    fromDatasetIndex: 1,
                                    transform: { type: 'boxplot' }
                                },
                                {
                                    fromDatasetIndex: 2,
                                    transform: { type: 'boxplot' }
                                }
                            ],
                            legend: {
                                top: '3%'
                            },
                            tooltip: {
                                trigger: 'item',
                                axisPointer: {
                                    type: 'shadow'
                                }
                            },
                            grid: {
                                left: '10%',
                                top: '15%',
                                right: '5%',
                                bottom: '15%'
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: true,
                                nameGap: 30,
                                splitArea: {
                                    show: true
                                },
                                splitLine: {
                                    show: false
                                }
                            },
                            yAxis: {
                                type: 'value',
                                name: 'Value',
                                min: -1000,
                                max: 200000,
                                splitArea: {
                                    show: false
                                }
                            },
                            dataZoom: [
                                {
                                    type: 'inside',
                                    start: 0,
                                    end: 20
                                },
                                {
                                    show: true,
                                    type: 'slider',
                                    top: '89%',
                                    xAxisIndex: [0],
                                    start: 0,
                                    end: 20
                                }
                            ],
                            series: [
                                {
                                    name: 'PREPOWER',
                                    type: 'boxplot',
                                    datasetIndex: 3
                                },
                                {
                                    name: 'ROUND(A.POWER,1)',
                                    type: 'boxplot',
                                    datasetIndex: 4
                                },
                                {
                                    name: 'YD15',
                                    type: 'boxplot',
                                    datasetIndex: 5
                                }
                            ]
                        };

                        option && this.chartInstance.setOption(option);
                    }
                });
            }
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