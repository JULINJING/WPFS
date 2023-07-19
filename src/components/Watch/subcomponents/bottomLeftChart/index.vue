<template>
    <div>
        <Chart :cdata="cdata" />
    </div>
</template>

<script>
import Chart from './chart.vue'
import { mapState } from 'vuex'
import rawData from '@/assets/testJson/12.json'
export default {
    data() {
        return {
            cdata: {
                category: [
                    "2021/4/2 0:00",
                    "2021/4/2 0:15",
                    "2021/4/2 0:30",
                    "2021/4/2 0:45",
                    "2021/4/2 1:00",
                    "2021/4/2 1:15",
                    "2021/4/2 1:30",
                    "2021/4/2 1:45",
                    "2021/4/2 2:00",
                    "2021/4/2 2:15",
                    "2021/4/2 2:30",
                    "2021/4/2 2:45",
                    "2021/4/2 3:00",
                    "2021/4/2 3:15",
                    "2021/4/2 3:30",
                    "2021/4/2 3:45",
                    "2021/4/2 4:00",
                    "2021/4/2 4:15",
                    "2021/4/2 4:30",
                    "2021/4/2 4:45",
                    "2021/4/2 5:00",
                    "2021/4/2 5:15",
                    "2021/4/2 5:30",
                    "2021/4/2 5:45",
                    "2021/4/2 6:00",
                    "2021/4/2 6:15",
                    "2021/4/2 6:30",
                    "2021/4/2 6:45",
                    "2021/4/2 7:00",
                    "2021/4/2 7:15",
                    "2021/4/2 7:30",
                    "2021/4/2 7:45",
                    "2021/4/2 8:00",
                ],
                lineData: [
                    18092,
                    20728,
                    24045,
                    28348,
                    32808,
                    36097,
                    39867,
                    44715,
                    48444,
                    50415,
                    56061,
                    62677,
                    59521,
                    67560,
                    18092,
                    20728,
                    24045,
                    28348,
                    32808,
                    36097,
                    39867,
                    44715,
                    48444,
                    50415,
                    36097,
                    39867,
                    44715,
                    48444,
                    50415,
                    50061,
                    32677,
                    49521,
                    32808
                ],
                barData: [
                    4600,
                    5000,
                    5500,
                    6500,
                    7500,
                    8500,
                    9900,
                    12500,
                    14000,
                    21500,
                    23200,
                    24450,
                    25250,
                    33300,
                    4600,
                    5000,
                    5500,
                    6500,
                    7500,
                    8500,
                    9900,
                    22500,
                    14000,
                    21500,
                    8500,
                    9900,
                    12500,
                    14000,
                    21500,
                    23200,
                    24450,
                    25250,
                    7500
                ],
                rateData: []
            },
            curData: Object
        };
    },
    components: {
        Chart,
    },
    mounted() {
        this.initData()
        this.setData()
    },
    methods: {
        initData() {
            this.curData = JSON.parse(JSON.stringify(rawData))
            let width = document.documentElement.clientWidth
            this.cdata.category = []
            this.cdata.rateData = []
            this.cdata.lineData = []
            if (width < 960) {
                for (let i = 0; i < 10; i++) {
                    this.cdata.category.push(this.curData[i].DATATIME)
                    this.cdata.barData.push(this.curData[i].predictYD15.toFixed(1))
                    this.cdata.rateData.push(this.curData[i].trueYD15.toFixed(1))
                    this.cdata.lineData.push(this.curData[i].AWS.toFixed(1))
                }
            } else {
                for (let i = 0; i < this.curData.length; i++) {
                    this.cdata.category.push(this.curData[i].DATATIME)
                    this.cdata.barData.push(this.curData[i].predictYD15.toFixed(1))
                    this.cdata.rateData.push(this.curData[i].trueYD15.toFixed(1))
                    this.cdata.lineData.push(this.curData[i].AWS.toFixed(1))
                }
            }
        },
        // 根据自己的业务情况修改
        setData() {

            window.addEventListener('resize', () => {
                //视窗窗口 宽度高度改变时 触发函数程序
                //获取浏览器视窗窗口的宽度
                let width = document.documentElement.clientWidth
                this.cdata.category = []
                this.cdata.rateData = []
                this.cdata.lineData = []
                if (width < 960) {
                    for (let i = 0; i < 10; i++) {
                        this.cdata.category.push(this.curData[i].DATATIME)
                        this.cdata.barData.push(this.curData[i].predictYD15.toFixed(0))
                        this.cdata.rateData.push(this.curData[i].trueYD15.toFixed(0))
                        this.cdata.lineData.push(this.curData[i].AWS.toFixed(1))
                    }
                } else {
                    for (let i = 0; i < this.curData.length; i++) {
                        this.cdata.category.push(this.curData[i].DATATIME)
                        this.cdata.barData.push(this.curData[i].predictYD15.toFixed(0))
                        this.cdata.rateData.push(this.curData[i].trueYD15.toFixed(0))
                        this.cdata.lineData.push(this.curData[i].AWS.toFixed(1))
                    }
                }
            })
        },
    }
};
</script>

<style lang="scss" scoped></style>