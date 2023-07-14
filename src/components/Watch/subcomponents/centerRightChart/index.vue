<template>
    <div>
        <Chart :cdata="cdata" />
    </div>
</template>

<script>
import Chart from './chart.vue';
export default {
    data() {
        return {
            drawTiming: null,
            cdata: {
                indicatorData: [
                    { name: "风机1", value: 0 },
                    { name: "风机2", value: 0 },
                    { name: "风机3", value: 0 },
                    { name: "风机4", value: 0 },
                    { name: "风机5", value: 0 },
                    { name: "风机6", value: 0 }
                ]
            }
        }
    },
    components: {
        Chart,
    },
    mounted() {
        this.drawTimeFn()
    },
    beforeDestroy() {
        clearInterval(this.drawTiming)
    },
    methods: {
        drawTimeFn() {
            this.setData()
            this.drawTiming = setInterval(() => {
                this.setData()
            }, 5000)
        },
        setData() {
            const num = parseInt(Math.random() * 20)
            const length = this.cdata.indicatorData.length
            const index = parseInt(Math.random() * length)
            this.cdata.indicatorData[index].value += num
        }
    }
}
</script>