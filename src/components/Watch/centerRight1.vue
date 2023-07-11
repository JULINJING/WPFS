<template>
    <div id="centerRight1">
        <div class="bg-color-black">
            <div class="d-flex pt-2 pl-2">
                <span>
                    <icon name="chart-line" class="text-icon"></icon>
                </span>
                <div class="d-flex">
                    <span class="fs-xl text mx-2">滚动预测屏</span>
                </div>
            </div>
            <div class="d-flex jc-center body-box">
                <dv-scroll-board class="dv-scr-board" :config="config" />
            </div>
        </div>
    </div>
</template>

<script>
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
                rowNum: 7, //表格行数
                headerHeight: 35,
                headerBGC: '#0f1325', //表头
                oddRowBGC: '#0f1325', //奇数行
                evenRowBGC: '#171c33', //偶数行
                index: false,
                columnWidth: [100, 100, 100],
                align: 'center'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
$box-height: 410px;
$box-width: 100%;

#centerRight1 {
    padding: 16px;
    padding-top: 20px;
    height: $box-height;
    width: $box-width;
    border-radius: 5px;

    .bg-color-black {
        height: $box-height - 30px;
        border-radius: 10px;
    }

    .text {
        color: #c3cbde;
    }

    .body-box {
        border-radius: 10px;
        overflow: hidden;

        .dv-scr-board {
            width: 350px;
            height: 340px;
        }
    }
}
</style>
