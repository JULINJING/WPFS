<template>
	<div id="turbine">
		<el-result title="抱歉" subTitle="为获得最佳体验，请使用PC端查看">
            <template slot="icon">
                <el-image :src="require('./imgs/PC端提示.png')" fit="cover"></el-image>
            </template>
            <template slot="extra">
                <el-button type="primary" size="medium" @click="backToHome">返回主页</el-button>
            </template>
        </el-result>
		<div id="PC">
			<HeaderLogo></HeaderLogo>
			<ControlPanel></ControlPanel>
			
			<Histogram v-if="dataList[0].checked"></Histogram>
			<AngleGuage v-if="dataList[1].checked"></AngleGuage>
			<MonitoringList v-if="dataList[2].checked"></MonitoringList>
			<GenerationParameter v-if="dataList[3].checked"></GenerationParameter>
			<StatisticalParameter v-if="dataList[4].checked"></StatisticalParameter>

			<Three3d></Three3d>
		</div>
	</div>
</template>
<script>
/*eslint-disable*/
// import NavTop from '../baseComponents/NavTop'
import ControlPanel from "./bigsur/ControlPanel";
import ProjectTitle from "./bigsur/Project_title/index";
import Histogram from "./bigsur/Histogram/index";
import MonitoringList from "./bigsur/MonitoringList/index";
import StatisticalParameter from "./bigsur/StatisticalParameter";
import GenerationParameter from "./bigsur/GenerationParameter";
import AngleGuage from "./bigsur/AngleGuage/index";
import HeaderLogo from "./bigsur/HeaderLogo/index";
import Three3d from "./three3d/index";

import { mapState } from 'vuex';


export default {
	name: "Turbine",
    data() {
        return {
            titleOptions: {
                // order: "04",
                cn: "控制面板",
            },
            dataList: [],
        };
    },
	mounted() {
		this.dataList = this.$store.state.global.TurbineTableList;
	},
	components: {
		Three3d,
		ProjectTitle,
		Histogram,
		MonitoringList,
		StatisticalParameter,
		GenerationParameter,
		AngleGuage,
		HeaderLogo,
		// NavTop
		ControlPanel
	},
	methods: {
		// 返回首页
		backToHome() {
            this.$router.push('/home')
        }
	},
	computed: {
        ...mapState('global', ['TurbineTableList']),
    },
	watch: {
        TurbineTableList: {
            handler(newTableData) {
                this.dataList = newTableData;
            },
            immediate: true, // 立即执行watch处理函数
        },
    },
};
</script>
<style lang="scss" scoped>
#turbine {
	width: 100vw;
	height: 100vh;
	// padding: 20px 30px;
	box-sizing: border-box;
	overflow-x: hidden;
	overflow-y: hidden;
}
// 大于800px
@media only screen and (min-width: 800px) {
	#turbine {
		background-color: #000000;
	}
	// 移动端消失
	.el-result {
        display: none;
    }
}
// 小于800px
@media only screen and (max-width: 800px) {
    .el-result {
        display: block;
        height: 100vh;
        display: flex;
        flex-direction: column;
    }

    #PC {
        display: none;
    }
}
</style>
