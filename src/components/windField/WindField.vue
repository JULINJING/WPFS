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
            // id 东南西北分别为1 2 3 4
            var positions = []
            switch (id) {
                case 1:
                    positions = [
                        { lng: 122.173944 + ( Math.random() - 0.5 ) / 20, lat: 30.025773 + ( Math.random() - 0.5 ) / 20, alt: 1716.4 + Math.random() },
                        { lng: 122.173944 + ( Math.random() - 0.5 ) / 20, lat: 30.025773 + ( Math.random() - 0.5 ) / 20, alt: 1716.4 + Math.random() },
                        { lng: 122.173944 + ( Math.random() - 0.5 ) / 20, lat: 30.025773 + ( Math.random() - 0.5 ) / 20, alt: 1716.4 + Math.random() },
                        { lng: 122.173944 + ( Math.random() - 0.5 ) / 20, lat: 30.025773 + ( Math.random() - 0.5 ) / 20, alt: 1716.4 + Math.random() },
                        { lng: 122.173944 + ( Math.random() - 0.5 ) / 20, lat: 30.025773 + ( Math.random() - 0.5 ) / 20, alt: 1716.4 + Math.random() },
                        { lng: 122.173944 + ( Math.random() - 0.5 ) / 20, lat: 30.025773 + ( Math.random() - 0.5 ) / 20, alt: 1716.4 + Math.random() }
                    ]
                    break;
                case 2:
                    positions = [
                        { lng: 115.473181 + ( Math.random() - 0.5 ) / 20, lat: 22.807014 + ( Math.random() - 0.5 ) / 20, alt: 1676.8 + Math.random() },
                        { lng: 115.473181 + ( Math.random() - 0.5 ) / 20, lat: 22.807014 + ( Math.random() - 0.5 ) / 20, alt: 1676.8 + Math.random() },
                        { lng: 115.473181 + ( Math.random() - 0.5 ) / 20, lat: 22.807014 + ( Math.random() - 0.5 ) / 20, alt: 1676.8 + Math.random() },
                        { lng: 115.473181 + ( Math.random() - 0.5 ) / 20, lat: 22.807014 + ( Math.random() - 0.5 ) / 20, alt: 1676.8 + Math.random() },
                        { lng: 115.473181 + ( Math.random() - 0.5 ) / 20, lat: 22.807014 + ( Math.random() - 0.5 ) / 20, alt: 1676.8 + Math.random() },
                        { lng: 115.473181 + ( Math.random() - 0.5 ) / 20, lat: 22.807014 + ( Math.random() - 0.5 ) / 20, alt: 1676.8 + Math.random() }
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
                    ]
                    break;
                default:
                    positions = [
                        { lng: 112.219753 + ( Math.random() - 0.5 ) / 20, lat: 39.057 + ( Math.random() - 0.5 ) / 20, alt: 1827 + Math.random() },
                        { lng: 112.219753 + ( Math.random() - 0.5 ) / 20, lat: 39.057 + ( Math.random() - 0.5 ) / 20, alt: 1827 + Math.random() },
                        { lng: 112.219753 + ( Math.random() - 0.5 ) / 20, lat: 39.057 + ( Math.random() - 0.5 ) / 20, alt: 1827 + Math.random() },
                        { lng: 112.219753 + ( Math.random() - 0.5 ) / 20, lat: 39.057 + ( Math.random() - 0.5 ) / 20, alt: 1827 + Math.random() },
                        { lng: 112.219753 + ( Math.random() - 0.5 ) / 20, lat: 39.057 + ( Math.random() - 0.5 ) / 20, alt: 1827 + Math.random() },
                        { lng: 112.219753 + ( Math.random() - 0.5 ) / 20, lat: 39.057 + ( Math.random() - 0.5 ) / 20, alt: 1827 + Math.random() }
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
                    this.map.setCameraView({"lat":30.03457,"lng":122.224079,"alt":1630.7,"heading":268.8,"pitch":-15.9})
                    break;
                case 2:
                    this.map.setCameraView({"lat":22.744186,"lng":115.511764,"alt":1452.2,"heading":333.2,"pitch":-11.8})
                    break;
                case 3:
                    this.map.setCameraView({"lat":37.282789,"lng":102.688775,"alt":5042.8,"heading":295.9,"pitch":-6.6})
                    break;
                default:
                    this.map.setCameraView({"lat":39.100007,"lng":112.173169,"alt":3451.2,"heading":138,"pitch":-17.2})
            }
            // 绑定点击风机事件
            this.turbineLayer.on(mars3d.EventType.click, () => {
                // 相机视角定位至风机群
                switch (id) {
                    case 1:
                        this.map.setCameraView({"lat":30.03457,"lng":122.224079,"alt":1630.7,"heading":268.8,"pitch":-15.9})
                        break;
                    case 2:
                        this.map.setCameraView({"lat":22.744186,"lng":115.511764,"alt":1452.2,"heading":333.2,"pitch":-11.8})
                        break;
                    case 3:
                        this.map.setCameraView({"lat":37.282789,"lng":102.688775,"alt":5042.8,"heading":295.9,"pitch":-6.6})
                        break;
                    default:
                        this.map.setCameraView({"lat":39.100007,"lng":112.173169,"alt":3451.2,"heading":138,"pitch":-17.2})
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
