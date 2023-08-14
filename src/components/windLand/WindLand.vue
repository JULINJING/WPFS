<template>
    <div id="windlandContainer" class="windLandContainer _windLandContainer">
        <NavTop />
        <el-result title="抱歉" subTitle="为获得最佳体验，请使用PC端查看">
            <template slot="icon">
                <el-image :src="require('./imgs/PC端提示.png')" fit="cover"></el-image>
            </template>
            <template slot="extra">
                <el-button type="primary" size="medium" @click="backToHome">返回主页</el-button>
            </template>
        </el-result>
        <div id="PC" ref="windland" @click="onModelClick">
            <ul class="equipmentLabel" ref="demo" :class="{ hide: labelHide }">
                <li @click="labelHide = true"></li>
                <li class="labelInfo">
                    <div>
                        <header>
                            <div class="cn">123</div>
                            <span class="en">123</span>
                            <img src="./imgs/pattern-logo.png">
                        </header>
                    </div>
                </li>
            </ul>
        </div>
        <HolographicProjection></HolographicProjection>
    </div>
</template>

<script>
import * as THREE from 'three'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import NavTop from '../baseComponents/NavTop'
import HolographicProjection from '@/components/windLand/AR/HolographicProjection'
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";


export default {
    name: 'windland',
    components: {
        NavTop,
        HolographicProjection
    },
    data() {
        return {
            // container: null,
            scene: null,
            // renderer: null,
            infoHide: true,
            labelHide: true,
            camera: null,
            matrix: null,
            raycaster: new THREE.Raycaster(),
            mouse: new THREE.Vector2(),
            turbineLabel: null,
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
            scene.fog = new THREE.Fog(0xc8f0f9, 50, 100)

            // renderer配置
            const renderer = new THREE.WebGLRenderer({ antialias: true }) // 打开抗锯齿
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 设置像素比
            renderer.setSize(window.innerWidth, window.innerHeight) // 全屏
            renderer.outputEncoding = THREE.sRGBEncoding // 设置颜色编码
            container.appendChild(renderer.domElement) // 加入renderer

            // 相机配置
            this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 120)
            // this.camera.position.set(34, 16, -20)
            // this.camera.lookAt(new THREE.Vector3(0, 0, 0));  // 回到起始视角
            scene.add(this.camera)

            // let stats = new Stats()
            // stats.setMode(0)

            // stats.domElement.style.position = 'absolute'
            // stats.domElement.style.left = '0px'
            // stats.domElement.style.top = '0px'
            // document.body.appendChild(stats.domElement)
            // 保持全屏
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
            const ambient = new THREE.AmbientLight(0xa0a0fc, 1)
            scene.add(ambient)

            const sunLight = new THREE.DirectionalLight(0xe8c37b, 1.0)
            sunLight.position.set(-65, -54, 14)
            scene.add(sunLight)

            /////////////////////////////////////////////////////////////////////////
            ///// LOADING GLB/GLTF MODEL FROM BLENDER
            let animations, mixer
            loader.load('models/gltf/windland.glb', gltf => {
                this.matrix = gltf
                gltf.scene.rotation.x = THREE.Math.degToRad(90)
                gltf.scene.castShadow = true
                //遍历模型中的mesh对象
                gltf.scene.traverse((child) => {
                    if (child.isMesh) {
                        // if (child.material.emissiveMap) {
                        //     // 该Mesh对象自带光，使用EmissiveMaterial作为其材质
                        //     child.material = new THREE.MeshBasicMaterial({
                        //         map: child.material.emissiveMap,
                        //         emissive: 0xffffff,
                        //         emissiveMap: child.material.emissiveMap,
                        //         emissiveIntensity: 1.0,
                        //         side: THREE.DoubleSide
                        //     })
                        // }
                        // child.frustumCulled = false;
                        //模型阴影
                        // child.castShadow = true;
                        //模型自发光
                        child.material.emissive = child.material.color
                        child.material.emissiveMap = child.material.map
                    }
                })
                scene.add(gltf.scene)
                animations = gltf.animations
                mixer = new THREE.AnimationMixer(gltf.scene)
                const clip = THREE.AnimationClip.findByName(animations, 'Anim_0')
                if (clip) {
                    const action = mixer.clipAction(clip)
                    action.play()
                }
                // animations.forEach(clip => {
                //     mixer.clipAction(clip).play()
                // })
            })
            /////////////////////////////////////////////////////////////////////////
            //// INTRO CAMERA ANIMATION USING TWEEN
            var introAnimation = () => {
                controls.enabled = false //disable orbit controls to animate the camera

                new TWEEN.Tween(this.camera.position.set(16, 50, 10)).to({ // from camera position
                    x: -35, //desired x position to go
                    y: -35, //desired y position to go
                    z: 20 //desired z position to go
                }, 6500) // time take to animate
                    .delay(1000).easing(TWEEN.Easing.Quartic.InOut).start() // define delay, easing
                    .onComplete(function () { //on finish animation
                        controls.enabled = true //enable orbit controls
                        setOrbitControlsLimits() //enable controls limits
                        TWEEN.remove(this) // remove the animation from memory
                    })
            }

            introAnimation() // 动画开始

            // 定义轨道控制限制
            function setOrbitControlsLimits() {
                controls.enableDamping = true
                controls.dampingFactor = 0.04
                controls.minDistance = 35
                controls.maxDistance = 100
                controls.enableRotate = true
                controls.enableZoom = true
                controls.maxPolarAngle = Math.PI / 2.5
            }

            /////////////////////////////////////////////////////////////////////////
            //// RENDER LOOP FUNCTION
            var clock = new THREE.Clock()
            var rendeLoop = () => {

                TWEEN.update() // 更新动画
                var time = clock.getDelta()
                if (mixer) {
                    mixer.update(time)
                }
                controls.update() // 更新轨道控制
                // stats.update()
                this.scene = scene;
                renderer.render(scene, this.camera) // render the scene using the camera
                requestAnimationFrame(rendeLoop) //loop the render function

            }

            rendeLoop() //start rendering
        },
        onModelClick(event) {
            // console.log(event);
            const [w, h] = [window.innerWidth, window.innerHeight]
            const { mouse, raycaster } = this
            this.mouse.x = (event.clientX / w) * 2 - 1
            this.mouse.y = -((event.clientY) / h) * 2 + 1
            raycaster.setFromCamera(mouse, this.camera)
            const intersects = raycaster.intersectObject(this.matrix.scene, true)
            if (intersects.length <= 0) return false
            const selectedObject = intersects[0].object;
            console.log(selectedObject.name, selectedObject.id);

            if (selectedObject.isMesh) {
                if (selectedObject.name.includes("polySurface")) {

                    // this.infoHide = false;
                    this.updateLabal(intersects[0]);
                } else {
                    this.labelHide = true;
                    // this.infoHide = true;
                }
            }
        },
        createTurbineLabel() {
            let label = new CSS2DObject(this.$refs.demo);
            this.turbineLabel = label;
            this.scene.add(label);
        },
        updateLabal(intersect) {
            if (this.labelHide) {
                this.labelHide = false;
                const point = intersect.point;
                this.turbineLabel.position.set(point.x, point.y, point.z);
                console.log(this.turbineLabel);
            }
        },
    },
    mounted() {
        this.turbineThree();
        this.createTurbineLabel();
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
@media only screen and (min-width: 800px) {
    .windLandContainer {

        .hide {
            display: none;
        }

        .equipmentLabel {
            top: 10%;
            z-index: 999;
            // display: flex;
            width: 988px;
            height: 451px;

            // background-color: red;
            &>li:nth-child(1) {
                color: #fff;
                width: 191.5px;
                height: 225.5px;
                // background-image: url("@/assets/images/1.png");
                background-size: 191.5px auto;
                position: absolute;
                right: 302.5px;
                top: 0px;
            }

            .labelInfo {
                width: 302.5px;
                height: 225.5px;
                background-image: url("@/assets/images/2.png");
                background-size: 302.5px auto;
                position: absolute;
                right: 0px;
                top: 0px;
                padding: 10px;
                box-sizing: border-box;

                &>div {
                    width: 100%;
                    height: 100%;
                    background-color: #65b2de73;
                    border: 1px solid #15c5e8;
                    box-sizing: border-box;
                    padding: 20px 20px;

                    header {
                        width: 100%;
                        // height: 40px;
                        text-align: left;
                        font-size: 14px;
                        line-height: 20px;
                        color: #fff;
                        border-bottom: 1px dashed aqua;
                        padding-bottom: 14px;

                        .en {
                            font-size: 12px;
                            color: aqua;
                        }
                    }

                    ul {
                        width: 100%;
                        color: #fff;

                        li {
                            line-height: 30px;
                            font-size: 14px;
                            display: flex;
                            // justify-content: space-between;
                            text-align: left;
                            align-items: center;

                            span:nth-child(1) {
                                width: 40%;
                            }

                            span:nth-child(2) {
                                width: 20%;
                                color: #f0c002;
                            }

                            span:nth-child(3) {
                                width: 30%;
                            }
                        }
                    }
                }
            }
        }

        // 移动端消失
        .el-result {
            display: none;
        }
    }
}

// 小于800px
@media only screen and (max-width: 800px) {
    ._windLandContainer {
        .el-result {
            display: block;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }

        #PC {
            display: none;
            height: 100%;
        }
    }
}
</style>
