<template>
  <div>
    <div id="talkbox_wrapper_min" ref="tb_normal">
      <div id="talkbox_max" class="b_hide" ref="tb_max">
        <div class="talkbox_header">
          <i class="iconfont">&#xe642;</i>
          <div id="tb_header_text" class="tb_header_text">
            风电宝
          </div>
          <i class="iconfont closeIcon" @click="panelSwitch">&#xeaf2;</i>
        </div>
        <div id="default_talk">
                    <span id="talk" class="talk" ref="talk">
                        <div id="privacy_text_top">由结束乐队提供的风电宝已唤醒，可以随时开始聊天啦</div>
                        <div class="talk_panel">
                            <div v-for="(message, index) in messages" :key="index"
                                 :class="message.isUser ? 'user-message' : 'robot-message'">
                                <img class="avatar"
                                     :src="message.isUser ? '../../../imgs/user.png' : '../../../imgs/robot.png'"
                                     :alt="message.isUser ? 'User Avatar' : 'Robot Avatar'"
                                     :style="{ order: message.isUser ? 2 : 1 }"/>
                                <p :style="{ order: message.isUser ? 1 : 2 }">
                                  <template v-if="message.isUser">
                                      {{ message.text }}
                                  </template>
                                  <template v-else>
                                    <div v-html="markdown(message.text)"></div>
                                    <div></div>
                                    <template v-if="message.isImage">
                                    <el-image
                                        style="width: 100px; height: 100px"
                                        :src="thumbnail"
                                        :preview-src-list="masterImg">
                                    </el-image>
                                    </template>
                                  </template>
                                </p>

                            </div>
                        </div>
                    </span>
          <div id="privacy_text_bottom" ref="loadParent">
            <div id="privacy_text_bottom_text" ref="loadChild">本服务由结束乐队运营</div>
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
import MarkdownIt from 'markdown-it';
import {mapState} from 'vuex';

