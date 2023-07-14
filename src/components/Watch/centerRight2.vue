<template>
    <div id="centerRight2">
        <div class="bg-color-black">
            <div class="d-flex pt-2 pl-2">
                <span class="fs-xl text mx-2">风机发电量</span>
            </div>
            <div class="d-flex flex-column body-box">
                <centerRight2Chart1 />
            </div>
        </div>
    </div>
</template>

<script>
import centerRight2Chart1 from '@/components/Watch/subcomponents/centerRightChart'

export default {
    data() {
        return {
        }
    },
    components: { centerRight2Chart1 }
}
</script>

<style lang="scss" scoped>
#centerRight2 {
    $box-height: 100%;
    $box-width: 100%;
    height: $box-height;
    width: $box-width;
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

    }
}
</style>
  