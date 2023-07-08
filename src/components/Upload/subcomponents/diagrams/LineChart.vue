<template>
  <div id="linechart"></div>
</template>
  
<script>
import * as echarts from 'echarts';
import $ from 'jquery';

export default {
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      var ROOT_PATH = 'https://echarts.apache.org/examples';
      const chartDom = document.getElementById('linechart');
      const myChart = echarts.init(chartDom);
      var option;

      $.get(ROOT_PATH + '/data/asset/data/life-expectancy-table.json', function (_rawData) {
        run(_rawData);
      });

      function run(_rawData) {
        const countries = ['Finland', 'France', 'Germany', 'Iceland', 'Norway', 'Poland', 'Russia', 'United Kingdom'];
        const datasetWithFilters = [];
        const seriesList = [];

        console.log(_rawData);

        echarts.util.each(countries, function (country) {
          var datasetId = 'dataset_' + country;
          datasetWithFilters.push({
            id: datasetId,
            fromDatasetId: 'dataset_raw',
            transform: {
              type: 'filter',
              config: {
                and: [
                  { dimension: 'Year', gte: 1950 },
                  { dimension: 'Country', '=': country }
                ]
              }
            }
          });
          seriesList.push({
            type: 'line',
            datasetId: datasetId,
            showSymbol: false,
            name: country,
            endLabel: {
              show: true,
              formatter: function (params) {
                return params.value[3] + ': ' + params.value[0];
              }
            },
            labelLayout: {
              moveOverlap: 'shiftY'
            },
            emphasis: {
              focus: 'series'
            },
            encode: {
              x: 'Year',
              y: 'Income',
              label: ['Country', 'Income'],
              itemName: 'Year',
              tooltip: ['Income']
            }
          });
        });

        option = {
          animationDuration: 10000,
          dataset: [
            {
              id: 'dataset_raw',
              source: _rawData
            },
            ...datasetWithFilters
          ],
          title: {
            text: 'Income of Germany and France since 1950'
          },
          tooltip: {
            order: 'valueDesc',
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            nameLocation: 'middle'
          },
          yAxis: {
            name: 'Income'
          },
          grid: {
            right: 140
          },
          series: seriesList
        };

        myChart.setOption(option);
      }
    }
  }
};
</script>
  
<style>
.linechart {
  width: 100%;
  height: 400px;
}
</style>