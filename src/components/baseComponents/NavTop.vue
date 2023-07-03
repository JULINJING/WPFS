<template>
    <div class="navcontainer _navcontainer">
        <img id="imgNav" src="../Home/imgs/logo1.png" height="40px" @click="$router.push('/home')">
        <div class="navicon _navicon"><i class="iconfont" @click="openMenu()">&#xeaf1;</i></div>
        <!-- <div class="turbineicon _turbineicon"><i class="iconfont" style="font-size: 24px;" @click="$router.push('/home')">&#xe6a3;</i></div> -->
        <div ref="navID" class="mainnavlist _mainnavlist">
            <div class="navlistclose"><i @click="closeMenu()" class="iconfont">&#xeaf2;</i></div>
            <div @click="routerpush('/upload')"><i class="iconfont">&#xe62d;</i> 上传</div>
            <div @click="routerpush('/forecast')"><i class="iconfont">&#xe764;</i> 预测</div>
            <div @click="routerpush('/windfield')"><i class="iconfont">&#xe60a;</i> Mars3D</div>
            <div @click="routerpush('/watch')"><i class="iconfont">&#xe613;</i> 监测</div>
            <div @click="routerpush('/turbine')"><i class="iconfont">&#xe614;</i> 异常</div>
            <div @click="routerpush('/windland')"><i class="iconfont">&#xe69c;</i> Three.js</div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'navtop',
    components: {
    },
    data () {
        return {
            nalistshowflag: false
        }
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
        openMenu () {
            var dom = this.$refs.navID

            if (dom.classList.contains('navlistshow')) {
                return
            }
            dom.classList.add('navlistshow')
        },
        // 当屏幕宽度小于800的时候，点击关闭按钮，关闭菜单
        closeMenu () {
            var dom = this.$refs.navID
            if (dom.classList.contains('navlistshow')) {
                dom.classList.remove('navlistshow')
            }
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
@media only screen and (min-width: 800px){
.navcontainer{
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    background-color: #000;
    color:rgb(214, 214, 214);
    .navicon{
        display:none;
        cursor: pointer;
    }
    .navicon:hover{
        color:white;
    }
    .turbineicon{
        width: 100px;
        cursor: pointer;
    }
    .turbineicon:hover{
        color:white;
        }
    .mainnavlist{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        .navlistclose{
            display: none;
        }
        div{
            text-align: center;
            height: 40px;
            line-height: 40px;
            width: 95px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
        }
        div:hover{
            color:white;
        }
    }
}
}
// 小于800px
@media only screen and (max-width: 800px){
    ._navcontainer{
    top: 0;
    display: flex;
    align-items: center;
    justify-content:space-between;
    height: 40px;
    background-color: #000;
    color:rgb(214, 214, 214);
    position: relative;
    ._navicon{
        width: 100px;
    }
    ._turbineicon{
        width: 100px;
    }
    ._mainnavlist{
        display: flex;
        flex-direction: column;
        position: absolute;
        //屏幕宽度小于800，默认情况下菜单是关闭的
        display: none;
        position:fixed;
        left: 0;
        top: 0 !important;
        z-index: 1999 !important;
        padding-top: 40px !important;
        width: 100%;
        height: 100%;
        color:rgb(214, 214, 214);
        background-color: rgba(0, 0, 0,0.95);
        top: 40px;
        padding: 0 40px;
        z-index: 999;
        div{
            text-align: left;
            height: 40px;
            line-height: 40px;
            width: 100%;
            border-bottom: 1px solid rgb(214, 214, 214);
        }
    }
    }
    .navlistshow{
        display: block !important;
    }
}
</style>
