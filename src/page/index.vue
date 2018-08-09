<template>
	<el-row :span="24" style="margin: -20px -80px;">
		<el-row :span="24" style="line-height:35px;background-color: #f6f6f6;font-size: 14px;color: #4e4e4e;">
			<el-col :span="20" style="margin: 0 auto;float: inherit;">
				<div style="float:left;">
					您好，欢迎admin来到普方云链平台
				</div>
				<div style="float:right;">
					免费注册 ｜ 立即登录 ｜ 帮助中心 ｜ 联系我们
				</div>
			</el-col>
		</el-row>
		<el-row :span="24">
			<el-col :span="20" style="margin: 0 auto;float: inherit;">
				<div style="padding: 10px 20px;padding-left:0px;float: left;height:70px;">
					<img src="../static/img/logo_small.png" />
				</div>
				<div style="margin-right: 80px;float: right;margin-top:30px;color:#636363;">
					<img src="../static/img/right_title.png" style="vertical-align: middle;" />
					<a style="margin-left: 20px;color: #1a7dc9;" href="javascript:void(0)" @click="login">应用中心</a>
				</div>
			</el-col>
			<el-col :span="24">
				<img style="width: 100%;" src="../static/img/bannar.png" />
				<img style="width: 100%;" src="../static/img/body1.png" />
				<img style="width: 100%;" src="../static/img/body2.png" />
			</el-col>
		</el-row>
		<el-row :span="24" style="height:300px;background-color: rgb(60,60,60);font-size: 14px;margin-top: -5px;">
			<el-col :span="20" style="margin: 0 auto;float: inherit;">
				<div style="border-bottom: 1px solid rgb(95,95,95);height: 180px;">
				<div style="padding-top: 30px;padding-left:0px;float: left;height:70px;">
					<img src="../static/img/logo_small.png" />
				</div>
				<div style="float: right;margin-top:40px;color:#636363;">
					<div style="float: left;"><img src="../static/img/service.png" style="vertical-align: middle;" /></div>
					<div style="margin-left: 20px;color: #d8d6d6;font-size: 56px;float: left;margin-top: -10px;">63428099</div>
					<div style="margin-left: 20px;color: #a09f9f;font-size: 14px;float: left;line-height: 30px;text-align: right;">
						普方云链平台全国客户服务热线 <br>北京服务时间：每日9：00-17：30
					</div>
					<div style="clear: both;color: #d8d6d6;line-height: 70px;text-align: center;">关于我们&nbsp;&nbsp;&nbsp;｜&nbsp;&nbsp;&nbsp;法律声明&nbsp;&nbsp;&nbsp;｜&nbsp;&nbsp;&nbsp;诚聘英才&nbsp;&nbsp;&nbsp;｜&nbsp;&nbsp;&nbsp;联系我们&nbsp;&nbsp;&nbsp;｜&nbsp;&nbsp;&nbsp;常见问题&nbsp;&nbsp;&nbsp;｜&nbsp;&nbsp;&nbsp;商务合作</div>
				</div>
				</div>
			</el-col>
			<div style="text-align: center;clear: both;line-height: 30px;color: #a09f9f;padding-top: 30px;">北京普方信智供应链科技有限公司 <br>北京市丰台区国投财富广场2号楼16层1605</div>
		</el-row>
	</el-row>
</template>
<script>
	export default {
		data() {
			return {}
		},
		//组件挂载完成时执行
		mounted() {
			//控制头部组件显示的状态
			this.$store.commit('changeHeaderShow', false);
		},
		methods: {
			login(){
				this.$router.push('login');
			}
		}
	}
</script>
<style scoped>

</style>