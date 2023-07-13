<template>
    <div id="watchContainer" class="watchContainer _watchContainer" ref="watch">
        <div class="bg">
            <dv-loading v-if="loading" style="height: 100vh;">Loading...</dv-loading>
            <div v-else class="host-body">
                <div class="d-flex jc-center">
                    <dv-decoration-10 class="dv-dec-10" />
                    <div class="d-flex jc-center">
                        <dv-decoration-8 class="dv-dec-8" :color="decorationColor" />
                        <div class="title">
                            <span class="title-text">风力能源监控</span>
                        </div>
                        <dv-decoration-8 class="dv-dec-8" :reverse="true" :color="decorationColor" />
                    </div>
                    <dv-decoration-10 class="dv-dec-10-s" />
                </div>

                <!-- 第二行 -->
                <div class="d-flex jc-between px-2">
                    <div class="d-flex aside-width">
                        <div class="react-left ml-4 react-l-s">
                            <span class="react-left"></span>
                            <span class="text">数据分析1</span>
                        </div>
                        <div class="react-left ml-3">
                            <span class="text">数据分析2</span>
                        </div>
                    </div>
                    <div class="d-flex aside-width">
                        <div class="react-right bg-color-blue mr-3">
                            <router-link to="/home"><span class="text fw-b">返回主页</span></router-link>
                        </div>
                        <div class="react-right mr-4 react-l-s">
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
// import centerLeft2 from './centerLeft2'
import centerRight1 from './centerRight1'
import centerRight2 from './centerRight2'

// import center from './center'
import bottomLeft from './bottomLeft'
import bottomRight from './bottomRight'
import NavTop from '../baseComponents/NavTop'

export default {
    name: 'watch',
    mixins: [drawMixin],
    components: {
        NavTop,
        centerLeft1,
        bottomLeft,
        centerRight1,
        centerRight2,
        bottomRight
    },
    data() {
        return {
            timing: null,
            loading: true,
            dateDay: null,
            dateYear: null,
            dateWeek: null,
            weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            decorationColor: ['#568aea', '#000000']
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