export default {
  name: 'wpfGPT',
  data() {
    return {
      // 语音以及输入 people
      voiceResult: '',
      voiceResultTemp: '',
      // chatgpt
      generatedText: '',
      // 总对话
      messages: [{
        text: '请问有什么能够帮助您的？',
        isUser: false,
        isImage: false,
      }],
      isImage: false,
      // 面板状态
      isMax: false,
      // test: '## 我是'
      thumbnail: 'http://10.101.240.60:7070/wpfgpt/api/images/20.png',
      masterImg: [
        'http://10.101.240.60:7070/wpfgpt/api/images/20.png',
      ]
    }
  },
  created() {
  },
  computed: {
    ...mapState('global', ['predictedJsonData', 'uploadedFileName']),
  },
  methods: {
    // 科大讯飞
    recordReady() {
      console.info('按钮就绪!')
    },
    recordStart() {
      console.info('录音开始')
    },
    showResult(text) {
      console.info('收到识别结果：', text)
    },
    recordStop() {
      console.info('录音结束')
    },
    recordNoResult() {
      console.info('没有录到什么，请重试')
    },
    recordComplete(text) {
      console.info('识别完成! 最终结果：', text)
    },
    recordFailed(error) {
      console.info('识别失败，错误栈：', error)
    },
    // chatgpt
    async generateText() {
      // 前端版本
      // this.generatedText = await ChatGPT.generateText(this.voiceResult);
      // 发送对话信息给gpt接口
      // Java版本

      var processParams = {
        "question": this.voiceResultTemp,
        "fileName": this.$store.state.global.uploadedFileName,
      }

      await this.request.post("/wpfgpt/postChat2", processParams).then((res) => {
        if (res.code === "200") {
          console.log("res.image:" + res.image)
          this.isImage = res.image
          this.thumbnail = "http://10.101.240.60:7070/wpfgpt/api/images/" + (this.$store.state.global.uploadedFileName).replace(".csv", ".png")
          this.masterImg = ["http://10.101.240.60:7070/wpfgpt/api/images/" + (this.$store.state.global.uploadedFileName).replace(".csv", ".png")]
          console.log(res.msg)
          this.generatedText = res.msg;
        } else {
          document.getElementById('loading').textContent = '抱歉，服务器异常，请重试';
        }
      });
    },
    // 转md
    markdown(text) {
      const md = new MarkdownIt()
      const result = md.render(text)
      return result
    },
    // 对话信息
    async sendMessage() {
      // 将用户发送的信息添加到对话数组中
      this.messages.push({
        text: this.voiceResult,
        isUser: true, // 表示该条信息是用户发送的
        isImage: this.isImage,
      });


      this.voiceResultTemp = this.voiceResult;
      // 清空用户输入框
      this.voiceResult = '';

      //  判断异常与否
      if (document.getElementById('loading')) {
        document.getElementById('loading').remove()
      }
      // 创建新的元素
      const loadingP = document.createElement('p');
      loadingP.id = 'loading';

      // 设置元素内容和样式
      loadingP.textContent = '请稍候...';
      loadingP.setAttribute('style', 'width: 348px;height: 14px;text-align: center;line-height: 14px;padding: 8px 0;color: #000000;font-size: 10px;letter-spacing: 0;')

      // 将元素插入页面
      this.$refs.loadParent.insertBefore(loadingP, this.$refs.loadChild);
      this.$refs.loadChild.style.display = 'none'

      await this.generateText()

      // 恢复原状
      document.getElementById('loading').remove();
      this.$refs.loadChild.style.display = 'block'

      // 模拟机器人回答信息（这里使用了setTimeout来模拟异步）
      // setTimeout(() => {
      //   // this.generatedText = '这是机器人的回答'; // 替换成真实的机器人回答信息

      //   // 将机器人回答的信息添加到对话数组中
      //   this.messages.push({
      //     text: this.generatedText,
      //     isUser: false, // 表示该条信息是机器人回答的
      //   });
      // }, 0);
      this.messages.push({
        text: this.generatedText,
        isUser: false, // 表示该条信息是机器人回答的
        isImage: this.isImage,
      });

      setTimeout(() => {
        //  滚动至最下方
        this.$refs.talk.scrollTop = this.$refs.talk.scrollHeight;
        console.log(this.$refs.talk.scrollTop)
      }, 500)
    },
    // 切换GPT面版
    panelSwitch() {
      if (!this.isMax) {
        this.$refs.tb_normal.classList.add('talkbox_wrapper_max', 'animated', 'fadeInRight')
        this.$refs.tb_max.classList.remove('b_hide')
        this.$refs.tb_min.classList.add('b_hide')
        this.isMax = true
      } else {
        this.$refs.tb_normal.classList.remove('talkbox_wrapper_max', 'fadeInRight')
        this.$refs.tb_max.classList.add('b_hide')
        this.$refs.tb_min.classList.remove('b_hide')
        this.isMax = false
      }
    },
    mouseLeaveSwitch() {
      this.$refs.minImg.addEventListener('mouseleave', () => {
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

  .voice-input-button-wrapper {
    width: 30px;
    height: 30px;
    background-color: #77ACEF;
    border-radius: 50%;
  }

  .el-input {
    width: 85%;

    .el-input__inner,
    .el-button {
      height: 30px;
    }

    .el-button:hover {
      font-weight: 900;
      font-size: larger;
    }
  }
}

.b_hide {
  display: none;
}

#talkbox_wrapper_min {
  position: fixed;
  cursor: pointer;
  top: 85%;
  right: 5px;
  background-color: transparent;
  z-index: 99999999999;

  #talkbox_min {
    .min_img {
      display: inline-block;
      margin-top: 0px;
      height: 50px;
      width: 50px;
      background-image: url('../../../public/imgs/th_sleep.jpg');
      background-size: cover;
    }

    .min_img:hover {
      background-image: url('../../../public/imgs/th.jpg') !important;
      height: 60px;
      width: 60px;
    }
  }
}

.talkbox_wrapper_max {
  cursor: default !important;
  top: 25% !important;
  right: 25px !important;
  background-color: white !important;
  border-radius: 6px;
  border: 1px #B8D4FF solid;

  #talkbox_max {
    width: 348px;
    height: 400px;

    .talkbox_header {
      height: 40px;
      line-height: 40px;
      border-radius: 6px 6px 0 0;
      border-bottom: 1px #F1F1F1 solid;
      background: white;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .closeIcon {
        cursor: pointer;
      }
    }

    #default_talk {
      border-radius: 0 0 6px 6px;

      #talk {
        display: block;
        overflow-x: hidden;
        overflow-y: auto;
        height: 290px;
        width: 348px;

        #privacy_text_top {
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
            align-items: start;
            margin-bottom: 10px;
          }

          .user-message {
            justify-content: flex-end;
            margin-left: 5px;
            margin-right: 5px;

            p {
              margin-right: 5px;
              font-size: 12px;
              text-align: right;
            }
          }

          .robot-message {
            margin-left: 5px;
            margin-right: 5px;
            width: 290px;

            p {
              margin-left: 5px;
              font-size: 12px;
              text-align: left;

              div {
                width: 290px;

                p {
                  margin: 0;
                }

                pre {
                  code {
                    display: inline-block;
                    width: 280px !important;
                    white-space: pre-wrap;
                    background-color: rgba(251, 251, 251, 0.8);
                    color: #409EFF;
                    font-weight: 800;
                    border: 1px solid #F1F1F1;
                    padding: 5px;

                    #text {
                      width: 280px !important;
                    }
                  }
                }
              }
            }
          }
        }
      }

      #privacy_text_bottom {
        height: 30px;
        width: 348px;

        #privacy_text_bottom_text {
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
