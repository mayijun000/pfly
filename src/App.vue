<template>
	
	<el-row class="container" style="height: 100%">
		<head-top v-show="getHeaderShow"></head-top>
		<el-col :span="24" class="main">
			<el-row>
				<section class="contentCon">
					<el-col :span="24" class="content-wrapper">
						<transition>
							<router-view></router-view>
						</transition>
					</el-col>
				</section>
			</el-row>
		</el-col>
		<footerDown v-show="getHeaderShow"></footerDown>
	</el-row>
</template>

<script>
	import headTop from './components/headTop';
	import footerDown from './components/footerDown';
	import {mapGetters} from 'vuex'
	export default {
		data() {
			return {
				
			}
		},
		components: {
			headTop,
			footerDown,
		},
		computed: {
			...mapGetters(['getHeaderShow']),
		},
	}
</script>

<style lang="less">
	@import './style/common';
</style>