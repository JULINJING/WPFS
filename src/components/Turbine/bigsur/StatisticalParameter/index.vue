<template>
	<div>
		<div class="title_container" style="z-index: 99998">
			<ProjectTitle :options="titleOptions"></ProjectTitle>
		</div>
		<div class="statistical_parameter">
			<ul class="container">
				<li class="left">
					<!-- <header>
						<span id="order">05&nbsp;</span>
						<span>统计参数</span>
					</header> -->
				<article>
					<li>
						<span>年发电量:</span>
						<span>{{ generationData.yearGeneration }}</span>
						<span>万kWh</span>
					</li>
					<li>
						<span>负荷率:</span>
						<span>{{ generationData.loadRate }}</span>
						<span>%</span>
					</li>
					<li>
						<span>月发电量:</span>
						<span>{{ generationData.monthGeneration }}</span>
						<span>万kWh</span>
					</li>
					<li>
						<span>平均风速:</span>
						<span>{{ generationData.averageWindSpeed }}</span>
						<span>m/s</span>
					</li>
					<li>
						<span>日发电量:</span>
						<span>{{ generationData.dayGeneration }}</span>
						<span>万kWh</span>
					</li>
					<li>
						<span>最大风速:</span>
						<span>{{ generationData.maxWindSpeed }}</span>
						<span>m/s</span>
					</li>
					<!-- <li>
						<span>总功率:</span>
						<span>35508.3</span>
						<span>万kWh</span>
					</li> -->
				</article>
				</li>
				<li class="right">
					<header>
						<span># {{ TurbineId }} 号 风 机</span>
					</header>
					<StackLine class="stackLine"></StackLine>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
import StackLine from "../StackLine/index";
import { mapState } from "vuex";
import ProjectTitle from "../Project_title";

export default {
	components: {
		StackLine,
		ProjectTitle
	},
	data() {
		return {
			TurbineId: "00",
			titleOptions: {
				order: "05",
				cn: "统计参数",
			},
			generationData: {
				yearGeneration: 8398.86,
				loadRate: 34.33,
				monthGeneration: 288.08,
				averageWindSpeed: 14.2,
				dayGeneration: 48.62,
				maxWindSpeed: 19.95,
			},
		};
	},
	mounted() {
		if(this.$store.state.global.currentTurbineId){
			this.TurbineId = this.$store.state.global.currentTurbineId;
		} else {
			this.TurbineId = "00";
		}
		this.addRandomNumbers();
	},
	computed: {
		...mapState('global', ['currentTurbineId']),
	},
	methods: {
		getRandomNumber(min, max) {
            return (Math.random() * (max - min)) + min;
        },
        addRandomNumbers() {
			this.generationData.yearGeneration = (this.generationData.yearGeneration + this.getRandomNumber(-500, 500)).toFixed(2);
        	this.generationData.loadRate = (this.generationData.loadRate + this.getRandomNumber(-3, 3)).toFixed(2);
			this.generationData.monthGeneration = (this.generationData.monthGeneration + this.getRandomNumber(-50, 50)).toFixed(2);
        	this.generationData.averageWindSpeed = (this.generationData.averageWindSpeed + this.getRandomNumber(-3, 3)).toFixed(2);
        	this.generationData.dayGeneration = (this.generationData.dayGeneration + this.getRandomNumber(-2, 2)).toFixed(2);
			this.generationData.maxWindSpeed = (this.generationData.maxWindSpeed + this.getRandomNumber(-10, 10)).toFixed(2);
        }
	}
};
</script>
<style lang="scss" scoped>
.title_container {
    position: absolute;
    top: 58vh;
    right: 49vh;
}
.statistical_parameter {
	width: 35vw;
	height: 34vh;
	background-color: #0c5c69;
	padding: 0.625rem 1.25rem;
	position: absolute;
	right: 2vh;
	bottom: 2vh;
	opacity: 0.8;
	.container {
		width: 100%;
		height: 100%;
		display: flex;
		opacity: 1.0;

		.left {
			width: 70%;
			height: 90%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			header {
				display: flex;
				text-align: left;
				color: #fff;
				span {
					color: #fff;
					font-size: 1.1rem;
					font-weight: bolder;
				}
				#order {
					font-size: 1.6rem;
				}
			}
			article {
				margin-top: 1.25rem;
				display: flex;
				flex-wrap: wrap;
				font-size: 12px;
				color: #ffffff;
				li {
					width: 50%;
					flex-shrink: 1;
					text-align: left;
					line-height: 2.75rem;
					margin-top: 20px;
					span:nth-child(2) {
						margin: 0 1px;
						color: #13f5f5;
					}
					span:nth-child(3) {
						margin: 0 1px;
						color: #88afed;
					}
				}
			}
		}
		.right {
			width: 50%;
			height: 100%;
			// background-color: pink;
			header {
				display: flex;
				flex-direction: row-reverse;
				span {
					width: 50%;
					height: 24px;
					background-color: #097da0;
					color: #fff;
					font-size: 12px;
					line-height: 24px;
				}
				.stackLine {
					width: 100%;
					margin-top: 4px;
					height: calc(100% - 28px);
					border: 1px solid red;
				}
			}
		}
	}
}
</style>
