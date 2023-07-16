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
			<Histogram></Histogram>
			<AngleGuage></AngleGuage>
			<MonitoringList></MonitoringList>
			<StatisticalParameter></StatisticalParameter>
			<ControlPanel></ControlPanel>
			<Three3d></Three3d>
		</div>
	</div>
</template>
<script>
/*eslint-disable*/
// import NavTop from '../baseComponents/NavTop'
import ProjectTitle from "./bigsur/Project_title/index";
import Histogram from "./bigsur/Histogram/index";
import MonitoringList from "./bigsur/MonitoringList/index";
import StatisticalParameter from "./bigsur/StatisticalParameter";
import ControlPanel from "./bigsur/ControlPanel";
import AngleGuage from "./bigsur/AngleGuage/index";
import HeaderLogo from "./bigsur/HeaderLogo/index";
import Three3d from "./three3d/index";
export default {
	name: "Turbine",
	components: {
		Three3d,
		ProjectTitle,
		Histogram,
		MonitoringList,
		StatisticalParameter,
		ControlPanel,
		AngleGuage,
		HeaderLogo,
		// NavTop
	},
	methods: {
		// 返回首页 
		backToHome() {
            this.$router.push('/home')
        }
	}
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
		background-color: #040b1a;
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
