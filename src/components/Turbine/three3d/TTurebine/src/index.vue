<template>
    <!-- <ul class="equipmentLabel" ref="demo" :class="{ hide: labelHide }" @click="labelHide = true">
        <li></li> -->
    <ul class="equipmentLabel" ref="demo" :class="{ hide: labelHide }">
        <li @click="labelHide = true"></li>
        <li class="labelInfo">
            <div>
                <header>
                    <div class="cn">{{ nowLabelData.cn }}</div>
                    <span class="en">{{ nowLabelData.en }}</span>
                </header>
                <ul>
                    <li v-for="(item, index) in nowLabelData.list" :key="index">
                        <span>{{ item.name }}:</span>
                        <span>{{ item.value }}</span>
                        <span>{{ item.unit }}</span>
                    </li>
                </ul>
            </div>
        </li>

    </ul>
</template>
<script>
/* eslint-disable */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RenderPass, EffectComposer, OutlinePass } from "three-outlinepass";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import TWEEN from "@tweenjs/tween.js";
import { mapState } from "vuex";
import { v4 as uuid } from 'uuid'
import { ref } from 'vue';

const MODEL_EQUIPMENT_ENUM = {
  PRINCIPAL_AXIS: '主轴',
  YAWMOTOR: '偏航电机',
  DYNAMO: '发电机',
  VARIABLE_PADDLE_SYSTEM: '变桨系统',
  CONTROL_CABINET: '控制柜',
  OIL_COOLING_PLANT: '油冷装置',
  ROTOR: '转子',
  AIR_COOLING_PLANT: '风冷装置',
  GEARBOX: '齿轮箱',
};
const MODEL_EQUIPMENT_POSITION_PARAMS_ENUM = {
    [MODEL_EQUIPMENT_ENUM.PRINCIPAL_AXIS]: {
        COMPOSE: { x: 20437.78515625, y: 8650, z: 0 },
        DECOMPOSE: { x: 20437.78515625, y: 8650, z: 400 },
    },
    [MODEL_EQUIPMENT_ENUM.YAWMOTOR]: {
        COMPOSE: { x: 20437.78515625, y: 8650, z: 0 },
        DECOMPOSE: { x: 21000, y: 8650, z: 100 },
    },
    [MODEL_EQUIPMENT_ENUM.DYNAMO]: {
        COMPOSE: { x: 20437.78515625, y: 8650, z: 0 },
        DECOMPOSE: { x: 20437.78515625, y: 8650, z: -200 },
    },
    [MODEL_EQUIPMENT_ENUM.VARIABLE_PADDLE_SYSTEM]: {
        COMPOSE: { x: 2519.07958984375, y: 29288.677734375, z: 0 },
        DECOMPOSE: { x: 2519.07958984375, y: 29288.677734375, z: 1000 },
    },
    [MODEL_EQUIPMENT_ENUM.CONTROL_CABINET]: {
        COMPOSE: { x: 20437.78515625, y: 8650, z: 0 },
        DECOMPOSE: { x: 20800, y: 8650, z: 0 },
    },
    [MODEL_EQUIPMENT_ENUM.OIL_COOLING_PLANT]: {
        COMPOSE: { x: 20437.78515625, y: 8650, z: 0 },
        DECOMPOSE: { x: 20437.78515625, y: 8850, z: 0 },
    },
    [MODEL_EQUIPMENT_ENUM.ROTOR]: {
        COMPOSE: { x: 20437.78515625, y: 8650, z: 0 },
        DECOMPOSE: { x: 20437.78515625, y: 8650, z: 700 },
    },
    [MODEL_EQUIPMENT_ENUM.AIR_COOLING_PLANT]: {
        COMPOSE: { x: 20437.78515625, y: 8650, z: 0 },
        DECOMPOSE: { x: 20000, y: 8850, z: 0 },
    },
    [MODEL_EQUIPMENT_ENUM.GEARBOX]: {
        COMPOSE: { x: 20437.78515625, y: 8650, z: 0 },
        DECOMPOSE: { x: 20437.78515625, y: 8650, z: 100 },
    }
};
var labelData = {
    [MODEL_EQUIPMENT_ENUM.VARIABLE_PADDLE_SYSTEM]: {
        cn: "变桨系统",
        en: "Variable-Pitch System",
        list: [
            {
                name: "轴箱1变桨位置",
                value: "0.03",
                unit: null
            },
            {
                name: "轴箱2变桨位置",
                value: "0.01",
                unit: null
            },
            {
                name: "轴箱3变桨位置",
                value: "0.02",
                unit: null
            }
        ]
    },
    [MODEL_EQUIPMENT_ENUM.PRINCIPAL_AXIS]: {
        cn: "主轴",
        en: "Principal Axis",
        list: [
            {
                name: "额定电压",
                value: "110",
                unit: "V"
            },
            {
                name: "额定电流",
                value: "101",
                unit: "A"
            },
            {
                name: "额定功率",
                value: "2",
                unit: "kw"
            },
            {
                name: "额定频率",
                value: "100",
                unit: "Hz"
            }
        ]
    },
    [MODEL_EQUIPMENT_ENUM.GEARBOX]: {
        cn: "齿轮箱",
        en: "Gear Box",
        list: [
            {
                name: "油槽温度",
                value: "51",
                unit: "°C"
            },
            {
                name: "入口轴温度",
                value: "41",
                unit: "°C"
            },
            {
                name: "输入轴温度",
                value: "66",
                unit: "°C"
            },
            {
                name: "输出轴温度",
                value: "60",
                unit: "°C"
            }
        ]
    },
    [MODEL_EQUIPMENT_ENUM.AIR_COOLING_PLANT]: {
        cn: "风冷装置",
        en: "Air Cooling System",
        list: [
            {
                name: "风冷温度",
                value: "7",
                unit: "°C"
            },
            {
                name: "风冷功率",
                value: "300",
                unit: "kWh"
            },
            {
                name: "功率",
                value: "200",
                unit: "kw"
            },
            {
                name: "温度",
                value: "24",
                unit: "°C"
            }
        ]
    },
    [MODEL_EQUIPMENT_ENUM.OIL_COOLING_PLANT]: {
        cn: "油冷装置",
        en: "oil Cooling System",
        list: [
            {
                name: "额定功率",
                value: "7",
                unit: "kw"
            },
            {
                name: "油箱容量",
                value: "300",
                unit: "L"
            },
            {
                name: "机器油耗",
                value: "200",
                unit: "G/KW.H"
            },
            {
                name: "工作时间",
                value: "24",
                unit: "H"
            }
        ]
    },
    [MODEL_EQUIPMENT_ENUM.DYNAMO]: {
        cn: "发电机",
        en: "Generator",
        list: [
            {
                name: "轴承A温度",
                value: "33",
                unit: "°C"
            },
            {
                name: "轴承B温度",
                value: "34",
                unit: "°C"
            },
            {
                name: "叶轮转速",
                value: "8",
                unit: "RPM"
            },
            {
                name: "转速",
                value: "1322",
                unit: "RPM"
            }
        ]
    }
};

