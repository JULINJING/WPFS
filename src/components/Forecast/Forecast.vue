<template>
    <div id="forecastContainer" class="forecastContainer _forecastContainer" ref="forecast">
        <NavTop/>
    </div>
</template>

<script>

import NavTop from '../baseComponents/NavTop'

export default {
    name: 'forecast',
    components: {
        NavTop
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