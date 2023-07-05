<template>
    <div>
        <div id="heatmapChart"></div>
    </div>
</template>
  
<script>
import * as echarts from 'echarts';

export default {
    mounted() {
        this.renderChart();
    },
    methods: {
        renderChart() {
            const chartDom = document.getElementById('heatmapChart');
            const myChart = echarts.init(chartDom);

            const X = [
                'WINDSPEED', 'PREPOWER', 'WINDDIRECTION', 'TEMPERATURE', 'HUMIDITY', 
                'PRESSURE', 'ROUDN(A.WS,1)', 'ROUD(A.POWER,0)', 'YD15'
            ];

            const Y = [
                'YD15', 'ROUD(A.POWER,0)', 'ROUDN(A.WS,1)', 'PRESSURE', 'HUMIDITY', 
                'WINDSPEED', 'TEMPERATURE', 'WINDDIRECTION', 'PREPOWER' 
            ];
            const data = [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], 
                        [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], 
                        [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 9, 0],
                        [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], 
                        [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], 
                        [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], 
                        [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], 
                        [7, 0, 2], [7, 1, 3], [7, 2, 0], [7, 3, 0], [7, 4, 0], [7, 5, 0], [7, 6, 0], [7, 7, 0], [7, 8, 1],
                        [8, 0, 2], [8, 1, 3], [8, 2, 0], [8, 3, 0], [8, 4, 0], [8, 5, 0], [8, 6, 0], [8, 7, 0], [8, 8, 1]
                    ].map(function (item) {
                    return [item[1], item[0], item[2] || '-'];
                });

            const option = {
                tooltip: {
                    position: 'top'
                },
                grid: {
                    height: '50%',
                    top: '10%'
                },
                xAxis: {
                    type: 'category',
                    data: X,
                    splitArea: {
                        show: true
                    }
                },
                yAxis: {
                    type: 'category',
                    data: Y,
                    splitArea: {
                        show: true
                    }
                },
                visualMap: {
                    min: 0,
                    max: 10,
                    calculable: true,
                    orient: 'horizontal',
                    left: 'center',
                    bottom: '15%'
                },
                series: [{
                    name: 'Punch Card',
                    type: 'heatmap',
                    data: data,
                    label: {
                        show: true
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };

            option && myChart.setOption(option);
        }
    }
}
</script>
  
<style>
.heatmapChart {
    width: 100%;
    height: 400px;
}
</style>
  