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
                    <el-col>
                        <el-row>
                            <el-button plain @click="backToHome">返回主页</el-button>
                        </el-row>
                        <el-row>
                            <el-button plain @click="turnToBuilding">检视风电场</el-button>
                        </el-row>
                        <el-row>
                            <el-button plain @click="chargeWindField">显示 / 关闭风场</el-button>
                        </el-row>
                    </el-col>
                    <el-col>
                        <el-row>
                            <el-button plain @click="addTurbineLayer(1)">东部：浙江括苍山风电场</el-button>
                        </el-row>
                        <el-row>
                            <el-button plain @click="addTurbineLayer(2)">南部：广东汕头南澳岛风电场</el-button>
                        </el-row>
                        <el-row>
                            <el-button plain @click="addTurbineLayer(3)">西部：新疆达坂城风电场</el-button>
                        </el-row>
                        <el-row>
                            <el-button plain @click="addTurbineLayer(4)">北部：内蒙古辉腾锡勒风电场</el-button>
                        </el-row>
                    </el-col>
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
import * as turf from '@turf/turf'
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
                position: { lng: 87.932892, lat: 43.573134, alt: 1153.7 },
                maximumScreenSpaceError: 16,
                tooltip: "新疆达坂城风电场办公楼",
                scale: 10,
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
            isBottomOpen: true
        }
    },
    methods: {
        // 地图构造完成回调
        onMapload() {
            // 开场
            this.map.openFlyAnimation()
            this.map.setCameraView({ lat: 20.648765, lng: 129.340334, alt: 19999976, heading: 355, pitch: -90 })
            // this.map.scene.globe.terrainExaggeration = 2 // 修改地形夸张程度

            this.addWindLayer()
            // this.addChinaMap()
            setTimeout(function () {
                $(".sideBar.left").removeClass("opacity0").removeClass("fadeOutLeft").addClass("animated fadeInLeft")
                $(".sideBar.right").removeClass("opacity0").removeClass("fadeOutRight").addClass("animated fadeInRight")
                $(".bottomBar").removeClass("opacity0").removeClass("fadeOutDown").addClass("animated fadeInUp")
            }, 2000)

            // 开启键盘漫游
            this.map.keyboardRoam.enabled = true
            this.map.keyboardRoam.minHeight = 80
            this.map.keyboardRoam.setOptions({
                moveStep: 10, // 平移步长 (米)。
                dirStep: 25, // 相机原地旋转步长，值越大步长越小。
                rotateStep: 1.0, // 相机围绕目标点旋转速率，0.3-2.0
                minPitch: 0.1, // 最小仰角  0-1
                maxPitch: 0.95 // 最大仰角  0-1
            })

            //webgl渲染失败后，刷新页面
            this.map.on(mars3d.EventType.renderError, function () {
                window.location.reload();
            });
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

            // 功率 动态图
            // 随机更新功率文本
            this.intervalId = setInterval(() => {
                powerLayer.eachGraphic((graphic) => {
                    var power = Math.random().toFixed(3) * 1000 // 更新文本
                    var powerGraphicLightVar = new mars3d.graphic.DivBoderLabel({
                        position: graphic.position,
                        style: {
                            text: `预测功率：${power} W`,
                            font_size: 14,
                            font_family: "楷体",
                            color: "#ccc",
                            boderColor: "#15d1f2",
                            addHeight: 100,
                            clampToGround: true,
                            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000)
                        },
                        pointerEvents: false
                    })
                    powerLayer.removeGraphic(graphic, true)
                    powerLayer.addGraphic(powerGraphicLightVar)
                })
            }, 10000)

            // 在turbineLayer图层绑定Popup弹窗
            turbineLayer.bindPopup(function (event) {
                // console.log(event.graphic)
                const attr = {}
                attr["时间"] = "2022/1/2  0:00:00"
                attr["风速"] = Math.random().toFixed(3) * 1000
                attr["实际功率"] = Math.random().toFixed(3) * 1000
                attr["预测功率"] = Math.random().toFixed(3) * 1000

                return mars3d.Util.getTemplateHtml({ title: event.graphic.id + ' 号 风 机', template: "all", attr: attr })
            })

            // 一定高度点击风机跳转视角 并删除风场
            if (this.map.camera.positionCartographic.height >= 100000) {
                // 绑定点击风机事件
                turbineLayer.on(mars3d.EventType.click, () => {
                    console.log(this.map.camera.positionCartographic.height)
                    // 相机视角定位至风机群
                    switch (id) {
                        case 1:
                            this.map.setCameraView({ "lat": 28.843931, "lng": 120.882302, "alt": 2803.8, "heading": 131.2, "pitch": -20.8})
                            break;
                        case 2:
                            this.map.setCameraView({ "lat": 23.419527, "lng": 117.164786, "alt": 1845.7, "heading": 93.2, "pitch": -21.3})
                            break;
                        case 3:
                            this.map.setCameraView({ "lat": 43.57666, "lng": 87.915963, "alt": 4799, "heading": 93.3, "pitch": -37.1 })
                            break;
                        default:
                            this.map.setCameraView({"lat": 41.300225, "lng": 112.874408, "alt": 5020.9, "heading": 88.7, "pitch": -29.5})
                    }
                    // 删除风场图层
                    // 跟踪相机实例
                    this.map.trackedEntity = null
                    if (this.windLayer) {
                        this.map.removeLayer(this.windLayer, true)
                        this.windLayer = null
                    }
                })
            }
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
            // this.map.setCameraView({ "lat": 43.571205, "lng": 87.938571, "alt": 1220.9, "heading": 1.6, "pitch": -5.2 })
            this.map.setCameraView({ "lat": 43.576993, "lng": 87.958406, "alt": 1568.8, "heading": 256.1, "pitch": -12 })
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
    .el-col-24 {
        width: 40% !important;
        height: 100% !important;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
    .bar-content-bottom .el-button {
        width: 80%;
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
