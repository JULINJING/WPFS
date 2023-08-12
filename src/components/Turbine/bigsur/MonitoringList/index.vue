<template>
	<div class="data_monitoring">
		<ProjectTitle :options="titleOption"></ProjectTitle>
		<div class="monitoring_list">
			<ul class="btn_list">
				<li :class="{active: activeIndex === 0}" @click="btnhandle(0)">实时数据</li>
				<li :class="{active: activeIndex === 1}" @click="btnhandle(1)">故障信息</li>
			</ul>
			<ul v-if="activeIndex === 0" class="data_list" ref="realTimeTable">
				<li v-for="item in 100" :key="item">
					<span>偏航系统精准</span>
					<span>{{ getCurrentTime(item + 10) }}</span>
				</li>
			</ul>
			<ul v-if="activeIndex === 1" class="data_list" ref="faultInfoTable">
				<li v-for="item in 20" :key="item" style="color: rgb(255, 0, 0);">
					<span>偏航系统故障</span>
					<span>{{ getCurrentTime(item + 10) }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
import ProjectTitle from "../Project_title/index";
export default {
	name: "DataMonitoring",
	data() {
		return {
			activeIndex: 0,
			scrollPosition: 0,
			titleOption: {
				order: "03",
				cn: "数据监测",
			},
		};
	},
	mounted() {
		// 每隔一段时间执行一次滚动
		this.timer = setInterval(this.autoScroll, 100);
	},
	beforeDestroy() {
		clearInterval(this.timer);
	},
	methods:{
		btnhandle(index) {
			this.activeIndex = index;
		},
		autoScroll() {			
			this.scrollPosition += 1;
			const table =
				this.activeIndex === 0 ? this.$refs.realTimeTable : this.$refs.faultInfoTable;
			if (table) {
				if (this.scrollPosition >= table.scrollHeight - table.clientHeight) {
					this.scrollPosition = 0;
				}
				table.scrollTop = this.scrollPosition;
			}
		},
		getCurrentTime(seconds) {
			const now = new Date();
			const currentSeconds = now.getSeconds() + seconds;
			const minutes = String(Math.floor(currentSeconds / 60) % 60).padStart(2, "0");
			const secondsLeft = String(currentSeconds % 60).padStart(2, "0");
			return `${now.getHours()}:${minutes}:${secondsLeft}`;
		},
	},
	components: {
		ProjectTitle,
	},
	computed: {
		random() {
			var result = (Math.random() * 10).toFixed(0)
			return result
		}
	}
};
</script>

<style lang="scss" scoped>
$list_height: 2.8vh;
$btn_height: calc(#{$list_height} + 4px); 
.data_monitoring {
	overflow: hidden;
	position: absolute;
	bottom: 2vh;
	left: 2vh;
	z-index: 99999;
	.monitoring_list {
		width: 16.6vw;
		height: 26.8vh;
		.btn_list {
			display: flex;
			justify-content: space-between;
			margin-bottom: 10px;
			li:nth-child(1) {
				margin-right: 10px;
			}
			li {
				width: calc(100% - 10px);
				height: $btn_height;
				line-height: $btn_height;
				color: #fff;
				font-size: 0.8rem;
				background-color: #06424e;
				cursor: pointer;
			}
			li.active {
				background-color: #1ac2e3;
				box-shadow: 0 0 20px 0px rgb(108 231 255 / 71%), 0 2px 0 #000;
			}
		}
		.data_list {
			max-height: 22.4vh;
			overflow-y: scroll;
			
			li:nth-child(2n) {
				background-color: #05343e;
			}
			li {
				width: 100%;
				height: $list_height;
				background-color: #091c4645;
				color: #0ee8e8;
				line-height: $list_height;
				font-size: 0.7px;
				text-align: left;
				box-sizing: border-box;
				padding: 0 1rem;
				display: flex;
				justify-content: space-between;
			}
		}
	}
}

::-webkit-scrollbar {
	width: 4px;
	height: 10px;
	background-color: transparent;
}

::-webkit-scrollbar-track {
	border-radius: 10px;
	background-color: transparent;
}

::-webkit-scrollbar-thumb {
	border-radius: 10px;
	background-color: #15c5e8;
}
</style>
