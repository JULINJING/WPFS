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
                uploadedFileName: null
            },
            mutations: {
                setUploadedFileName(state, fileName) {
                    state.uploadedFileName = fileName;
                },
                setPath(state) {
                    state.currentPathName = localStorage.getItem("currentPathName")
                },
            },
            getters: {
                getUploadedFileName(state) {
                    return state.uploadedFileName;
                }
            }
        }
    },
    getters: {}
})
export default store
