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
                <div class="bar-content bar-content-left" id="leftContent">
                    <div class="chartbox">
                        <h5>风向 风速</h5>
                        <div id="weather1"></div>
                    </div>
                    <div class="chartbox">
                        <h5>气温</h5>
                        <div id="weather2"></div>
                    </div>
                    <div class="chartbox">
                        <h5>气压 湿度</h5>
                        <div id="weather3"></div>
                    </div>
                </div>
            </div>

            <div id="RightBar" class="sideBar right opacity0">
                <i id="rightClickSpan" class="iconfont opration-handler" aria-hidden="true" @click="hideRightPanel">&#xe653;</i>
                <div class="bar-content bar-content-right" id="rightContent">
                    <div class="chartbox">
                        <h5>四大风力发电场</h5>
                        <ul class="chartList">
                            <li :key="index" v-for="(item, index) in fieldData">
                                <span>{{ item.name }}</span>
                                <span :class="{'typeA': item.type === '荒原风场', 'typeB': item.type === '海滨风场', 'typeC': item.type === '高山风场'}">
                                    {{ item.type }}
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div class="chartbox">
                        <h5>风机运行状态统计</h5>
                        <div id="state"></div>
                    </div>
                    <div class="chartbox">
                        <h5>各风电场预测功率总计</h5>
                        <div id="powerSum"></div>
                    </div>
                </div>
            </div>

            <div id="BottomBar" class="bottomBar opacity0">
                <i id="bottomClickSpan" class="iconfont opration-handler" aria-hidden="true"
                    @click="hideBottomPanel">&#xe601;</i>
                <div class="bar-content-bottom" id="bottomContent">
                    <el-row>
                        <el-col>
                            <el-button plain @click="backToHome">返回主页</el-button>
                        </el-col>
                        <el-col>
                            <el-button plain @click="turnToBuilding">飞至风电场</el-button>
                        </el-col>
                        <el-col>
                            <el-button plain @click="wanderTurbine">开始 / 停止漫游</el-button>
                        </el-col>
                        <el-col>
                            <el-button plain @click="chargeWindField">显示 / 关闭风场</el-button>
                        </el-col>
                        <el-col>
                            <el-button plain @click="controlCha">开启 / 关闭角色控制</el-button>
                        </el-col>
                    </el-row>
                    <el-row id="row2">
                        <el-col>
                            <el-button class="bbottomButton" plain @click="addTurbineLayer(1)">浙江括苍山风电场</el-button>
                        </el-col>
                        <el-col>
                            <el-button class="bbottomButton" plain @click="addTurbineLayer(2)">广东汕头南澳岛风电场</el-button>
                        </el-col>
                        <el-col>
                            <el-button class="bbottomButton" plain @click="addTurbineLayer(3)">新疆达坂城风电场</el-button>
                        </el-col>
                        <el-col>
                            <el-button class="bbottomButton" plain @click="addTurbineLayer(4)">内蒙古辉腾锡勒风电场</el-button>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div id="explanatoryPicture">
                <img src="./imgs/keyboard.png" alt="" />
                <span class="closeButton" @click="closeImgPanel">关闭</span>
            </div>
        </div>
    </div>
</template>

<script>
import Layout from "./subcomponents/Header/index";

