<template>
    <div>
        <Chart :cdata="cdata" />
    </div>
</template>
  
<script>
import Chart from './chart.vue'
export default {
    data() {
        const now = new Date(2022, 3, 1)
        return {
            drawTiming: null,
            cdata: {
                maxData: 12000,
                xdata: [],
                ydata: { 0: [], 1: [] }
            },
            now
        }
    },
    components: {
        Chart,
    },
    mounted() {
        this.drawTimingFn();
    },
    beforeDestroy() {
        clearInterval(this.drawTiming);
    },
    methods: {
        drawTimingFn() {
            this.setData()
            this.drawTiming = setInterval(() => {
                for (let i = 0; i < 5; i++) {
                    let xydata = this.randomData()
                    this.cdata.xdata.shift()
                    this.cdata.ydata[0].shift()
                    this.cdata.ydata[1].shift()
                    this.cdata.ydata[0].push(xydata.value[0])
                    this.cdata.ydata[1].push(xydata.value[1])
                }
            }, 6000);
        },
        setData() {
            for (let i = 0; i < 100; i++) {
                let xydata = this.randomData()
                this.cdata.xdata.push(xydata.name)
                this.cdata.ydata[0].push(xydata.value[0])
                this.cdata.ydata[1].push(xydata.value[1])
            }
        },
        randomData() {
            const oneDay = 24 * 3600 * 1000
            this.now = new Date(+this.now + oneDay)
            const value = Math.random() * 500 + 250
            return {
                name: [this.now.getFullYear(), this.now.getMonth(), this.now.getDate()].join('/'),
                value: [
                    Math.round(value),
                    Math.round(value) - Math.round(Math.random() * 100)
                ]
            };
        }
    }
};
</script>

<style lang="scss" scoped></style>