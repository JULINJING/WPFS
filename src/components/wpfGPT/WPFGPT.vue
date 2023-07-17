<template>
    <div>
        <!-- talkbox_wrapper_min -->
        <div id="talkbox_wrapper" class="">
            <div id="talkbox_max" class="">
                <!-- b_hide -->
                <div class="talkbox_header">
                    <img src="./imgs/logo2.png" height="25px">
                    <div id="tb_header_text" class="tb_header_text">
                        风电宝
                    </div>
                    <span id="tb_maxclose" class="tb_disable_close">
                        <span id="tb_maxclose_img" class="tb_close_img">-</span>
                    </span>
                </div>
                <div id="default_talk">
                    <span id="talk_tip" class="talk_tip" style="height: 100px;">
                        <div id="privacy_text_top">由结束乐队提供的风电宝已唤醒，可以随时开始聊天啦</div>
                        <p>{{ generatedText }}</p>
                    </span>
                    <div id="privacy_text_bottom">
                        <div id="privacy_text_bottom_text">本服务由结束乐队运营</div>
                    </div>
                    <div id="voice">
                        <div class="voice-input-button-wrapper">
                            <voice-input-button
                                v-model="voiceResult"
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
                        <el-input placeholder="请输入内容" v-model="voiceResult" clearable class="input-with-button">
                            <el-button slot="append" @click="generateText"><i class="iconfont">&#xe646;</i></el-button>
                        </el-input>
                    </div>
                </div>
            </div>
            <div id="talkbox_min" class="talkbox_min">
                <span id="min_img" ref="minImg" class="min_img" style="background-image: url('/imgs/th_sleep.gif'); width: 75px;"></span>
            </div>
        </div>
    </div>
</template>
<script>
import ChatGPT from './chatgpt.js';

export default {
    name: 'wpfGPT',
    data() {
        return {
            // 语音
            voiceResult: '',
            // chatgpt
            generatedText: ''
        }
    },
    created(){
    },
    computed:{
    },
    methods: {
        // 科大讯飞
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
        },
        // chatgpt
        async generateText() {
            this.generatedText = await ChatGPT.generateText(this.voiceResult);
        },
        mouseLeaveSwitch() {
            let timeoutId;

            this.$refs.minImg.addEventListener('mouseleave', ()=> {
                // 鼠标离开元素后，设置3秒钟的定时器
                timeoutId = setTimeout(()=> {
                    this.$refs.minImg.style.backgroundImage = "url('../../../imgs/th_sleep.gif')";
                    console.log(this.$refs.minImg.style.backgroundImage)
                }, 3000);
            });

            this.$refs.minImg.addEventListener('mouseenter', function() {
                // 如果鼠标再次进入元素，就清除定时器
                clearTimeout(timeoutId);
            });
        }
    },
    mounted() {
        this.mouseLeaveSwitch()
    }
}
</script>
<style lang="less">
    #voice {
        margin: 0 auto;
        width: 400px;
        height: 40px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-bottom: 10px;
        .voice-input-button-wrapper{
            width: 40px;
            height: 40px;
            background-color: #77ACEF;
            border-radius: 50%;
        }
        .el-input {
            width: 80%;
        }
    }
    .b_hide{
        display: none;
    }
    #talkbox_wrapper{
        position: fixed;
        top: 25%;
        right: 14px;
        z-index: 99999999999;
        background-color: #F1F1F1;
        border-radius: 6px;
        #talkbox_max{
            // width: 200px;
            height: 300px;
            .talkbox_header{
                height: 50px;
                line-height: 50px;
                border-radius: 6px 6px 0 0;
                background: #f3f2f1;
                display: flex;
                justify-content: space-around;
                align-items: center;
            }
        }
    }
    .talkbox_wrapper_min{
        cursor: pointer;
        top: 40% !important;
        right: -10px !important;
        background-color: transparent !important;
        #talkbox_min {
            .min_img {
                display: inline-block;
                margin-top: 0px;
                height: 150px;
            }
            .min_img:hover{
                background-image: url('../../../public/imgs/th.gif') !important;
            }
        }
    }
</style>
