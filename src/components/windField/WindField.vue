<template>
    <div id="centerDiv" class="mapcontainer">
        <Layout />
        <mars-map :url="configUrl" @onload="onMapload" :options="mapOptions" />
        <div id="leftBar" class="sideBar left opacity0">
            <i id="leftClickSpan" class="iconfont opration-handler" aria-hidden="true" @click="hideLeftPanel">&#xe653;</i>
            <div class="bar-content" id="leftContent">
                <el-row>
                    <el-button plain @click="chargeWindField">显示/关闭风场</el-button>
                </el-row>
                <el-row>
                    <el-button plain @click="addTurbineLayer(1)">东部</el-button>
                </el-row>
                <el-row>
                    <el-button plain @click="addTurbineLayer(2)">西部</el-button>
                </el-row>
                <el-row>
                    <el-button plain @click="addTurbineLayer(3)">南部</el-button>
                </el-row>
                <el-row>
                    <el-button plain @click="addTurbineLayer(4)">北部</el-button>
                </el-row>
            </div>
        </div>

        <div id="RightBar" class="sideBar right opacity0">
            <i id="rightClickSpan" class="iconfont opration-handler" aria-hidden="true" @click="hideRightPanel">&#xe653;</i>
            <div class="bar-content" id="rightContent">

            </div>
        </div>

        <div id="BottomBar" class="bottomBar opacity0">
            <i id="bottomClickSpan" class="iconfont opration-handler" aria-hidden="true"
                @click="hideBottomPanel">&#xe601;</i>
            <div class="bar-content-bottom" id="bottomContent">

            </div>
        </div>
    </div>
</template>

<script>
import Layout from "./subcomponents/Header/index";

import MarsMap from "./mars-work/mars-map.vue"
import * as mars3d from 'mars3d'
import $ from 'jquery'

