<template>
  <div class="homeContainer _homeContainer">
    <div class="page-overlay">
      <h3 class="animated_text">w p f b o o s t</h3>
      <h2 id="teamName" class="schoolTitle opacity0" style="color: white;font-weight: 800;margin-top: 20px;">
        武汉大学</h2>
      <h2 id="teamName" class="title opacity0" style="color: white;font-weight: 800;margin-top: 20px;">结束乐队</h2>
      <div class="logo-list opacity0"><img src="./imgs/logo3.png"></div>
    </div>
    <div id="home">
      <NavTop></NavTop>
      <div class="subdiv _subdiv" style="margin-top: 1%;">
        <div class="left box" id="first">
          <BlockBriefInfo :blockIcon="'&#xe62d;'" :blockTitle="'上传数据'" :blockInfo="'&#xec7f; '"
                          :backgroundColor="'rgb(250, 250, 250)'" :fontColor="'black'" :imgSrc="require('./imgs/1.jpg')"
                          :blockName="'upload'"/>
        </div>
        <div class="right box" id="second">
          <BlockBriefInfo :blockIcon="'&#xe764;'" :blockTitle="'训练预测'" :blockInfo="'&#xec7f; '" :fontColor="'white'"
                          :backgroundColor="'rgb(250, 250, 250)'" :imgSrc="require('./imgs/6.jpg')"
                          :blockName="'forecast'"/>
        </div>
      </div>
      <div class="subdiv _subdiv">
        <div class="left box" id="third">
          <BlockBriefInfo :blockIcon="'&#xe60a;'" :blockTitle="'数字风电'" :blockInfo="'&#xec7f; '"
                          :backgroundColor="'rgb(250, 250, 250)'" :fontColor="'white'" :imgSrc="require('./imgs/4.jpg')"
                          :blockName="'windfield'"/>
        </div>
        <div class="right box" id="fourth">
          <BlockBriefInfo :blockIcon="'&#xe613;'" :blockTitle="'风电监测'" :blockInfo="'&#xec7f; '"
                          :backgroundColor="'rgb(250, 250, 250)'" :fontColor="'black'" :imgSrc="require('./imgs/5.jpg')"
                          :blockName="'watch'"/>
        </div>
      </div>
      <div class="subdiv _subdiv">
        <div class="left box" id="fifth">
          <BlockBriefInfo :blockIcon="'&#xe614;'" :blockTitle="'异常监控'" :blockInfo="'&#xec7f; '"
                          :fontColor="'black'" :backgroundColor="'rgb(250, 250, 250)'" :imgSrc="require('./imgs/3.jpg')"
                          :blockName="'turbine'"/>
        </div>
        <div class="right box" id="sixth">
          <BlockBriefInfo :blockIcon="'&#xe69c;'" :blockTitle="'动画Demo'" :blockInfo="'&#xec7f; '"
                          :fontColor="'white'" :backgroundColor="'rgb(250, 250, 250)'" :imgSrc="require('./imgs/2.jpg')"
                          :blockName="'windland'"/>
        </div>
      </div>
      <Footer></Footer>
    </div>
  </div>
</template>

<script>
import BlockBriefInfo from './subcomponents/BlockBriefInfo'
import NavTop from '../baseComponents/NavTop.vue';
import Footer from '../baseComponents/Footer.vue'
import $ from 'jquery'

export default {
  name: 'home',
  components: {
    BlockBriefInfo,
    NavTop,
    Footer,
  },
  data() {
    return {}
  },
  methods: {
    initAnimate() {
      var x = {
        size: 150,
        weight: 8,
        color: ["#177cb0", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#8d4bbb", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f47983", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f47983", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8"],
        duration: 0.35,
        delay: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4],
        fade: 0.5,
        individualDelays: false,
        easing: d3_ease.easeSinInOut.ease
      };
      var element = $(".animated_text")[0];
      var z = new Letters(element, x);
      z.show();
      // 遮罩层点击事件被触发 跳过动画
      $(".page-overlay").on("click", function () {
        console.log("跳过动画")
        $(".title").addClass("animated rollIn");
        // $(".schoolTitle").addClass("animated bounceIn")
        $(".logo-list").addClass("animated fadeInUp")
        !$(".page-overlay").hasClass("loaded") && $(".page-overlay").addClass('loaded')
        $(".page-overlay").hasClass("loaded") && $(".page-overlay").css("display", "none") && $("#home").css("display", "block")
      });
      // 动画
      setTimeout(function () {
        $(".title").addClass("animated rollIn");
        // $(".schoolTitle").addClass("animated bounceIn")
        $(".logo-list").addClass("animated fadeInUp")
      }, 3000);
      setTimeout(function () {
        !$(".page-overlay").hasClass("loaded") && $(".page-overlay").addClass('loaded')
      }, 6000)
      setTimeout(function () {
        $(".page-overlay").hasClass("loaded") && $(".page-overlay").css("display", "none") && $("#home").css("display", "block")
      }, 7000)
    },
  },
  mounted() {
    this.initAnimate()
  }
}
</script>

