<template>
	<div class="AngleGuage">
		<ProjectTitle :options="titleOption"></ProjectTitle>
		<div class="angle_guagle">
			<div class="pointer" :style="{ 'transform': rotate }"></div>
		</div>
	</div>
</template>
<script>
import ProjectTitle from "../Project_title/index";
export default {
	name: "AngleGuage",
	data() {
		return {
			titleOption: {
				order: "02",
				cn: "变桨系统",
			},
			rotate: "rotate(15deg)",
		};
	},
	components: {
		ProjectTitle,
	},
	methods:{
		mockData(deg){
			return `rotate(${deg}deg)`
		}
	},
	mounted(){
		setInterval(() => {
			this.rotate = this.mockData(Math.random()*90)
		}, 3000);
	}
};
</script>
<style lang="scss" scoped>
$width: 12vw;
.AngleGuage {
	position: absolute;
	top: 33vh;
	left: 2vh;
	.angle_guagle {
		width: $width;
		height: $width;
		background-image: url("../../../../assets/images/gauges.png");
		background-size: $width;
		position: relative;
		.pointer {
			width: 2px;
			height: 18.5vh;
			background-color: #15c5e8;
			position: absolute;
			top: 1vw;
			right: 0.9vw;
			transform-origin: center top;
			// transform: rotate(15deg);
			transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
		}
	}
}
</style>
