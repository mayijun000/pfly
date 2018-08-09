<template>
	<div>
		<div class="topClass">
			<div style="padding-top: 10px;padding-left: 80px;float: left;height:40px;"><img src="../static/img/logo_small.png" /></div>
			<div style="padding-left: 80px;float: left;height:40px;color:#636363;line-height: 80px;">
				<img src="../static/img/welcome.png" style="vertical-align: middle;" />
				<span style="padding-left: 10px;margin-top: 2px;">欢迎使用云链平台！</span>
			</div>
			<div style="padding-right: 100px;float: right;height:40px;color:#636363;line-height: 30px;">
				<p style="padding-right: 100px;color: #1a7dc9;padding-top: 20px;font-size: 14px;">当前用户：{{getUser != null && getCompany !=null?getCompany.shortName:""}}  {{getUser != null?getUser.userName:""}}</p>
				<p style="padding-right: 100px;color: #1a7dc9;float:left;font-size: 14px;">{{timeShow}}</p>
				<el-button type="text" @click="logout" style="float:left;margin-top: -20px;"><i class="fa fa-sign-out" aria-hidden="true"></i> 退出</el-button>
			</div>

		</div>
		<div class="header_container">
			<el-breadcrumb separator=">">
				<el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
				<template v-for="(item, index) in $route.meta">
					<el-breadcrumb-item>{{item}}</el-breadcrumb-item>
				</template>
			</el-breadcrumb>
		</div>
	</div>
</template>

<script>
	import { logout } from '@/api/getData'
	import { getStore, deleteCookie } from '@/config/mUtils'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				timeOut: null,
				timeShow: "",
				companyInfo:"",
			}
		},
		created() {
			this.timeSetOut();
		},
		computed: {
			...mapGetters(['getUser','getCompany']),
		},
		methods: {
			async logout() {
				try {
					let returnData = await logout();
					if(returnData.result == "success") {
						//退出登录后清除所有缓存
						window.localStorage.clear();
						//清空cookie
						//deleteCookie("jPowerBOSCookieToken");
						this.$router.push('/');
					} else {
						console.log('登出失败');
					}
				} catch(err) {
					console.log('获取数据失败', err);
				}
			},
			timeSetOut() {
				this.timeOut = setTimeout(this.timeNow, 1000); //开始执行
			},
			timeNow() {
				clearTimeout(this.timeOut); //清除定时器
				let dt = new Date();
				let t = dt.getDate();
				let h = dt.getHours();
				let m = dt.getMinutes();
				let s = dt.getSeconds();
				this.timeShow = "当前时间：" + t + "日" + h + "时" + m + "分";
				this.timeOut = setTimeout(this.timeNow, 1000); //设定定时器，循环执行             
			}

		}
	}
</script>

<style lang="less" scoped>
	@import '../style/mixin';
	.header_container {
		background-color: #f6f6f6;
		height: 40px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 80px;
		clear: both;
	}
	
	.avator {
		.wh(36px, 36px);
		border-radius: 50%;
		margin-right: 37px;
	}
	
	.el-dropdown-menu__item {
		text-align: center;
	}
	
	.topClass {
		background: url('../static/img/top.png');
		height: 96px;
		line-height: 96px;
	}
	
	.el-breadcrumb__item__inner,
	.el-breadcrumb__item__inner a {
		color: #3d3d3d;
	}
</style>