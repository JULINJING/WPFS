<template>
    <div id="forecastContainer" class="forecastContainer _forecastContainer" ref="forecast">
        <NavTop />
        <el-button-group>
            <el-button type="primary" @click="showTrainSettings">训练</el-button>
            <el-button type="primary" @click="showPredictSettings">预测</el-button>
        </el-button-group>

        <TrainSettings v-if="isTrainSettingsVisible" />
        <PredictSettings v-show="!isTrainSettingsVisible" />
        <ForecastDisplay v-show="!isTrainSettingsVisible" />
        <ChartsDisplay />
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
            isTrainSettingsVisible: true,
        };
    },
    methods: {
        showTrainSettings() {
            this.isTrainSettingsVisible = true;
        },
        showPredictSettings() {
            this.isTrainSettingsVisible = false;
        },
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
    .forecastContainer {}
}

// 小于800px
@media only screen and (max-width: 800px) {
    ._forecastContainer {}
}
</style>