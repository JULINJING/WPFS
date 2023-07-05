import VueRouter from 'vue-router'
import Vue from 'vue'

import Home from '../components/Home/Home'
import Upload from '../components/Upload/Upload'
import WindField from '../components/windField/WindField'
import WindLand from '../components/windLand/WindLand'
import Turbine from '../components/Turbine/Turbine'
import Watch from '../components/Watch/Watch'
import Forecast from '../components/Forecast/Forecast'
import Login from '../components/Login/Login'

// import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

var router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            component: Home
        },
        {
            path: '/upload',
            component: Upload
        },
        {
            path: '/windfield',
            component: WindField
        },
        {
            path: '/windland',
            component: WindLand
        },
        {
            path: '/turbine',
            component: Turbine
        },
        {
            path: '/watch',
            component: Watch
        },
        {
            path: '/forecast',
            component: Forecast
        },
        {
            path: '/login',
            component: Login
        }
    ],
    mode: 'history'

})

NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

//用路由守卫来做nav显示
router.beforeEach((to, from, next) => {
    NProgress.start()
    // store.dispatch('setBarTitle', to.name)
    next()
})
router.afterEach(() => {
    NProgress.done()
})
export default router