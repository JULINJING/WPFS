<template>
    <div class="diagramcontainer">
        <div class="diagrambody">
            <div>
                <h1>相关性矩阵</h1>
                <p>无线，无繁琐，<br>
                    只有妙不可言。</p>
                <span>进一步了解 ></span>
                <!-- <img src="../imgs/CorrelationMatrix.png" alt=""> -->
                <HeatMap :tableData="tableData" class="HeatMap"/>

            </div>
            <div>
                <h1>实际风速和实际功率相关图</h1>
                <p>家的新声。</p>
                <span>进一步了解 ></span>
                <!-- <img src="../imgs/ROUOND(A.WS,1)_YD15.png" alt=""> -->
                <ScatterPlot :tableData="tableData" class="ScatterPlot" />
            </div>
        </div>
        <div class="diagrambody">
            <div>
                <h1>箱线图</h1>
                <p>你喜爱的音乐，<br>
                    随身带着走。</p>
                <span>进一步了解 ></span>
                <!-- <img src="../imgs/Boxplot.png" alt=""> -->
                <BoxPlot :tableData="tableData" class="BoxPlot"/>
            </div>
            <div>
                <h1>时序图</h1>
                <p>给好听的歌曲，<br>
                    搭个好看的装备。</p>
                <span>进一步了解 ></span>
                <!-- <img src="../imgs/SequenceDiagram.png" alt=""> -->
                <LineChart :tableData="tableData" class="LineChart"/>
            </div>
        </div>
    </div>
</template>
  
<script>
import ScatterPlot from './diagrams/ScatterPlot.vue';
import HeatMap from './diagrams/HeatMap.vue';
import LineChart from './diagrams/LineChart.vue';
import BoxPlot from './diagrams/BoxPlot.vue';

export default {
    props: {
        tableData: Array,
    },
    name: 'dataanalysis',
    components: {
        HeatMap, LineChart, BoxPlot, ScatterPlot
    }
}
</script>
  
<style lang='less' scoped>
.ScatterPlot {
    width: 800px;
    height: 600px;
}

@media only screen and (min-width: 800px) {
    .diagramcontainer {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .diagrambody {
            max-width: 1000px;
            display: flex;
            justify-content: space-between;
            padding: 20px 0;

            div {
                width: 48%;
                padding: 5%;
                background-color: rgb(250, 250, 250);
                height: 600px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                h1 {
                    font-size: 20px;
                    font-weight: 600;
                }

                p {
                    padding: 10px 0;
                    font-size: 40px;
                    font-weight: 600;
                }

                span {
                    color: rgb(12, 106, 205);
                    padding: 10px;
                }

                img {
                    margin-top: 30px;
                    width: 60%;
                    height: auto;
                }
            }
        }
    }
}

// 小于800px
@media only screen and (max-width: 800px) {
    ._diagramcontainer {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .diagrambody {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            // padding-top: 20px;
            background-color: white;

            div {
                width: 100%;
                background-color: rgb(250, 250, 250);
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top: 20px;

                h1 {
                    margin: 10px 0;
                    font-size: 5.333vw;
                    font-weight: 600;
                }

                p {
                    padding: 10px 0;
                    font-size: 15px;
                }

                span {
                    color: rgb(12, 106, 205);
                    padding: 1.333vw;
                }

                img {
                    margin-top: 30px;
                    width: 200px;
                    // height: 100%;
                }
            }
        }
    }
}
</style>