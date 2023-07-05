<template>
    <div id="centerDiv" class="mapcontainer">
        <Layout/>
        <mars-map :url="configUrl" @onload="onMapload" :options="mapOptions" />
        <div id="leftBar" class="sideBar left opacity0">
            <i id="leftClickSpan" class="iconfont opration-handler"
				aria-hidden="true" @click="hideLeftPanel">&#xe653;</i>
			<div class="bar-content" id="leftContent">
                
			</div>
		</div>

		<div id="RightBar" class="sideBar right opacity0">
			<i id="rightClickSpan" class="iconfont opration-handler"
				aria-hidden="true" @click="hideRightPanel">&#xe653;</i>
			<div class="bar-content" id="rightContent">
                
			</div>
		</div>

		<div id="BottomBar" class="bottomBar opacity0">
			<i id="bottomClickSpan" class="iconfont opration-handler"
				aria-hidden="true" @click="hideBottomPanel">&#xe601;</i>
			<div class="bar-content-bottom" id="bottomContent">
                
			</div>
		</div>
    </div>
</template>

<script>
import Layout from "./subcomponents/Header/index";
// import BaseField from './subcomponents/BaseField/index.vue'
// import ControlPanel from './subcomponents/widgets/ControlPanel'
// import ControlTurbine from './subcomponents/widgets/ControlTurbine'

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
                scene3Donly: false,
                fxaa: true,
                contextOptions: {
                    requestWebgl1: true
                }
            },
        }
        const windLayer = new mars3d.layer.WindLayer()
        const graphicLayer = new mars3d.layer.GraphicLayer()
        return {
            configUrl: basePathUrl + 'config/config.json',
            mapOptions: mapOptions,
            windLayer,
            graphicLayer,

            isLeftOpen: true,
            isRightOpen: true,
            isBottomOpen: true
        }
    },
    methods: {
        // 地图构造完成回调
        onMapload(map) {
            // 以下为演示代码
            // map.setCameraView({ lat: 20.648765, lng: 129.340334, alt: 19999976, heading: 355, pitch: -90 })
            this.addGraphic(map)
            // this.addLayer(map)
            setTimeout(function () {
                $(".sideBar.left").removeClass("opacity0").removeClass("fadeOutLeft").addClass("animated fadeInLeft")
                $(".sideBar.right").removeClass("opacity0").removeClass("fadeOutRight").addClass("animated fadeInRight")
                $(".bottomBar").removeClass("opacity0").removeClass("fadeOutDown").addClass("animated fadeInUp")
            }, 2000)
        },
        addLayer(map) {
            this.removeLayer(map)
            this.windLayer = new mars3d.layer.WindLayer({
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
            map.addLayer(this.windLayer)
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
        addGraphic(map) {
            const positions = [
                { lng: 112.257630577, lat: 39.0613382363999, alt: 1815 },
                // { lng: 112.219302206, lat: 39.0579481036999, alt: 1827 },
                // { lng: 112.226596341, lat: 39.0584773033999, alt: 1849 },
                // { lng: 112.22911174, lat: 39.0574840383999, alt: 1866 },
                // { lng: 112.215476722, lat: 39.0550566812, alt: 1866 },
                // { lng: 112.215643865, lat: 39.0532631538, alt: 1899 },
                // { lng: 112.219228645, lat: 39.0525930380999, alt: 1880 },
                // { lng: 112.234976033, lat: 39.0502488098, alt: 1926 },
                // { lng: 112.225661372999, lat: 39.0484097539999, alt: 1948 },
                // { lng: 112.209409737, lat: 39.0474211486, alt: 1910 },
                // { lng: 112.214894212, lat: 39.0464248147999, alt: 1983 },
                // { lng: 112.214022809, lat: 39.0436919592999, alt: 2036 },
                // { lng: 112.234492463, lat: 39.0413040158, alt: 2036 },
                // { lng: 112.213470676999, lat: 39.0381470684, alt: 2038 },
                // { lng: 112.210336836, lat: 39.039450506, alt: 2071 },
                // { lng: 112.231019662, lat: 39.0367113260999, alt: 2063 },
                // { lng: 112.21282611, lat: 39.045567662, alt: 2026 },
                // { lng: 112.2321147308, lat: 39.0439265946, alt: 2048 },
                // { lng: 112.216533, lat: 39.041840792, alt: 2056 },
                // { lng: 112.2322813848, lat: 39.0343489941, alt: 2075 },
                // { lng: 112.215573092, lat: 39.0307660108, alt: 2015 },
                // { lng: 112.220069655, lat: 39.0323883292, alt: 2022 },
                // { lng: 112.217448043999, lat: 39.0310627231, alt: 2021 },
                // { lng: 112.230322327, lat: 39.0281575923999, alt: 1965 }
            ]
            const arr = []
            positions.forEach((item) => {
                arr.push({
                    type: "modelP",
                    position: item,
                    style: {
                        url: "//data.mars3d.cn/gltf/mars/fengche.gltf",
                        scale: 100,
                        heading: 315,
                        minimumPixelSize: 30,
                        clampToGround: true
                    }
                })
            })
            // 创建gltf模型
            this.graphicLayer = new mars3d.layer.GraphicLayer({
                name: "风力发电机",
                data: arr,
                center: { lat: 39.016487, lng: 112.262087, alt: 3500, heading: 313, pitch: -22, roll: 0 },
                flyTo: false
            })
            map.addLayer(this.graphicLayer)

            // 绑定事件
            this.graphicLayer.on(mars3d.EventType.click,function(event){
                map.setCameraView({"lat":39.066387,"lng":112.195926,"alt":3711.4,"heading":148.3,"pitch":-25.3})
            })
        },
        removeLayer(map) {
            map.trackedEntity = null
            if (this.graphicLayer) {
                map.removeLayer(this.graphicLayer, true)
                this.graphicLayer = null
            }
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
    border: 1px rgba(255, 255, 255, 0.5) solid;
    border-radius: 5px;
    // background-color: transparent;
    box-shadow: 0 10px 100px 0 rgba(1, 48, 102, 0.8) inset;
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
.bottomBar {
    position: absolute;
    bottom: 0;
    left: 22%;
    right: 22%;
    height: 30%;
    border: 1px rgba(255, 255, 255, 0.5) solid;
    border-radius: 5px;
    // background-color: transparent;
    box-shadow: 0 10px 100px 0 rgba(1, 48, 102, 0.8) inset;
    -webkit-transition: all 1000ms ease-in-out;
    -moz-transition: all 1000ms ease-in-out;
    -o-transition: all 1000ms ease-in-out;
    transition: all 1000ms ease-in-out;
}
.sideBar.left > .opration-handler {
    color: #20B0CB;
    right: -4px;
    position: absolute;
    top: 49%;
    cursor: pointer;
    z-index: 9999;
    font-size: 24px;
}
.sideBar.right > .opration-handler {
    color: #20B0CB;
    left: -4px;
    position: absolute;
    top: 49%;
    cursor: pointer;
    z-index: 9999;
    font-size: 24px;
}
.bottomBar > .opration-handler {
    color: #20B0CB;
    top: -5px;
    position: absolute;
    left: 49%;
    cursor: pointer;
    z-index: 9999;
    font-size: 24px;
}
.sideBar.left > .opration-handler:focus, .sideBar.left > .opration-handler:hover {
    color: rgba(255, 255, 255, 1.0);
}
.sideBar.right > .opration-handler:focus, .sideBar.right > .opration-handler:hover {
    color: rgba(255, 255, 255, 1.0);
}
.bottomBar > .opration-handler:focus, .bottomBar > .opration-handler:hover {
    color: rgba(255, 255, 255, 1.0);
}
</style>