const Cesium = mars3d.Cesium

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Index',

    components: {
        MarsMap,
        Layout,
        // BaseField
    },

    data() {
        const basePathUrl = window.basePathUrl || ' '
        const mapOptions = {
            scene: {
                center: { lat: 20.648765, lng: 129.340334, alt: 19999976, heading: 355, pitch: -89 },
                scene3Donly: true,
                fxaa: false,
                contextOptions: {
                    requestWebgl1: true
                }
            },
        }
        const windLayer = new mars3d.layer.WindLayer()
        const turbineLayer = new mars3d.layer.GraphicLayer()
        return {
            configUrl: basePathUrl + 'config/config.json',
            mapOptions: mapOptions,
            windLayer,
            turbineLayer,

            // 记录面板展开状态
            isLeftOpen: true,
            isRightOpen: true,
            isBottomOpen: true
        }
    },
    methods: {
        // 地图构造完成回调
        onMapload() {
            this.map.setCameraView({ lat: 20.648765, lng: 129.340334, alt: 19999976, heading: 355, pitch: -90 })

            this.addWindLayer()
            setTimeout(function () {
                $(".sideBar.left").removeClass("opacity0").removeClass("fadeOutLeft").addClass("animated fadeInLeft")
                $(".sideBar.right").removeClass("opacity0").removeClass("fadeOutRight").addClass("animated fadeInRight")
                $(".bottomBar").removeClass("opacity0").removeClass("fadeOutDown").addClass("animated fadeInUp")
            }, 3000)
        },
        addWindLayer() {
            this.windLayer = new mars3d.layer.WindLayer({
                name: '风场',
                particlesNumber: 9000,
                fadeOpacity: 0.996,
                dropRate: 0.003,
                dropRateBump: 0.01,
                speedFactor: 0.2,
                lineWidth: 4.0,
                // 色带配置
                color: [
                    "rgb(4,14,216)"
                ]
            })
            this.map.addLayer(this.windLayer)
            this.loadNetCDF("/weather/wind.nc").then((data) => {
                this.windLayer.setData(data)
            })
        },
        loadNetCDF(filepath) {
            return new Promise(function (resolve) {
                const request = new XMLHttpRequest()
                request.open("GET", filepath)
                request.responseType = "arraybuffer"

                request.onload = function () {
                    const arrayToMap = function (array) {
                        return array.reduce(function (map, object) {
                            map[object.name] = object
                            return map
                        }, {})
                    }

                    // eslint-disable-next-line new-cap
                    const NetCDF = new netcdfjs(request.response)
                    const variables = arrayToMap(NetCDF.variables)
                    const uAttributes = arrayToMap(variables.U.attributes)
                    const vAttributes = arrayToMap(variables.V.attributes)

                    const arrLon = NetCDF.getDataVariable("lon").flat()
                    const arrLat = NetCDF.getDataVariable("lat").flat()
                    const arrU = NetCDF.getDataVariable("U").flat()
                    const maxU = uAttributes.max.value
                    const minU = uAttributes.min.value
                    const arrV = NetCDF.getDataVariable("V").flat()
                    const maxV = vAttributes.max.value
                    const minV = vAttributes.min.value

                    // 构造WindLayer类需要的格式数据
                    const result = {
                        xmin: Math.min(...arrLon),
                        xmax: Math.max(...arrLon),
                        ymin: Math.min(...arrLat),
                        ymax: Math.max(...arrLat),
                        rows: arrLat.length,
                        cols: arrLon.length,
                        udata: arrU,
                        vdata: arrV,
                        umin: minU,
                        umax: maxU,
                        vmin: minV,
                        vmax: maxV
                    }
                    resolve(result)
                }
                request.send()
            })
        },
        addTurbineLayer(id) {
            // 移除其余风机
            if (this.turbineLayer) {
                this.map.removeLayer(this.turbineLayer, true)
                this.turbineLayer = null
            }
            // id 东西南北分别为1 2 3 4
            var positions = []
            switch (id) {
                case 1:
                    positions = [
                        { lng: 122.124753 + (Math.random() - 0.5) / 1000, lat: 30.035441 + (Math.random() - 0.5) / 1000, alt: 1716.4 + (Math.random() - 0.5) },
                        { lng: 122.124753 + (Math.random() - 0.5) / 1000, lat: 30.035441 + (Math.random() - 0.5) / 1000, alt: 1716.4 + (Math.random() - 0.5) },
                        { lng: 122.124753 + (Math.random() - 0.5) / 1000, lat: 30.035441 + (Math.random() - 0.5) / 1000, alt: 1716.4 + (Math.random() - 0.5) },
                        { lng: 122.124753 + (Math.random() - 0.5) / 1000, lat: 30.035441 + (Math.random() - 0.5) / 1000, alt: 1716.4 + (Math.random() - 0.5) },
                        { lng: 122.124753 + (Math.random() - 0.5) / 1000, lat: 30.035441 + (Math.random() - 0.5) / 1000, alt: 1716.4 + (Math.random() - 0.5) },
                        { lng: 122.124753 + (Math.random() - 0.5) / 1000, lat: 30.035441 + (Math.random() - 0.5) / 1000, alt: 1716.4 + (Math.random() - 0.5) }
                    ]
                    break;
                case 2:
                    positions = [
                        { lng: 115.453 + (Math.random() - 0.5) / 1000, lat: 22.757 + (Math.random() - 0.5) / 1000, alt: 1676.8 + (Math.random() - 0.5) },
                        { lng: 115.453 + (Math.random() - 0.5) / 1000, lat: 22.757 + (Math.random() - 0.5) / 1000, alt: 1676.8 + (Math.random() - 0.5) },
                        { lng: 115.453 + (Math.random() - 0.5) / 1000, lat: 22.757 + (Math.random() - 0.5) / 1000, alt: 1676.8 + (Math.random() - 0.5) },
                        { lng: 115.453 + (Math.random() - 0.5) / 1000, lat: 22.757 + (Math.random() - 0.5) / 1000, alt: 1676.8 + (Math.random() - 0.5) },
                        { lng: 115.453 + (Math.random() - 0.5) / 1000, lat: 22.757 + (Math.random() - 0.5) / 1000, alt: 1676.8 + (Math.random() - 0.5) },
                        { lng: 115.453 + (Math.random() - 0.5) / 1000, lat: 22.757 + (Math.random() - 0.5) / 1000, alt: 1676.8 + (Math.random() - 0.5) }
                    ]
                    break;
                case 3:
                    positions = [
                        { lng: 102.597 + (Math.random() - 0.5) / 1000, lat: 37.316 + (Math.random() - 0.5) / 1000, alt: 3919.8 + (Math.random() - 0.5) },
                        { lng: 102.597 + (Math.random() - 0.5) / 1000, lat: 37.316 + (Math.random() - 0.5) / 1000, alt: 3919.8 + (Math.random() - 0.5) },
                        { lng: 102.597 + (Math.random() - 0.5) / 1000, lat: 37.316 + (Math.random() - 0.5) / 1000, alt: 3919.8 + (Math.random() - 0.5) },
                        { lng: 102.597 + (Math.random() - 0.5) / 1000, lat: 37.316 + (Math.random() - 0.5) / 1000, alt: 3919.8 + (Math.random() - 0.5) },
                        { lng: 102.597 + (Math.random() - 0.5) / 1000, lat: 37.316 + (Math.random() - 0.5) / 1000, alt: 3919.8 + (Math.random() - 0.5) },
                        { lng: 102.597 + (Math.random() - 0.5) / 1000, lat: 37.316 + (Math.random() - 0.5) / 1000, alt: 3919.8 + (Math.random() - 0.5) },
                    ]
                    break;
                default:
                    positions = [
                        { lng: 112.219 + (Math.random() - 0.5) / 1000, lat: 39.057 + (Math.random() - 0.5) / 1000, alt: 1827 + (Math.random() - 0.5) },
                        { lng: 112.219 + (Math.random() - 0.5) / 1000, lat: 39.057 + (Math.random() - 0.5) / 1000, alt: 1827 + (Math.random() - 0.5) },
                        { lng: 112.219 + (Math.random() - 0.5) / 1000, lat: 39.057 + (Math.random() - 0.5) / 1000, alt: 1827 + (Math.random() - 0.5) },
                        { lng: 112.219 + (Math.random() - 0.5) / 1000, lat: 39.057 + (Math.random() - 0.5) / 1000, alt: 1827 + (Math.random() - 0.5) },
                        { lng: 112.219 + (Math.random() - 0.5) / 1000, lat: 39.057 + (Math.random() - 0.5) / 1000, alt: 1827 + (Math.random() - 0.5) },
                        { lng: 112.219 + (Math.random() - 0.5) / 1000, lat: 39.057 + (Math.random() - 0.5) / 1000, alt: 1827 + (Math.random() - 0.5) }
                    ]
            }
            const arr = []
            positions.forEach((item) => {
                arr.push({
                    type: "modelP",
                    position: item,
                    maximumScreenSpaceError: 16,
                    maximumMemoryUsage: 1024,
                    style: {
                        url: "//data.mars3d.cn/gltf/mars/fengche.gltf",
                        scale: 100,
                        heading: Math.random() * 360,
                        minimumPixelSize: 30,
                        clampToGround: true
                    }
                })
            })
            // 创建gltf模型
            this.turbineLayer = new mars3d.layer.GraphicLayer({
                name: "风力发电机",
                data: arr,
                // center: { "lat": 39.087905, "lng": 112.193672, "alt": 3719.2, "heading": 148.3, "pitch": -25.3 },
                flyTo: false
            })
            this.map.addLayer(this.turbineLayer)

            // 根据各部位置飞行
            switch (id) {
                case 1:
                    this.map.setCameraView({ "lat": 30.035441, "lng": 122.124753, "alt": 2716.4, "heading": 148.3, "pitch": -25.3 })
                    break;
                case 2:
                    this.map.setCameraView({ "lat": 22.757, "lng": 115.453, "alt": 2676.8, "heading": 148.3, "pitch": -25.3 })
                    break;
                case 3:
                    this.map.setCameraView({ "lat": 37.316, "lng": 102.597, "alt": 4919.8, "heading": 148.3, "pitch": -25.3 })
                    break;
                default:
                    this.map.setCameraView({ "lat": 39.057, "lng": 112.219, "alt": 1827, "heading": 148.3, "pitch": -25.3 })
            }
            // 绑定事件
            this.turbineLayer.on(mars3d.EventType.click, () => {
                // 相机视角定位至风机群
                this.map.setCameraView({ "lat": 39.091073, "lng": 112.19958, "alt": 3720.4, "heading": 148.3, "pitch": -25.3 })
                // 删除风场图层
                // 跟踪相机实例
                this.map.trackedEntity = null
                if (this.windLayer) {
                    this.map.removeLayer(this.windLayer, true)
                    this.windLayer = null
                }
            })
        },
        chargeWindField() {
            if (!this.windLayer) {
                this.addWindLayer()
            }
            else {
                this.map.removeLayer(this.windLayer, true)
                this.windLayer = null
            }
        },
        showEasternTurbine() {
            
        },

        hideLeftPanel() {
            this.isLeftOpen = !this.isLeftOpen
            if (this.isLeftOpen == false) {
                $(".sideBar.left").removeClass("fadeInLeft").addClass("fadeOutLeft")
                $(".sideBar.left").removeClass("fadeOutLeft").css({
                    "width": "1%",
                    "display": "block",
                    "opacity": "1",
                    "box-shadow": "none",
                    "background-color": "rgba(1, 48, 102, 0.8)"
                })
            }
            else {
                $(".sideBar.left").addClass("fadeInLeft")
                $(".sideBar.left").css({
                    "width": "20%",
                    "opacity": "0",
                    "box-shadow": "0 10px 100px 0 rgba(1, 48, 102, 0.8) inset",
                    "background-color": "transparent"
                })
            }
        },
        hideRightPanel() {
            this.isRightOpen = !this.isRightOpen
            if (this.isRightOpen == false) {
                $(".sideBar.right").removeClass("fadeInRight").addClass("fadeOutRight")
                $(".sideBar.right").removeClass("fadeOutRight").css({
                    "width": "1%",
                    "display": "block",
                    "opacity": "1",
                    "box-shadow": "none",
                    "background-color": "rgba(1, 48, 102, 0.8)"
                })
            }
            else {
                $(".sideBar.right").addClass("fadeInRight")
                $(".sideBar.right").css({
                    "width": "20%",
                    "opacity": "0",
                    "box-shadow": "0 10px 100px 0 rgba(1, 48, 102, 0.8) inset",
                    "background-color": "transparent"
                })
            }
        },
        hideBottomPanel() {
            this.isBottomOpen = !this.isBottomOpen
            if (this.isBottomOpen == false) {
                $(".bottomBar").removeClass("fadeInUp").addClass("fadeOutDown")
                $(".bottomBar").removeClass("fadeOutDown").css({
                    "height": "1.5%",
                    "display": "block",
                    "opacity": "1",
                    "box-shadow": "none",
                    "background-color": "rgba(1, 48, 102, 0.8)",
                    "left": "1%",
                    "right": "1%"
                })
            }
            else {
                $(".bottomBar").addClass("fadeInUp")
                $(".bottomBar").css({
                    "height": "30%",
                    "left": "22%",
                    "right": "22%",
                    "opacity": "0",
                    "box-shadow": "0 10px 100px 0 rgba(1, 48, 102, 0.8) inset",
                    "background-color": "transparent"
                })
            }
        },
    }
}

