<template>
  <div class="login-container">
    <div class="pageHeader">
      <img src="@/components/Home/imgs/logo2.png" alt="logo" />
      <span>"数 智 一 体" 风 电 预 测 探 索 者</span>
    </div>

    <div class="login-box">
      <div class="login-text" v-if="typeView != 2">
        <a
          href="javascript:;"
          :class="typeView == 0 ? 'active' : ''"
          @click="handleTab(0)"
          >登录</a
        >
        <b>|</b>
        <a
          href="javascript:;"
          :class="typeView == 1 ? 'active' : ''"
          @click="handleTab(1)"
          >注册</a
        >
      </div>
      <!-- 登录模块 -->
      <!-- <div class="option">
        <el-checkbox size="mini" v-model="checked" class="checked remember"
          >记住密码</el-checkbox
        >
        <span class="forget-pwd" @click.stop="forgetPwd">忘记密码?</span>
      </div> -->
      <el-form
        :model="user"
        :rules="loginRules"
        ref="userForm1"
        v-show="typeView == 0"
      >
        <el-form-item class="mobileInput" prop="username">
          <el-input
            placeholder="请输入账号"
            size="medium"
            prefix-icon="el-icon-user"
            v-model="user.username"
          ></el-input>
        </el-form-item>
        <el-form-item class="mobileInput" prop="password">
          <el-input
            placeholder="请输入密码"
            size="medium"
            prefix-icon="el-icon-lock"
            show-password
            v-model="user.password"
            @keyup.native.enter="login"
          ></el-input>
        </el-form-item>
        <el-form-item class="bottomTool" style="text-align: right">
          <el-button
            type="info"
            size="small"
            autocomplete="off"
            @click="handleTab(1)"
            >注册</el-button
          >
          <el-button
            type="primary"
            size="small"
            autocomplete="off"
            @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>

      <!-- 注册模块 -->
      <el-form
        :model="user"
        :rules="registerRules"
        ref="userForm2"
        v-show="typeView == 1"
      >
        <el-form-item class="mobileInput" prop="username">
          <el-input
            placeholder="请输入账号"
            size="medium"
            prefix-icon="el-icon-user"
            v-model="user.username"
          ></el-input>
        </el-form-item>
        <el-form-item class="mobileInput" prop="password">
          <el-input
            placeholder="请输入密码"
            size="medium"
            prefix-icon="el-icon-lock"
            show-password
            v-model="user.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="mobileInput" prop="confirmPassword">
          <el-input
            placeholder="请确认密码"
            size="medium"
            prefix-icon="el-icon-lock"
            show-password
            v-model="user.confirmPassword"
            @keyup.native.enter="register"
          ></el-input>
        </el-form-item>
        <el-form-item class="bottomTool" style="text-align: right">
          <el-button
            type="primary"
            size="small"
            autocomplete="off"
            @click="register"
            >注册</el-button
          >
          <el-button
            type="info"
            size="small"
            autocomplete="off"
            @click="handleTab(0)"
            >返回登录</el-button
          >
        </el-form-item>
      </el-form>

      <!-- 忘记密码 -->
      <!-- <div class="right-content" v-show="typeView == 2">
            <div class="title">重置密码</div>
            <div class="input-box">
                <input
                autocomplete="off"
                type="text"
                class="input"
                v-model="formReset.userName"
                placeholder="请输入登录邮箱/手机号"
                />
                <input
                autocomplete="off"
                type="password"
                class="input"
                v-model="formReset.userPwd"
                maxlength="20"
                @keyup.enter="reset"
                placeholder="请输入密码"
                />
                <input
                autocomplete="off"
                type="password"
                class="input"
                v-model="formReset.userPwd2"
                maxlength="20"
                @keyup.enter="reset"
                placeholder="请再次确认密码"
            />
            </div>
            <Button
            class="loginBtn"
            type="primary"
            :disabled="isResetAble"
            :loading="isLoading"
            @click.stop="reset">
            确认重置
            </Button>
            <div class="option">
            <span class="goback" @click.stop="selectLogin">返回登录注册</span>
            </div>
        </div> -->
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "login",
  components: {},
  data() {
    return {
      user: {},
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur",
          },
        ],
      },
      registerRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur",
          },
        ],
        confirmPassword: [
          { required: true, message: "请确认密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur",
          },
        ],
      },
      // formReset: {
      //   userName: '',
      //   userPwd2: '',
      //   userPwd: '',
      // },
      typeView: 0, //显示不同的view
    };
  },
  computed: {
    // 重置密码按钮状态
    // isResetAble() {
    //   return !(this.formReset.userName && this.formReset.userPwd && this.formReset.userPwd2);
    // }
  },
  mounted() {
    this.initAnimate();
  },
  methods: {
    // 设置开场动画
    initAnimate() {
      setTimeout(function () {
        $(".pageHeader").css("visibility", "visible");
        $(".login-box").css("visibility", "visible");
        $(".pageHeader").addClass("animated fadeInUp");
        $(".login-box").addClass("animated rollIn");
      }, 1500);
    },
    // 登录/注册tab切换
    handleTab(type) {
      this.typeView = type;
    },
    //   // 忘记密码界面
    //   forgetPwd() {
    //     this.$message.info('忘记密码，请联系客服');
    //     // this.typeView = 2;
    //     // this.clearInput();
    //   },

    // 立即登录
    login() {
      this.$refs["userForm1"].validate((valid) => {
        if (valid) {
          // 表单校验合法
          this.request.post("/user/login", this.user).then((res) => {
            if (res.code === "200") {
              localStorage.setItem("user", JSON.stringify(res.data)); // 存储用户信息到浏览器
              localStorage.setItem("menus", JSON.stringify(res.data.menus)); // 存储用户信息到浏览器

              this.$message({
                message: "登录成功",
                type: 'success',
                offset: '50',//距离顶部的位置
                duration: '8000'//持续的时间
              });

              if (res.data.role === "ROLE_NORMAL") {
                this.$router.push("/home");
              } else {
                this.$router.push("/home");
              }
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },

    // 立即注册
    register() {
      this.$refs['userForm2'].validate((valid) => {
        if (valid) {  // 表单校验合法
          if (this.user.password !== this.user.confirmPassword) {
            this.$message.error("两次输入的密码不一致")
            return false
          }
          this.request.post("/user/register", this.user).then(res => {
            if (res.code === '200') {
              this.$message.success("注册成功")
              this.$router.push("/login")
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.bottomTool {
  margin: 0;
  padding: 0;
}
@media only screen and (min-width: 1000px) {
  .login-container {
    background-image: url("@/assets/images/login.gif");
    background-position: center;
    background-size: cover;
    // position: relative;
    width: 100vw;
    height: 100vh;

    .pageHeader {
      padding-top: 5%;
      padding-left: 5%;
      display: flex;
      visibility: hidden;
      /*上下居中*/
      align-items: center;

      img {
        vertical-align: middle;
        margin-right: 3%;
        height: auto;
        width: 20%;
      }

      span {
        font-size: 3em;
        font-weight: 800;
        vertical-align: middle;
        color: #fefefe;
        text-shadow: 0px 1px 0px #c0c0c0, 0px 2px 0px #b0b0b0,
          0px 3px 0px #a0a0a0, 0px 4px 0px #909090,
          0px 5px 10px rgba(0, 0, 0, 0.9);
        user-select: none;
      }
    }

    .login-box {
      visibility: hidden;
      position: absolute;
      left: 60vw;
      // top: 50%;
      // -webkit-transform: translateY(-50%);
      // transform: translateY(-50%);
      box-sizing: border-box;
      text-align: center;
      box-shadow: 0 1px 11px rgba(0, 0, 0, 0.3);
      border-radius: 20px;
      /*margin: 100px auto 0;*/
      width: 25vw;
      background: #fff;
      padding: 4vh 2.5vw;

      .login-text {
        width: 100%;
        text-align: center;
        padding: 0 0 40px;
        font-size: 18px;
        letter-spacing: 6px;
        user-select: none;
        a {
          padding: 10px;
          color: #969696;
          &.active {
            font-weight: 800;
            color: rgba(73, 129, 242, 0.9);
            border-bottom: 2px solid rgba(73, 129, 242, 1);
          }
          &:hover {
            border-bottom: 2px solid rgba(73, 129, 242, 1);
          }
        }
        b {
          padding: 10px;
        }
      }
    }
  }
}
@media only screen and (max-width: 1000px) {
  .login-container {
    background-image: url("@/assets/images/login.gif");
    background-position: center;
    background-size: cover;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    .pageHeader {
      display: flex;
      flex-direction: column;
      visibility: hidden;
      /*上下居中*/
      align-items: center;
      /*左右居中*/
      justify-content: center;

      img {
        vertical-align: middle;
        margin-right: 0%;
        height: auto;
        width: 50%;
      }

      span {
        font-size: 1.5em;
        font-weight: 800;
        vertical-align: middle;
        color: #fefefe;
        text-shadow: 0px 1px 0px #c0c0c0, 0px 2px 0px #b0b0b0,
          0px 3px 0px #a0a0a0, 0px 4px 0px #909090,
          0px 5px 10px rgba(0, 0, 0, 0.9);
        user-select: none;
      }
    }

    .login-box {
      visibility: hidden;
      box-sizing: border-box;
      text-align: center;
      box-shadow: 0 1px 11px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      width: 75vw;
      background: #fff;
      padding: 4vh 8vw;

      .login-text {
        width: 100%;
        text-align: center;
        padding: 0 0 30px;
        font-size: 14px;
        letter-spacing: 4px;
        user-select: none;
        a {
          padding: 10px;
          color: #969696;
          &.active {
            font-weight: 800;
            color: rgba(73, 129, 242, 0.9);
            border-bottom: 2px solid rgba(73, 129, 242, 1);
          }
          &:hover {
            border-bottom: 2px solid rgba(73, 129, 242, 1);
          }
        }
        b {
          padding: 10px;
        }
      }
    }
    .mobileInput {
      margin-bottom: 10px;
    }
  }
}
</style>
