<template>
  <div class="navcontainer _navcontainer">
    <img id="imgNav" src="../Home/imgs/logo1.png" height="40px" @click="$router.push('/home')">
    <div class="navicon _navicon"><i class="iconfont" @click="openMenu()">&#xeaf1;</i></div>
    <!-- <div class="turbineicon _turbineicon"><i class="iconfont" style="font-size: 24px;" @click="$router.push('/home')">&#xe6a3;</i></div> -->
    <div ref="navID" class="mainnavlist _mainnavlist">
      <div class="navlistclose"><i @click="closeMenu()" class="iconfont">&#xeaf2;</i></div>
      <div @click="routerpush('/upload')"><i class="iconfont">&#xe62d;</i> 上传数据</div>
      <div @click="routerpush('/forecast')"><i class="iconfont">&#xe764;</i> 训练预测</div>
      <div @click="routerpush('/windfield')"><i class="iconfont">&#xe60a;</i> 数字场站</div>
      <div @click="routerpush('/watch')"><i class="iconfont">&#xe613;</i> 风电运维</div>
      <div @click="routerpush('/turbine')"><i class="iconfont">&#xe614;</i> 异常监控</div>
      <div @click="routerpush('/windland')"><i class="iconfont">&#xe69c;</i> AR风电</div>
      <div class="logout _logout">
        <el-dropdown
            class="logout _logout" style="cursor: pointer; text-align: right; color: white"
        >
          <div class="logout _logout">
            <span class="el-dropdown-link" style="margin-left: 35px; width: 200px;">
              <i class="el-icon-user-solid" style="margin-right: 10px"></i>{{ user.nickname }}<i
                class="el-icon-arrow-down el-icon--right"
            ></i>
            </span>
          </div>
          <el-dropdown-menu slot="dropdown" style="width: 120px; text-align: center">
            <el-dropdown-item icon="el-icon-user">
              <span @click="personInfo">个人信息</span>
            </el-dropdown-item>
            <el-dropdown-item icon="el-icon-edit-outline">
              <span @click="changePwd">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided icon="el-icon-switch-button"><span @click="logout">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!-- 个人信息弹窗 -->
    <el-dialog
        title="个人信息"
        :visible.sync="infoDialogVisible"
        width="20%">
      <el-form label-width="80px" size="small">
        <el-form-item label="用户名">
          <el-input v-model="form.username" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="infoDialogVisible=false">取 消</el-button>
      <el-button type="primary" @click="saveInfo">保 存</el-button>

    </el-dialog>
    <!-- 修改密码弹窗 -->
    <el-dialog
        title="修改密码"
        :visible.sync="pwdDialogVisible"
        width="20%">
      <el-form label-width="120px" size="small" :model="form" :rules="rules" ref="pass">
        <el-form-item label="原密码" prop="password">
          <el-input v-model="form.password" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="form.newPassword" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-button @click="pwdDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="savePwd">确 定</el-button>
      </el-form>
    </el-dialog>
  </div>

</template>


<script>

import {serverIp} from "@/../public/config"

