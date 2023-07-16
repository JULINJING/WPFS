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

import NavTop from '../baseComponents/NavTop'

export default {
    name: 'windland',
    components: {
        NavTop
    },
    data() {
        return {
            // container: null,
            // scene: null,
            // renderer: null,
            camera: null,
            // controls: null,
            // ambient: null,
            // sunLight: null,
        };
    },
    methods: {
        // 返回首页 
		backToHome() {
            this.$router.push('/home')
        },
        turbineThree() {
            /////////////////////////////////////////////////////////////////////////
            //// DRACO LOADER TO LOAD DRACO COMPRESSED MODELS FROM BLENDER
            const dracoLoader = new DRACOLoader()
            const loader = new GLTFLoader()
            dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
            dracoLoader.setDecoderConfig({ type: 'js' })
            loader.setDRACOLoader(dracoLoader)

            /////////////////////////////////////////////////////////////////////////
            ///// DIV CONTAINER CREATION TO HOLD THREEJS EXPERIENCE
            const container = document.createElement('div')
            // document.body.appendChild(container)
            this.$refs.windland.appendChild(container)

            /////////////////////////////////////////////////////////////////////////
            ///// SCENE CREATION
            const scene = new THREE.Scene()
            scene.background = new THREE.Color('#c8f0f9')

            /////////////////////////////////////////////////////////////////////////
            ///// RENDERER CONFIG
            const renderer = new THREE.WebGLRenderer({ antialias: true }) // turn on antialias
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) //set pixel ratio
            renderer.setSize(window.innerWidth, window.innerHeight) // make it full screen
            renderer.outputEncoding = THREE.sRGBEncoding // set color encoding
            container.appendChild(renderer.domElement) // add the renderer to html div

            /////////////////////////////////////////////////////////////////////////
            ///// CAMERAS CONFIG
            this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 100)
            this.camera.position.set(34, 16, -20)
            // this.camera.lookAt(new THREE.Vector3(0, 0, 0));  // Look at the origin
            scene.add(this.camera)

            /////////////////////////////////////////////////////////////////////////
            ///// MAKE EXPERIENCE FULL SCREEN
            window.addEventListener('resize', () => {
                const width = window.innerWidth
                const height = window.innerHeight
                this.camera.aspect = width / height
                this.camera.updateProjectionMatrix()

                renderer.setSize(width, height)
                renderer.setPixelRatio(2)
            })

            /////////////////////////////////////////////////////////////////////////
            ///// CREATE ORBIT CONTROLS
            const controls = new OrbitControls(this.camera, renderer.domElement)

            /////////////////////////////////////////////////////////////////////////
            ///// SCENE LIGHTS
            const ambient = new THREE.AmbientLight(0xa0a0fc, 0.82)
            scene.add(ambient)

            const sunLight = new THREE.DirectionalLight(0xe8c37b, 1.96)
            sunLight.position.set(-69, 44, 14)
            scene.add(sunLight)

            /////////////////////////////////////////////////////////////////////////
            ///// LOADING GLB/GLTF MODEL FROM BLENDER
            loader.load('models/gltf/starter-scene.glb', function (gltf) {
                gltf.scene.rotation.x = THREE.Math.degToRad(90); // Rotate the model by 90 degrees
                scene.add(gltf.scene)
            })

            /////////////////////////////////////////////////////////////////////////
            //// INTRO CAMERA ANIMATION USING TWEEN
            var introAnimation = ()=> {
                controls.enabled = false //disable orbit controls to animate the camera

                new TWEEN.Tween(this.camera.position.set(16, 50, 10)).to({ // from camera position
                    x: 26, //desired x position to go
                    y: 4, //desired y position to go
                    z: 35 //desired z position to go
                }, 6500) // time take to animate
                .delay(1000).easing(TWEEN.Easing.Quartic.InOut).start() // define delay, easing
                .onComplete(function () { //on finish animation
                    controls.enabled = true //enable orbit controls
                    setOrbitControlsLimits() //enable controls limits
                    TWEEN.remove(this) // remove the animation from memory
                })
            }

            introAnimation() // call intro animation on start

            /////////////////////////////////////////////////////////////////////////
            //// DEFINE ORBIT CONTROLS LIMITS
            function setOrbitControlsLimits() {
                controls.enableDamping = true
                controls.dampingFactor = 0.04
                controls.minDistance = 35
                controls.maxDistance = 60
                controls.enableRotate = true
                controls.enableZoom = true
                controls.maxPolarAngle = Math.PI / 2.5
            }

            /////////////////////////////////////////////////////////////////////////
            //// RENDER LOOP FUNCTION
            var rendeLoop = ()=> {

                TWEEN.update() // update animations

                controls.update() // update orbit controls

                renderer.render(scene, this.camera) // render the scene using the camera

                requestAnimationFrame(rendeLoop) //loop the render function

            }

            rendeLoop() //start rendering
        },
        // // 初始化three配置
        // initThree() {
        //     // 创造DIV容器容纳three.js
        //     var container = document.createElement('div')
        //     this.$refs.windland.appendChild(container)
        //     // 创建场景
        //     var scene = new THREE.Scene();
        //     scene.background = new THREE.Color('#c8f0f9')
        //     // renderer配置
        //     var renderer = new THREE.WebGLRenderer({ antialias: true });// 打开抗锯齿
        //     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));// 设置像素比
        //     renderer.setSize(window.innerWidth, window.innerHeight);// 全屏
        //     renderer.outputEncoding = THREE.sRGBEncoding;// 设置颜色编码
        //     container.appendChild(renderer.domElement);// 加入renderer
        //     // 相机配置
        //     var camera = new THREE.PerspectiveCamera(
        //         35,
        //         window.innerWidth / window.innerHeight,
        //         1,
        //         100
        //     );
        //     camera.position.set(34, 16, -20);
        //     scene.add(camera);

        //     // 创建轨道控制
        //     var controls = new OrbitControls(camera, renderer.domElement)

        //     // 场景光
        //     var ambient = new THREE.AmbientLight(0xa0a0fc, 0.82)
        //     scene.add(ambient)
        //     var sunLight = new THREE.DirectionalLight(0xe8c37b, 1.96)
        //     sunLight.position.set(-69,44,14)
        //     scene.add(sunLight)

        //     this.container = container;
        //     this.scene = scene;
        //     this.renderer = renderer;
        //     this.camera = camera;
        //     this.controls = controls;
        //     this.ambient = ambient;
        //     this.sunLight = sunLight;
        // },
        // // 加载模型
        // loadModel() {
        //     var loader = new GLTFLoader();
        //     var dracoLoader = new DRACOLoader();
        //     dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
        //     dracoLoader.setDecoderConfig({ type: 'js' });
        //     loader.setDRACOLoader(dracoLoader);

        //     loader.load('models/gltf/starter-scene.glb', (gltf) => {
        //         this.scene.add(gltf.scene);
        //     });
        // },
        // // 使用渐变介绍相机动画
        // introAnimation() {
        //     this.controls.enabled = false;//禁用轨道控制以使相机动画化
        //     new TWEEN.Tween(this.camera.position.set(26, 4, -35)).to({// 从相机位置开始
        //         x: 16,// 想要的x位置
        //         y: 50,// 想要的y位置
        //         z: -0.1,// 想要的z位置
        //     }, 6500)// 动画时间
        //     .delay(1000)
        //     .easing(TWEEN.Easing.Quartic.InOut)
        //     .start()// 定义延迟、缓和
        //     .onComplete(() => {// 完成动画
        //     this.controls.enabled = true;// 启用轨道控制
        //     this.setOrbitControlsLimits();// 启用控制限制
        //     TWEEN.remove(this);// 从内存中删除动画
        //     });
        // },
        // //确定轨道控制限制
        // setOrbitControlsLimits() {
        //     this.controls.enableDamping = true;
        //     this.controls.dampingFactor = 0.04;
        //     this.controls.minDistance = 35;
        //     this.controls.maxDistance = 60;
        //     this.controls.enableRotate = true;
        //     this.controls.enableZoom = true;
        //     this.controls.maxPolarAngle = Math.PI / 2.5;
        // },
        // renderLoop() {
        //     TWEEN.update();// 更新动画
        //     this.controls.update();// 更新轨道控制
        //     this.renderer.render(this.scene, this.camera);// 使用相机渲染场景
        //     requestAnimationFrame(this.renderLoop); // 循环渲染函数
        // },
        // fullScreen() {
        //     window.addEventListener('resize', () => {
        //         const width = window.innerWidth;
        //         const height = window.innerHeight;
        //         this.camera.aspect = width / height;
        //         this.camera.updateProjectionMatrix();

        //         this.renderer.setSize(width, height);
        //         this.renderer.setPixelRatio(2);
        //     });
        // },
    },
    mounted() {
        // this.initThree();
        // this.loadModel();
        // this.introAnimation();
        // this.renderLoop();
        // this.fullScreen();
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
