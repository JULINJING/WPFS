import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.use(ElementUI);

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