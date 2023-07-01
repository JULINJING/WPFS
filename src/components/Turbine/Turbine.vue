<template>
	<div id="turbine">
		<NavTop id="navtopTurbine"/>
		<HeaderLogo></HeaderLogo>
		<Histogram></Histogram>
		<AngleGuage style="margin-top:10px"></AngleGuage>
		<MonitoringList></MonitoringList>
		<StatisticalParameter></StatisticalParameter>
		<ControlPanel></ControlPanel>
		<Three3d></Three3d>
	</div>
</template>
<script>
/*eslint-disable*/
import NavTop from '../baseComponents/NavTop'
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
		NavTop
	},
};
</script>
<style lang="scss" scoped>
#navtopTurbine {
	z-index: 9999999;
}
#turbine {
	width: 100%;
	height: 100%;
	background-color: #040b1a;
	// padding: 20px 30px;
	box-sizing: border-box;
	overflow-x: hidden;
	overflow-y: hidden;
}
</style>
