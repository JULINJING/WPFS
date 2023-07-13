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
            lineData: []
        };
    },
    mounted() {
        if (this.lineData !== null) {
            this.processData();
            this.renderChart();
        }
    },
    watch: {
        tableData: {
            handler(newTableData) {
                if (newTableData !== null) {
                    this.lineData = [];
                    this.processData();
                    this.renderChart();
                }
            },
            immediate: true, // 立即执行watch处理函数
        },
    },
    methods: {
        processData() {
            if (this.tableData && this.tableData.length > 0) {

                this.lineData = this.tableData.map(item => ({
                    DATATIME: item.DATATIME,
                    PREPOWER: item.PREPOWER,
                    POWER: item.APOWER,
                    YD15: item.YD15
                }));
            }
        },

        renderChart() {
            if (this.tableData && this.tableData.length > 0) {
                this.$nextTick(() => {
                    if (!this.chartInstance) {
                        this.chartInstance = echarts.init(document.getElementById('linechart'));
                        window.addEventListener("resize", ()=> {
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
                            animationDuration: 1000,
                            legend: {
                                data: Object.keys(this.lineData[0]).filter(key => key !== 'DATATIME'),
                                top: '3%'
                            },
                            xAxis: {
                                type: 'category',
                                data: xAxisData
                            },
                            yAxis: {
                                type: 'value'
                            },
                            tooltip: {
                                order: 'valueDesc',
                                trigger: 'axis'
                            },
                            series: seriesData
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
