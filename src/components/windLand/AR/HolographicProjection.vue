<template>
    <div id="arbox_wrapper_min" ref="tb_normal">
        <div id="arbox_max" class="b_hide" ref="ar_max">
            <div class="arbox_header">
                <i class="iconfont">&#xe642;</i>
                <div id="ar_header_text" class="ar_header_text">
                    AR风电
                </div>
                <i class="iconfont close_Icon" @click="panelSwitch">&#xeaf2;</i>
            </div>

            <el-carousel :autoplay="false" indicator-position="outside" height="480px">
                <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
                    <img :src="item.imageSrc" alt="Carousel Image" class="carousel-image">
                </el-carousel-item>
            </el-carousel>
        </div>
        <div id="arbox_min" class="arbox_min" ref="tb_min">
            <span id="min_img" ref="minImg" class="min_img" @click="panelSwitch"></span>
        </div>
    </div>
</template>
<script>

export default {
    name: 'ar',
    data() {
        return {
            carouselItems: [
                // { imageSrc: require('@/components/Home/imgs/logo3.png') },
                // { imageSrc: require('@/components/Home/imgs/logo3.png') },
                // { imageSrc: require('@/components/Home/imgs/logo3.png') },
                // { imageSrc: require('@/components/Home/imgs/logo3.png') }
                { imageSrc: require('../imgs/pattern-logo3.png') },
                { imageSrc: require('../imgs/pattern-logo3.png') },
                { imageSrc: require('../imgs/pattern-logo3.png') },
                { imageSrc: require('../imgs/pattern-logo3.png') }
            ],
        }
    },
    created() {
    },
    methods: {
        panelSwitch() {
            if (!this.isMax) {
                this.$refs.tb_normal.classList.add('talkbox_wrapper_max', 'animated', 'fadeInRight')
                this.$refs.ar_max.classList.remove('b_hide')
                this.$refs.tb_min.classList.add('b_hide')
                this.isMax = true
            } else {
                this.$refs.tb_normal.classList.remove('talkbox_wrapper_max', 'fadeInRight')
                this.$refs.ar_max.classList.add('b_hide')
                this.$refs.tb_min.classList.remove('b_hide')
                this.isMax = false
            }
        },
        mouseLeaveSwitch() {
            this.$refs.minImg.addEventListener('mouseleave', () => {
                this.$refs.minImg.style.backgroundImage = "url('../../../imgs/ar.png')";
            });
        }
    },
    mounted() {
        this.mouseLeaveSwitch()
    }
}
</script>
<style lang="less">
// 大于800px
@media only screen and (min-width: 800px) {
    .b_hide {
        display: none;
    }

    // 缩略图
    .el-image-viewer__wrapper {
        z-index: 999999999999 !important;
    }

    #arbox_wrapper_min {
        position: fixed;
        cursor: pointer;
        top: 85%;
        right: 5px;
        background-color: transparent;
        z-index: 99999999999;

        #arbox_min {
            .min_img {
                display: inline-block;
                margin-top: 0px;
                height: 50px;
                width: 50px;
                background-image: url('../../../../public/imgs/ar.png');
                background-size: cover;
            }

            .min_img:hover {
                background-image: url('../../../../public/imgs/ar.png') !important;
                height: 60px;
                width: 60px;
            }
        }
    }

    .talkbox_wrapper_max {
        cursor: default !important;
        width: 50%;
        top: 20% !important;
        right: 25% !important;
        // transform: translateX(50%) !important;
        background-color: white !important;
        border-radius: 6px;
        border: 1px #B8D4FF solid;

        .carousel-image {
            width: 100%;
            max-width: 100%;
            /* 图片最大宽度为容器宽度 */
            max-height: 100%;
            /* 图片最大高度为容器高度 */
        }

        .el-carousel__item:nth-child(2n) {
            background-color: #99a9bf;
        }

        .el-carousel__item:nth-child(2n+1) {
            background-color: #d3dce6;
        }

        #arbox_max {
            // width: 50%;
            height: 500px;

            .arbox_header {
                height: 40px;
                line-height: 40px;
                border-radius: 6px 6px 0 0;
                border-bottom: 1px #F1F1F1 solid;
                background: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 10px;

                .close_Icon {
                    cursor: pointer;
                }
            }
        }
    }
}

// 小于800px
@media only screen and (max-width: 800px) {
    .b_hide {
        display: none;
    }

    #arbox_wrapper_min {
        position: fixed;
        cursor: pointer;
        top: 85%;
        right: 5px;
        background-color: transparent;
        z-index: 99999999999;

        #arbox_min {
            .min_img {
                display: inline-block;
                margin-top: 0px;
                height: 50px;
                width: 50px;
                background-image: url('../../../../public/imgs/ar.png');
                background-size: cover;
            }

            .min_img:hover {
                background-image: url('../../../../public/imgs/ar.png') !important;
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

        #arbox_max {
            width: 348px;
            //width: 700px;
            height: 400px;
            //height: 500px;

            .arbox_header {
                height: 40px;
                line-height: 40px;
                border-radius: 6px 6px 0 0;
                border-bottom: 1px #F1F1F1 solid;
                background: white;
                display: flex;
                justify-content: space-around;
                align-items: center;

                .close_Icon {
                    cursor: pointer;
                }
            }
        }
    }
}
</style>  