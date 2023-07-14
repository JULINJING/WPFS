<template>
    <div class="diagramcontainer _diagramcontainer">
        <div class="subdiv _subdiv" style="margin-top: 1%;">
            <div class="left box">
                <h1>折线图</h1>
                <LineChart :tableData="tableData" class="LineChart"/>
            </div>
            <div class="right box">
                <h1>散点图</h1>
                <ScatterPlot :tableData="tableData" class="ScatterPlot"/>
            </div>
        </div>
    </div>
</template>

<script>
import LineChart from './diagrams/LineChart.vue';
import ScatterPlot from './diagrams/ScatterPlot.vue';

export default {
    props: {
        tableData: Array,
    },
    name: 'dataanalysis',
    components: {
        LineChart, ScatterPlot
    }
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