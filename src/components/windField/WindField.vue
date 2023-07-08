<template>
    <div id="centerDiv" class="mapcontainer">
        <el-result title="抱歉" subTitle="为获得最佳体验，请使用PC端查看">
            <template slot="icon">
                <el-image :src="require('./imgs/PC端提示.png')" fit="cover"></el-image>
            </template>
            <template slot="extra">
                <el-button type="primary" size="medium" @click="backToHome">返回主页</el-button>
            </template>
        </el-result>
        <div id="PC">
            <Layout />
            <mars-map :url="configUrl" @onload="onMapload" :options="mapOptions" />
            <div id="leftBar" class="sideBar left opacity0">
                <i id="leftClickSpan" class="iconfont opration-handler" aria-hidden="true" @click="hideLeftPanel">&#xe653;</i>
                <div class="bar-content" id="leftContent">

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
                    <el-row>
                        <el-button plain @click="backToHome">返回主页</el-button>
                    </el-row>
                    <el-row>
                        <el-button plain @click="chargeWindField">显示 / 关闭风场</el-button>
                    </el-row>
                    <el-row>
                        <el-button plain @click="addTurbineLayer(1)">东部</el-button>
                    </el-row>
                    <el-row>
                        <el-button plain @click="addTurbineLayer(2)">南部</el-button>
                    </el-row>
                    <el-row>
                        <el-button plain @click="addTurbineLayer(3)">西部</el-button>
                    </el-row>
                    <el-row>
                        <el-button plain @click="addTurbineLayer(4)">北部</el-button>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Layout from "./subcomponents/Header/index";

