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
import voiceInputButton from 'voice-input-button2'


Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype.request = request
// 创建 Pinia
// const pinia = createPinia()

// Vue.use(PiniaVuePlugin)
Vue.use(ElementUI)
Vue.use(dataV)
Vue.use(voiceInputButton, {
    appId: 'd22bb119', // 您申请的语音听写服务应用的ID
    apiKey: '03dc4164811c96df36e089c23e197b48', // 您开通的语音听写服务的 apiKey
    apiSecret: 'NjE2ZGE1ZmZhNGYxZWJlYTM5YTExOTg1', // 您开通的语音听写服务的 apiSecret
    color: '#fff', // 按钮图标的颜色
    tipPosition: 'top', // 提示条位置
    vad_eos: 1000
    // 其他配置项, 参见下方 [Attributes / 属性] 部分
})

new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
    store,
    // pinia
})
