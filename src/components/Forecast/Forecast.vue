<template>
    <div class="forecastContainer _forecastContainer" ref="forecast">
        <NavTop />
        <div id="tabBox">
            <el-tabs v-model="activeName" type="border-card" style="height:100%;width:96%;margin-bottom: 20px;margin-top: 20px;">
                <el-tab-pane name="train">
                    <span slot="label"><i class="iconfont">&#xe628;</i> 训练</span>
                    <TrainSettings/>
                </el-tab-pane>
                <el-tab-pane name="forecast">
                    <span slot="label"><i class="iconfont">&#xe6df;</i> 预测</span>
                    <PredictSettings @update-table-data="updateTableData"/>
                    <ForecastDisplay />
                    <ChartsDisplay />
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- <el-row style="border-bottom: 3px #D9D9D9 dotted;width: 96%;margin-bottom: 5px;">
            <el-button class="tabButton" @click="showTrainSettings">训练</el-button>
            <el-button class="tabButton" @click="showPredictSettings">预测</el-button>
        </el-row> -->
        <Footer />
    </div>
</template>

<script>

import NavTop from '../baseComponents/NavTop';
import PredictSettings from './subcomponents/PredictSettings.vue';
import ForecastDisplay from './subcomponents/ForecastDisplay.vue';
import TrainSettings from './subcomponents/TrainSettings.vue';
import ChartsDisplay from './subcomponents/ChartsDisplay.vue';
import Footer from '../baseComponents/Footer.vue';

export default {
    name: 'forecast',
    components: {
        NavTop, PredictSettings, ForecastDisplay, TrainSettings, ChartsDisplay, Footer
    },
    data() {
        return {
            activeName: 'train',
        };
    },
    mounted() {
        this.$on('update-table-data', this.updateTableData);
    },
    methods: {
        updateTableData(){
            console.log("Update predict table data");
        }
    }
}
</script>

<style lang="less" scoped>
#forecastContainer {
    margin: 0;
    padding: 0;
    overscroll-behavior: none;
    overflow: hidden;
}

// 大于800px
@media only screen and (min-width: 800px) {
    .forecastContainer {
        #tabBox{
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}

// 小于800px
@media only screen and (max-width: 800px) {
    ._forecastContainer {
        #tabBox{
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}
</style>