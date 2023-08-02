<template>
    <div id="windlandContainer" class="windLandContainer _windLandContainer">
        <NavTop/>
        <el-result title="抱歉" subTitle="为获得最佳体验，请使用PC端查看">
            <template slot="icon">
                <el-image :src="require('./imgs/PC端提示.png')" fit="cover"></el-image>
            </template>
            <template slot="extra">
                <el-button type="primary" size="medium" @click="backToHome">返回主页</el-button>
            </template>
        </el-result>
        <div id="PC" ref="windland"></div>
    </div>
</template>

<script>
import * as THREE from 'three'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js'

import NavTop from '../baseComponents/NavTop'

export default {
    name: 'windland',
    components: {
        NavTop
    },
    data() {
        return {
            camera: null
        };
    },
    methods: {
        // 返回首页 
		backToHome() {
            this.$router.push('/home')
        },
        turbineThree() {
            // 从Blender向Draco加载器加载Draco压缩模型
            const dracoLoader = new DRACOLoader()
            const loader = new GLTFLoader()
            dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
            dracoLoader.setDecoderConfig({ type: 'js' })
            loader.setDRACOLoader(dracoLoader)

            // 创造DIV容器容纳three.js
            const container = document.createElement('div')
            this.$refs.windland.appendChild(container)

            // 创建场景
            const scene = new THREE.Scene()
            scene.background = new THREE.Color('#c8f0f9')

            // renderer配置
            const renderer = new THREE.WebGLRenderer({ antialias: true }) // 打开抗锯齿
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 设置像素比
            renderer.setSize(window.innerWidth, window.innerHeight) // 全屏
            renderer.outputEncoding = THREE.sRGBEncoding // 设置颜色编码
            container.appendChild(renderer.domElement) // 加入renderer

            // 相机配置
            this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 100)
            this.camera.position.set(34, 16, -20)
            // this.camera.lookAt(new THREE.Vector3(0, 0, 0));  // 回到起始视角
            scene.add(this.camera)

            // 保持全屏
            window.addEventListener('resize', () => {
                const width = window.innerWidth
                const height = window.innerHeight
                this.camera.aspect = width / height
                this.camera.updateProjectionMatrix()

                renderer.setSize(width, height)
                renderer.setPixelRatio(2)
            })

            // 创建轨道控制
            const controls = new OrbitControls(this.camera, renderer.domElement)

            // 场景光
            const ambient = new THREE.AmbientLight(0xa0a0fc, 0.82)
            scene.add(ambient)

            const sunLight = new THREE.DirectionalLight(0xe8c37b, 1.96)
            sunLight.position.set(-69, 44, 14)
            scene.add(sunLight)

            // 加载模型
            loader.load('models/gltf/starter-scene.glb', function (gltf) {
                gltf.scene.rotation.x = THREE.Math.degToRad(90); // 旋转90度
                scene.add(gltf.scene)
            })

            // 使用渐变介绍相机动画
            var introAnimation = ()=> {
                controls.enabled = false // 禁用轨道控制以使相机动画化

                new TWEEN.Tween(this.camera.position.set(16, 50, 10)).to({ // 从相机位置开始
                    x: 26, // 想要的x位置
                    y: 4, // 想要的y位置
                    z: 35 // 想要的z位置
                }, 6500) // 动画时间
                .delay(1000).easing(TWEEN.Easing.Quartic.InOut).start() // 定义延迟、缓和
                .onComplete(function () { // 完成动画
                    controls.enabled = true // 启用轨道控制
                    setOrbitControlsLimits() // 启用控制限制
                    TWEEN.remove(this) // 从内存中删除动画
                })
            }

            introAnimation() // 动画开始

            // 定义轨道控制限制
            function setOrbitControlsLimits() {
                controls.enableDamping = true
                controls.dampingFactor = 0.04
                controls.minDistance = 35
                controls.maxDistance = 60
                controls.enableRotate = true
                controls.enableZoom = true
                controls.maxPolarAngle = Math.PI / 2.5
            }

            // 循环渲染函数
            var renderLoop = ()=> {

                TWEEN.update() // 更新动画

                controls.update() // 更新轨道控制

                renderer.render(scene, this.camera) // 使用相机渲染场景

                requestAnimationFrame(renderLoop) // 循环渲染函数

            }

            renderLoop() // 开始渲染

            // 开启GUI调试
            const gui = new GUI()

            // 创建GUI参数
            var params = {color: sunLight.color.getHex(), color2: ambient.color.getHex(), color3: scene.background.getHex()}

            // 创建GUI回调函数
            const update = function () {
                var colorObj = new THREE.Color( params.color )
                var colorObj2 = new THREE.Color( params.color2 )
                var colorObj3 = new THREE.Color( params.color3 )
                sunLight.color.set(colorObj)
                ambient.color.set(colorObj2)
                scene.background.set(colorObj3)
            }

            // GUI 配置
            gui.add(sunLight, 'intensity').min(0).max(10).step(0.0001).name('Dir intensity')
            gui.add(sunLight.position, 'x').min(-100).max(100).step(0.00001).name('Dir X pos')
            gui.add(sunLight.position, 'y').min(0).max(100).step(0.00001).name('Dir Y pos')
            gui.add(sunLight.position, 'z').min(-100).max(100).step(0.00001).name('Dir Z pos')
            gui.addColor(params,'color').name('Dir color').onChange(update)
            gui.addColor(params,'color2').name('Amb color').onChange(update)
            gui.add(ambient, 'intensity').min(0).max(10).step(0.001).name('Amb intensity')
            gui.addColor(params,'color3').name('BG color').onChange(update)

            // 鼠标移动获得相机位置
            document.addEventListener('mousemove', (event) => {
                event.preventDefault()

                console.log(this.camera.position)

            }, false)
        },
    },
    mounted() {
        this.turbineThree()
    }
}
</script>

<style lang="less" scoped>
#windlandContainer {
    margin: 0;
	padding: 0;
	overscroll-behavior: none;
	overflow: hidden;
}
// 大于800px
@media only screen and (min-width: 800px){
    .windLandContainer{
        // 移动端消失
        .el-result {
            display: none;
        }
    }
}

// 小于800px
@media only screen and (max-width: 800px){
    ._windLandContainer{
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
}
</style>