</script>

<style lang="less" scoped>
// 大于800px
@media only screen and (min-width: 800px) {}

// 小于800px
@media only screen and (max-width: 800px) {}
.mapcontainer {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
}

.opacity0 {
    filter: alpha(opacity=0);
    -webkit-opacity: 0;
    -moz-opacity: 0;
    opacity: 0;
}

/* Bar */
.sideBar {
    position: absolute;
    top: 6vh;
    bottom: 0px;
    max-width: 320px;
    width: 20%;
    height: 100%;
    border: 1px rgba(255, 255, 255, 0.5) solid;
    border-radius: 5px;
    // background-color: transparent;
    box-shadow: 0 10px 100px 0 rgba(23, 49, 71, 0.8) inset;
    -webkit-transition: all 1000ms ease-in-out;
    -moz-transition: all 1000ms ease-in-out;
    -o-transition: all 1000ms ease-in-out;
    transition: all 1000ms ease-in-out;
}

.sideBar.left {
    left: 0;
}

.sideBar.right {
    right: 0;
}

.bar-content {
    display: flex;
    flex-direction: column;
    height: 94%;
    justify-content: space-around;
}

.bottomBar {
    position: absolute;
    bottom: 0;
    left: 22%;
    right: 22%;
    width: 56%;
    height: 30%;
    border: 1px rgba(255, 255, 255, 0.5) solid;
    border-radius: 5px;
    // background-color: transparent;
    box-shadow: 0 10px 100px 0 rgba(23, 49, 71, 0.8) inset;
    -webkit-transition: all 1000ms ease-in-out;
    -moz-transition: all 1000ms ease-in-out;
    -o-transition: all 1000ms ease-in-out;
    transition: all 1000ms ease-in-out;
}

