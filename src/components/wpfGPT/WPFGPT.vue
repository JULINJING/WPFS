<template>
    <div>
        <div id="voice">
            <div class="voice-input-button-wrapper">
                <voice-input-button
                    v-model="result"
                    @record="showResult"
                    @record-start="recordStart"
                    @record-stop="recordStop"
                    @record-blank="recordNoResult"
                    @record-failed="recordFailed"
                    @record-ready="recordReady"
                    @record-complete="recordComplete"
                    interactiveMode="touch"
                >
                    <template slot="no-speak">没听清您说的什么</template>
                </voice-input-button>
            </div>
            <div class="result">{{result}}</div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'wpfGPT',
    data() {
        return {
            result: ''
        }
    },
    created(){
    },
    computed:{
    },
    methods: {
        recordReady () {
            console.info('按钮就绪!')
        },
        recordStart () {
            console.info('录音开始')
        },
        showResult (text) {
            console.info('收到识别结果：', text)
        },
        recordStop () {
            console.info('录音结束')
        },
        recordNoResult () {
            console.info('没有录到什么，请重试')
        },
        recordComplete (text) {
            console.info('识别完成! 最终结果：', text)
        },
        recordFailed (error) {
            console.info('识别失败，错误栈：', error)
        }
    },
}
</script>
<style lang="less">
    #voice {
        margin: 0 auto;
        width: 400px;
        display: flex;
        justify-content: space-around;
        .voice-input-button-wrapper{
            width: 40px;
            height: 40px;
            background-color: #77ACEF;
            border-radius: 50%;
        }
        .result{
            width: 80%;
            padding: 20px;
            border: #e2e2e2 1px solid;
            border-radius: 5px;
            line-height: 2;
            font-size: 16px;
            color: #727272;
            min-height: 24px;
            margin-bottom: 25px;
        }
    }
</style>
