<template>
    <div class="wrap">
        <!-- <div class="loading-container" v-if="loadingVisible">
            <loading></loading>
            <div class="tips">
                <div>模型加载中,请耐心等待</div>
                <div>已加载{{ percent.toFixed(2) }}%</div>
            </div>
        </div> -->
        <t_renderer :size="size">
            <t_camera></t_camera>
            <t_scene></t_scene>
            <t_controls></t_controls>
            <t_light></t_light>
            <t_light></t_light>
            <!-- <t-raycaster></t-raycaster> -->
            <TTurebine @progress="progress"></TTurebine>
        </t_renderer>
    </div>
</template>
<script>
import * as THREE from "three";
import t_renderer from './TRenderer/src/index';
import t_camera from './TCamera/src/index';
import t_scene from './TScene/src/index';
import t_controls from './TControls/src/index';
import t_light from './TLight/src/index';
import TTurebine from './TTurebine/src/index';
THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);
export default {
    components: {
        t_renderer,
        t_camera,
        t_scene,
        t_controls,
        t_light,
        TTurebine
    },
    data() {
        return {
            statsDom: this.$refs.stats,
            size: {
                w: window.innerWidth,
                h: window.innerHeight,
            },
            eleRoutes: [],
            tower: [],
            mapLoaded: false,
            turbineLoaded: false,
            percent: 0,
            loadingVisible: true
        };
    },
    props: {
        turbineMsg: Array,
    },
    computed: {},
    methods: {
        progress(percent) {
            this.percent = percent;
            // console.log(percent)
            if(percent === 100){
                this.loadingVisible = false
            }
        },
    },
    mounted() {},
};
</script>
<style>
* {
    padding: 0;
    margin: 0;
}
.wrap {
    width: 100vw;
    height: 100vh;
}
#stats {
    display: flex;
}
#stats canvas:not(:last-child) {
    display: block !important;
    margin-top: 8px;
    margin-left: 8px;
}
#stats canvas:last-child {
    display: none !important;
}
</style>
<style lang='scss' scoped>
#container {
    width: 100%;
    height: 100%;
    background-color: #212121;
}
// .loading-container {
//     width: 100vw;
//     height: 100vh;
//     position: fixed;
//     z-index: 999999;
//     background-color: #0000007a;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     flex-direction: column;
//     .tips {
//         margin-top: 10px;
//         div {
//             color: #fff;
//             font-size: 20px;
//             font-weight: bold;
//             line-height: 40px;
//         }
//     }
// }
</style>