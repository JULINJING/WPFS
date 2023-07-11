<template>
    <div id="centerLeft1">
        <div class="bg-color-black">
            <div class="d-flex pt-2 pl-2">
                <span>
                    <icon name="chart-bar" class="text-icon"></icon>
                </span>
                <div class="d-flex">
                    <span class="fs-xl text mx-2">设备运行统计</span>
                    <dv-decoration-3 class="dv-dec-3" />
                </div>
            </div>
            <div class="d-flex jc-center">
                <CenterLeft1Chart />
            </div>
            
        </div>
    </div>
</template>

<script>
import CenterLeft1Chart from '@/components/Watch/subcomponents/centerLeft1Chart'
export default {
    data() {
        return {
        }
    },
    components: {
        CenterLeft1Chart
    },
    mounted() {
    },
    methods: {
    }
}
</script>

<style lang="scss" scoped>
$box-width: 100%;
$box-height: 410px;

#centerLeft1 {
    padding: 16px;
    height: $box-height;
    width: $box-width;
    border-radius: 10px;

    .bg-color-black {
        height: $box-height - 30px;
        border-radius: 10px;
    }

    .text {
        color: #c3cbde;
    }

    .dv-dec-3 {
        position: relative;
        width: 100px;
        height: 20px;
        top: -3px;
    }

}
</style>