.sideBar.left>.opration-handler {
    color: #20B0CB;
    right: -4px;
    position: absolute;
    top: 49%;
    cursor: pointer;
    z-index: 9999;
    font-size: 24px;
}

.sideBar.right>.opration-handler {
    color: #20B0CB;
    left: -4px;
    position: absolute;
    top: 49%;
    cursor: pointer;
    z-index: 9999;
    font-size: 24px;
}

.bottomBar>.opration-handler {
    color: #20B0CB;
    top: -5px;
    position: absolute;
    left: 49%;
    cursor: pointer;
    z-index: 9999;
    font-size: 24px;
}

.sideBar.left>.opration-handler:focus,
.sideBar.left>.opration-handler:hover {
    color: rgba(255, 255, 255, 1.0);
}

.sideBar.right>.opration-handler:focus,
.sideBar.right>.opration-handler:hover {
    color: rgba(255, 255, 255, 1.0);
}

.bottomBar>.opration-handler:focus,
.bottomBar>.opration-handler:hover {
    color: rgba(255, 255, 255, 1.0);
}


.el-button {
    width: 70%;
    background-color: rgba(0,183,254,0.5);
    border: none;
    font-size: 16px;
    font-weight: 800;
    color: white;
}
.el-button:hover,
.el-button:active {
    background-color: #20B0CB;
    color: white
}
.el-button:focus {
    background-color: rgba(0,183,254,0.5);
    color: white;
}
</style>
