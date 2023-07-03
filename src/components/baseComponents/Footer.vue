<template>
    <div class="mainfooter _mainfooter">
        <div class="footerbody _footerbody">
            <div>
                <img src="../Home/imgs/logo.png">
            </div>
            <div id="functionTable">
                <h1>功能</h1>
                <p @click="routerpush('/upload')">上传</p>
                <p @click="routerpush('/forecast')">预测</p>
                <p @click="routerpush('/windfield')">风场</p>
                <p @click="routerpush('/watch')">监测</p>
                <p @click="routerpush('/turbine')">异常</p>
                <p @click="routerpush('/windland')">three</p>
            </div>
            <div>
                <h1>About</h1>
                <p>武汉大学 结束乐队</p>
                <p>杨可</p>
                <p>吴斌文 李廷赟 黄梓涛</p>
                <h1>Address</h1>
                <p>湖北省武汉市武昌区八一路299号</p>
                <p>430072</p>
            </div>
            <div>
                <h1>Contact</h1>
                <p><a href="zitaohuang@whu.edu.cn">发送邮件给我们</a></p>
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
            justify-content: space-around;
            text-align: left;
            padding: 20px 0;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            margin:0 10%;
            div{
                width: 180px;
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

}

@media only screen and (max-width: 800px){
    ._mainfooter{
        display: flex;
        flex-direction: column;
        width: 100%;
        justify-content: start;
        ._footerbody{
            width: 100%;
            display: flex;
            justify-content: space-around;
            text-align: left;
            // padding: 20px 0;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            // height: 500px;
            display: flex;
            flex-direction: column;
            align-items: center;
            // margin:0 10%;
            div{
                margin: 0 10px;
                width: 95%;
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
                    display: none ;
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
        
    }
}

</style>