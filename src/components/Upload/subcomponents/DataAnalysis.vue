<template>
    <div class="diagramcontainer _diagramcontainer">
        <h1 style="margin-top: 20px;margin-bottom: 10px;">{{ Turbine_id }}号风机数据预处理后图表可视化</h1>
        <div class="subdiv _subdiv" style="margin-top: 2%;">
            <div class="left box">
                <h1>三维柱状图</h1>
                <SolidHistogram class="SolidHistogram"/>
            </div>
            <div class="right box">
                <h1>相关性矩阵图</h1>
                <HeatMap class="HeatMap"/>
            </div>
        </div>
        <div class="subdiv _subdiv" style="margin-top: 2%;">
            <div class="left box">
                <h1>风向—风速图</h1>
                <WeatherChart class="WeatherChart"/>
            </div>
            <div class="right box">
                <h1>四季图</h1>
                <ParallelChart class="ParallelChart"/>
            </div>
        </div>
        <div class="subdiv _subdiv" style="margin-top: 2%;">
            <div class="left box">
                <h1>预测功率和实际功率相关图</h1>
                <DynamicHistogram class="DynamicHistogram" />
            </div>
            <div class="right box">
                <h1>时序图</h1>
                <LineChart class="LineChart"/>
            </div>
        </div>
        <div class="subdiv _subdiv" style="margin-top: 2%;margin-bottom: 2%;">
            <div class="left box">
                <h1>箱线图</h1>
                <BoxPlot class="BoxPlot"/>
            </div>
            <div class="right box">
                <h1>实际功率1 和 实际功率2 相关图</h1>
                <ScatterPlot class="ScatterPlot" />
            </div>
        </div>
    </div>
</template>

<script>
import ScatterPlot from './diagrams/ScatterPlot.vue';
import HeatMap from './diagrams/HeatMap.vue';
import LineChart from './diagrams/LineChart.vue';
import BoxPlot from './diagrams/BoxPlot.vue';
import ParallelChart from './diagrams/ParallelChart.vue';
import DynamicHistogram from './diagrams/DynamicHistogram.vue';
import WeatherChart from './diagrams/WeatherChart.vue';
import SolidHistogram from './diagrams/SolidHistogram.vue';
import { mapState } from 'vuex';

export default {
    name: 'dataanalysis',
    components: {
        HeatMap, LineChart, BoxPlot, ScatterPlot, ParallelChart, DynamicHistogram, WeatherChart, SolidHistogram
    },
    data() {
        return {
            Turbine_id: '',
        };
    },
    computed: {
        ...mapState('global', ['uploadedFileName']),
    },
    watch: {
        uploadedFileName: {
            handler(newName) {
                this.updateTitle();
            },
            deep: true
        }
    },
    methods: {
        updateTitle() {
            var fileName = this.$store.state.global.uploadedFileName;
            this.Turbine_id = fileName.split('.')[0];
        }
    },

}
</script>

<style lang='less' scoped>
.box {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1.5px white solid;
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
                letter-spacing: 5px;
            }
        }
    }
}

// 小于800px
@media only screen and (max-width: 800px) {
    ._diagramcontainer {
        ._subdiv {
            height: 50vh;
            width: 100%;
            display: flex;
            flex-direction: column;
            // justify-content: space-around;
            font-size: .5em;

            .left {
                width: 100%;
                height: 100%;
                font-size: .8em;
                margin-top: 10px;
            }

            .right {
                width: 100%;
                height: 100%;
                font-size: .8em;
                margin-top: 10px;
            }
        }
    }
}
</style>