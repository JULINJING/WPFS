<template>
    <div id="watchContainer" class="watchContainer _watchContainer" ref="watch">
        <WPFGPT></WPFGPT>
        <div class="bg" id="PC">
            <dv-loading v-if="loading" style="height: 100vh;">Loading...</dv-loading>
            <div v-else class="host-body">
                <div class="d-flex jc-center">
                    <dv-decoration-10 class="dv-dec-10 decor" />
                    <div class="d-flex jc-center">
                        <dv-decoration-8 class="dv-dec-8 decor" :color="decorationColor" />
                        <div class="title">
                            <span class="title-text">单 风 电 场 智 能 运 维</span>
                        </div>
                        <dv-decoration-8 class="dv-dec-8 decor" :reverse="true" :color="decorationColor" />
                    </div>
                    <dv-decoration-10 class="dv-dec-10-s decor" />
                </div>

                <!-- 第二行 -->
                <div class="d-flex jc-between px-2">
                    <div class="d-flex aside-width">
                        <div class="react-left ml-4 react-l-s ">
                            <span class="react-left"></span>
                            <span class="text">{{ turbineName }}</span>
                        </div>
                        <div class="react-left ml-3 decor">
                            <router-link to="/windfield"><span class="text fw-b">返回场站</span></router-link>
                        </div>
                    </div>
                    <div class="d-flex aside-width">
                        <div class="react-right bg-color-blue mr-3">
                            <router-link to="/home"><span class="text fw-b">返回主页</span></router-link>
                        </div>
                        <div class="react-right mr-4 react-l-s decor">
                            <span class="react-after"></span>
                            <span class="text">{{ dateYear }} {{ dateWeek }} {{ dateDay }}</span>
                        </div>
                    </div>
                </div>
                <div class="body-box">
                    <!-- 第三行数据 -->
                    <div class="content-box">
                        <div>
                            <dv-border-box-12>
                                <centerLeft1 />
                            </dv-border-box-12>
                        </div>
                        <div>
                            <centerRight2 />
                        </div>
                        <div>
                            <dv-border-box-13>
                                <centerRight1 />
                            </dv-border-box-13>
                        </div>
                    </div>
                    <div class="bottom-box">
                        <dv-border-box-13>
                            <bottomLeft />
                        </dv-border-box-13>
                        <dv-border-box-12>
                            <bottomRight />
                        </dv-border-box-12>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import drawMixin from '@/utils/drawMixin'
import { formatTime } from '@/utils/index.js'
import centerLeft1 from './centerLeft1'
import centerRight1 from './centerRight1'
import centerRight2 from './centerRight2'

import bottomLeft from './bottomLeft'
import bottomRight from './bottomRight'
import NavTop from '../baseComponents/NavTop'
import WPFGPT from '../wpfGPT/WPFGPT.vue'

export default {
    name: 'watch',
    mixins: [drawMixin],
    components: {
        NavTop,
        centerLeft1,
        bottomLeft,
        centerRight1,
        centerRight2,
        bottomRight,
        WPFGPT
    },
    data() {
        let filename = this.$store.state.global.uploadedFileName;
        let machineNumber = filename.split(".")[0]; // 分割字符串并取得数字
        let turbineName = machineNumber + '号风机'; // 组合新的字符串
        return {
            timing: null,
            loading: true,
            dateDay: null,
            dateYear: null,
            dateWeek: null,
            weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            decorationColor: ['#568aea', '#000000'],
            turbineName
        }
    },
    methods: {
        timeFn() {
            this.timing = setInterval(() => {
                this.dateDay = formatTime(new Date(), 'HH:mm:ss')
                this.dateYear = formatTime(new Date(), 'yyyy-MM-dd')
                this.dateWeek = this.weekday[new Date().getDay()]
            })
        },
        cancelLoading() {
            setTimeout(() => {
                this.loading = false
            }, 300)
        },
        // 返回首页 
        backToHome() {
            this.$router.push('/home')
        }
    },
    mounted() {
        this.timeFn()
        this.cancelLoading()
    },
    beforeDestroy() {
        clearInterval(this.timing)
    }
}
</script>


<style lang="scss" scoped>
@import '../../assets/styles/scss/index.scss';
</style>
