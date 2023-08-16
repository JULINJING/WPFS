<template>
    <div>
        <NavTop></NavTop>
        <div style="width: 100%;display: flex;flex-direction: column;align-items: center;margin-bottom: 40px;">
            <PanelGroup @changeComponent="handleChangeComponent"></PanelGroup>
            <TransactionTable v-show="currentComponent === 'transactionTable'"></TransactionTable>
            <PreTransactionTable v-show="currentComponent === 'preTransactionTable'"></PreTransactionTable>
            <div v-show="currentComponent === 'lineCharts'" style="display: flex;flex-direction: column;align-items: center;width: 100%;margin-top: 40px;" v-for="(data, index) in chartDatas" :key="index">
                <p>{{ filenames[index] }}</p>
                <LineChart ref="lineCharts" :chartData="data" />
            </div>
        </div>
    </div>
</template>
<script>
import NavTop from '../baseComponents/NavTop'
import PanelGroup from './subcomponents/PanelGroup'
import TransactionTable from './subcomponents/TransactionTable'
import PreTransactionTable from './subcomponents/PreTransactionTable'
import LineChart from './subcomponents/LineChart.vue'
import Data11 from '@/assets/testJson/data/11.json';
import Data12 from '@/assets/testJson/data/12.json';
import Data13 from '@/assets/testJson/data/13.json';
import Data14 from '@/assets/testJson/data/14.json';
import Data15 from '@/assets/testJson/data/15.json';
import Data16 from '@/assets/testJson/data/16.json';
import Data17 from '@/assets/testJson/data/17.json';
import Data18 from '@/assets/testJson/data/18.json';
import Data19 from '@/assets/testJson/data/19.json';
import Data20 from '@/assets/testJson/data/20.json';


export default {
    name: 'workSpace',
    components: {
        NavTop,PanelGroup,TransactionTable,PreTransactionTable,LineChart
    },
    data() {
        return {
            currentComponent: 'transactionTable',
            filenames: ['11.csv', '18.csv', '20.csv', '12.csv', '17.csv', '13.csv', '15.csv', '16.csv', '19.csv', '14.csv'],
            chartDatas: [
                Data11, Data12, Data13, Data14, Data15,
                Data16, Data17, Data18, Data19, Data20
                // ... 更多数据对象
            ]
        }
    },
    created(){
    },
    computed:{
    },
    methods: {
        handleChangeComponent(componentName) {
            this.currentComponent = componentName
        }
    },
    watch: {
        currentComponent(newValue) {
            if (newValue === 'lineCharts') {
            this.$nextTick(() => {
                this.$refs.lineCharts.forEach((chartComponent) => {
                    chartComponent.resizeChart();
                });
            });
            }
        }
    }
}
</script>
<style scoped>

</style>