import MarsMap from "./mars-work/mars-map.vue"
import * as mars3d from 'mars3d'
import $ from 'jquery'
import { CanvasBillboard } from "../../../public/lib/custom/CanvasBillboard.js"

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
        var windLayer = new mars3d.layer.WindLayer()
        
        return {
            configUrl: basePathUrl + 'config/config.json',
            mapOptions: mapOptions,
            windLayer,

            // 记录计时器ID
            intervalId: null,

            // 记录面板展开状态
            isLeftOpen: true,
            isRightOpen: true,
            isBottomOpen: true
        }
    },
    methods: {
        // 地图构造完成回调
        onMapload() {
            // 开场
            this.map.openFlyAnimation()
            this.map.setCameraView({ lat: 20.648765, lng: 129.340334, alt: 19999976, heading: 355, pitch: -90 })
            this.map.scene.globe.terrainExaggeration = 2 // 修改地形夸张程度

            this.addWindLayer()
            setTimeout(function () {
                $(".sideBar.left").removeClass("opacity0").removeClass("fadeOutLeft").addClass("animated fadeInLeft")
                $(".sideBar.right").removeClass("opacity0").removeClass("fadeOutRight").addClass("animated fadeInRight")
                $(".bottomBar").removeClass("opacity0").removeClass("fadeOutDown").addClass("animated fadeInUp")
            }, 2000)
        },
        addWindLayer() {
            this.windLayer = new mars3d.layer.WindLayer({
                id: '风场',
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
            // 清除计时器
            if (this.intervalId !== null) {
                // 如果已经有一个正在运行的定时器，停止它
                clearInterval(this.intervalId);
                this.intervalId = null;
            }

            // 移除其余风机
            if (this.map.getLayerById("风机") && this.map.getLayerById("功率")) {
                this.map.removeLayer(this.map.getLayerById("风机"), true)
                this.map.removeLayer(this.map.getLayerById("功率"), true)
            }

            // // 根据各部位置飞行
            // switch (id) {
            //     case 1:
            //         this.map.setCameraView({"lat":30.041168,"lng":122.314148,"alt":2119.8,"heading":268.8,"pitch":-15.9})
            //         break;
            //     case 2:
            //         this.map.setCameraView({"lat":22.744186,"lng":115.511764,"alt":1452.2,"heading":333.2,"pitch":-11.8})
            //         break;
            //     case 3:
            //         this.map.setCameraView({"lat":37.344724,"lng":102.669323,"alt":9359.2,"heading":242.8,"pitch":-19.5})
            //         break;
            //     default:
            //         this.map.setCameraView({"lat":39.101415,"lng":112.188214,"alt":5648,"heading":148.1,"pitch":-24})
            // }

            // id 东南西北分别为1 2 3 4
            // 确定风机位置以及视点飞行路径
            var positions = []
            var viewPoints = []
            switch (id) {
                case 1:
                    positions = [
                        { lng: 122.243398 + ( Math.random() - 0.5 ) / 20, lat: 30.037948 + ( Math.random() - 0.5 ) / 20, alt: 1716.4 + Math.random() },
                        { lng: 122.243398 + ( Math.random() - 0.5 ) / 20, lat: 30.037948 + ( Math.random() - 0.5 ) / 20, alt: 1716.4 + Math.random() },
                        { lng: 122.243398 + ( Math.random() - 0.5 ) / 20, lat: 30.037948 + ( Math.random() - 0.5 ) / 20, alt: 1716.4 + Math.random() },
                        { lng: 122.243398 + ( Math.random() - 0.5 ) / 20, lat: 30.037948 + ( Math.random() - 0.5 ) / 20, alt: 1716.4 + Math.random() },
                        { lng: 122.243398 + ( Math.random() - 0.5 ) / 20, lat: 30.037948 + ( Math.random() - 0.5 ) / 20, alt: 1716.4 + Math.random() },
                        { lng: 122.243398 + ( Math.random() - 0.5 ) / 20, lat: 30.037948 + ( Math.random() - 0.5 ) / 20, alt: 1716.4 + Math.random() },
                        { lng: 122.243398 + ( Math.random() - 0.5 ) / 20, lat: 30.037948 + ( Math.random() - 0.5 ) / 20, alt: 1716.4 + Math.random() },
                        { lng: 122.243398 + ( Math.random() - 0.5 ) / 20, lat: 30.037948 + ( Math.random() - 0.5 ) / 20, alt: 1716.4 + Math.random() },
                        { lng: 122.243398 + ( Math.random() - 0.5 ) / 20, lat: 30.037948 + ( Math.random() - 0.5 ) / 20, alt: 1716.4 + Math.random() },
                        { lng: 122.243398 + ( Math.random() - 0.5 ) / 20, lat: 30.037948 + ( Math.random() - 0.5 ) / 20, alt: 1716.4 + Math.random() },
                    ]
                    viewPoints = [
                        { "lat": 30.041168, "lng": 122.314148, "alt": 2119.8, "heading": 268.8, "pitch": -15.9, duration: 3 },
                        { "lat": 30.029833, "lng": 122.178014, "alt": 2100.6, "heading": 75.6, "pitch": -17.5, duration: 6 },
                        { "lat": 30.021059, "lng": 122.304282, "alt": 2110.5, "heading": 282.3, "pitch": -14.9, duration: 6 },
                        { "lat": 30.041168, "lng": 122.314148, "alt": 2119.8, "heading": 268.8, "pitch": -15.9, duration: 6 }
                    ]
                    break;
                case 2:
                    positions = [
                        { lng: 115.473181 + ( Math.random() - 0.5 ) / 20, lat: 22.807014 + ( Math.random() - 0.5 ) / 20, alt: 1676.8 + Math.random() },
                        { lng: 115.473181 + ( Math.random() - 0.5 ) / 20, lat: 22.807014 + ( Math.random() - 0.5 ) / 20, alt: 1676.8 + Math.random() },
                        { lng: 115.473181 + ( Math.random() - 0.5 ) / 20, lat: 22.807014 + ( Math.random() - 0.5 ) / 20, alt: 1676.8 + Math.random() },
                        { lng: 115.473181 + ( Math.random() - 0.5 ) / 20, lat: 22.807014 + ( Math.random() - 0.5 ) / 20, alt: 1676.8 + Math.random() },
                        { lng: 115.473181 + ( Math.random() - 0.5 ) / 20, lat: 22.807014 + ( Math.random() - 0.5 ) / 20, alt: 1676.8 + Math.random() },
                        { lng: 115.473181 + ( Math.random() - 0.5 ) / 20, lat: 22.807014 + ( Math.random() - 0.5 ) / 20, alt: 1676.8 + Math.random() },
                        { lng: 115.473181 + ( Math.random() - 0.5 ) / 20, lat: 22.807014 + ( Math.random() - 0.5 ) / 20, alt: 1676.8 + Math.random() },
                        { lng: 115.473181 + ( Math.random() - 0.5 ) / 20, lat: 22.807014 + ( Math.random() - 0.5 ) / 20, alt: 1676.8 + Math.random() },
                        { lng: 115.473181 + ( Math.random() - 0.5 ) / 20, lat: 22.807014 + ( Math.random() - 0.5 ) / 20, alt: 1676.8 + Math.random() },
                        { lng: 115.473181 + ( Math.random() - 0.5 ) / 20, lat: 22.807014 + ( Math.random() - 0.5 ) / 20, alt: 1676.8 + Math.random() }
                    ]
                    viewPoints = [
                        { "lat": 22.744186, "lng": 115.511764, "alt": 1452.2, "heading": 333.2, "pitch": -11.8, duration: 3 },
                        { "lat": 22.777821, "lng": 115.541255, "alt": 1454.2, "heading": 288.7, "pitch": -13.4, duration: 6 },
                        { "lat": 22.823162, "lng": 115.541673, "alt": 1456.6, "heading": 250.6, "pitch": -12.8, duration: 6 },
                        { "lat": 22.744186, "lng": 115.511764, "alt": 1452.2, "heading": 333.2, "pitch": -11.8, duration: 6 }
                    ]
                    break;
                case 3:
                    positions = [
                        { lng: 102.597753 + ( Math.random() - 0.5 ) / 20, lat: 37.316441 + ( Math.random() - 0.5 ) / 20, alt: 3919.8 + Math.random() },
                        { lng: 102.597753 + ( Math.random() - 0.5 ) / 20, lat: 37.316441 + ( Math.random() - 0.5 ) / 20, alt: 3919.8 + Math.random() },
                        { lng: 102.597753 + ( Math.random() - 0.5 ) / 20, lat: 37.316441 + ( Math.random() - 0.5 ) / 20, alt: 3919.8 + Math.random() },
                        { lng: 102.597753 + ( Math.random() - 0.5 ) / 20, lat: 37.316441 + ( Math.random() - 0.5 ) / 20, alt: 3919.8 + Math.random() },
                        { lng: 102.597753 + ( Math.random() - 0.5 ) / 20, lat: 37.316441 + ( Math.random() - 0.5 ) / 20, alt: 3919.8 + Math.random() },
                        { lng: 102.597753 + ( Math.random() - 0.5 ) / 20, lat: 37.316441 + ( Math.random() - 0.5 ) / 20, alt: 3919.8 + Math.random() },
                        { lng: 102.597753 + ( Math.random() - 0.5 ) / 20, lat: 37.316441 + ( Math.random() - 0.5 ) / 20, alt: 3919.8 + Math.random() },
                        { lng: 102.597753 + ( Math.random() - 0.5 ) / 20, lat: 37.316441 + ( Math.random() - 0.5 ) / 20, alt: 3919.8 + Math.random() },
                        { lng: 102.597753 + ( Math.random() - 0.5 ) / 20, lat: 37.316441 + ( Math.random() - 0.5 ) / 20, alt: 3919.8 + Math.random() },
                        { lng: 102.597753 + ( Math.random() - 0.5 ) / 20, lat: 37.316441 + ( Math.random() - 0.5 ) / 20, alt: 3919.8 + Math.random() },
                    ]
                    viewPoints = [
                        { "lat": 37.344724, "lng": 102.669323, "alt": 9359.2, "heading": 242.8, "pitch": -19.5, duration: 3 },
                        { "lat": 37.370147, "lng": 102.583486, "alt": 9357.4, "heading": 171.1, "pitch": -16, duration: 6 },
                        { "lat": 37.260906, "lng": 102.578152, "alt": 9353.4, "heading": 18.1, "pitch": -30.1, duration: 6 },
                        { "lat": 37.344724, "lng": 102.669323, "alt": 9359.2, "heading": 242.8, "pitch": -19.5, duration: 6 }
                    ]
                    break;
                default:
                    positions = [
                        { lng: 112.219753 + ( Math.random() - 0.5 ) / 20, lat: 39.057 + ( Math.random() - 0.5 ) / 20, alt: 1827 + Math.random() },
                        { lng: 112.219753 + ( Math.random() - 0.5 ) / 20, lat: 39.057 + ( Math.random() - 0.5 ) / 20, alt: 1827 + Math.random() },
                        { lng: 112.219753 + ( Math.random() - 0.5 ) / 20, lat: 39.057 + ( Math.random() - 0.5 ) / 20, alt: 1827 + Math.random() },
                        { lng: 112.219753 + ( Math.random() - 0.5 ) / 20, lat: 39.057 + ( Math.random() - 0.5 ) / 20, alt: 1827 + Math.random() },
                        { lng: 112.219753 + ( Math.random() - 0.5 ) / 20, lat: 39.057 + ( Math.random() - 0.5 ) / 20, alt: 1827 + Math.random() },
                        { lng: 112.219753 + ( Math.random() - 0.5 ) / 20, lat: 39.057 + ( Math.random() - 0.5 ) / 20, alt: 1827 + Math.random() },
                        { lng: 112.219753 + ( Math.random() - 0.5 ) / 20, lat: 39.057 + ( Math.random() - 0.5 ) / 20, alt: 1827 + Math.random() },
                        { lng: 112.219753 + ( Math.random() - 0.5 ) / 20, lat: 39.057 + ( Math.random() - 0.5 ) / 20, alt: 1827 + Math.random() },
                        { lng: 112.219753 + ( Math.random() - 0.5 ) / 20, lat: 39.057 + ( Math.random() - 0.5 ) / 20, alt: 1827 + Math.random() },
                        { lng: 112.219753 + ( Math.random() - 0.5 ) / 20, lat: 39.057 + ( Math.random() - 0.5 ) / 20, alt: 1827 + Math.random() }
                    ]
                    viewPoints = [
                        { "lat": 39.101415, "lng": 112.188214, "alt": 5648, "heading": 148.1, "pitch": -24, duration: 3 },
                        { "lat": 39.031555, "lng": 112.154211, "alt": 5642.6, "heading": 71.6, "pitch": -21.7, duration: 6 },
                        { "lat": 38.994278, "lng": 112.246046, "alt": 5647.8, "heading": 340.3, "pitch": -20.1, duration: 6 },
                        { "lat": 39.101415, "lng": 112.188214, "alt": 5648, "heading": 148.1, "pitch": -24, duration: 6 }
                    ]
            }

            //创建风机数据图层
            let turbineLayer = new mars3d.layer.GraphicLayer({ id: '风机' })
            this.map.addLayer(turbineLayer)
            // 创建功率数据图层
            let powerLayer = new mars3d.layer.GraphicLayer({ id: '功率' })
            this.map.addLayer(powerLayer)

            // 添加单个矢量数据
            positions.forEach((item, index) => {
                // 风机
                var turbineGraphic = new mars3d.graphic.ModelPrimitive({
                    id: index,
                    position: item,
                    style: {
                        url: '//data.mars3d.cn/gltf/mars/fengche.gltf',
                        heading: Math.random() * 360,
                        scale: 100,
                        minimumPixelSize: 30,
                        fill: true,
                        color: 'white',
                        clampToGround: true
                    },
                })
                turbineLayer.addGraphic(turbineGraphic)

                // 功率
                var powerGraphic = new mars3d.graphic.CanvasBillboard({
                    id: index + 10,
                    position: item,
                    style: {
                        text: ' ↻',
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        scaleByDistance: new Cesium.NearFarScalar(6000, 0.25,10000, 0.15),
                        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000),
                        clampToGround: true
                    }
                })
                powerLayer.addGraphic(powerGraphic)
            })

            // 视角切换（分步执行）
            this.map.setCameraViewList(viewPoints)

            // 随机更新功率文本
            this.intervalId = setInterval(() => {
                powerLayer.eachGraphic((graphic) => {
                    graphic.text = Math.random().toFixed(3) * 1000 // 更新文本
                })
            }, 2000)

            // 绑定点击风机事件
            turbineLayer.on(mars3d.EventType.click, () => {
                // 相机视角定位至风机群
                switch (id) {
                    case 1:
                        this.map.setCameraView({"lat":30.041168,"lng":122.314148,"alt":2119.8,"heading":268.8,"pitch":-15.9})
                        break;
                    case 2:
                        this.map.setCameraView({"lat":22.744186,"lng":115.511764,"alt":1452.2,"heading":333.2,"pitch":-11.8})
                        break;
                    case 3:
                        this.map.setCameraView({"lat":37.344724,"lng":102.669323,"alt":9359.2,"heading":242.8,"pitch":-19.5})
                        break;
                    default:
                        this.map.setCameraView({"lat":39.101415,"lng":112.188214,"alt":5648,"heading":148.1,"pitch":-24})
                }
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
                this.map.setCameraView({ lat: 20.648765, lng: 129.340334, alt: 19999976, heading: 355, pitch: -90 })
            }
            else {
                this.map.removeLayer(this.windLayer, true)
                this.windLayer = null
            }
        },

        backToHome() {
            this.$router.push('/home')
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
                $(".bar-content").css("display","none")
            }
            else {
                $(".sideBar.left").addClass("fadeInLeft")
                $(".sideBar.left").css({
                    "width": "20%",
                    "opacity": "0",
                    "box-shadow": "0 10px 100px 0 rgba(1, 48, 102, 0.8) inset",
                    "background-color": "transparent"
                })
                setTimeout(function () {
                    $(".bar-content").css("display","flex")
                },1000)
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
                    "width": "98%",
                    "display": "block",
                    "opacity": "1",
                    "box-shadow": "none",
                    "background-color": "rgba(1, 48, 102, 0.8)",
                    "left": "1%",
                    "right": "1%"
                })
                $(".bar-content-bottom").css("display","none")
            }
            else {
                $(".bottomBar").addClass("fadeInUp")
                $(".bottomBar").css({
                    "height": "30%",
                    "width": "56%",
                    "left": "22%",
                    "right": "22%",
                    "opacity": "0",
                    "box-shadow": "0 10px 100px 0 rgba(1, 48, 102, 0.8) inset",
                    "background-color": "transparent"
                })
                setTimeout(function () {
                    $(".bar-content-bottom").css("display","flex")
                },1000)
            }
        },
    },
    watch: {

    }

}

</script>

<style lang="less" scoped>
.mapcontainer {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
}
// 大于800px
@media only screen and (min-width: 800px) {
    // 移动端消失
    .el-result {
        display: none;
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

    .bar-content-bottom {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 100%;
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

    // 侧栏按钮
    .bar-content .el-button {
        width: 70%;
        background-color: rgba(0,183,254,0.5);
        border: none;
        font-size: 16px;
        font-weight: 800;
        color: white;
    }
    .bar-content .el-button:hover,
    .bar-content .el-button:active {
        background-color: #20B0CB;
        color: white
    }
    .bar-content .el-button:focus {
        // border: 1px white solid;
    }

    // 底栏按钮
    .bar-content-bottom .el-button {
        width: 100%;
        background-color: rgba(0,183,254,0.5);
        border: none;
        font-size: 16px;
        font-weight: 800;
        color: white;
    }
    .bar-content-bottom .el-button:hover,
    .bar-content-bottom .el-button:active {
        background-color: #20B0CB;
        color: white
    }
}

// 小于800px
@media only screen and (max-width: 800px) {
    .el-result {
        display: block;
        height: 100vh;
        display: flex;
        flex-direction: column;
    }
    #PC {
        display: none;
    }
}
</style>