import MarsMap from "./mars-work/mars-map.vue"
import * as mars3d from 'mars3d'
import CesiumRoleController from "../../../public/lib/CesiumRoleController/CesiumRoleController.js"
import $ from 'jquery'
import * as turf from '@turf/turf'
import * as echarts from "echarts"
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
            layers: [{
                id: "风电场办公楼",
                type: "3dtiles",
                url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
                position: { lng: 87.881843, lat: 43.584772, alt: 1139.8 },
                maximumScreenSpaceError: 16,
                tooltip: "新疆达坂城风电场办公楼",
                scale: 8,
                show: true
            }]
        }
        var windLayer = new mars3d.layer.WindLayer()
        var chinaLayer = new mars3d.layer.GeoJsonLayer()
        
        return {
            configUrl: basePathUrl + 'config/config.json',
            mapOptions: mapOptions,
            windLayer,
            chinaLayer,
            controller: null,

            // 记录人物状态
            isControl: false,
            // 记录漫游状态
            isWonder: false,

            // 记录视点飞行状态
            isEasternFly: false,
            isSouthernFly: false,
            isWesternFly: false,
            isNorthernFly: false,

            // 记录计时器ID
            intervalId: null,

            // 记录面板展开状态
            isLeftOpen: true,
            isRightOpen: true,
            isBottomOpen: true,

            // 风点场名
            fieldData: [
                { name: "东部：浙江括苍山风电场", type: "高山风场" },
                { name: "南部：广东汕头南澳岛风电场", type: "海滨风场" },
                { name: "西部：新疆达坂城风电场", type: "荒原风场" },
                { name: "北部：内蒙古辉腾锡勒风电场", type: "荒原风场" }
            ],

            // 统计图表
            // 右侧
            chartsDataState: [
                { name: "并网", value: 0 },
                { name: "待机", value: 0 },
                { name: "故障", value: 0 },
                { name: "维护", value: 0 }
            ],
            myChartState: null,
            myOptionState: {},

            chartsDataPower: [
                { name: "东部", value: 0 },
                { name: "南部", value: 0 },
                { name: "西部", value: 0 },
                { name: "北部", value: 0 }
            ],
            myChartPower: null,
            myOptionPower: {},

            // 左侧
            myChartWeather1: null,
            myOptionWeather1: {},
            chartsDataWeather1: [
                {"DATATIME":"2022/3/26 12:00","WINDDIRECTION":"135","TurbID":"18","WINDSPEED":"0.6","PRESSURE":"1013","HUMIDITY":"19","TEMPERATURE":"16.3","PREPOWER":"5423.664291","YD15":"3338","ROUND(A.POWER,0)":"3622","AWS":"3.7"},{"DATATIME":"2022/3/26 12:15","WINDDIRECTION":"167","TurbID":"18","WINDSPEED":"0.9","PRESSURE":"1013","HUMIDITY":"19","TEMPERATURE":"16.7","PREPOWER":"5393.043637","YD15":"3539","ROUND(A.POWER,0)":"4293","AWS":"3.7"},{"DATATIME":"2022/3/26 12:30","WINDDIRECTION":"184","TurbID":"18","WINDSPEED":"1.3","PRESSURE":"1013","HUMIDITY":"18","TEMPERATURE":"17","PREPOWER":"5386.377587","YD15":"10185","ROUND(A.POWER,0)":"8480","AWS":"5"},{"DATATIME":"2022/3/26 12:45","WINDDIRECTION":"193","TurbID":"18","WINDSPEED":"1.7","PRESSURE":"1012","HUMIDITY":"17","TEMPERATURE":"17.3","PREPOWER":"5504.582102","YD15":"16032","ROUND(A.POWER,0)":"14243","AWS":"5.7"},{"DATATIME":"2022/3/26 13:00","WINDDIRECTION":"201","TurbID":"18","WINDSPEED":"2.2","PRESSURE":"1012","HUMIDITY":"16","TEMPERATURE":"17.6","PREPOWER":"5422.402582","YD15":"23043","ROUND(A.POWER,0)":"24667","AWS":"7.2"},{"DATATIME":"2022/3/26 13:15","WINDDIRECTION":"206","TurbID":"18","WINDSPEED":"2.8","PRESSURE":"1012","HUMIDITY":"16","TEMPERATURE":"17.9","PREPOWER":"5384.134899","YD15":"27501","ROUND(A.POWER,0)":"26488","AWS":"7.6"},{"DATATIME":"2022/3/26 13:30","WINDDIRECTION":"210","TurbID":"18","WINDSPEED":"3.4","PRESSURE":"1011","HUMIDITY":"16","TEMPERATURE":"18.2","PREPOWER":"5429.203811","YD15":"32914","ROUND(A.POWER,0)":"29174","AWS":"7.8"},{"DATATIME":"2022/3/26 13:45","WINDDIRECTION":"213","TurbID":"18","WINDSPEED":"3.8","PRESSURE":"1011","HUMIDITY":"15","TEMPERATURE":"18.4","PREPOWER":"5483.465929","YD15":"26735","ROUND(A.POWER,0)":"24703","AWS":"7.1"},{"DATATIME":"2022/3/26 14:00","WINDDIRECTION":"216","TurbID":"18","WINDSPEED":"4.4","PRESSURE":"1010","HUMIDITY":"15","TEMPERATURE":"18.7","PREPOWER":"5854","YD15":"23881","ROUND(A.POWER,0)":"26448","AWS":"7.4"}
            ],

            myChartWeather2: null,
            myOptionWeather2: {},
            chartsDataWeather2: [
                {"DATATIME":"2022/3/26 12:00","WINDDIRECTION":"135","TurbID":"18","WINDSPEED":"0.6","PRESSURE":"1013","HUMIDITY":"19","TEMPERATURE":"16.3","PREPOWER":"5423.664291","YD15":"3338","ROUND(A.POWER,0)":"3622","AWS":"3.7"},{"DATATIME":"2022/3/26 12:15","WINDDIRECTION":"167","TurbID":"18","WINDSPEED":"0.9","PRESSURE":"1013","HUMIDITY":"19","TEMPERATURE":"16.7","PREPOWER":"5393.043637","YD15":"3539","ROUND(A.POWER,0)":"4293","AWS":"3.7"},{"DATATIME":"2022/3/26 12:30","WINDDIRECTION":"184","TurbID":"18","WINDSPEED":"1.3","PRESSURE":"1013","HUMIDITY":"18","TEMPERATURE":"17","PREPOWER":"5386.377587","YD15":"10185","ROUND(A.POWER,0)":"8480","AWS":"5"},{"DATATIME":"2022/3/26 12:45","WINDDIRECTION":"193","TurbID":"18","WINDSPEED":"1.7","PRESSURE":"1012","HUMIDITY":"17","TEMPERATURE":"17.3","PREPOWER":"5504.582102","YD15":"16032","ROUND(A.POWER,0)":"14243","AWS":"5.7"},{"DATATIME":"2022/3/26 13:00","WINDDIRECTION":"201","TurbID":"18","WINDSPEED":"2.2","PRESSURE":"1012","HUMIDITY":"16","TEMPERATURE":"17.6","PREPOWER":"5422.402582","YD15":"23043","ROUND(A.POWER,0)":"24667","AWS":"7.2"},{"DATATIME":"2022/3/26 13:15","WINDDIRECTION":"206","TurbID":"18","WINDSPEED":"2.8","PRESSURE":"1012","HUMIDITY":"16","TEMPERATURE":"17.9","PREPOWER":"5384.134899","YD15":"27501","ROUND(A.POWER,0)":"26488","AWS":"7.6"},{"DATATIME":"2022/3/26 13:30","WINDDIRECTION":"210","TurbID":"18","WINDSPEED":"3.4","PRESSURE":"1011","HUMIDITY":"16","TEMPERATURE":"18.2","PREPOWER":"5429.203811","YD15":"32914","ROUND(A.POWER,0)":"29174","AWS":"7.8"},{"DATATIME":"2022/3/26 13:45","WINDDIRECTION":"213","TurbID":"18","WINDSPEED":"3.8","PRESSURE":"1011","HUMIDITY":"15","TEMPERATURE":"18.4","PREPOWER":"5483.465929","YD15":"26735","ROUND(A.POWER,0)":"24703","AWS":"7.1"},{"DATATIME":"2022/3/26 14:00","WINDDIRECTION":"216","TurbID":"18","WINDSPEED":"4.4","PRESSURE":"1010","HUMIDITY":"15","TEMPERATURE":"18.7","PREPOWER":"5854","YD15":"23881","ROUND(A.POWER,0)":"26448","AWS":"7.4"}
            ],

            myChartWeather3: null,
            myOptionWeather3: {},
            chartsDataWeather3: [
                {"DATATIME":"2022/3/26 12:00","WINDDIRECTION":"135","TurbID":"18","WINDSPEED":"0.6","PRESSURE":"1013","HUMIDITY":"19","TEMPERATURE":"16.3","PREPOWER":"5423.664291","YD15":"3338","ROUND(A.POWER,0)":"3622","AWS":"3.7"},{"DATATIME":"2022/3/26 12:15","WINDDIRECTION":"167","TurbID":"18","WINDSPEED":"0.9","PRESSURE":"1013","HUMIDITY":"19","TEMPERATURE":"16.7","PREPOWER":"5393.043637","YD15":"3539","ROUND(A.POWER,0)":"4293","AWS":"3.7"},{"DATATIME":"2022/3/26 12:30","WINDDIRECTION":"184","TurbID":"18","WINDSPEED":"1.3","PRESSURE":"1013","HUMIDITY":"18","TEMPERATURE":"17","PREPOWER":"5386.377587","YD15":"10185","ROUND(A.POWER,0)":"8480","AWS":"5"},{"DATATIME":"2022/3/26 12:45","WINDDIRECTION":"193","TurbID":"18","WINDSPEED":"1.7","PRESSURE":"1012","HUMIDITY":"17","TEMPERATURE":"17.3","PREPOWER":"5504.582102","YD15":"16032","ROUND(A.POWER,0)":"14243","AWS":"5.7"},{"DATATIME":"2022/3/26 13:00","WINDDIRECTION":"201","TurbID":"18","WINDSPEED":"2.2","PRESSURE":"1012","HUMIDITY":"16","TEMPERATURE":"17.6","PREPOWER":"5422.402582","YD15":"23043","ROUND(A.POWER,0)":"24667","AWS":"7.2"},{"DATATIME":"2022/3/26 13:15","WINDDIRECTION":"206","TurbID":"18","WINDSPEED":"2.8","PRESSURE":"1012","HUMIDITY":"16","TEMPERATURE":"17.9","PREPOWER":"5384.134899","YD15":"27501","ROUND(A.POWER,0)":"26488","AWS":"7.6"},{"DATATIME":"2022/3/26 13:30","WINDDIRECTION":"210","TurbID":"18","WINDSPEED":"3.4","PRESSURE":"1011","HUMIDITY":"16","TEMPERATURE":"18.2","PREPOWER":"5429.203811","YD15":"32914","ROUND(A.POWER,0)":"29174","AWS":"7.8"},{"DATATIME":"2022/3/26 13:45","WINDDIRECTION":"213","TurbID":"18","WINDSPEED":"3.8","PRESSURE":"1011","HUMIDITY":"15","TEMPERATURE":"18.4","PREPOWER":"5483.465929","YD15":"26735","ROUND(A.POWER,0)":"24703","AWS":"7.1"},{"DATATIME":"2022/3/26 14:00","WINDDIRECTION":"216","TurbID":"18","WINDSPEED":"4.4","PRESSURE":"1010","HUMIDITY":"15","TEMPERATURE":"18.7","PREPOWER":"5854","YD15":"23881","ROUND(A.POWER,0)":"26448","AWS":"7.4"}
            ],

            // 记录风机状态数
            // 故障 维护 待机 并网个数
            gzNum: 0,
            whNum: 0,
            djNum: 0,
            bwNum: 0,

            // 记录风电场预测总功率
            // 东部 南部 西部 北部
            eSum: 0,
            sSum: 0,
            wSum: 0,
            nSum: 0,

            // 故障风机id数组
            turbineIdError: []
        }
    },
    methods: {
        // 地图构造完成回调
        onMapload() {
            // 开场
            this.map.openFlyAnimation()
            this.map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。
            this.map.setCameraView({ lat: 20.648765, lng: 129.340334, alt: 19999976, heading: 355, pitch: -90 })
            // this.map.scene.globe.terrainExaggeration = 2 // 修改地形夸张程度
            // 宇宙天空盒
            this.map.scene.skyBox = new Cesium.SkyBox({
                sources: {
                    negativeX: "../../../imgs/skybox/tycho2t3_80_mx.jpg",
                    negativeY: "../../../imgs/skybox/tycho2t3_80_my.jpg",
                    negativeZ: "../../../imgs/skybox/tycho2t3_80_mz.jpg",
                    positiveX: "../../../imgs/skybox/tycho2t3_80_px.jpg",
                    positiveY: "../../../imgs/skybox/tycho2t3_80_py.jpg",
                    positiveZ: "../../../imgs/skybox/tycho2t3_80_pz.jpg"
                }
            })
            // 近地天空盒 晴天
            const qingtianSkybox = new mars3d.GroundSkyBox({
                sources: {
                    positiveX: "../../../imgs/skybox_near/rightav9.jpg",
                    negativeX: "../../../imgs/skybox_near/leftav9.jpg",
                    positiveY: "../../../imgs/skybox_near/frontav9.jpg",
                    negativeY: "../../../imgs/skybox_near/backav9.jpg",
                    positiveZ: "../../../imgs/skybox_near/topav9.jpg",
                    negativeZ: "../../../imgs/skybox_near/bottomav9.jpg"
                }
            })
            let defaultSkybox = this.map.scene.skyBox
            this.map.on(mars3d.EventType.postRender, ()=> {
                const position = this.map.camera.position
                const height = Cesium.Cartographic.fromCartesian(position).height
                if (height < 230000) {
                    this.map.scene.skyBox = qingtianSkybox
                    this.map.scene.skyAtmosphere.show = false
                } else {
                    if (defaultSkybox) {
                        this.map.scene.skyBox = defaultSkybox
                    }
                    this.map.scene.skyAtmosphere.show = true
                }
            })

            this.addWindLayer()
            this.addOtherFactoryLayer()
            // this.addChinaMap()
            setTimeout(function () {
                $(".sideBar.left").removeClass("opacity0").removeClass("fadeOutLeft").addClass("animated fadeInLeft")
                $(".sideBar.right").removeClass("opacity0").removeClass("fadeOutRight").addClass("animated fadeInRight")
                $(".bottomBar").removeClass("opacity0").removeClass("fadeOutDown").addClass("animated fadeInUp")
            }, 2000)

            // 右侧
            let state = document.getElementById("state")
            let powerSum = document.getElementById("powerSum")
            // 左侧
            let weather1 = document.getElementById("weather1")
            let weather2 = document.getElementById("weather2")
            let weather3 = document.getElementById("weather3")
            this.initCharts(this.chartsDataState, this.chartsDataPower, this.chartsDataWeather1,
                this.chartsDataWeather2, this.chartsDataWeather3, state, powerSum, weather1, weather2, weather3)

            //webgl渲染失败后，刷新页面
            this.map.on(mars3d.EventType.renderError, function () {
                window.location.reload();
            });
        },
        addOtherFactoryLayer() {
            // 添加道路
            var otherFactoryLayer = new mars3d.layer.GraphicLayer()
            this.map.addLayer(otherFactoryLayer)
            const roadGraphic1 = new mars3d.graphic.Road({
                positions: [
                    [87.937602, 43.556519, 1100.1],
                    [87.83576, 43.596981, 1126.1]
                ],
                style: {
                    image: "../../../imgs/road.jpg",
                    width: 50,
                    height: 1
                }
            })
            const roadGraphic2 = new mars3d.graphic.Road({
                positions: [
                    [87.89991, 43.566763, 1102],
                    [87.867252, 43.579576, 1118.6],
                    [87.861179, 43.582624, 1121.1],
                    [87.860132, 43.583037, 1121.7],
                    [87.855952, 43.584103, 1121.8],
                    [87.834496, 43.595468, 1116.9]
                ],
                style: {
                    image: "../../../imgs/road.jpg",
                    width: 50,
                    height: 1
                }
            })
            otherFactoryLayer.addGraphic(roadGraphic1)
            otherFactoryLayer.addGraphic(roadGraphic2)

            // 添加车辆
            var carGraphic1 = new mars3d.graphic.ModelPrimitive({
                id: 1,
                position: [87.872971, 43.582348, 1116.1],
                style: {
                    url: '//data.mars3d.cn/gltf/mars/car/kache3.gltf',
                    heading: 210,
                    scale: 5,
                    minimumPixelSize: 1,
                },
            })
            var carGraphic2 = new mars3d.graphic.ModelPrimitive({
                id: 2,
                position: [87.869916, 43.578403, 1118.1],
                style: {
                    url: '//data.mars3d.cn/gltf/imap/d8cb721fdc3642a085533583da944c79/gltf/gltf2.gltf',
                    heading: 30,
                    scale: 5,
                    minimumPixelSize: 1,
                },
            })
            var carGraphic3 = new mars3d.graphic.ModelPrimitive({
                id: 3,
                position: [87.882719, 43.578459, 1113.4],
                style: {
                    url: '//data.mars3d.cn/gltf/imap/1d4f63111fc9499dac5cee2286ad7bb3/gltf/gltf2.gltf',
                    heading: 120,
                    scale: 5,
                    minimumPixelSize: 1,
                },
            })
            var carGraphic4 = new mars3d.graphic.ModelPrimitive({
                id: 4,
                position: [87.873501, 43.576978, 1116.3],
                style: {
                    url: '//data.mars3d.cn/gltf/mars/car/kache1.gltf',
                    heading: 30,
                    scale: 5,
                    minimumPixelSize: 1,
                },
            })
            otherFactoryLayer.addGraphic(carGraphic1)
            otherFactoryLayer.addGraphic(carGraphic2)
            otherFactoryLayer.addGraphic(carGraphic3)
            otherFactoryLayer.addGraphic(carGraphic4)

            // 添加厂房
            var houseGraphic1 = new mars3d.graphic.ModelPrimitive({
                position: [87.878189, 43.577725, 1118.5],
                style: {
                    url: '//data.mars3d.cn/gltf/imap/9d3a5ca27bad426b81b05bca10aac9bd/gltf/gltf2.gltf',
                    heading: 210,
                    scale: 10,
                    minimumPixelSize: 1,
                },
            })
            var houseGraphic2 = new mars3d.graphic.ModelPrimitive({
                position: [87.875837, 43.578815, 1120],
                style: {
                    url: '//data.mars3d.cn/gltf/imap/9d3a5ca27bad426b81b05bca10aac9bd/gltf/gltf2.gltf',
                    heading: 210,
                    scale: 10,
                    minimumPixelSize: 1,
                },
            })
            var houseGraphic3 = new mars3d.graphic.ModelPrimitive({
                position: [87.876017, 43.577012, 1116.4],
                style: {
                    url: '//data.mars3d.cn/gltf/imap/b04575a269e74d309d80fb4aa504c307/gltf/gltf2.gltf',
                    heading: 120,
                    scale: 10,
                    minimumPixelSize: 1,
                },
            })
            var houseGraphic4 = new mars3d.graphic.ModelPrimitive({
                position: [87.87317, 43.579765, 1122.8],
                style: {
                    url: '//data.mars3d.cn/gltf/imap/4f99992dc26a43c2975038003879a8c2/gltf/gltf2.gltf',
                    heading: 210,
                    scale: 10,
                    minimumPixelSize: 1,
                },
            })
            otherFactoryLayer.addGraphic(houseGraphic1)
            otherFactoryLayer.addGraphic(houseGraphic2)
            otherFactoryLayer.addGraphic(houseGraphic3)
            otherFactoryLayer.addGraphic(houseGraphic4)

            // 添加人
            var peopleGraphic1 = new mars3d.graphic.ModelPrimitive({
                position: [87.872396, 43.579394, 1120.4],
                style: {
                    url: '//data.mars3d.cn/gltf/mars/man/walk.gltf',
                    heading: 210,
                    scale: 10,
                    minimumPixelSize: 1,
                },
            })
            otherFactoryLayer.addGraphic(peopleGraphic1)

            // 添加电力设备
            var electricityGraphic1 = new mars3d.graphic.ModelPrimitive({
                position: [87.890183, 43.573563, 1117.5],
                style: {
                    url: '//data.mars3d.cn/gltf/imap/029020c24f604b9e8a5621306889965e/gltf/default.gltf',
                    heading: 210,
                    scale: 10,
                    minimumPixelSize: 1,
                },
            })
            var electricityGraphic2 = new mars3d.graphic.ModelPrimitive({
                position: [87.888943, 43.571967, 1109.9],
                style: {
                    url: '//data.mars3d.cn/gltf/imap/64b2b420d1564777bb68c771f9c9e57e/gltf/gltf2.gltf',
                    heading: 210,
                    scale: 10,
                    minimumPixelSize: 1,
                },
            })
            otherFactoryLayer.addGraphic(electricityGraphic1)
            otherFactoryLayer.addGraphic(electricityGraphic2)

            // 添加输电线路
            var transportGraphic1 = new mars3d.graphic.ModelPrimitive({
                position: [87.901237, 43.572966, 1119],
                style: {
                    url: '../../../mars3dModels/Electric_Towers_Blend.gltf',
                    heading: 210,
                    scale: 4,
                    minimumPixelSize: 1,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 100000)
                },
            })
            var transportGraphic2 = new mars3d.graphic.ModelPrimitive({
                position: [87.918563, 43.571499, 1134.6],
                style: {
                    url: '../../../mars3dModels/Electric_Towers_Blend.gltf',
                    heading: 210,
                    scale: 4,
                    minimumPixelSize: 1,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 100000)
                },
            })
            var transportGraphic3 = new mars3d.graphic.ModelPrimitive({
                position: [87.935538, 43.570906, 1150.8],
                style: {
                    url: '../../../mars3dModels/Electric_Towers_Blend.gltf',
                    heading: 210,
                    scale: 4,
                    minimumPixelSize: 1,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 100000)
                },
            })
            var transportGraphic4 = new mars3d.graphic.ModelPrimitive({
                position: [87.955726, 43.570854, 1155.9],
                style: {
                    url: '../../../mars3dModels/Electric_Towers_Blend.gltf',
                    heading: 210,
                    scale: 4,
                    minimumPixelSize: 1,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 100000)
                },
            })
            var transportGraphic5 = new mars3d.graphic.ModelPrimitive({
                position: [87.889205, 43.567413, 1097.8],
                style: {
                    url: '../../../mars3dModels/Electric_Towers_Blend.gltf',
                    heading: 210,
                    scale: 4,
                    minimumPixelSize: 1,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 100000)
                },
            })
            var transportGraphic6 = new mars3d.graphic.ModelPrimitive({
                position: [87.958552, 43.591722, 1240.1],
                style: {
                    url: '../../../mars3dModels/Electric_Towers_Blend.gltf',
                    heading: 210,
                    scale: 4,
                    minimumPixelSize: 1,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 100000)
                },
            })
            var transportGraphic7 = new mars3d.graphic.ModelPrimitive({
                position: [87.961935, 43.615723, 1338.4],
                style: {
                    url: '../../../mars3dModels/Electric_Towers_Blend.gltf',
                    heading: 210,
                    scale: 4,
                    minimumPixelSize: 1,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 100000)
                },
            })
            // 自动计算与绘制高压电线
            let polylines1 = []
            let polylines2 = []
            let polylines3 = []
            let polylines4 = []
            let polylines5 = []
            let polylines6 = []
            let polylines7 = []
            let polylines8 = []
            let polylines9 = []
            const polylinesTB = []
            const transportGraphicPositions = [
                [87.889205, 43.567413, 1266.8],
                [87.901237, 43.572966, 1288],
                [87.918563, 43.571499, 1303.6],
                [87.935538, 43.570906, 1319.8],
                [87.955726, 43.570854, 1324.9],
                [87.958552, 43.591722, 1409.1],
                [87.961935, 43.615723, 1507.4]
            ]
            for (let i = 0; i < transportGraphicPositions.length; i++) {
                const item = transportGraphicPositions[i]

                // 所在经纬度坐标及海拔高度
                const longitude = item[0]
                const latitude = item[1]
                const height = item[2]

                const originPoint1 = {
                    longitude: longitude,
                    latitude: latitude,
                    height: height
                }
                const originPoint2 = {
                    longitude: longitude,
                    latitude: latitude,
                    height: height - 40
                }
                const originPoint3 = {
                    longitude: longitude,
                    latitude: latitude,
                    height: height - 80
                }
                const position1 = Cesium.Cartesian3.fromDegrees(originPoint1.longitude, originPoint1.latitude, originPoint1.height)
                const position2 = Cesium.Cartesian3.fromDegrees(originPoint2.longitude, originPoint2.latitude, originPoint2.height)
                const position3 = Cesium.Cartesian3.fromDegrees(originPoint3.longitude, originPoint3.latitude, originPoint3.height)

                // 计算电线塔转角角度
                const degree = 210

                // 3条线路坐标 上中下三段
                const hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(degree), 0, 0)
                const newPoint1 = mars3d.PointUtil.getPositionByHprAndOffset(position1, new Cesium.Cartesian3(0.341789, 16.837972, 50.717621), hpr)
                const newPoint2 = mars3d.PointUtil.getPositionByHprAndOffset(position1, new Cesium.Cartesian3(0.34241, -16.838163, 50.717617), hpr)
                const newPoint3 = mars3d.PointUtil.getPositionByHprAndOffset(position1, new Cesium.Cartesian3(-0.025005, 0.022878, 39.540545), hpr)

                const newPoint4 = mars3d.PointUtil.getPositionByHprAndOffset(position2, new Cesium.Cartesian3(0.341789, 16.837972, 50.717621), hpr)
                const newPoint5 = mars3d.PointUtil.getPositionByHprAndOffset(position2, new Cesium.Cartesian3(0.34241, -16.838163, 50.717617), hpr)
                const newPoint6 = mars3d.PointUtil.getPositionByHprAndOffset(position2, new Cesium.Cartesian3(-0.025005, 0.022878, 39.540545), hpr)

                const newPoint7 = mars3d.PointUtil.getPositionByHprAndOffset(position3, new Cesium.Cartesian3(0.341789, 16.837972, 50.717621), hpr)
                const newPoint8 = mars3d.PointUtil.getPositionByHprAndOffset(position3, new Cesium.Cartesian3(0.34241, -16.838163, 50.717617), hpr)
                const newPoint9 = mars3d.PointUtil.getPositionByHprAndOffset(position3, new Cesium.Cartesian3(-0.025005, 0.022878, 39.540545), hpr)

                polylinesTB.push(newPoint2) // 图标显示的点

                if (i === 0) {
                    polylines1.push(newPoint1)
                    polylines2.push(newPoint2)
                    polylines3.push(newPoint3)
                    polylines4.push(newPoint4)
                    polylines5.push(newPoint5)
                    polylines6.push(newPoint6)
                    polylines7.push(newPoint7)
                    polylines8.push(newPoint8)
                    polylines9.push(newPoint9)
                } else {
                    // 曲率
                    const angularityFactor = -2500
                    // 点集数量
                    const num = 50
                    let positions = mars3d.PolyUtil.getLinkedPointList(polylines1[polylines1.length - 1], newPoint1, angularityFactor, num) // 计算曲线点
                    polylines1 = polylines1.concat(positions)

                    positions = mars3d.PolyUtil.getLinkedPointList(polylines2[polylines2.length - 1], newPoint2, angularityFactor, num) // 计算曲线点
                    polylines2 = polylines2.concat(positions)

                    positions = mars3d.PolyUtil.getLinkedPointList(polylines3[polylines3.length - 1], newPoint3, angularityFactor, num) // 计算曲线点
                    polylines3 = polylines3.concat(positions)

                    positions = mars3d.PolyUtil.getLinkedPointList(polylines4[polylines4.length - 1], newPoint4, angularityFactor, num) // 计算曲线点
                    polylines4 = polylines4.concat(positions)

                    positions = mars3d.PolyUtil.getLinkedPointList(polylines5[polylines5.length - 1], newPoint5, angularityFactor, num) // 计算曲线点
                    polylines5 = polylines5.concat(positions)

                    positions = mars3d.PolyUtil.getLinkedPointList(polylines6[polylines6.length - 1], newPoint6, angularityFactor, num) // 计算曲线点
                    polylines6 = polylines6.concat(positions)

                    positions = mars3d.PolyUtil.getLinkedPointList(polylines7[polylines7.length - 1], newPoint7, angularityFactor, num) // 计算曲线点
                    polylines7 = polylines7.concat(positions)

                    positions = mars3d.PolyUtil.getLinkedPointList(polylines3[polylines8.length - 1], newPoint8, angularityFactor, num) // 计算曲线点
                    polylines8 = polylines8.concat(positions)

                    positions = mars3d.PolyUtil.getLinkedPointList(polylines9[polylines9.length - 1], newPoint9, angularityFactor, num) // 计算曲线点
                    polylines9 = polylines9.concat(positions)
                }
            }
            function drawGuideLine(positions, color) {
                const lineGraphic = new mars3d.graphic.PolylinePrimitive({
                    positions: positions,
                    style: {
                        width: 1,
                        color: color
                    }
                })
                otherFactoryLayer.addGraphic(lineGraphic)
            }
            drawGuideLine(polylines1, "#2C2F36")
            drawGuideLine(polylines2, "#2C2F36")
            drawGuideLine(polylines3, "#2C2F36")
            drawGuideLine(polylines4, "#2C2F36")
            drawGuideLine(polylines5, "#2C2F36")
            drawGuideLine(polylines6, "#2C2F36")
            drawGuideLine(polylines7, "#2C2F36")
            drawGuideLine(polylines8, "#2C2F36")
            drawGuideLine(polylines9, "#2C2F36")
            otherFactoryLayer.addGraphic(transportGraphic1)
            otherFactoryLayer.addGraphic(transportGraphic2)
            otherFactoryLayer.addGraphic(transportGraphic3)
            otherFactoryLayer.addGraphic(transportGraphic4)
            otherFactoryLayer.addGraphic(transportGraphic5)
            otherFactoryLayer.addGraphic(transportGraphic6)
            otherFactoryLayer.addGraphic(transportGraphic7)

            // 添加变电站
            // var transformerGraphic1 = new mars3d.graphic.ModelPrimitive({
            //     position: [87.884667, 43.574988, 1116.7],
            //     style: {
            //         url: '../../../mars3dModels/变电站.gltf',
            //         heading: 210,
            //         scale: 4,
            //         minimumPixelSize: 1,
            //         distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 100000)
            //     },
            // })
            // otherFactoryLayer.addGraphic(transformerGraphic1)
            var transformerLayer = new mars3d.layer.TilesetLayer({
                name: "变电站",
                url: "//data.mars3d.cn/3dtiles/max-shihua/tileset.json",
                position: { lng: 87.91969, lat: 43.585619, alt: 1150.3 },
                maximumScreenSpaceError: 16,
                rotation: {
                    z: 70
                },
                scale: 3,

                // 以下参数可以参考用于3dtiles总数据大，清晰度过高情况下进行性能优化。这不是一个通用的解决方案，但可以以此为参考。
                skipLevelOfDetail: true,
                loadSiblings: true,
                cullRequestsWhileMoving: true,
                cullRequestsWhileMovingMultiplier: 10,
                preferLeaves: true,
                dynamicScreenSpaceError: true,
                preloadWhenHidden: true,
                enableDebugWireframe: true, // 是否可以进行三角网的切换显示
                // 以上为优化的参数
            })
            this.map.addLayer(transformerLayer)

            // 变电站点击事件
            transformerLayer.on(mars3d.EventType.click, () => {
                this.$router.push('/watch')
                const h = this.$createElement;
                this.$message({
                    message: h('p', null, [
                        h('span', null, '已成功切换至 '),
                        h('i', { style: 'color: teal' }, '风力发电场')
                    ]),
                    offset: 50
                });
                // 清除计时器
                if (this.intervalId !== null) {
                    // 如果已经有一个正在运行的定时器，停止它
                    clearInterval(this.intervalId);
                    this.intervalId = null;
                }
            })

            // 办公楼点击事件
            this.map.getLayerById("风电场办公楼").on(mars3d.EventType.click, ()=> {
                this.map.setCameraView({ "lat": 43.585478, "lng": 87.875422, "alt": 1223.4, "heading": 127, "pitch": 0.8 })
                $("#explanatoryPicture").css({
                    "display": "block",
                    "position": "absolute",
                    "top": "10%",
                    "left": "22%",
                    "right": "22%",
                    "width": "56%"
                })
                $("#explanatoryPicture").addClass("animated fadeInDown")
            })

            // 添加监控
            function addCamera(graphicLayer, position) {
                const graphicImg = new mars3d.graphic.DivGraphic({
                    position: position,
                    style: {
                        html: ` <div class="mars3d-camera-content" style="height: 30px;cursor:pointer">
                                    <svg width="30px" height="50px" xmlns="http://www.w3.org/2000/svg">
                                        <image href="../../imgs/camera.svg" width="30" height="30">
                                            <animate attributeName="y" values="20;0;20" keyTimes="0;0.5;1" dur="2s" repeatCount="indefinite" />
                                        </image>
                                    </svg>
                                </div>
                                <div class="mars3d-camera-line" style="height: 80px;width: 5px;margin-top: 20px;
                                border-left: 3px dashed #5b8fee;margin-left: calc(50% - 1px);"></div>
                                <div class="mars3d-camera-point" style="border-radius: 50%;width: 8px;height: 8px;
                                margin-left: calc(50% - 3px);background-color: #5b8fee;"></div>
                            `,
                        offsetX: -16,
                        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000)
                    },
                    popup: `<video src='../../imgs/videos/概览.mp4' controls autoplay style="width: 300px;" ></video>`,
                    popupOptions: {
                        offsetY: -170, // 显示Popup的偏移值，是DivGraphic本身的像素高度值
                        template: `<div class="marsBlackPanel" style="min-width: 90px;min-height: 35px;position: absolute;left: 16px;bottom: 10px;
                                        cursor: default;border-radius: 4px;opacity: 0.96;border: 1px solid #14171c;box-shadow: 0px 2px 21px 0px rgba(33, 34, 39, 0.55);
                                        border-radius: 4px;box-sizing: border-box;background: linear-gradient(0deg, #1e202a 0%, #0d1013 100%);">
                                        <div class="marsBlackPanel-text" style="width: 100%;height: 100%;min-height: 33px;text-align: center;padding: 5px 5px 0 5px;
                                            margin: 0;font-size: 14px;font-weight: 400;color: #ffffff;border: 1px solid #ffffff4f;-webkit-box-sizing: border-box;
                                            box-sizing: border-box;white-space: nowrap;">
                                            {content}
                                        </div>
                                    </div>`,
                        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                        verticalOrigin: Cesium.VerticalOrigin.CENTER
                    }
                })
                graphicLayer.addGraphic(graphicImg)
            }
            // 添加具体监控数据
            addCamera(otherFactoryLayer, [87.884014, 43.585733, 1271.6])
            addCamera(otherFactoryLayer, [87.875852, 43.577082, 1153.9])
            addCamera(otherFactoryLayer, [87.916696, 43.579158, 1164.2])
            var style = document.createElement('style');
            style.innerHTML = '.marsBlackPanel::before { content: ""; width: calc(100% + 22px); height: 39px; position: absolute; bottom: -39px; left: -22px; background: url(//mars3d.cn/img/icon/popupLbl.png) 0px 0px no-repeat; background-position: 0px 0px; }';
            document.getElementsByTagName('head')[0].appendChild(style);

            // 添加视频
            const video2D = new mars3d.graphic.Video2D({
                position: [87.875485, 43.572068, 1104],
                style: {
                    url: "../../imgs/videos/百度智能云-龙源电力.mp4",
                    angle: 40,
                    angle2: 22.5,
                    heading: 235,
                    pitch: 8,
                    distance: 360,
                    showFrustum: true
                }
            })
            otherFactoryLayer.addGraphic(video2D)
        },
        addChinaMap() {
            this.chinaLayer = new mars3d.layer.GeoJsonLayer({
                name: "全国省界",
                url: "../../../chinaData/中国行政区划.json",
                format: this.simplifyGeoJSON, // 用于自定义处理geojson
                symbol: {
                    type: "polylineC",
                    styleOptions: {
                        width: 2,
                        materialType: mars3d.MaterialType.LineFlow,
                        materialOptions: {
                            color: "#00ffff",
                            image: "imgs/fence-line.png",
                            speed: 10,
                            repeat_x: 10
                        },
                        distanceDisplayCondition: true,
                        distanceDisplayCondition_far: 30000000,
                        distanceDisplayCondition_near: 2000000
                    }
                },
            })
            this.map.addLayer(this.chinaLayer)
        },
        // 简化geojson的坐标
        simplifyGeoJSON(geojson) {
            try {
                geojson = turf.simplify(geojson, { tolerance: 0.0001, highQuality: true, mutate: true })
            } catch (e) {
                //
            }
            return geojson
        },
        addWindLayer() {
            this.windLayer = new mars3d.layer.WindLayer({
                id: '风场',
                particlesNumber: 9000,
                fadeOpacity: 0.996,
                dropRate: 0.003,
                dropRateBump: 0.01,
                speedFactor: 0.05,
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

            // 移除风场
            if (this.windLayer) {
                this.map.removeLayer(this.windLayer, true)
                this.windLayer = null
            }

            // 移除其余风机
            if (this.map.getLayerById("风机") && this.map.getLayerById("功率")) {
                this.map.removeLayer(this.map.getLayerById("风机"), true)
                this.map.removeLayer(this.map.getLayerById("功率"), true)
            }

            // id 东南西北分别为1 2 3 4
            // 确定风机位置以及视点飞行路径
            // 确定风力发电场名称和位置
            // 更改飞行状态
            var positions = []
            var viewPoints = []
            var factoryTitle = ''
            var factoryPosition = {}
            switch (id) {
                case 1:
                    positions = [
                        { lng: 120.935595, lat: 28.816111, alt: 1282.3 },
                        { lng: 120.935475, lat: 28.818617, alt: 1220.3 },
                        { lng: 120.931715, lat: 28.813515, alt: 1335.4 },
                        { lng: 120.92851, lat: 28.812498, alt: 1349.7 },
                        { lng: 120.927039, lat: 28.812325, alt: 1378 },
                        { lng: 120.924696, lat: 28.810802, alt: 1345.3 },
                        { lng: 120.922887, lat: 28.81043, alt: 1378.3 },
                        { lng: 120.921624, lat: 28.81019, alt: 1387.5 },
                        { lng: 120.918119, lat: 28.807413, alt: 1327.3 },
                        { lng: 120.91864, lat: 28.805663, alt: 1312.8 },
                        { lng: 120.916948, lat: 28.808792, alt: 1300.3 },
                        { lng: 120.916376, lat: 28.803348, alt: 1244.2 },
                        { lng: 120.9126, lat: 28.810853, alt: 1183.9 },
                        { lng: 120.909243, lat: 28.813867, alt: 1011.4 },
                        { lng: 120.919192, lat: 28.813804, alt: 1213.1 },
                        { lng: 120.916721, lat: 28.820411, alt: 1015.8 },
                        { lng: 120.936704, lat: 28.811973, alt: 1154.6 },
                        { lng: 120.924538, lat: 28.815428, alt: 1270.4 },
                        { lng: 120.915811, lat: 28.827058, alt: 936.9 },
                        { lng: 120.932343, lat: 28.823411, alt: 1088.6 }
                    ]
                    viewPoints = [
                        { "lat": 28.843931, "lng": 120.882302, "alt": 2803.8, "heading": 131.2, "pitch": -20.8, duration: 5 },
                        { "lat": 28.78197, "lng": 120.89736, "alt": 2895, "heading": 34.3, "pitch": -23.1, duration: 3 },
                        { "lat": 28.784143, "lng": 120.949173, "alt": 2817.7, "heading": 321.4, "pitch": -21.8, duration: 3 },
                        { "lat": 28.827739, "lng": 120.968225, "alt": 2866.4, "heading": 253.6, "pitch": -22.4, duration: 3 },
                        { "lat": 28.843931, "lng": 120.882302, "alt": 2803.8, "heading": 131.2, "pitch": -20.8, duration: 3 }
                    ]
                    if (this.isEasternFly)
                        this.map.setCameraView({"lat":28.843931,"lng":120.882302,"alt":2803.8,"heading":131.2,"pitch":-20.8})
                    else
                        // 视角切换（分步执行）
                        this.map.setCameraViewList(viewPoints)
                    this.isEasternFly = true
                    factoryTitle = '浙江括苍山风电场'
                    factoryPosition = { lng: 120.913288, lat: 28.819988, alt: 823.2}
                    break;
                case 2:
                    for (var k = 1; k <= 20; k++){
                        if (k <= 5) {
                            positions.push({ lng: 117.200756, lat: 23.38885 + k * 0.01, alt: 6.6})
                        }
                        else if(k <= 10){
                            positions.push({ lng: 117.210756, lat: 23.38885 + ( k - 5 ) * 0.01, alt: 6.6})
                        }
                        else if(k <= 15){
                            positions.push({ lng: 117.220756, lat: 23.38885 + ( k - 10 ) * 0.01, alt: 6.6})
                        }
                        else {
                            positions.push({ lng: 117.230756, lat: 23.38885 + ( k - 15 ) * 0.01, alt: 6.6})
                        }
                    }
                    viewPoints = [
                        { "lat": 23.419527, "lng": 117.164786, "alt": 1845.7, "heading": 93.2, "pitch": -21.3, duration: 5 },
                        { "lat": 23.37117, "lng": 117.213158, "alt": 1821, "heading": 4.6, "pitch": -21, duration: 3 },
                        { "lat": 23.416306, "lng": 117.269615, "alt": 1833.6, "heading": 273.3, "pitch": -19, duration: 3 },
                        { "lat": 23.472185, "lng": 117.218578, "alt": 1872.8, "heading": 183.4, "pitch": -19.4, duration: 3 },
                        { "lat": 23.419527, "lng": 117.164786, "alt": 1845.7, "heading": 93.2, "pitch": -21.3, duration: 3 },
                    ]
                    if (this.isSouthernFly)
                        this.map.setCameraView({ "lat": 23.419334, "lng": 117.164786, "alt": 1845.7, "heading": 93.2, "pitch": -21.3 })
                    else
                        // 视角切换（分步执行）
                        this.map.setCameraViewList(viewPoints)
                    this.isSouthernFly = true
                    factoryTitle = '广东汕头南澳岛风电场'
                    factoryPosition = { lng: 117.250791, lat: 23.419054, alt: 7}
                    break;
                case 3:
                    for (var j = 1; j <= 20; j++){
                        if (j <= 5) {
                            positions.push({ lng: 87.964237, lat: 43.544667 + j * 0.01, alt: 1138.6})
                        }
                        else if(j <= 10){
                            positions.push({ lng: 87.974237, lat: 43.544667 + ( j - 5 ) * 0.01, alt: 1138.6})
                        }
                        else if(j <= 15){
                            positions.push({ lng: 87.984237, lat: 43.544667 + ( j - 10 ) * 0.01, alt: 1138.6})
                        }
                        else {
                            positions.push({ lng: 87.994237, lat: 43.544667 + ( j - 15 ) * 0.01, alt: 1138.6})
                        }
                    }
                    viewPoints = [
                        { "lat": 43.57666, "lng": 87.915963, "alt": 4799, "heading": 93.3, "pitch": -37.1, duration: 5 },
                        { "lat": 43.524646, "lng": 87.973567, "alt": 4888.6, "heading": 6, "pitch": -38.1, duration: 3 },
                        { "lat": 43.573178, "lng": 88.045264, "alt": 4891, "heading": 271.5, "pitch": -32.9, duration: 3 },
                        { "lat": 43.624864, "lng": 87.980843, "alt": 4903.2, "heading": 183.2, "pitch": -38.4, duration: 3 },
                        { "lat": 43.57666, "lng": 87.915963, "alt": 4799, "heading": 93.3, "pitch": -37.1, duration: 3 }
                    ]
                    if (this.isWesternFly)
                        this.map.setCameraView({ "lat": 43.57666, "lng": 87.915963, "alt": 4799, "heading": 93.3, "pitch": -37.1 })
                    else
                        // 视角切换（分步执行）
                        this.map.setCameraViewList(viewPoints)
                    this.isWesternFly = true
                    factoryTitle = '新疆达坂城风电场'
                    factoryPosition = { lng: 88.007588, lat: 43.574361, alt: 1713.9}
                    break;
                default:
                    for (var i = 1; i <= 20; i++){
                        if (i <= 5) {
                            positions.push({ lng: 112.937053, lat: 41.270271 + i * 0.01, alt: 3319.4})
                        }
                        else if(i <= 10){
                            positions.push({ lng: 112.947053, lat: 41.270271 + ( i - 5 ) * 0.01, alt: 3319.4})
                        }
                        else if(i <= 15){
                            positions.push({ lng: 112.957053, lat: 41.270271 + ( i - 10 ) * 0.01, alt: 3319.4})
                        }
                        else {
                            positions.push({ lng: 112.967053, lat: 41.270271 + ( i - 15 ) * 0.01, alt: 3319.4})
                        }
                    }
                    viewPoints = [
                        { "lat": 41.300225, "lng": 112.874408, "alt": 5020.9, "heading": 88.7, "pitch": -29.5, duration: 5 },
                        { "lat": 41.241012, "lng": 112.95336, "alt": 5001.4, "heading": 357.5, "pitch": -29.5, duration: 3 } ,
                        { "lat": 41.293692, "lng": 113.022992, "alt": 5010.9, "heading": 275.6, "pitch": -31.1, duration: 3 },
                        { "lat": 41.358879, "lng": 112.957203, "alt": 5022.1, "heading": 184.3, "pitch": -32.4, duration: 3 },
                        { "lat": 41.300225, "lng": 112.874408, "alt": 5020.9, "heading": 88.7, "pitch": -29.5, duration: 3 }
                    ]
                    if (this.isNorthernFly)
                        this.map.setCameraView({"lat": 41.300225, "lng": 112.874408, "alt": 5020.9, "heading": 88.7, "pitch": -29.5})
                    else
                        // 视角切换（分步执行）
                        this.map.setCameraViewList(viewPoints)
                    this.isNorthernFly = true
                    factoryTitle = '内蒙古辉腾锡勒风电场'
                    factoryPosition = { lng: 112.991873, lat: 41.300298, alt: 1713.9}
            }

            //创建风电场数据图层
            let titleLayer = new mars3d.layer.GraphicLayer({ id: '风电场名称' })
            this.map.addLayer(titleLayer)
            // 添加风电场名称
            var titleGraphic = new mars3d.graphic.LabelEntity({
                position: new mars3d.LngLatPoint(factoryPosition.lng, factoryPosition.lat, factoryPosition.lat),
                style: {
                    text: factoryTitle,
                    font_size: 30,
                    font_family: "楷体",
                    color: "#0081c2",
                    outline: true,
                    outlineColor: "#ffffff",
                    outlineWidth: 2,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1000000),
                    clampToGround: true,

                    // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
                    highlight: {
                        font_size: 40
                    }
                },
            })
            titleLayer.addGraphic(titleGraphic)

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
                    id: index + 1,
                    position: item,
                    style: {
                        url: '//data.mars3d.cn/gltf/mars/fengche.gltf',
                        heading: 90,
                        scale: 100,
                        minimumPixelSize: 30,
                        fill: true,
                        color: 'white',
                        clampToGround: true
                    },
                })
                turbineLayer.addGraphic(turbineGraphic)

                // 功率 普通贴图
                // var powerGraphic = new mars3d.graphic.CanvasBillboard({
                //     id: index + 11,
                //     position: item,
                //     style: {
                //         text: ' ↻',
                //         horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                //         verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                //         scaleByDistance: new Cesium.NearFarScalar(6000, 0.25,10000, 0.15),
                //         distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000),
                //         clampToGround: true
                //     }
                // })
                // powerLayer.addGraphic(powerGraphic)

                // 功率 动态图
                var powerGraphicLight = new mars3d.graphic.DivBoderLabel({
                    id: index + 21,
                    position: item,
                    style: {
                        text: `预测功率：加载中↻`,
                        font_size: 14,
                        font_family: "楷体",
                        color: "#ccc",
                        boderColor: "#15d1f2",
                        addHeight: 0,
                        clampToGround: true,
                        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000)
                    },
                    pointerEvents: false
                })
                powerLayer.addGraphic(powerGraphicLight)
            })

            // 功率 普通贴图
            // 随机更新功率文本
            // this.intervalId = setInterval(() => {
            //     powerLayer.eachGraphic((graphic) => {
            //         graphic.text = Math.random().toFixed(3) * 1000 // 更新文本
            //     })
            // }, 2000)

            // var powerArray = []

            // 第一次计时器
            // 功率 动态图
            // 随机更新功率文本
            this.intervalId = setInterval(() => {
                // 统计量置零
                this.gzNum = 0
                this.whNum = 0
                this.djNum = 0
                this.bwNum = 0

                // this.eSum = 0
                // this.sSum = 0
                // this.wSum = 0
                // this.nSum = 0

                var tempSum = 0

                powerLayer.eachGraphic((graphic) => {
                    var power = (Math.random() - 0.1).toFixed(3) * 1000 // 随机数据文本
                    // 故障 维护 待机 并网
                    if (power < 0) {
                        power = 0
                        graphic.setStyle({
                            boderColor: "red"
                        })
                        this.gzNum += 1
                        // 故障风机ID
                        this.turbineIdError.push(graphic.id - 20)
                    }
                    else if (power < 50) {
                        graphic.setStyle({
                            boderColor: "yellow"
                        })
                        this.whNum += 1
                    }
                    else if (power < 100) {
                        graphic.setStyle({
                            boderColor: "#37A2DA"
                        })
                        this.djNum += 1
                    }
                    else {
                        graphic.setStyle({
                            boderColor: "#15d1f2"
                        })
                        this.bwNum += 1
                    }

                    tempSum += power
                    // 更新预测功率
                    graphic.setStyle({
                        text: `预测功率：${power} KW`
                    })
                })
                // 更新风机状态图表数据
                this.chartsDataState = [
                    { name: "并网", value: this.bwNum },
                    { name: "待机", value: this.djNum },
                    { name: "故障", value: this.gzNum },
                    { name: "维护", value: this.whNum }
                ]
                this.myOptionState = {
                    tooltip: {
                        trigger: "item",
                        formatter: "{b}<br/>{c} 占{d}%",
                    },
                    // 图例 的相关设置
                    legend: {
                        orient: "vertical",
                        left: "right",
                        textStyle: {
                            color: "#fff"
                        }
                    },
                    // 图形的设置
                    series: [
                        {
                            // name: '访问来源',
                            type: "pie",
                            radius: "80%",
                            right: "20%",
                            // 图形上文本标签的样式设置
                            label: {
                                show: true,
                                position: "inside",
                                formatter: "{c}",
                                fontWeight: "bold"
                            },
                            color: [
                                "#15d1f2",
                                "#37A2DA",
                                "red",
                                "yellow"
                            ],
                            center: ["45%", "55%"],
                            data: this.chartsDataState, // 使用for循环添加
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: "rgba(0, 0, 0, 0.5)"
                                }
                            }
                        }
                    ]
                }
                // 更新各风电场总预测功率
                switch (id) {
                    case 1:
                        this.eSum = tempSum
                        break;
                    case 2:
                        this.sSum = tempSum
                        break;
                    case 3:
                        this.wSum = tempSum
                        break;
                    default:
                        this.nSum = tempSum
                }
                this.myOptionPower = {
                    // xAxis和yAxis的nameTextStyle不起作用
                    // 因此设置了字体的全局样式
                    textStyle: {
                        color: "#ccc"
                    },
                    title: {
                        text: "单位:" + "kw",
                        // 全局样式对此不生效，
                        textStyle: {
                            color: "#fff",
                            fontSize: 12
                        }
                    },
                    // 移入柱子时的阴影
                    tooltip: {
                        trigger: "axis",
                        formatter: "{b}<br/>{c}" + "kw",
                        axisPointer: {
                            type: "shadow"
                        }
                    },
                    grid: {
                        left: "5px",
                        right: "0",
                        bottom: "5px",
                        containLabel: true
                    },
                    xAxis: {
                        type: "category",
                        data: ["东部","南部","西部","北部"]
                    },
                    yAxis: {
                        type: "value"
                    },
                    series: [
                    {
                        // 柱子的相关设置
                        itemStyle: {
                            color: "rgb(0, 174, 255)"
                        },
                        barWidth: "20px",
                        type: "bar",
                        emphasis: {
                            focus: "series"
                        },
                        data: [this.eSum,this.sSum,this.wSum,this.nSum]
                    }
                    ]
                }
            }, 5000)

            // 风机提示
            turbineLayer.bindTooltip("单击:显示风机大致情况<br />右击:查看风机详细情况",{direction:"right"})

            // 在turbineLayer图层绑定Popup弹窗
            turbineLayer.bindPopup((event)=> {
                // console.log(event.graphic)
                const attr = {}
                attr["时间"] = "2022/1/2  0:00:00"
                attr["风速"] = Math.random().toFixed(2) * 10
                attr["实际功率"] = (Math.random() - 0.1).toFixed(3) * 1000
                // 停止计时器
                clearInterval(this.intervalId);

                return mars3d.Util.getTemplateHtml({ title: event.graphic.id + ' 号 风 机', template: "all", attr: attr })
            })

            // 右击查看对应风机具体情况
            turbineLayer.eachGraphic((graphic) => {
                graphic.on(mars3d.EventType.rightClick, ()=> {
                    this.$router.push('/turbine')
                    const h = this.$createElement;
                    this.$message({
                        message: h('p', null, [
                            h('span', null, '已成功切换至 '),
                            h('i', { style: 'color: teal' }, graphic.id + '号风机')
                        ]),
                        offset: 50
                    });
                    // 清除计时器
                    if (this.intervalId !== null) {
                        // 如果已经有一个正在运行的定时器，停止它
                        clearInterval(this.intervalId);
                        this.intervalId = null;
                    }
                })
            })

            // 关闭弹窗时第二次计时器
            turbineLayer.on(mars3d.EventType.popupClose, ()=> {
                this.intervalId = setInterval(() => {
                    // 统计量置零
                    this.gzNum = 0
                    this.whNum = 0
                    this.djNum = 0
                    this.bwNum = 0

                    // this.eSum = 0
                    // this.sSum = 0
                    // this.wSum = 0
                    // this.nSum = 0

                    var tempSum = 0
                    powerLayer.eachGraphic((graphic) => {
                        var power = (Math.random() - 0.2).toFixed(3) * 1000 // 随机数据文本
                        // 故障 维护 待机 并网
                        if (power < 0) {
                            power = 0
                            graphic.setStyle({
                                boderColor: "red"
                            })
                            this.gzNum += 1
                        }
                        else if (power < 50) {
                            graphic.setStyle({
                                boderColor: "yellow"
                            })
                            this.whNum += 1
                        }
                        else if (power < 100) {
                            graphic.setStyle({
                                boderColor: "#37A2DA"
                            })
                            this.djNum += 1
                        }
                        else {
                            graphic.setStyle({
                                boderColor: "#15d1f2"
                            })
                            this.bwNum += 1
                        }

                        tempSum += power
                        // 更新预测功率
                        graphic.setStyle({
                            text: `预测功率：${power} KW`
                        })
                    })
                    // 更新风机状态图表数据
                    this.chartsDataState = [
                        { name: "并网", value: this.bwNum },
                        { name: "待机", value: this.djNum },
                        { name: "故障", value: this.gzNum },
                        { name: "维护", value: this.whNum }
                    ]
                    this.myOptionState = {
                        tooltip: {
                            trigger: "item",
                            formatter: "{b}<br/>{c} 占{d}%",
                        },
                        // 图例 的相关设置
                        legend: {
                            orient: "vertical",
                            left: "right",
                            textStyle: {
                                color: "#fff"
                            }
                        },
                        // 图形的设置
                        series: [
                            {
                                // name: '访问来源',
                                type: "pie",
                                radius: "80%",
                                right: "20%",
                                // 图形上文本标签的样式设置
                                label: {
                                    show: true,
                                    position: "inside",
                                    formatter: "{c}",
                                    fontWeight: "bold"
                                },
                                color: [
                                    "#15d1f2",
                                    "#37A2DA",
                                    "red",
                                    "yellow"
                                ],
                                center: ["45%", "55%"],
                                data: this.chartsDataState, // 使用for循环添加
                                emphasis: {
                                    itemStyle: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: "rgba(0, 0, 0, 0.5)"
                                    }
                                }
                            }
                        ]
                    }
                    // 更新各风电场总预测功率
                    switch (id) {
                        case 1:
                            this.eSum = tempSum
                            break;
                        case 2:
                            this.sSum = tempSum
                            break;
                        case 3:
                            this.wSum = tempSum
                            break;
                        default:
                            this.nSum = tempSum
                    }
                    this.myOptionPower = {
                        // xAxis和yAxis的nameTextStyle不起作用
                        // 因此设置了字体的全局样式
                        textStyle: {
                            color: "#ccc"
                        },
                        title: {
                            text: "单位:" + "kw",
                            // 全局样式对此不生效，
                            textStyle: {
                                color: "#fff",
                                fontSize: 12
                            }
                        },
                        // 移入柱子时的阴影
                        tooltip: {
                            trigger: "axis",
                            formatter: "{b}<br/>{c}" + "kw",
                            axisPointer: {
                                type: "shadow"
                            }
                        },
                        grid: {
                            left: "5px",
                            right: "0",
                            bottom: "5px",
                            containLabel: true
                        },
                        xAxis: {
                            type: "category",
                            data: ["东部","南部","西部","北部"]
                        },
                        yAxis: {
                            type: "value"
                        },
                        series: [
                        {
                            // 柱子的相关设置
                            itemStyle: {
                                color: "rgb(0, 174, 255)"
                            },
                            barWidth: "20px",
                            type: "bar",
                            emphasis: {
                                focus: "series"
                            },
                            data: [this.eSum,this.sSum,this.wSum,this.nSum]
                        }
                        ]
                    }
                }, 5000)
            })

            // // 一定高度点击风机跳转视角 并删除风场
            // if (this.map.camera.positionCartographic.height >= 100000) {
            //     // 绑定点击风机事件
            //     turbineLayer.on(mars3d.EventType.click, () => {
            //         console.log(this.map.camera.positionCartographic.height)
            //         // 相机视角定位至风机群
            //         switch (id) {
            //             case 1:
            //                 this.map.setCameraView({ "lat": 28.843931, "lng": 120.882302, "alt": 2803.8, "heading": 131.2, "pitch": -20.8})
            //                 break;
            //             case 2:
            //                 this.map.setCameraView({ "lat": 23.419527, "lng": 117.164786, "alt": 1845.7, "heading": 93.2, "pitch": -21.3})
            //                 break;
            //             case 3:
            //                 this.map.setCameraView({ "lat": 43.57666, "lng": 87.915963, "alt": 4799, "heading": 93.3, "pitch": -37.1 })
            //                 break;
            //             default:
            //                 this.map.setCameraView({"lat": 41.300225, "lng": 112.874408, "alt": 5020.9, "heading": 88.7, "pitch": -29.5})
            //         }
            //         // 删除风场图层
            //         // 跟踪相机实例
            //         this.map.trackedEntity = null
            //         if (this.windLayer) {
            //             this.map.removeLayer(this.windLayer, true)
            //             this.windLayer = null
            //         }
            //     })
            // }
        },
        // 控制风场
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
        // 控制人物
        controlCha() {
            // 人物控制器
            this.controller = new CesiumRoleController(mars3d.Cesium, this.map.viewer)
            if (!this.isControl) {
                this.map.setCursor("crosshair")

                this.map.once("click", (event) => {
                    this.map.setCursor("default")
                    this.initController(event.cartesian)
                })
                this.isControl = true
            } else {
                this.controller.destroy()
                this.isControl = false
            }
        },
        initController(position) {
            const point = mars3d.LngLatPoint.fromCartesian(position) // 转为经纬度
            this.controller.init({
                position: [point.lng, point.lat, point.alt],
                url: "//data.mars3d.cn/gltf/mars/man/running.glb",
                animation: "run",
                lockViewLevel: 1,
                pitch: -25,
                speed: 0.1,
                range: 50
            })
            this.isControl = true
        },
        // 返回首页 
        backToHome() {
            this.$router.push('/home')
            // 清除计时器
            if (this.intervalId !== null) {
                // 如果已经有一个正在运行的定时器，停止它
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        },
        // 检视风电场
        turnToBuilding() {
            // 移除风场
            if (this.windLayer) {
                this.map.removeLayer(this.windLayer, true)
                this.windLayer = null
            }

            // this.map.setCameraView({"lat":43.573973,"lng":87.903254,"alt":1262.6,"heading":134.6,"pitch":-3.4})
            this.map.setCameraView({ "lat": 43.581253, "lng": 87.857363, "alt": 1484, "heading": 94, "pitch": -6.3 })
            // 开启键盘漫游
            this.map.keyboardRoam.enabled = true
            this.map.keyboardRoam.minHeight = 80
            this.map.keyboardRoam.setOptions({
                moveStep: 0.5, // 平移步长 (米)。
                dirStep: 5, // 相机原地旋转步长，值越大步长越小。
                rotateStep: 2.0, // 相机围绕目标点旋转速率，0.3-2.0
                minPitch: 0.1, // 最小仰角  0-1
                maxPitch: 0.95 // 最大仰角  0-1
            })
            this.hideBottomPanel()
        },
        // 漫游风电场
        wanderTurbine() {
            // 移除风场
            if (this.windLayer) {
                this.map.removeLayer(this.windLayer, true)
                this.windLayer = null
            }

            var wonderLayer = new mars3d.layer.GraphicLayer()
            this.map.addLayer(wonderLayer)
            const positions = [
                [88.062549, 43.574906, 2197.7],
                [87.943603, 43.576979, 2217.3]
            ]
            var fixedRoute = new mars3d.graphic.FixedRoute({
                name: "场站漫游路线",
                speed: 3000,
                positions: positions,
                clockLoop: false,      //是否循环播放
                clockRange: Cesium.ClockRange.CLAMPED, // CLAMPED 到达终止时间后停止
                camera: {
                    type: "dy",
                    // offsetX: 1000,
                    // offsetY: 1000
                }
            })
            wonderLayer.addGraphic(fixedRoute)

            if (!this.isWonder) {
                // 开始漫游
                fixedRoute.start()
            }
            else {
                // 停止漫游
                fixedRoute.pause()
            }
            this.isWonder = !this.isWonder
        },
        // 添加Echarts图形
        // chart Echart圆形
        // chart Echart柱状
        // chart Echart其他
        // 参数为前数据 后dom
        initCharts(arrState, arrPowerSum, arrWeather1, arrWeather2, arrWeather3, state, powerSum, weather1, weather2, weather3) {
            // 风机状态统计图
            this.myChartState = echarts.init(state)
            this.myOptionState = {
                tooltip: {
                    trigger: "item",
                    formatter: "{b}<br/>{c} 占{d}%",
                },
                // 图例 的相关设置
                legend: {
                    orient: "vertical",
                    left: "right",
                    textStyle: {
                        color: "#fff"
                    }
                },
                // 图形的设置
                series: [
                    {
                        // name: '访问来源',
                        type: "pie",
                        radius: "80%",
                        right: "20%",
                        // 图形上文本标签的样式设置
                        label: {
                            show: true,
                            position: "inside",
                            formatter: "{c}",
                            fontWeight: "bold"
                        },
                        color: [
                            "#15d1f2",
                            "#37A2DA",
                            "red",
                            "yellow"
                        ],
                        center: ["45%", "55%"],
                        data: arrState, // 使用for循环添加
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: "rgba(0, 0, 0, 0.5)"
                            }
                        }
                    }
                ]
            }
            this.myChartState.setOption(this.myOptionState)

            // 各风电场预测总功率统计图
            const arrName = []
            const arrValue = []
            for (let i = 0; i < arrPowerSum.length; i++) {
                arrName[i] = arrPowerSum[i].name
                arrValue[i] = arrPowerSum[i].value
            }
            this.myChartPower = echarts.init(powerSum)
            this.myOptionPower = {
                // xAxis和yAxis的nameTextStyle不起作用
                // 因此设置了字体的全局样式
                textStyle: {
                    color: "#ccc"
                },
                title: {
                    text: "单位:" + "kw",
                    // 全局样式对此不生效，
                    textStyle: {
                        color: "#fff",
                        fontSize: 12
                    }
                },
                // 移入柱子时的阴影
                tooltip: {
                    trigger: "axis",
                    formatter: "{b}<br/>{c}" + "kw",
                    axisPointer: {
                        type: "shadow"
                    }
                },
                grid: {
                    left: "5px",
                    right: "0",
                    bottom: "5px",
                    containLabel: true
                },
                xAxis: {
                    type: "category",
                    data: arrName
                },
                yAxis: {
                    type: "value"
                },
                series: [
                {
                    // 柱子的相关设置
                    itemStyle: {
                        color: "rgb(0, 174, 255)"
                    },
                    barWidth: "20px",
                    type: "bar",
                    emphasis: {
                        focus: "series"
                    },
                    data: arrValue
                }
                ]
            }
            this.myChartPower.setOption(this.myOptionPower)

            // 风向 风速图
            const directionMap = {};
            // 风向对象
            const windDirection = ['W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE', 'E', 'ENE', 'NE', 'NNE', 'N', 'NNW', 'NW', 'WNW']
            windDirection.forEach(function (name, index) {
                directionMap[name] = Math.PI / 8 * index;
            });
            const data = arrWeather1.map(function (entry) {
                // 找出与风向数值最接近的方向
                let closestDirection = 'W'; // 默认值
                let smallestDifference = Math.abs(Number(entry.WINDDIRECTION) - directionMap[closestDirection] / Math.PI * 180);
                for (var direction in directionMap) {
                    let difference = Math.abs(Number(entry.WINDDIRECTION) - directionMap[direction] / Math.PI * 180);
                    if (difference < smallestDifference) {
                        smallestDifference = difference;
                        closestDirection = direction;
                    }
                }
                // 时间转换
                let date = new Date(entry.DATATIME);
                let isoFormat = date.toISOString();
                return [isoFormat, closestDirection, Number(entry.WINDSPEED), Number(entry.AWS)];
            });
            // 索引
            const dims = {
                DATATIME: 0,
                WINDDIRECTION: 1,
                WINDSPEED: 2,
                AWS: 3
            };
            // 箭头图标大小
            const arrowSize = 18;
            const renderArrow = function (param, api) {
                const point = api.coord([
                    api.value(dims.DATATIME),
                    api.value(dims.AWS)
                ]);
                return {
                    type: 'path',
                    shape: {
                        pathData: 'M31 16l-15-15v9h-26v12h26v9z',
                        x: -arrowSize / 2,
                        y: -arrowSize / 2,
                        width: arrowSize,
                        height: arrowSize
                    },
                    rotation: directionMap[api.value(dims.WINDDIRECTION)],
                    position: point,
                    style: api.style({
                        stroke: '#555',
                        lineWidth: 1
                    })
                };
            };
            this.myChartWeather1 = echarts.init(weather1)
            this.myOptionWeather1 = {
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        return [
                            echarts.format.formatTime(
                                'yyyy-MM-dd',
                                params[0].value[dims.DATATIME]
                            ) +
                            ' ' +
                            echarts.format.formatTime('hh:mm', params[0].value[dims.DATATIME]),
                            '风向：' + params[0].value[dims.WINDDIRECTION],
                            '预测风速：' + params[0].value[dims.WINDSPEED],
                            '实际风速：' + params[0].value[dims.AWS]
                        ].join('<br>');
                    }
                },
                grid: {
                    top: 10,
                    bottom: 80
                },
                xAxis: {
                    type: 'time',
                    minInterval: 3600 * 1000 * 0.4,
                    maxInterval: 3600 * 1000 * 24,
                    splitLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    }
                },
                yAxis: [
                    {
                        name: '实际风速',
                        nameLocation: 'middle',
                        nameGap: 14,
                        nameTextStyle: {
                            fontSize: 11,
                            color: "#fff"
                        },
                        axisLine: {
                            lineStyle: {
                            color: '#666'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#ddd'
                            }
                        }
                    },
                    {
                        name: '预测风速',
                        nameLocation: 'middle',
                        nameGap: 16,
                        nameTextStyle: {
                            fontSize: 11,
                            color: "#fff"
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#15D1F2'
                            }
                        },
                        splitLine: { show: false }
                    },
                    {
                        axisLine: { show: false },
                        axisTick: { show: false },
                        axisLabel: { show: false },
                        splitLine: { show: false }
                    }
                ],
                visualMap: {
                    type: 'piecewise',
                    // show: false,
                    orient: 'horizontal',
                    left: 'center',
                    bottom: 0,
                    textStyle: {
                        color: "#fff"
                    },
                    pieces: [
                        {
                            gte: 6,
                            color: '#18BF12',
                            label: '大风'
                        },
                        {
                            gte: 3,
                            lt: 6,
                            color: '#f4e9a3',
                            label: '中风'
                        },
                        {
                            lt: 3,
                            color: '#D33C3E',
                            label: '微风'
                        }
                    ],
                    seriesIndex: 1,
                    dimension: 3
                },
                dataZoom: [
                    {
                        type: 'inside',
                        xAxisIndex: 0,
                        minSpan: 2
                    },
                    {
                        type: 'slider',
                        xAxisIndex: 0,
                        minSpan: 2,
                        bottom: 30,
                        height: 20,
                        handleStyle: {
                            boderColor: "#fff",
                            borderWidth: 2
                        }
                    }
                ],
                series: [
                    {
                        type: 'line',
                        yAxisIndex: 1,
                        showSymbol: false,
                        emphasis: {
                            scale: false
                        },
                        symbolSize: 10,
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                global: false,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: 'rgba(88,160,253,1)'
                                    },
                                    {
                                        offset: 0.5,
                                        color: 'rgba(88,160,253,0.7)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(88,160,253,0)'
                                    }
                                ]
                            }
                        },
                        lineStyle: {
                            color: 'rgba(88,160,253,1)'
                        },
                        itemStyle: {
                            color: 'rgba(88,160,253,1)'
                        },
                        encode: {
                            x: dims.DATATIME,
                            y: dims.WINDSPEED
                        },
                        data: data,
                        z: 2
                    },
                    {
                        type: 'custom',
                        renderItem: renderArrow,
                        encode: {
                            x: dims.DATATIME,
                            y: dims.AWS
                        },
                        data: data,
                        z: 10
                    },
                    {
                        type: 'line',
                        symbol: 'none',
                        encode: {
                            x: dims.DATATIME,
                            y: dims.AWS
                        },
                        lineStyle: {
                            color: '#aaa',
                            type: 'dotted'
                        },
                        data: data,
                        z: 1
                    }
                ]
            };
            this.myChartWeather1.setOption(this.myOptionWeather1)

            // 温度图
            this.myChartWeather2 = echarts.init(weather2)
            this.myOptionWeather2 = {
                series: [
                    {
                        type: 'gauge',
                        center: ['50%', '65%'],
                        startAngle: 200,
                        endAngle: -20,
                        min: 0,
                        max: 60,
                        splitNumber: 12,
                        itemStyle: {
                            color: '#FFAB91'
                        },
                        progress: {
                            show: true,
                            width: 20
                        },
                        pointer: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                width: 20
                            }
                        },
                        axisTick: {
                            distance: -30,
                            splitNumber: 5,
                            lineStyle: {
                                width: 1,
                                color: '#999'
                            }
                        },
                        splitLine: {
                            distance: -37,
                            length: 14,
                            lineStyle: {
                                width: 2,
                                color: '#999'
                            }
                        },
                        axisLabel: {
                            distance: -10,
                            color: '#999',
                            fontSize: 14
                        },
                        anchor: {
                            show: false
                        },
                        title: {
                            show: false
                        },
                        detail: {
                            valueAnimation: true,
                            width: '60%',
                            lineHeight: 40,
                            borderRadius: 8,
                            offsetCenter: [0, '-5%'],
                            fontSize: 20,
                            fontWeight: 'bolder',
                            formatter: '{value} °C',
                            color: 'inherit'
                        },
                        data: [
                            {
                                value: null
                            }
                        ]
                    },
                    {
                        type: 'gauge',
                        center: ['50%', '65%'],
                        startAngle: 200,
                        endAngle: -20,
                        min: 0,
                        max: 60,
                        itemStyle: {
                            color: '#FD7347'
                        },
                        progress: {
                            show: true,
                            width: 6
                        },
                        pointer: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        },
                        detail: {
                            show: false
                        },
                        data: [
                            {
                                value: null
                            }
                        ]
                    }
                ]
            }
            this.myChartWeather2.setOption(this.myOptionWeather2)
            let index = 0; // 创建一个索引变量
            let len = arrWeather2.length; // 获取数据的长度
            setInterval(()=> {
                this.myChartWeather2.setOption({
                    series: [
                    {
                        data: [
                            {
                                value: Number(arrWeather2[index]["TEMPERATURE"])
                            }
                        ]
                    },
                    {
                        data: [
                            {
                                value: Number(arrWeather2[index]["TEMPERATURE"])
                            }
                        ]
                    }
                    ]
                });
                index++; // 更新索引

                // 如果索引超过数组长度，重置为0
                if(index == len) {
                    index = 0;
                }
            }, 2000);

            // 气压 湿度图
            this.myChartWeather3 = echarts.init(weather3)
            // 取前1/2数据
            let halfLength = Math.floor(arrWeather3.length / 2);
            let firstHalf = arrWeather3.slice(0, halfLength);
            // 序号
            const order = (function () {
                let res = [];
                let len = halfLength;
                while (len--) {
                    res.push(halfLength - len - 1);
                }
                return res;
            })();
            // 时间
            let firstElements = firstHalf.map(function(item) {
                return item.DATATIME; // 返回每个数组的第一个元素
            });
            // 气压
            let secondElements = firstHalf.map(function(item) {
                return Number(item.PRESSURE); // 返回每个数组的第二个元素
            });
            // 湿度
            let thirdElements = firstHalf.map(function(item) {
                return Number(item.HUMIDITY); // 返回每个数组的第三个元素
            });
            // 取后1/2数据
            // 剩余部分
            let remainingPart = arrWeather3.slice(halfLength);
            // 时间
            let firstRemainingElements = remainingPart.map(function(item) {
                return item.DATATIME; // 返回每个数组的第一个元素
            });
            // 气压
            let secondRemainingElements = remainingPart.map(function(item) {
                return Number(item.PRESSURE); // 返回每个数组的第二个元素
            });
            // 湿度
            let thirdRemainingElements = remainingPart.map(function(item) {
                return Number(item.HUMIDITY); // 返回每个数组的第三个元素
            });
            this.myOptionWeather3 = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#283b56'
                        }
                    }
                },
                grid: {
                    top: '20%',
                    bottom: '15%',
                    left: '15%',
                    right: '15%'
                },
                legend: {
                    textStyle: {
                        color:"#fff"
                    }
                },
                dataZoom: {
                    show: false,
                    start: 0,
                    end: 100
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: true,
                        data: firstElements
                    },
                    {
                        type: 'category',
                        boundaryGap: true,
                        data: order,
                        show: false
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        scale: true,
                        name: '气压',
                        nameTextStyle: {
                            color: "#fff"
                        }
                    },
                    {
                        type: 'value',
                        scale: true,
                        name: '湿度',
                        max: 100,
                        min: 0,
                        nameTextStyle: {
                            color: "#fff"
                        }
                    }
                ],
                series: [
                    {
                        name: '气压',
                        type: 'bar',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        data: secondElements,
                        barWidth: '40%'
                    },
                    {
                        name: '湿度',
                        type: 'line',
                        data: thirdElements
                    }
                ]
            }
            this.myChartWeather3.setOption(this.myOptionWeather3)
            var count = 0
            var temp = halfLength
            var tempSecond = secondElements.slice()
            var tempThird = thirdElements.slice()
            var tempFirst = firstElements.slice()
            var tempOrder = order.slice()
            setInterval(() => {
                tempSecond.shift();
                tempSecond.push(secondRemainingElements[count]);
                tempThird.shift();
                tempThird.push(thirdRemainingElements[count]);
                tempFirst.shift();
                tempFirst.push(firstRemainingElements[count]);
                tempOrder.shift();
                temp += 1
                tempOrder.push(temp);
                this.myChartWeather3.setOption({
                    xAxis: [
                        {
                            data: tempFirst
                        },
                        {
                            data: tempOrder
                        }
                    ],
                    series: [
                        {
                            data: tempSecond
                        },
                        {
                            data: tempThird
                        }
                    ]
                })
                count++
                if (count == remainingPart.length) {
                    count = 0
                }
            }, 2000);

            window.addEventListener("resize", ()=> {
                this.myChartState.resize()
                this.myChartPower.resize()
                this.myChartWeather1.resize()
                this.myChartWeather2.resize()
                this.myChartWeather3.resize()
            })
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
                $(".bar-content-left").css("display","none")
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
                    $(".bar-content-left").css("display","flex")
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
                $(".bar-content-right").css("display","none")
            }
            else {
                $(".sideBar.right").addClass("fadeInRight")
                $(".sideBar.right").css({
                    "width": "20%",
                    "opacity": "0",
                    "box-shadow": "0 10px 100px 0 rgba(1, 48, 102, 0.8) inset",
                    "background-color": "transparent"
                })
                setTimeout(function () {
                    $(".bar-content-right").css("display","flex")
                },1000)
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
                    "height": "15%",
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
        closeImgPanel() {
            $("#explanatoryPicture").css("display","none")
        }
    },
    watch: {
        myOptionState: {
            handler: function () {
                this.myChartState.setOption(this.myOptionState)
            },
            deep: true
        },
        myOptionPower: {
            handler: function () {
                this.myChartPower.setOption(this.myOptionPower)
            }
        }
    }

}

