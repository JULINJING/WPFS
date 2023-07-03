<template>
    <div id="centerDiv" class="mapcontainer">
        <NavTop />
        <mars-map :url="configUrl" @onload="onMapload" :options="mapOptions" />
    </div>
</template>

<script>
import NavTop from '../baseComponents/NavTop'

import MarsMap from './mars-work/mars-map.vue'
import * as mars3d from 'mars3d'

const Cesium = mars3d.Cesium

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Index',

    components: {
        MarsMap,
        NavTop
    },

    data() {
        const basePathUrl = window.basePathUrl || ''
        const mapOptions = {
            scene: {
                center: { lat: 20.648765, lng: 129.340334, alt: 19999976, heading: 355, pitch: -89 },
                scene3Donly: true,
                contextOptions: {
                    requestWebgl1: true
                }
            },
            control: {
                sceneModePicker: false
            }
        }
        const windLayer = new mars3d.layer.WindLayer()
        return {
            configUrl: basePathUrl + 'config/config.json',
            mapOptions: mapOptions,
            windLayer
        }
    },

    methods: {
        // 地图构造完成回调
        onMapload(map) {
            // 以下为演示代码
            map.setCameraView({ lat: 20.648765, lng: 129.340334, alt: 19999976, heading: 355, pitch: -90 })

            this.addLayer(map)

        },
        addLayer(map) {
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
        }

    }
}

// import MacBriefInfo from './subcomponents/MacBriefInfo'
// import CompareMac from './subcomponents/CompareMac'
// import MacosICloud from './subcomponents/MacosICloud'
// import InnerAppinfo from './subcomponents/InnerAppinfo'
// import ProfessAppinfo from './subcomponents/ProfessAppinfo'
// import MacFinalInfo from './subcomponents/MacFinalInfo'
// export default {
//   name: 'windfield',
//   components: {
//     MacBriefInfo,
//     CompareMac,
//     MacosICloud,
//     InnerAppinfo,
//     ProfessAppinfo,
//     MacFinalInfo,
//     NavTop
//   }
// }
</script>

<style lang="less" scoped>
// 大于800px
@media only screen and (min-width: 800px) {}

// 小于800px
@media only screen and (max-width: 800px) {}

.mapcontainer {
    position: relative;
    height: 100%;
    overflow: hidden;
}
</style>
