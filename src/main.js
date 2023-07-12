import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import dataV from '@jiaminghi/data-view'
// import { createPinia, PiniaVuePlugin } from 'pinia'
import * as echarts from 'echarts'
import './assets/styles/scss/style.scss'
import request from "@/utils/request";
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype.request = request
// 创建 Pinia
// const pinia = createPinia()

// Vue.use(PiniaVuePlugin)
Vue.use(ElementUI)
Vue.use(dataV)

new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
    // pinia
    store
})
