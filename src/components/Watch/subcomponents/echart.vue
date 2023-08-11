<template>
    <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>

export default {
    name: 'echart',
    props: {
        className: {
            type: String,
            default: 'chart'
        },
        id: {
            type: String,
            default: 'chart'
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '100%'
        },
        options: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            chart: null,
        }
    },
    watch: {
        options: {
            handler(options) {
                // 设置true清空echart缓存
                this.chart.setOption(options, true)
            },
            deep: true
        }
    },
    mounted() {
        // this.$echarts.registerTheme('tdTheme', tdTheme); // 覆盖默认主题
        this.initChart();
        window.addEventListener("resize", () => {
            if (this.chart) {
                this.chart.resize()
            }
        })
    },
    beforeDestroy() {
        this.chart.dispose()
        this.chart = null
        window.removeEventListener('resize', () => {
            this.chart.resize()
        })
    },
    methods: {
        initChart() {
            // 初始化echart
            this.chart = this.$echarts.init(this.$el, 'tdTheme')
            this.chart.setOption(this.options, true)
        }
    }
}
</script>

<style></style>