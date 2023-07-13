<template>
    <div class="diagramcontainer _diagramcontainer">
        <div class="subdiv _subdiv" style="margin-top: 1%;">
            <div class="left box">
                <h1>时序图</h1>
                <SolidHistogram :tableData="tableData" class="SolidHistogram"/>
            </div>
            <div class="right box">
                <h1>相关性矩阵</h1>
                <HeatMap :tableData="tableData" class="HeatMap"/>
            </div>
        </div>
        <div class="subdiv _subdiv" style="margin-top: 1%;">
            <div class="left box">
                <h1>风向 风速 湿度</h1>
                <WeatherChart :tableData="tableData" class="WeatherChart"/>
            </div>
            <div class="right box">
                <h1>平行坐标系图</h1>
                <ParallelChart :tableData="tableData" class="ParallelChart"/>
            </div>
        </div>
        <div class="subdiv _subdiv" style="margin-top: 1%;">
            <div class="left box">
                <h1>实际风速和实际功率相关图</h1>
                <DynamicHistogram :tableData="tableData" class="DynamicHistogram" />
            </div>
            <div class="right box">
                <h1>时序图</h1>
                <LineChart :tableData="tableData" class="LineChart"/>
            </div>
        </div>
        <div class="subdiv _subdiv" style="margin-top: 1%;margin-bottom: 1%;">
            <div class="left box">
                <h1>箱线图</h1>
                <BoxPlot :tableData="tableData" class="BoxPlot"/>
            </div>
            <div class="right box">
                <h1>实际风速和实际功率相关图</h1>
                <ScatterPlot :tableData="tableData" class="ScatterPlot" />
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

export default {
    props: {
        tableData: Array,
    },
    name: 'dataanalysis',
    components: {
        HeatMap, LineChart, BoxPlot, ScatterPlot, ParallelChart, DynamicHistogram, WeatherChart, SolidHistogram
    }
}
</script>

<style lang='less' scoped>
.ScatterPlot {
    width: 800px;
    height: 600px;
}
.box {
    display: flex;
    flex-direction: column;
    align-items: center;
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