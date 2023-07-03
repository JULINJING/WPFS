<template>
    <div ref="container" class="base-field">
        <div class="base-field-left">
        <div class="map-panels">
            <slot name="left"> </slot>
        </div>
        <div class="map-controls">
            <slot name="control"> </slot>
        </div>
        </div>
        <div class="base-field-right">
        <div class="map-panels">
            <slot name="right"></slot>
        </div>
        </div>
    </div>
</template>
<script setup lang="ts">

</script>
<style lang="scss" scoped>
.base-field {
    width: 100%;
    height: 100%;

    .base-field-left,
    .base-field-right {
        position: absolute;
        top: 70px;
        z-index: 999;
        display: flex;
        grid-gap: 10px;
        height: calc(100% - 90px);
        transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);

        &.base-field-left {
            left: 10px;
        }

        &.base-field-right {
            right: 10px;
        }

        .map-panels {
            display: grid;
            grid-template-rows: repeat(3, 1fr);
            grid-gap: 10px;
            height: 100%;
            overflow: hidden;
        }
    }

    .map-controls {
        display: flex;
        flex-direction: column;
        grid-gap: 10px;
    }
}
</style>
