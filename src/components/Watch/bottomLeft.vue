<template>
    <div id="bottomLeft">
        <div class="bg-color-black">
            <div class="d-flex pt-2 pl-2">
                <div class="d-flex">
                    <span class="fs-xl text mx-2">功率曲线</span>
                </div>
            </div>
            <div>
                <BottomLeftChart />
            </div>
        </div>
    </div>
</template>

<script>
import BottomLeftChart from '@/components/Watch/subcomponents/bottomLeftChart'
export default {
    components: {
        BottomLeftChart
    }
}
</script>

<style lang="scss" scoped>
$box-height: 100%;
$box-width: 100%;

#bottomLeft {
    padding: 10px 8px;
    height: $box-height;
    width: $box-width;
    border-radius: 5px;

    .bg-color-black {
        height: $box-height;
        border-radius: 10px;
    }

    .text {
        color: #c3cbde;
    }
}
</style>