</script>

<style lang="less" scoped>
.mapcontainer {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    user-select: none;
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
        width: 100%;
        justify-content: space-around;
        align-items: center;
    }

    // 侧栏图表
    .chartList {
        font-size: 14px;
        color: #ffffff;
        height: 90%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        li{
            border-bottom: white 0.5px dashed;
            padding-bottom: 5px;
        }
        li:hover {
            padding: 10px;
            background-color: rgba(32, 176 ,203, 0.4);
        }
        .typeA{
            color: #CD6F43;
        }
        .typeB{
            color: #328D98;
        }
        .typeC{
            color: #E0B041;
        }
    }
    .chartbox {
        display: flex;
        flex-direction: column;
        width: 90%;
        height: 28.5%;
        border: 1px solid #17366c;
        background: linear-gradient(to left, #3897cf, #3897cf) left top no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) left top no-repeat,
            linear-gradient(to left, #3897cf, #3897cf) right top no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) right top no-repeat,
            linear-gradient(to left, #3897cf, #3897cf) left bottom no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) left bottom no-repeat,
            linear-gradient(to left, #3897cf, #3897cf) right bottom no-repeat, linear-gradient(to left, #3897cf, #3897cf) right bottom no-repeat;
        background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
        background-color: rgba(0, 0, 0, 0.1);
        h5 {
            color: #ffffff;
            letter-spacing: 3px;
        }
    }
    #state,
    #powerSum,
    #weather1,
    #weather2,
    #weather3 {
        width: 100%;
        height: 100%;
    }

    // 底部 
    .bottomBar {
        position: absolute;
        bottom: 0;
        left: 22%;
        right: 22%;
        width: 56%;
        height: 15%;
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
        flex-direction: column;
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

    // 底栏按钮
    .el-row {
        width: 98%;
        height: 40% !important;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
    #row2 {
        width: 100%;
        margin-bottom: 2.5vh;
        .bbottomButton {
            width: 90%;
        }
    }
    .bar-content-bottom .el-button {
        width: 95%;
        background-color: rgba(0,183,254,0.5);
        border: none;
        font-size: 0.6rem;
        font-weight: 800;
        color: white;
    }
    .bar-content-bottom .el-button:hover,
    .bar-content-bottom .el-button:active {
        background-color: #20B0CB;
        color: white
    }

    // 按键图
    #explanatoryPicture {
        display: none;
    }
    // 关闭按键按钮
    .closeButton {
        position: absolute;
        top:0%;
        right:20%;
        font-size: 12px;
        color: white;
    }
    .closeButton:hover {
        cursor: pointer;
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
