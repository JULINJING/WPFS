<template>
	<div class="header">
		<span>{{ turbine }} 风 力 发 电 机</span>
		<div style="display: flex;flex-direction: column;width: 100%">
			<div id="returnWF">
				<h2 style="z-index: 99999;margin-top: 1.5vh;"><router-link to="/home">返回主页</router-link></h2>
				<!-- <h2 style="z-index: 99999;margin-top: 1.5vh;"><router-link to="/windfield">返回场站</router-link></h2> -->
				<h2 style="z-index: 99999;margin-top: 1.5vh; color: #D3D6DD; cursor: pointer;" @click="redirectToWindfield">返回场站</h2> 
			</div>
			<h2 id="control" style="z-index: 99999;text-align: center;margin-top: 10px;color: #D3D6DD;" @click="changeState">开启/关闭详细信息</h2>
		</div>
	</div>
</template>
<script>
import { mapState, mapMutations } from "vuex";


export default {
	name: "HeaderLogo",
	data() {
		return {
			turbine: "",
		};
	},
	mounted() {
		console.log(this.$store.state.global.currentTurbineId);
		if(this.$store.state.global.currentTurbineId){
			this.turbine = this.$store.state.global.currentTurbineId + " 号";
		} else {
			this.turbine = "00 号";
		}
	},
	computed: {
        ...mapState('global', ['isTurbineCanClick', 'currentTurbineId', 'windFieldId']),
    },
	methods: {
		...mapMutations("global", ["setTurbineCanClick"]),
		changeState() {
			var flag = this.$store.state.global.isTurbineCanClick;
			this.setTurbineCanClick(!flag);
		},
		redirectToWindfield() {
			const fieldId = this.$store.state.global.windFieldId;
			console.log(fieldId);
			// 执行路由跳转到 windfield 页面，并传递参数 isReturnButtonClicked
			this.$router.push({ name: 'windfield', params: { isReturnButtonClicked: true,  fieldId: fieldId } });
			// this.$router.push({ path: '/windfield', query: { isReturnButtonClicked: true, fieldId: fieldId } });
		}
	}
};
</script>
<style lang="scss" scoped>
.header {
	height: 10vh;
	box-sizing: border-box;
	padding: 0.8rem 0;
	text-align: left;
	font-size: 0.8rem;
	color: #6284a0;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: absolute;
	top: 1vh;
	left: 2vh;
	span {
		font-size: 1.7rem;
		color: #fff;
		font-weight: bolder;
		line-height: 1.7rem;
	}
	#returnWF {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
	#control:hover {
		cursor: pointer;
	}
}
</style>
