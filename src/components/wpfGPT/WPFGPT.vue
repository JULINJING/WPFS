<template>
    <div>
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
        <p>{{ generatedText }}</p>
        <div id="talkbox_wrapper" class="talkbox_wrapper">
            <div id="talkbox_max" class="">
                <div class="ev_tb_header">
                    <div id="ev_tb_disable" class="ev_tb_disable"></div>
                    <div id="ev_tb_header_text" class="ev_tb_disable_header_text">
                        <a id="ev_tb_header_default_text" class="ev_tb_header_default_text">小冰</a>
                        <span id="ev_tb_header_select_img" class="ev_tb_header_select_close"></span>
                    </div>
                    <span id="ev_tb_maxclose" class="ev_tb_disable_close">
                        <span id="ev_tb_maxclose_img" class="ev_tb_close_img"></span>
                    </span>
                </div>
                <div id="ev_show_enlarge_img" class="b_hide">
                    <img id="ev_enlarge_img" class="ev_enlarge_img" data-bm="24">
                    <div id="ev_enlarge_close" class="ev_enlarge_close"></div>
                    <div id="ev_enlarge_background" class="ev_enlarge_background" style="height: 191px;"></div>
                </div>
                <div id="ev_default_talk">
                    <span id="ev_talkbox" class="ev_talkbox" style="height: 100px;">
                        <div id="ev_privacy_text_top">由红棉小冰提供的虚拟人类已唤醒，可以随时开始聊天啦</div>
                    </span>
                    <div id="ev_privacy_text_bottom">
                        <div id="ev_privacy_text_bottom_text">本服务由小冰公司运营</div>
                    </div>
                    <div id="ev_send_input">
                        <textarea id="ev_send_text" class="ev_send_text" type="text" placeholder="来说点什么吧"></textarea>
                        <div id="ev_send_button" class="ev_send_button">
                            <div id="ev_send_button_img" class="ev_send_button_img"></div>
                        </div>
                    </div>
                </div>
                <iframe id="ev_iframe_talk" class="b_hide" data-bm="43" style="height: 191px;"></iframe>
            </div>
            <div id="talkbox_min" class="talkbox_cn_min b_hide">
                <span id="ev_min_zo_img" class="ev_min_cn_img" style="width: 75px;"></span>
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
        }
    },
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
    #talkbox_wrapper{
        position: fixed;
        top: 94px;
        right: 16px;
        z-index: 99999999999;
        background-color: #F5F5F6;
    }
</style>
