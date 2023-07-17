<template>
    <div class="diagramcontainer _diagramcontainer">
        <h1 style="margin-top: 20px;margin-bottom: 10px;">{{ Turbine_id }}号风机预测结果数据图表可视化</h1>
        <div class="subdiv _subdiv" style="margin-top: 1%;">
            <div class="left box">
                <h1>预测功率YD15图</h1>
                <LineChart class="LineChart"/>
            </div>
            <div class="right box">
                <h1>功率24小时变化图</h1>
                <SolidHistogram class="SolidHistogram"/>
            </div>
        </div>

        <div class="subdiv _subdiv" style="margin-top: 1%;">
            <div class="left box">
                <h1>雷达图</h1>
                <RadarChart class="RadarChart"/>
            </div>
            <div class="right box">
                <h1>散点图</h1>
                <ScatterPlot class="ScatterPlot"/>
            </div>
        </div>
    </div>
</template>

<script>
import LineChart from './diagrams/LineChart.vue';
import ScatterPlot from './diagrams/ScatterPlot.vue';
import SolidHistogram from './diagrams/SolidHistogram.vue';
import RadarChart from './diagrams/RadarChart.vue';
import { mapState } from 'vuex';

export default {
    name: 'dataanalysis',
    components: {
        LineChart, ScatterPlot, SolidHistogram, RadarChart
    },
    data() {
        return {
            Turbine_id: '',
        };
    },
    mounted() {
        this.updateTitle();
    },
    computed: {
        ...mapState('global', ['predictedJsonData']),
    },
    methods: {
        updateTitle() {
            this.Turbine_id = this.$store.state.global.predictedJsonData[0].TurbID;
        }
    },

}
</script>

<style lang='less' scoped>
.LineChart {
    width: 800px;
    height: 600px;
}
.box {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px #F1F1F1 solid;
    background: linear-gradient(to left, #409EFF, #409EFF) left top no-repeat, linear-gradient(to bottom, #409EFF, #409EFF) left top no-repeat,
        linear-gradient(to left, #409EFF, #409EFF) right top no-repeat, linear-gradient(to bottom, #409EFF, #409EFF) right top no-repeat,
        linear-gradient(to left, #409EFF, #409EFF) left bottom no-repeat, linear-gradient(to bottom, #409EFF, #409EFF) left bottom no-repeat,
        linear-gradient(to left, #409EFF, #409EFF) right bottom no-repeat, linear-gradient(to left, #409EFF, #409EFF) right bottom no-repeat;
    background-size: 2px 20px, 20px 2px, 2px 20px, 20px 2px;
}
h1 {
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 5px;
}
@media only screen and (min-width: 800px) {
    .diagramcontainer {
        user-select: none;
        font-size: 1vw;
        .subdiv {
            height: 50vh;
            width: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            font-size: .5em;

            .left {
                width: 48%;
                height: 100%;
                font-size: .8em;
            }

            .right {
                width: 48%;
                height: 100%;
                font-size: .8em;
            }
            .box h1 {
                font-size: 18px;
                font-weight: 800;
                letter-spacing: 3px;
            }
        }
    }
}

// 小于800px
@media only screen and (max-width: 800px) {
    ._diagramcontainer {
        ._subdiv {
            width: 100%;
            display: flex;
            flex-direction: column;
            // justify-content: space-around;
            font-size: .5em;

            .left {
                width: 100%;
                height: 100%;
                font-size: .8em;
            }

            .right {
                width: 100%;
                height: 100%;
                font-size: .8em;
            }
        }
    }
}
</style>