import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import Stats from 'three/addons/libs/stats.module.js'

let scene, camera, renderer, orbitControls
let stats

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}
async function three3d() {
    const dracoLoader = new DRACOLoader()
    const loader = new GLTFLoader()
    //设置解压库文件路径
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
    dracoLoader.setDecoderConfig({ type: 'js' })
    loader.setDRACOLoader(dracoLoader)

    const container = document.createElement('div')
    document.body.appendChild(container)

    scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0xffffff, .17)
    scene.background = new THREE.Color('#c8f0f9')

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.001, 5000)
    camera.position.set(34, 16, -20)
    camera.lookAt(scene.position)

    const ambientLight = new THREE.AmbientLight(0xa0a0fc, 8)
    scene.add(ambientLight)
    const sunLight = new THREE.DirectionalLight(0xe8c37b, 1.96)
    sunLight.position.set(-69, 44, 14)
    scene.add(sunLight)

    renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    stats = new Stats()
    document.body.appendChild(stats.dom)

    orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.minDistance = 35
    orbitControls.maxDistance = 60
    orbitControls.enableDamping = true

    const gltf = await loader.loadAsync(`${process.env.BASE_URL}model/scene.glb`)
    scene.add(gltf.scene)

    window.addEventListener('resize', onWindowResize, false)
}
export default three3d