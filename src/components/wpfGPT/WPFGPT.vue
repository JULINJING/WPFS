<template>
    <div>
        <div id="talkbox_wrapper_min" class="" ref="tb_normal">
            <div id="talkbox_max" class="b_hide" ref="tb_max">
                <div class="talkbox_header">
                    <i class="iconfont">&#xe642;</i>
                    <div id="tb_header_text" class="tb_header_text">
                        风电宝
                    </div>
                    <i class="iconfont closeIcon" @click="panelSwitch">&#xeaf2;</i>
                </div>
                <div id="default_talk">
                    <span id="talk" class="talk">
                        <div id="privacy_text_top">由结束乐队提供的风电宝已唤醒，可以随时开始聊天啦</div>
                        <div class="talk_panel">
                            <div v-for="(message, index) in messages" :key="index" :class="message.isUser ? 'user-message' : 'robot-message'">
                                <img class="avatar" :src="message.isUser ? '../../../imgs/user.png' : '../../../imgs/robot.png'" :alt="message.isUser ? 'User Avatar' : 'Robot Avatar'" :style="{ order: message.isUser ? 2 : 1 }"/>
                                <p :style="{ order: message.isUser ? 1 : 2 }">{{ message.text }}</p>
                            </div>
                        </div>
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
                        <el-input placeholder="来说点什么吧" v-model="voiceResult" @keyup.enter.native="sendMessage">
                            <el-button slot="append" @click="sendMessage"><i class="iconfont">&#xe646;</i></el-button>
                        </el-input>
                    </div>
                </div>
            </div>
            <div id="talkbox_min" class="talkbox_min" ref="tb_min">
                <span id="min_img" ref="minImg" class="min_img" @click="panelSwitch"></span>
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
            // 语音以及输入 people
            voiceResult: '',
            // chatgpt
            generatedText: '',
            // 总对话
            messages: [{
                text: '请问有什么能够帮助您的？',
                isUser: false,
            }],
            // 面板状态
            isMax: false
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
            // 调用后端预测接口，传入预测参数
            // await this.request.post("/wpfgpt/chat", this.sendMessage).then((res) => {
            //     if (res.code === "200") {
            //         console.log(1)
            //     }
            // });
        },
        // 对话信息
        sendMessage() {
            // 将用户发送的信息添加到对话数组中
            this.messages.push({
                text: this.voiceResult,
                isUser: true, // 表示该条信息是用户发送的
            });

            this.generateText()

            // 模拟机器人回答信息（这里使用了setTimeout来模拟异步）
            setTimeout(() => {
                // this.generatedText = '这是机器人的回答'; // 替换成真实的机器人回答信息

                // 将机器人回答的信息添加到对话数组中
                this.messages.push({
                    text: this.generatedText,
                    isUser: false, // 表示该条信息是机器人回答的
                });
            }, 1000);

            // 清空用户输入框
            this.voiceResult = '';
        },
        // 切换GPT面版
        panelSwitch() {
            if (!this.isMax) {
                this.$refs.tb_normal.classList.add('talkbox_wrapper_max', 'animated', 'fadeInRight')
                this.$refs.tb_max.classList.remove('b_hide')
                this.$refs.tb_min.classList.add('b_hide')
                this.isMax = true
            }
            else {
                this.$refs.tb_normal.classList.remove('talkbox_wrapper_max', 'fadeInRight')
                this.$refs.tb_max.classList.add('b_hide')
                this.$refs.tb_min.classList.remove('b_hide')
                this.isMax = false
            }
        },
        mouseLeaveSwitch() {
            this.$refs.minImg.addEventListener('mouseleave', ()=> {
                this.$refs.minImg.style.backgroundImage = "url('../../../imgs/th_sleep.jpg')";
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
        width: 324px;
        height: 30px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-bottom: 10px;
        .voice-input-button-wrapper{
            width: 30px;
            height: 30px;
            background-color: #77ACEF;
            border-radius: 50%;
        }
        .el-input {
            width: 85%;
            .el-input__inner{
                height: 30px;
            }
        }
    }
    .b_hide{
        display: none;
    }
    #talkbox_wrapper_min{
        position: fixed;
        cursor: pointer;
        top: 40%;
        right: 5px;
        background-color: transparent;
        z-index: 99999999999;
        #talkbox_min {
            .min_img {
                display: inline-block;
                margin-top: 0px;
                height: 100px;
                width: 100px;
                background-image: url('../../../public/imgs/th_sleep.jpg');
            }
            .min_img:hover{
                background-image: url('../../../public/imgs/th.jpg') !important;
            }
        }
    }
    .talkbox_wrapper_max{
        cursor: default !important;
        top: 25% !important;
        right: 25px !important;
        background-color: white !important;
        border-radius: 6px;
        #talkbox_max{
            width: 348px;
            height: 400px;
            .talkbox_header{
                height: 40px;
                line-height: 40px;
                border-radius: 6px 6px 0 0;
                border-bottom: 1px #F1F1F1 solid;
                background: white;
                display: flex;
                justify-content: space-around;
                align-items: center;
                .closeIcon{
                    cursor: pointer;
                }
            }
            #default_talk{
                border-radius: 0 0 6px 6px;
                #talk{
                    display: block;
                    overflow-x: hidden;
                    overflow-y: auto;
                    height: 290px;
                    width: 348px;
                    #privacy_text_top{
                        text-align: center;
                        font-size: 10px;
                        letter-spacing: .3px;
                        color: #c0c0c0;
                        overflow: hidden;
                        padding: 10px 0 14px 0;
                        vertical-align: middle;
                    }
                    .talk_panel {
                        display: flex;
                        flex-direction: column;
                        .user-message,
                        .robot-message {
                            display: flex;
                            align-items: center;
                            margin-bottom: 10px;
                        }
                        .user-message {
                            justify-content: flex-end;
                            margin-right: 5px;
                            p{
                                margin-right: 5px;
                            }
                        }
                        .robot-message {
                            margin-left: 5px;
                            p{
                                margin-left: 5px;
                            }
                        }
                    }
                }
                #privacy_text_bottom{
                    height: 30px;
                    width: 348px;
                    #privacy_text_bottom_text{
                        width: 348px;
                        height: 14px;
                        text-align: center;
                        line-height: 14px;
                        padding: 8px 0;
                        color: #c8c8c8;
                        font-size: 10px;
                        letter-spacing: 0;
                    }
                }
            }
        }
    }
</style>
