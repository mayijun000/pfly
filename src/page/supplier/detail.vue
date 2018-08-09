<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width:800px;margin: 0 auto;padding-bottom: 10px;">
					<header class="contractTitle">供应商详情</header>
					<ul class="contractBody">
						<li>
							<span class="bodyLabel">统一社会信用代码: </span><span>{{formData.licenseCode}}</span>
							<span class="bodyLabel">供应商简称: </span><span>{{formData.shortName}}</span>

						</li>
						<li>
							<span class="bodyLabel">供应商名称: </span><span>{{formData.name}}</span>
							<span class="bodyLabel">城市: </span><span>{{formData.educationName}}{{formData.politicsName}}</span>

						</li>
						<li>
							<span class="bodyLabel">创建时间: </span><span>{{formData.createDate}}</span>
							<span class="bodyLabel"></span><span></span>
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
	import { getMemberInfo } from '@/api/getData'
	export default {
		data() {
			return {
				formData: {
					memberId: '',
					shortName: '',
					name: '',
					educatioNname: '',
					politicsName: '',
					createDate: '',
					status: '',
					licenseCode: '',
				},
			}
		},
		created() {
			this.getMemberInfoData();
		},
		methods: {
			toBack() {
				this.$router.go(-1);
			},
			//获取会员信息
			async getMemberInfoData() {
				try {
					const returnData = await getMemberInfo({
						memberId: this.$route.query.memberId
					});
					if(returnData.result == "success") {
						let item = returnData.obj
						this.formData.memberId = item.memberId;
						this.formData.shortName = item.shortName;
						this.formData.name = item.name;
						this.formData.educationName = item.educationName;
						this.formData.politicsName = item.politicsName;
						this.formData.createDate = item.createDate.substr(0, 10);
						this.formData.licenseCode = item.licenseCode;
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