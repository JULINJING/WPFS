<template>
    <div id="forecastContainer" class="forecastContainer _forecastContainer" ref="forecast">
        <NavTop/>
        <ParamsSettings/>
        <ForecastDisplay/>
    </div>
</template>

<script>

import NavTop from '../baseComponents/NavTop';
import ParamsSettings from './subcomponents/ParamsSettings.vue';
import ForecastDisplay from './subcomponents/ForecastDisplay.vue';

export default {
    name: 'forecast',
    components: {
        NavTop, ParamsSettings, ForecastDisplay
    },
    data() {
        return {
        };
    },
    methods: {

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
@media only screen and (min-width: 800px){
    .forecastContainer{
    }
}

// 小于800px
@media only screen and (max-width: 800px){
    ._forecastContainer{
    }
}
</style>