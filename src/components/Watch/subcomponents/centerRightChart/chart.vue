<template>
    <div>
        <Echart :options="options" id="centreRight2Chart1" height="200px" width="260px"></Echart>
    </div>
</template>
  
<script>
import Echart from '../echart'
export default {
    data() {
        return {
            options: {},
        };
    },
    components: {
        Echart,
    },
    props: {
        cdata: {
            type: Object,
            default: () => ({})
        },
    },
    watch: {
        cdata: {
            handler(newData) {

                this.options = {
                    xAxis: {
                        max: 'dataMax'
                    },
                    yAxis: {
                        type: 'category',
                        data: [],
                        inverse: true,
                        animationDuration: 300,
                        animationDurationUpdate: 300,
                        max: 4 //only the largest 5 bars will be displayed
                    },
                    series: [
                        {
                            realtimeSort: true,
                            name: "X",
                            type: "bar",
                            data: newData.dataBJ,
                            label: {
                                show: true,
                                position: 'right',
                                valueAnimation: true
                            },
                            itemStyle: {
                                color: "#F9713C"
                            },
                        }],
                    legend: {
                        show: true
                    },
                    animationDuration: 0,
                    animationDurationUpdate: 3000,
                    animationEasing: 'linear',
                    animationEasingUpdate: 'linear'
                }
            },
            immediate: true,
            deep: true
        }
    }
};
</script>