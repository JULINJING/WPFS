<template>
    <div class="scatterBox" style="width: 480px; height: 300px;">
        <div id="scatterChart" class="chartContainer"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import jsonData from '@/assets/testJson/11.json';


export default {
    data() {
        return {
            // serverIp: serverIp,
            originData: jsonData,
            scatterData: []
        };
    },
    mounted() {
        this.processData();
        this.renderChart();
    },
    methods: {
        processData() {
            // 遍历 jsonData 数组
            for (let i = 0; i < this.originData.length; i++) {
                const item = this.originData[i];
                const power = item.POWER;
                const yd15 = item.YD15;

                // 检查 POWER 和 YD15 是否存在
                if (power !== undefined && yd15 !== undefined) {
                    // 将 POWER 和 YD15 的值存储为散点图数据的格式
                    this.scatterData.push([power, yd15]);
                }
            }
        },
        renderChart() {
            const chartDom = document.getElementById('scatterChart');
            const myChart = echarts.init(chartDom);

            const option = {
                xAxis: {
                    scale: true
                },
                yAxis: {
                    scale: true
                },
                series: [
                    {
                        type: 'effectScatter',
                        symbolSize: 20,
                        data: [
                            [172.7, 105.2],
                            [153.4, 42]
                        ]
                    },
                    {
                        type: 'scatter',
                        data: this.scatterData
                    }
                ]
            };
            console.log(option);
            option && myChart.setOption(option);
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
  