export default {
  name: 'navtop',
  components: {},
  data() {
    return {
      serverIp: serverIp,
      user: {},
      form: {},
      nalistshowflag: false,
      infoDialogVisible: false,
      pwdDialogVisible: false,
      rules: {
        password: [
          {required: true, message: '请输入原密码', trigger: 'blur'},
          {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
        ],
        newPassword: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
          {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
        ],
        confirmPassword: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
        ],
      }
    }
  },
  created() {
    // 从后台获取最新的User数据
    this.getUser().then(res => {
      console.log("this.form: " + res)
      this.form = res
      this.form.password = ''
    })
  },
  computed: {
    currentPathName() {
      return this.$store.state.currentPathName; //需要监听的数据
    },
  },
  methods: {
    routerpush(to) {
      this.$router.push(to)
      // 跳转之后，关闭菜单（在屏幕宽度小于800的时候才生效）
      var dom = document.getElementById('navID')
      if (dom.classList.contains('navlistshow')) {
        dom.classList.remove('navlistshow')
      }
    },
    // 当屏幕宽度小于800的时候，点击菜单图标，显示隐藏的菜单
    openMenu() {
      var dom = this.$refs.navID

      if (dom.classList.contains('navlistshow')) {
        return
      }
      dom.classList.add('navlistshow')
    },
    // 当屏幕宽度小于800的时候，点击关闭按钮，关闭菜单
    closeMenu() {
      var dom = this.$refs.navID
      if (dom.classList.contains('navlistshow')) {
        dom.classList.remove('navlistshow')
      }
    },
    logout() {
      this.$message({
        message: '退出成功',
        type: 'success'
      });
      this.$store.commit("logout");
      // this.$message.success("退出成功");

    },
    personInfo() {
      console.log("个人信息")
      this.infoDialogVisible = true
    },
    changePwd() {
      console.log("修改密码")
      this.pwdDialogVisible = true
    },
    async getUser() {
      let username = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).username : ""
      if (username) {
        // 从后台获取User数据
        await this.request.get("/user/username/" + username).then(res => {
          // 重新赋值后台的最新User数据
          this.user = res.data
        })
        console.log(this.user)
      }
      return (await this.request.get("/user/username/" + this.user.username)).data
    },
    saveInfo() {
      this.request.post("/user", this.form).then(res => {
        if (res.code === '200') {
          this.$message.success("保存成功")

          // 触发父级更新User的方法
          this.$emit("refreshUser")

          // 更新浏览器存储的用户信息
          this.getUser().then(res => {
            res.token = JSON.parse(localStorage.getItem("user")).token
            localStorage.setItem("user", JSON.stringify(res))
          })

        } else {
          this.$message.error("保存失败")
        }
      })
    },
    savePwd() {
      this.$refs.pass.validate((valid) => {
        if (valid) {
          if (this.form.newPassword !== this.form.confirmPassword) {
            this.$message.error("2次输入的新密码不相同")
            return false
          }
          this.request.post("/user/password", this.form).then(res => {
            if (res.code === '200') {
              this.$message.success("修改成功")
              this.$store.commit("logout")
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
#imgNav:hover {
  cursor: pointer;
  background-color: rgba(58, 53, 53, 0.5);
}

// 大于800px
@media only screen and (min-width: 800px) {
  .navcontainer {
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    background-color: #000;
    color: rgb(214, 214, 214);
    user-select: none;

    .navicon {
      display: none;
      cursor: pointer;
    }

    .navicon:hover {
      color: white;
    }

    .turbineicon {
      width: 100px;
      cursor: pointer;
    }

    .turbineicon:hover {
      color: white;
    }

    .mainnavlist {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;

      .navlistclose {
        display: none;
      }

      div {
        text-align: center;
        height: 40px;
        line-height: 40px;
        width: 86px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      }

      div:hover {
        color: white;
      }
    }
  }

  .logout {
    width: 150px !important
  }
}

// 小于800px
@media only screen and (max-width: 800px) {
  ._navcontainer {
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    background-color: #000;
    color: rgb(214, 214, 214);
    position: relative;

    ._navicon {
      width: 100px;
    }

    ._turbineicon {
      width: 100px;
    }

    ._mainnavlist {
      display: flex;
      flex-direction: column;
      position: absolute;
      //屏幕宽度小于800，默认情况下菜单是关闭的
      display: none;
      position: fixed;
      left: 0;
      top: 0 !important;
      z-index: 1999 !important;
      padding-top: 40px !important;
      width: 100%;
      height: 100%;
      color: rgb(214, 214, 214);
      background-color: rgba(0, 0, 0, 0.95);
      top: 40px;
      padding: 0 40px;
      z-index: 999;

      div {
        text-align: left;
        height: 40px;
        line-height: 40px;
        width: 100%;
        border-bottom: 1px solid rgb(214, 214, 214);
      }
    }
  }

  .navlistshow {
    display: block !important;
  }

  .el-dropdown-link {
    margin-left: 0 !important;
  }

  .el-dropdown-menu {
    left: 45px !important;
  }
}
</style>
