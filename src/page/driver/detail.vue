<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width:800px;margin: 0 auto;padding-bottom: 10px;">
					<header class="contractTitle">司机详情</header>
					<ul class="contractBody">
						<li>
							<span class="bodyLabel">物流公司: </span><span>{{formData.memberName}}</span>
							<span class="bodyLabel">姓名: </span><span>{{formData.userName}}</span>
						</li>
						<li>
							<span class="bodyLabel">手机号: </span><span>{{formData.mobile}}</span>
							<span class="bodyLabel">车牌号: </span><span>{{formData.carNum}}</span>
						</li>

					</ul>
					<div class="button_submit">
						<el-button type="primary" @click="toBack">返回</el-button>
					</div>
				</el-card>

			</el-col>
		</el-row>
	</section>
</template>

<script>
	import { getDriverInfo } from '@/api/getData'
	export default {
		data() {
			return {
				formData: {
					driverId: "",
					memberId: "",
					carNum: "",
					userName: "",
					mobile: "",
				}
			}
		},
		created() {
			this.getDriverInfoData();
		},
		methods: {
			async getDriverInfoData() {
				try {
					const returnData = await getDriverInfo({
						driverId: this.$route.query.driverId
					});
					if(returnData.result == "success") {
						let item = returnData.obj
						this.formData.memberName = item.memberName;
						this.formData.driverId = item.driverId;
						this.formData.carNum = item.carNum;
						this.formData.userName = item.userName;
						this.formData.mobile = item.mobile;
					} else {
						this.$message({
							type: 'error',
							message: returnData.message
						});
					}
				} catch(err) {
					console.log('获取数据失败', err);
				}
			},
			toBack() {
				this.$router.go(-1);
			},
		},
	}
</script>

<style scoped>
	.button_submit {
		text-align: center;
		margin-top: 50px;
	}
	
	.contractBody {
		border-bottom: 1px solid #dfe6ec;
		border-left: 1px solid #dfe6ec;
		-moz-border-radius-bottomleft: 4px;
		-moz-border-radius-bottomright: 4px;
		-webkit-border-bottom-left-radius: 4px;
		-webkit-border-bottom-right-radius: 4px;
	}
	
	.contractBody li {
		font-size: 14px;
		color: #48576a;
		height: 61px;
	}
	
	.contractBody li span {
		float: left;
		width: 200px;
		display: flex;
		height: 60px;
		border-top: 1px solid #dfe6ec;
		border-right: 1px solid #dfe6ec;
		align-items: center;
		padding: 0 10px;
	}
	
	.contractBody li .bodyLabel {
		width: 137.5px;
		text-align: right;
		background-color: #eef1f6;
		justify-content: flex-end;
	}
	
	.contractTitle {
		background-color: #20a0ff;
		line-height: 60px;
		color: #fff;
		font-size: 24px;
		text-align: center;
		-moz-border-radius-topleft: 4px;
		-moz-border-radius-topright: 4px;
		-webkit-border-top-left-radius: 4px;
		-webkit-border-top-right-radius: 4px;
	}
</style>