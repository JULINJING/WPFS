import Vue from 'vue'
import Vuex from 'vuex'
import path from 'path-browserify' // 使用适用于浏览器的path替代方案
import userInfo from './modules/userInfo'
import createPersistedState from 'vuex-persistedstate'

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
export default new Vuex.Store({
    modules: {
        userInfo
    },
    getters: {
        isLogined: state => {
            return state.userInfo.isLogined
        }
    },
    plugins: [createPersistedState({
        key: 'store',
        storage: window.localStorage,
    })]
})
