<template>
	<div class="header">
		<span>大型风力发电机</span>
		<div style="display: flex;flex-direction: column;width: 100%">
			<div id="returnWF">
				<h2 style="z-index: 99999;margin-top: 1.5vh;"><router-link to="/home">返回主页</router-link></h2>
				<h2 style="z-index: 99999;margin-top: 1.5vh;"><router-link to="/windfield">返回场站</router-link></h2>
			</div>
			<h2 id="control" style="z-index: 99999;text-align: center;margin-top: 10px;color: #D3D6DD;" @click="">开启/关闭详细信息</h2>
		</div>
	</div>
</template>
<script>
export default {
	name: "HeaderLogo"
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
