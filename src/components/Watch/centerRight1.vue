<template>
    <div id="centerRight1">
        <div class="bg-color-black">
            <div class="d-flex pt-2 pl-2">
                <div class="d-flex">
                    <span class="fs-xl text mx-2">滚动预测屏</span>
                </div>
            </div>
            <div class="d-flex body-box">
                <dv-scroll-board class="dv-scr-board" :config="config" ref="scrollBoard" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import rawData from '@/assets/testJson/11.json'
export default {
    data() {
        return {
            config: {
                header: ['DATATIME', 'A.POWER', 'YD15'],
                data: [
                    ['4/2 0:00', '17959', "13819"],
                    ['4/2 0:15', '25930', "20435"],
                    ['4/2 0:30', '31287', "25376"],
                    ['4/2 0:45', '32626', "25669"],
                    ['4/2 1:00', '24645', "24036"],
                    ['4/2 1:15', '13230', "17085"],
                    ['4/2 1:30', '4200', "4606"],
                    ['4/2 1:45', '30', "0"],
                    ['4/2 2:00', '206', "0"],
                    ['4/2 2:15', '-223', "-754"]
                ],
                rowNum: 5, //表格行数
                headerHeight: 20,
                headerBGC: '#0f1325', //表头
                oddRowBGC: '#0f1325', //奇数行
                evenRowBGC: '#171c33', //偶数行
                index: false,
                columnWidth: 750,
                align: 'center'
            },
            curData: Array
        }
    },
    mounted() {
        this.setData()
    },
    watch: {
        processedJsonData: {
            handler(newData) {
                this.setData();
            },
            deep: true
        }
    },
    computed: {
        ...mapState('global', ['processedJsonData']),
    },
    methods: {
        setData() {
            if (this.$store.state.global.processedJsonData.length == 0) {
                this.curData = JSON.parse(JSON.stringify(rawData))
            } else {
                this.curData = this.$store.state.global.processedJsonData.slice(0, 672);
            }
            this.config.data = []
            for (let i = 0; i < this.curData.length; i++) {
                this.config.data.push([this.curData[i].DATATIME,this.curData[i].APOWER,this.curData[i].YD15])
            }
            this.config = { ...this.config };
        }
    }
}
</script>

<style lang="scss" scoped>
$box-height: 100%;
$box-width: 100%;

#centerRight1 {
    padding: 16px 16px 0 16px;
    padding-top: 10px;
    border-radius: 5px;

    .bg-color-black {
        height: $box-height;
        width: $box-width;
        border-radius: 10px;
    }

    .text {
        color: #c3cbde;
    }

    .body-box {
        border-radius: 10px;
        width: 100%;
        height: 100%;
        margin: 0px auto;

        .dv-scr-board {
            height: 200px;
            overflow: hidden;
        }
    }
}
</style>
