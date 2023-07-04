<template>
    <div class="mainfooter _mainfooter">
        <div class="footerbody _footerbody">
            <div>
                <img src="../Home/imgs/logo2.png" width="250px">
            </div>
            <div id="functionTable">
                <h1>功能</h1>
                <p @click="routerpush('/upload')"><i class="iconfont">&#xe62d;</i> 上传</p>
                <p @click="routerpush('/forecast')"><i class="iconfont">&#xe764;</i> 预测</p>
                <p @click="routerpush('/windfield')"><i class="iconfont">&#xe60a;</i> 风场</p>
                <p @click="routerpush('/watch')"><i class="iconfont">&#xe613;</i> 监测</p>
                <p @click="routerpush('/turbine')"><i class="iconfont">&#xe614;</i> 异常</p>
                <p @click="routerpush('/windland')"><i class="iconfont">&#xe69c;</i> three</p>
            </div>
            <div>
                <h1>About</h1>
                <p><i class="iconfont">&#xe604;</i> 武汉大学 结束乐队</p>
                <p><i class="iconfont">&#xe608;</i> 杨可</p>
                <p><i class="iconfont">&#xe607;</i> 吴斌文 李廷赟 黄梓涛</p>
                <h1>Address</h1>
                <p><i class="iconfont">&#xe652;</i> 湖北省武汉市武昌区八一路299号</p>
                <p><i class="iconfont">&#xe60b;</i> 430072</p>
            </div>
            <div>
                <div class="contact">
                    <h1 class="contact_title">联系我们</h1>
                    <i class="icon iconfont" id="open" @click="showContact = !showContact">&#xe600;</i>
                </div>
                <transition name="fade">
                    <div class="list" v-show="showContact">
                        <h1>Email</h1>
                        <p><i class="iconfont">&#xe66f;</i> <a href="mailto:zitaohuang@whu.edu.cn">发送邮件给我们</a></p>
                        <h1 id="top">QQ</h1>
                        <p><i class="iconfont">&#xe882;</i> <a>2454548089</a></p>
                    </div>
                </transition>
            </div>
        </div>
        <div class="footerbottom _footerbottom">
            <p>Copyright © 2023 结束乐队 保留所有权利。</p>
        </div>
    </div>
</template>

<script>


export default {
    name: 'mainfooter',
    components: {
    },
    data() {
        return {
            showContact: false,
        }
    },
    methods: {
        routerpush(to) {
            this.$router.push(to)
        },
    }
}
</script>

<style lang="less" scoped>
@media only screen and (min-width: 800px){
    .mainfooter{
        display: flex;
        flex-direction: column;
        width: 100%;
        user-select: none;
        .footerbody{
            display: flex;
            justify-content: space-between;
            text-align: left;
            padding: 20px 0;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            margin:0 8%;
            div{
                width: 200px;
                h1{
                    font-size: 16px;
                    font-weight:800;
                    margin: 7px 0;
                }
                p{
                    font-size: 10px;
                    margin: 7px 0;
                    color:grey;
                }
                a{
                    color:grey;
                }
            }
            #functionTable{
                p{
                    &:hover{
                        cursor: pointer;
                        color: black;
                    }
                }
            }
        }
        .footerbottom{
            margin: 7px 0;
            p{
                font-size: 10px;
            }
        }
    }
    .contact {
        display: flex;
        .contact_title {
            flex: 7;
            padding-left: 20px;
            font-size: 16px;
            font-weight:800;
            margin: 7px 0;
        }
        .icon {
            flex: 1;
            font-size: 16px;
            margin: 10px 0;
        }
    }
    .list {
        padding-left: 35px;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity 1s;
        background-color: rgba(233,231,239,0.4);
    }
    .fade-enter, .fade-leave-to{
        opacity: 0;
    }
    #top {
        margin-top: 10px;
    }
    #open:hover {
        cursor: pointer;
    } 
}

@media only screen and (max-width: 800px){
    ._mainfooter{
        display: flex;
        flex-direction: column;
        width: 100%;
        justify-content: start;
        user-select: none;
        ._footerbody{
            width: 100%;
            display: flex;
            justify-content: space-around;
            text-align: left;
            // padding: 20px 0;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            // height: 500px;
            flex-direction: column;
            align-items: center;
            // margin:0 10%;
            div{
                // margin: 0 10px;
                width: 90%;
                h1{
                    display: block;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                    color: rgba(0, 0, 0, 0.5);
                    height: 40px;
                    font-size: 10px;
                    font-weight:800;
                    line-height: 40px;
                    // margin: 7px 0;
                }
                p{
                    // display: none ;
                    font-size: 10px;
                    margin: 7px 0;
                }
            }
        }
        ._footerbottom{
            margin: 7px 0;
            p{
                font-size: 10px;
            }
        }
        .contact {
            display: flex;
            justify-content: space-between;
            .contact_title {
                font-size: 10px;
                // margin: 7px 0;
                border: none;
            }
            .icon {
                flex: 1;
                font-size: 10px;
                margin-top: 14px;
            }
        }
        .list {
            padding-left: 10px;
        }
        .fade-enter-active, .fade-leave-active {
            transition: opacity 1s;
            background-color: rgba(233,231,239,0.4);
        }
        .fade-enter, .fade-leave-to{
            opacity: 0;
        }
        
    }
}

</style>