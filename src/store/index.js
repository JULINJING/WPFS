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
                uploadedFileList: [], // 上传的文件列表
                existedFileList: [], // 已经存在的文件列表
                processedJsonData: [], // 预处理后的数据
                predictedJsonData: [], // 预测的数据
                trainingProgress: 0, // 训练进度
                isTraining: false, // 是否正在训练
                isTurbineCanClick: true,
                currentTurbineId: "",
                windFieldId: 0,
                TurbineTableList: [
                    {
                        cn: "环境监测",
                        checked: true,
                    },
                    {
                        cn: "变桨系统",
                        checked: true,
                    },
                    {
                        cn: "数据监测",
                        checked: true,
                    },
                    {
                        cn: "发电参数",
                        checked: true,
                    },
                    {
                        cn: "统计参数",
                        checked: true,
                    }
                ],
            },
            mutations: {
                setPath(state) {
                    state.currentPathName = localStorage.getItem("currentPathName")
                },

                setUploadedFileName(state, fileName) {
                    state.uploadedFileName = fileName;
                },
                setUploadedFileList(state, fileList){
                    state.uploadedFileList = fileList;
                },
                setExistedFileList(state, fileList){
                    state.existedFileList = fileList;
                },
                pushToUploadedFileList(state, newItem) {
                    state.uploadedFileList.push(newItem);
                },
                removeFromUploadedFileList(state, itemToRemove) {
                    const index = state.uploadedFileList.indexOf(itemToRemove);
                    if (index !== -1) {
                        state.uploadedFileList.splice(index, 1);
                    }
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
                },
                setTurbineCanClick(state, flag){
                    state.isTurbineCanClick = flag;
                },

                setTurbineTableList(state, data){
                    state.TurbineTableList = data;
                },
                setCurrentTurbineId(state, id){
                    state.currentTurbineId = id;
                },
                setWindFieldId(state, id){
                    state.windFieldId = id;
                }
            },
            getters: {
                getUploadedFileName(state) {
                    return state.uploadedFileName;
                },
                getUploadedFileList(state) {
                    return state.uploadedFileList;
                },
                getExistedFileList(state) {
                    return state.existedFileList;
                },
                getProcessedJsonData(state) {
                    return state.processedJsonData;
                },
                getPredictedJsonData(state) {
                    return state.setPredictedJsonData;
                },
                getTrainingProgress(state) {
                    return state.trainingProgress;
                },
                getTurbineCanClick(state){
                    return state.flag;
                },
                getTurbineTableList(state){
                    return state.TurbineTableList;
                },
                getCurrentTurbineId(state){
                    return state.currentTurbineId;
                },
                getWindFieldId(state){
                    return state.windFieldId;
                }
            }
        }
    },
    getters: {}
})
export default store
