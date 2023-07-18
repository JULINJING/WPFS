import Vue from 'vue'
import Vuex from 'vuex'
import path from 'path-browserify' // 使用适用于浏览器的path替代方案
import router, {resetRouter} from "@/router";

Vue.use(Vuex)

//自动导入
const contexts = require.context('./', true, /index.js$/);
let modules = {}
contexts.keys().forEach(key => {
    const dirname = path.dirname(key)
    if (dirname != '.') {
        const moduleName = dirname.replace(/^\.\//, '')
        modules[moduleName] = contexts(key).default || contexts(key)
    }
})
const store = new Vuex.Store({
    state: {
        currentPathName: ''
    },
    mutations: {
        setPath (state) {
            state.currentPathName = localStorage.getItem("currentPathName")
        },
        logout() {
            // 清空缓存
            localStorage.removeItem("user")
            localStorage.removeItem("menus")
            router.push("/login")

            // 重置路由
            resetRouter()
        }
    },
    modules: {
        global: {
            namespaced: true, // 确保命名空间设置为 true
            state: {
                uploadedFileName: "11.csv", // 上传的文件名
                processedJsonData: [], // 预处理后的数据
                predictedJsonData: [], // 预测的数据
                trainingProgress: 0, // 训练进度
                isTraining: false, // 是否正在训练
            },
            mutations: {
                setUploadedFileName(state, fileName) {
                    state.uploadedFileName = fileName;
                },
                setPath(state) {
                    state.currentPathName = localStorage.getItem("currentPathName")
                },
                setProcessedJsonData(state, data) {
                    state.processedJsonData = data;
                },
                setPredictedJsonData(state, data) {
                    state.predictedJsonData = data;
                },
                setTrainingProgress(state, progress) {
                    state.trainingProgress = progress;
                },
                setIsTraining(state, isTraining) {
                    state.isTraining = isTraining;
                }
            },
            getters: {
                getUploadedFileName(state) {
                    return state.uploadedFileName;
                },
                getProcessedJsonData(state) {
                    return state.processedJsonData;
                },
                getPredictedJsonData(state) {
                    return state.setPredictedJsonData;
                },
                getTrainingProgress(state) {
                    return state.trainingProgress;
                }
            }
        }
    },
    getters: {}
})
export default store
