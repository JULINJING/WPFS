import Vue from 'vue'
import App from './App'
import router from './router'
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.config.productionTip = false

// 创建 Pinia
const pinia = createPinia()

new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
    pinia
})
Vue.use(PiniaVuePlugin)