<style lang="less" scoped>
#home {
  display: none;
}

/* LOGO */
.logo-list {
  margin-top: 20px;
  /* position: absolute;
     bottom: 20px;
     left: 45%;*/
}

.logo-list img {
  height: 150px;
}

/* Loader */
.page-overlay {
  position: relative;
  z-index: 1;
  overflow: hidden;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: #2c2e2f;
  z-index: 10000;
  zoom: 1;
  filter: alpha(opacity=100);
  -webkit-opacity: 1;
  -moz-opacity: 1;
  opacity: 1;
  -webkit-transition: all 800ms ease-in-out;
  -moz-transition: all 800ms ease-in-out;
  -o-transition: all 800ms ease-in-out;
  transition: all 800ms ease-in-out;
}

.page-overlay.loaded {
  zoom: 1;
  filter: alpha(opacity=0);
  -webkit-opacity: 0;
  -moz-opacity: 0;
  opacity: 0;
  visibility: hidden;
}

.page-overlay.clear {
  background: transparent;
}

/* AnimatedLetters */
.animated_text {
  position: relative;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  max-width: 100%;
  color: transparent;
  pointer-events: none;
}

.opacity0 {
  filter: alpha(opacity=0);
  -webkit-opacity: 0;
  -moz-opacity: 0;
  opacity: 0;
}

// 大于800px
@media only screen and (min-width: 800px) {
  .homeContainer {
    font-size: 1vw;

    .subdiv {
      width: 100%;
      display: flex;
      justify-content: space-around;
      font-size: .5em;

      .left {
        width: 48%;
        height: 100%;
        font-size: .8em;
      }

      .right {
        width: 48%;
        height: 100%;
        font-size: .8em;
      }
    }
  }

  #teamName {
    font-size: 3em;
  }

  // 每块
  #first:hover + #second {
    // opacity: 0.8;
    -webkit-filter: blur(5px) brightness(90%); /*考虑浏览器兼容性：兼容 Chrome, Safari, Opera */
    filter: blur(5px) brightness(90%);
  }

  #first:has(~ #second:hover) {
    -webkit-filter: blur(5px) brightness(90%); /*考虑浏览器兼容性：兼容 Chrome, Safari, Opera */
    filter: blur(5px) brightness(90%);
  }

  #third:hover + #fourth {
    // opacity: 0.7;
    -webkit-filter: blur(5px) brightness(90%); /*考虑浏览器兼容性：兼容 Chrome, Safari, Opera */
    filter: blur(5px) brightness(90%);
  }

  #third:has(~ #fourth:hover) {
    -webkit-filter: blur(5px) brightness(90%); /*考虑浏览器兼容性：兼容 Chrome, Safari, Opera */
    filter: blur(5px) brightness(90%);
  }

  #fifth:hover + #sixth {
    // opacity: 0.7;
    -webkit-filter: blur(5px) brightness(90%); /*考虑浏览器兼容性：兼容 Chrome, Safari, Opera */
    filter: blur(5px) brightness(90%);
  }

  #fifth:has(~ #sixth:hover) {
    -webkit-filter: blur(5px) brightness(90%); /*考虑浏览器兼容性：兼容 Chrome, Safari, Opera */
    filter: blur(5px) brightness(90%);
  }

  // 每两块
  .subdiv:hover + .subdiv {
    -webkit-filter: blur(5px) brightness(90%); /*考虑浏览器兼容性：兼容 Chrome, Safari, Opera */
    filter: blur(5px) brightness(90%);
  }

  .subdiv:has(~ .subdiv:hover) {
    -webkit-filter: blur(5px) brightness(90%); /*考虑浏览器兼容性：兼容 Chrome, Safari, Opera */
    filter: blur(5px) brightness(90%);
  }
}

// 小于800px
@media only screen and (max-width: 800px) {
  ._homeContainer {
    font-size: 1vw;

    ._subdiv {
      width: 100%;
      display: flex;
      flex-direction: column;
      // justify-content: space-around;
      font-size: .5em;

      .left {
        width: 100%;
        height: 100%;
        font-size: .8em;
      }

      .right {
        width: 100%;
        height: 100%;
        font-size: .8em;
      }
    }
  }

  #teamName {
    font-size: 8em;
  }
}
</style>
