<template>
    <div>
        <div id="heatmapChart"></div>
    </div>
</template>
  
<script>
import * as echarts from 'echarts';
import jsonData from '@/assets/testJson/11.json';

export default {
    mounted() {
        this.renderChart();
    },
    methods: {
        calculateCorrelation(data) {
            // 提取需要计算相关性的数值序列
            const windspeed = data.map(item => parseFloat(item.WINDSPEED));
            const prepower = data.map(item => parseFloat(item.PREPOWER));
            const winddirection = data.map(item => parseFloat(item.WINDDIRECTION));
            const temperature = data.map(item => parseFloat(item.TEMPERATURE));
            const humidity = data.map(item => parseFloat(item.HUMIDITY));
            const pressure = data.map(item => parseFloat(item.PRESSURE));
            const ws = data.map(item => parseFloat(item.WS));
            const power = data.map(item => parseFloat(item.POWER));
            const yd15 = data.map(item => parseFloat(item.YD15));

            // 计算相关性矩阵
            const variables = [windspeed, prepower, winddirection, temperature, humidity, pressure, ws, power, yd15];
            const n = windspeed.length;
            const correlationMatrix = [];

            for (let i = 0; i < variables.length; i++) {
                const row = [];
                for (let j = 0; j < variables.length; j++) {
                    const xi = variables[i];
                    const xj = variables[j];
                    const sumXi = xi.reduce((sum, value) => sum + value, 0);
                    const sumXj = xj.reduce((sum, value) => sum + value, 0);
                    const sumXiXj = xi.reduce((sum, value, index) => sum + value * xj[index], 0);
                    const sumXiSquared = xi.reduce((sum, value) => sum + value * value, 0);
                    const sumXjSquared = xj.reduce((sum, value) => sum + value * value, 0);

                    const correlation = (n * sumXiXj - sumXi * sumXj) /
                        Math.sqrt((n * sumXiSquared - sumXi * sumXi) * (n * sumXjSquared - sumXj * sumXj));

                    row.push(correlation);
                }
                correlationMatrix.push(row);
            }

            return correlationMatrix;
        },
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
  