export default {
    name: "TTurebine",
    inject: ["global"],
    data() {
        return {
            test: "test",
            matrixTurbine: null,
            materials: [],
            wireframe: null,
            mesh: null,
            metal: null,
            texture: null, // 纹理对象
            turbineAnimation: null, // 风机动画
            frameId: null, // 动画帧ID
            mouse: new THREE.Vector2(),
            raycaster: new THREE.Raycaster(),
            equipment: ref({}),
            // equipment: null,
            equipmentMaterialMap: new Map(),
            wholeGroup: new THREE.Group(),
            plane: null,
            wholeGroupall: new THREE.Group(),
            turbineLabel: null,
            labelHide: true,
            isOutlineVisible: false,
            renderMixins: new Map(),
            nowLabelData: {
                cn: "暂无数据",
                en: "暂无数据",
                list: [
                    {
                        name: "暂无数据",
                        value: "暂无数据",
                        unit: "暂无数据"
                    }
                ]
            },
        };
    },
    
    methods: {
        // 风机加载
        loadTurbine() {
            const loader = new GLTFLoader()
            const onProgress = xhr => {
                this.$emit("progress", 100)
            }
            loader.load(`${process.env.BASE_URL}model/turbine.glb`, object => {
                this.$emit("complete")
                this.matrixTurbine = object;

                let mesh = object.scene;
                this.mesh = mesh;
                this.metal = mesh.getObjectByName("颜色材质");
                this.wireframe = mesh.getObjectByName("线框材质");
                this.metal.visible = false;
                this.turbineAnimation = object.animations;
                let scale = 0.0003 * 1;
                mesh.scale.set(scale, scale, scale);
                mesh.rotateX(Math.PI / 2);
                mesh.rotateY(-Math.PI / 2);
                const plane = object.scene.getObjectByName("polySurface136");
                mesh.remove(plane);
                this.wholeGroup.add(mesh);
                mesh.position.set(0, 0, -2.42);
                this.changeAnimation(mesh, "Anim_0");
                this.changeTurbineColor(0x3cbfc1);
            }, onProgress);
        },
        // 设备加载
        loadEquipment() {
            let loader = new GLTFLoader();
            loader.load(`${process.env.BASE_URL}model/equipment1.glb`, object => {
                let mesh = object.scene;

                mesh.traverse(child => {
                    if (child.isMesh) {
                        const material = child.material.clone();
                        child.material = material;
                        // console.log(material.uuid)
                        this.equipmentMaterialMap.set(child.name, child);
                    }
                });
                let scale = 0.0003 * 1;
                mesh.scale.set(scale, scale, scale);
                mesh.rotateX(Math.PI / 2);
                mesh.rotateY(-Math.PI / 2);
                mesh.position.set(0, 0, -2.42);
                this.equipment.value = mesh;
                // this.equipment = mesh;

                this.wholeGroup.add(mesh);
            }); 
        },
        // 平台加载
        loadingPlane() {
            let loader = new GLTFLoader();
            loader.load(`${process.env.BASE_URL}model/plane.glb`, object => {
                let mesh = object.scene;
                this.plane = mesh;
                let scale = 0.0003 * 1;
                mesh.scale.set(scale, scale, scale);
                mesh.rotateX(Math.PI / 2);
                mesh.rotateY(-Math.PI / 2);
                this.global.scene.add(mesh);
                mesh.position.set(0, 0, -2.42);
                this.planeAnimation();
                this.plane.traverse(child => {
                    if (child.isMesh) {
                        child.material.color.set(0x3cbfc1);
                    }
                });
            });
        },
        // 添加和改变风机旋转动画
        changeAnimation(turbine, animationName) {
            const animations = this.matrixTurbine.animations;
            const mixer = new THREE.AnimationMixer(turbine);

            const clip = THREE.AnimationClip.findByName(
                animations,
                animationName
            );
            const key = "AA";
            if (clip) {
                const action = mixer.clipAction(clip);
                action.play();
                this.global.mixers.set(key, mixer);
            } else {
                this.global.mixers.delete(key);
            }
        },
        // 风机平台动画
        planeAnimation() {
            const texture = this.plane.children[0].material.map;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;

            this.frameId = requestAnimationFrame(this.animateTexture);
        },
        animateTexture() {
            const texture = this.plane.children[0].material.map;
            const count = texture ? texture.repeat.y : 0;
            if (count <= 10) {
                texture.repeat.x += 0.01;
                texture.repeat.y += 0.02;
            } else {
                texture.repeat.x = 0;
                texture.repeat.y = 0;
            }

            this.frameId = requestAnimationFrame(this.animateTexture);
        },
        onPointerClick(event) {
            const [w, h] = [window.innerWidth, window.innerHeight];
            const { mouse, global, equipment, raycaster } = this;
            this.mouse.x = (event.clientX / w) * 2 - 1;
            this.mouse.y = -(event.clientY / h) * 2 + 1;
            raycaster.setFromCamera(mouse, global.camera);
            const intersects = raycaster.intersectObject(equipment.value, true);
            if (intersects.length <= 0) return false;
            const selectedObject = intersects[0].object;
            if (selectedObject.isMesh) {
                // console.log(intersects[0].object.name);
                this.outline([selectedObject]);
                this.addRandomNumbers();
                if(labelData[intersects[0].object.name]){
                    this.nowLabelData = labelData[intersects[0].object.name];
                } else {
                    this.nowLabelData = {
                        cn: "暂无数据",
                        en: "暂无数据",
                        list: [
                            {
                                name: "暂无数据",
                                value: "暂无数据",
                                unit: "暂无数据"
                            }
                        ]
                    };
                }
                this.updateLabal(intersects[0]);
            } 
        },
        updateLabal(intersect) {
            if (this.labelHide && this.isOutlineVisible) {
                this.labelHide = false;
                const point = intersect.point;
                this.turbineLabel.position.set(point.x, point.y, point.z);
            } else if(!this.labelHide) {
                this.labelHide = true;
            }
        },
        outline(selectedObjects, color = 0x15c5e8) {
            const { renderer, camera, scene } = this.global;
            const [w, h] = [window.innerWidth, window.innerHeight];

            // 如果轮廓已经显示，移除效果并清除标记
            if (this.isOutlineVisible) {
                this.global.compose.passes.pop();
                this.isOutlineVisible = false;
                return;
            }

            var compose = new EffectComposer(renderer);
            var renderPass = new RenderPass(scene, camera);
            var outlinePass = new OutlinePass(
                new THREE.Vector2(w, h),
                scene,
                camera,
                selectedObjects
            );
            outlinePass.renderToScreen = true;
            outlinePass.selectedObjects = selectedObjects;
            compose.addPass(renderPass);
            compose.addPass(outlinePass);
            const params = {
                edgeStrength: 10,
                edgeGlow: 0,
                edgeThickness: 50.0,
                pulsePeriod: 1,
                usePatternTexture: false
            };
            outlinePass.edgeStrength = params.edgeStrength;
            outlinePass.edgeGlow = params.edgeGlow;
            outlinePass.visibleEdgeColor.set(color);
            outlinePass.hiddenEdgeColor.set(color);
            compose.render(scene, camera);
            this.$set(this.global, "compose", compose);

            this.isOutlineVisible = true;
        },
        //过度动画
        animation(oldObject, newObject, time, update, complete) {
            var tween = new TWEEN.Tween(oldObject);
            tween.to(newObject, time);
            tween.onUpdate(function (object) {
                update && update(object);
            });
            tween.onComplete(function () {
                complete && complete();
            });
            tween.easing(TWEEN.Easing.Linear.None);
            tween.start();
        },
        animation2(props) {
            const {
                from,
                to,
                duration,
                easing = TWEEN.Easing.Quadratic.Out,
                onUpdate,
                onComplete,
            } = props;

            return new TWEEN.Tween(from)
                .to(to, duration)
                .easing(easing)
                .onUpdate((object) => this.$isFunction(onUpdate) && onUpdate(object))
                .onComplete((object) => this.$isFunction(onComplete) && onComplete(object))
                .start();
        },
        $isFunction(variable) {
            return typeof variable === 'function';
        },
        //更新风机的偏航角
        updataTurbineYawAngle() {
            setInterval(() => {
                const curAngle = this.wholeGroup.rotation.z;
                const newAngle = parseInt(Math.random() * 90) * (Math.PI / 180);
                const update = data => {
                    // let polySurface189 = this.wholeGroup.getObjectByName("polySurface189")
                    // console.log();
                    // polySurface189.rotation.y = data.angle;
                    this.wholeGroup.rotation.z = data.angle;
                };
                const complete = () => {
                    // this.turbineYawAngle.set(entityId, newAngle);
                };

                this.animation(
                    { angle: curAngle },
                    { angle: newAngle },
                    2000,
                    update,
                    complete
                );
            }, 5000);
        },
        createCssObject(str) {
            const dom = $(str)[0];
            let CSSObject = new CSS2DObject(dom);
            // console.log("CSSObject", CSSObject);
            return CSSObject;
        },
        createTurbineLabel() {
            let label = new CSS2DObject(this.$refs.demo);
            this.turbineLabel = label;
            this.global.scene.add(label);
        },
        alarm() {
            const nameList = [
                '主轴',
                '偏航电机',
                '发电机',
                '变桨系统',
                '控制柜',
                '油冷装置',
                '转子',
                '风冷装置',
                '齿轮箱',
            ];
            setInterval(() => {
                const random = parseInt(Math.random() * 9);
                const equipment = this.equipmentMaterialMap.get(
                    nameList[random]
                );
                if (equipment) {
                    equipment.material.emissive.setHex(equipment.currentHex);
                }
                equipment.currentHex = equipment.material.emissive.getHex();
                equipment.material.emissive.setHex(0xff0000);
                setTimeout(() => {
                    if (equipment)
                        equipment.material.emissive.setHex(
                            equipment.currentHex
                        );
                }, 4000);
            }, 5000);
        },
        changeTurbineColor(color) {
            this.mesh.traverse(child => {
                if (child.isMesh) {
                    child.material.color.set(color);
                }
            });
        },
        async equipmentDecomposeAnimation() {
            this.groundAndSkeletonHideAnimation();

            // 等待 1 秒钟
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // 更新模型的世界矩阵
            this.equipment.value?.updateMatrixWorld();
            this.equipment.value?.children.forEach((child) => {
                const params = MODEL_EQUIPMENT_POSITION_PARAMS_ENUM[child.name];
                this.animation2({
                    from: child.position,
                    to: params.DECOMPOSE,
                    duration: 2 * 1000,
                    onUpdate: (position) => {
                        child.position.set(position.x, position.y, position.z);
                    },
                });
            });
        },
        equipmentComposeAnimation(){
            this.groundAndSkeletonShowAnimation();
            this.equipment.value?.children.forEach((child) => {
                const params = MODEL_EQUIPMENT_POSITION_PARAMS_ENUM[child.name]
                this.animation2({
                    from: child.position,
                    to: params.COMPOSE,
                    duration: 2 * 1000,
                    onUpdate: (position) => {
                        child.position.set(position.x, position.y, position.z)
                    },
                })
            })
        },
        // 地面和风机骨架隐藏动画
        groundAndSkeletonHideAnimation() {
            this.mesh.traverse((mesh) => {
                if (!(mesh instanceof THREE.Mesh)) return undefined;
                mesh.material.clippingPlanes = [this.clippingPlane];
                return undefined;
            });

            this.plane.traverse((mesh) => {
                if (!(mesh instanceof THREE.Mesh)) return undefined;
                mesh.material.clippingPlanes = [this.clippingPlane];
                return undefined;
            });

            const uid = uuid();
            this.equipmentMaterialMap.set(uid, () => {
                if (this.clippingPlane.constant <= -0.1) this.renderMixins.delete(uid);
                this.clippingPlane.constant -= 0.04;
            });
        },
        // 地面和风机骨架显示
        groundAndSkeletonShowAnimation() {
            this.mesh.traverse((mesh) => {
                if (!(mesh instanceof THREE.Mesh)) return undefined
                mesh.material.clippingPlanes = [this.clippingPlane]
                return undefined
            })
            this.plane.traverse((mesh) => {
                if (!(mesh instanceof THREE.Mesh)) return undefined
                mesh.material.clippingPlanes = [this.clippingPlane]
                return undefined
            })
            const uid = uuid()
            this.equipmentMaterialMap.set(uid, () => {
                if (clippingPlane.constant >= 3.5) renderMixins.delete(uid)
                this.clippingPlane.constant += 0.04
            })
        },
        sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        },
        skeletonAnimation() {
            console.log("skeletonAnimation() called");

            const shellModel = this.matrixTurbine?.scene?.getObjectByName(
                "颜色材质"
            );
            const clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 3.5);

            shellModel.traverse((mesh) => {
                if (!(mesh instanceof THREE.Mesh)) return;

                const material = new THREE.MeshPhysicalMaterial({
                    color: 0xffffff,
                    metalness: 1,
                    roughness: 0.7,
                });

                mesh.material = material;
                // 白色外壳消隐效果
                mesh.material.clippingPlanes = [clippingPlane];
            });

            const uid = uuid();
            this.renderMixins.set(uid, () => {
                if (clippingPlane.constant <= -0.1) {
                    this.matrixTurbine?.scene?.remove(shellModel);
                    this.renderMixins.delete(uid);
                    console.log('renderMixins', this.renderMixins);
                }
                console.log(clippingPlane.constant);
                clippingPlane.constant -= 0.01;
            });
        },
        getRandomNumber(min, max) {
            return (Math.random() * (max - min)) + min;
        },
        addRandomNumbers() {
            for (const equipmentType in labelData) {
                const equipment = labelData[equipmentType];
                for (const item of equipment.list) {
                    if(!item.name.includes("额定")){
                        item.value = this.getRandomNumber(0, 10).toFixed(2);
                    }
                }
            }
        }
    },
    mounted() {
        this.loadTurbine();
        this.loadEquipment();
        this.loadingPlane();
        this.updataTurbineYawAngle();
        this.createTurbineLabel();
        this.alarm();
        this.global.scene.add(this.wholeGroup);

    },
    beforeUnmount() {
        cancelAnimationFrame(this.frameId);
    },
    computed: {
        ...mapState('global', ['isTurbineCanClick']),
    },
    watch: {
        isTurbineCanClick(newFlag, oldFlag) {
            if (!newFlag) {
                document.addEventListener("click", this.onPointerClick);
                this.mesh.visible = false;
                this.equipmentDecomposeAnimation();
                // this.skeletonAnimation();
            } else {
                document.removeEventListener("click", this.onPointerClick);
                this.equipmentComposeAnimation();
                this.labelHide = true;
                this.sleep(2000).then(() => {
                    this.mesh.visible = true;
                });
            }
        }
    },
};
</script>
<style lang="scss" scoped>
.hide {
    display: none;
}

.show {
    display: block !important;
}

.equipmentLabel {
    z-index: 999;
    // display: flex;
    width: 988px;
    height: 451px;

    // background-color: red;
    &>li:nth-child(1) {
        color: #fff;
        width: 191.5px;
        height: 225.5px;
        background-image: url("../../../../../assets/images/1.png");
        background-size: 191.5px auto;
        position: absolute;
        right: 302.5px;
        top: 0px;
    }

    .labelInfo {
        width: 302.5px;
        height: 225.5px;
        background-image: url("../../../../../assets/images/2.png");
        background-size: 302.5px auto;
        position: absolute;
        right: 0px;
        top: 0px;
        padding: 10px;
        box-sizing: border-box;

        &>div {
            width: 100%;
            height: 100%;
            background-color: #04669e73;
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
</style>
