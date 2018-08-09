<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width:800px;margin: 0 auto;padding-bottom: 10px;">
					<header class="contractTitle">项目机会详情</header>
					<ul class="contractBody">
						<li>
							<span class="bodyLabel">企业客户: </span><span>{{formData.memberId}}</span>
							<span class="bodyLabel">联系人: </span><span>{{formData.contactsId}}</span>
						</li>
						<li>
							<span class="bodyLabel">业务员: </span><span>{{formData.salerId}}</span>
							<span class="bodyLabel">沟通日期: </span><span>{{formData.communicationDate}}</span>
						</li>
					</ul>
					<div class="edit_container">
						<div class="editerTitle">沟通内容: </div>
						<div class="editer">
							{{formData.content}}
						</div>
					</div>

					<div class="button_submit">
						<el-button type="primary" @click="toBack">返回</el-button>
					</div>
				</el-card>

			</el-col>
		</el-row>
	</section>
</template>

<script>
	import { getCommunicateInfo } from '@/api/getData'
	export default {
		data() {
			return {
				formData: {
					salerId: "",
					communicationDate: "",
					contactsId: "",
					memberId: "",
					content: "",
				}
			}
		},
		created() {
			this.getCommunicateInfoData();
		},
		methods: {
			toBack() {
				this.$router.go(-1);
			},
			//获取会员信息
			async getCommunicateInfoData() {
				try {
					const returnData = await getCommunicateInfo({
						communicationId: this.$route.query.communicationId
					});
					if(returnData.result == "success") {
						let item = returnData.obj
						this.formData.salerId = item.userName;
						this.formData.communicationDate = item.communicationDate.substr(0, 10);
						this.formData.contactsId = item._contactsId;
						this.formData.memberId = item._memberId;
						this.formData.content = item.content;
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
		clear: both;
	}
	
	.contractBody {
		border-bottom: 1px solid #dfe6ec;
		border-left: 1px solid #dfe6ec;
		/*-moz-border-radius-bottomleft: 4px;
		-moz-border-radius-bottomright: 4px;
		-webkit-border-bottom-left-radius: 4px;
		-webkit-border-bottom-right-radius: 4px;*/
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
	
	.editerTitle {
		background-color: #eef1f6;
		width: 671px;
		line-height: 60px;
		font-size: 14px;
		color: #48576a;
		border-right: 1px solid #dfe6ec;
		border-left: 1px solid #dfe6ec;
		padding-left: 88px;
	}
	
	.editer {
		width: 739px;
		color: #48576a;
		border: 1px solid #dfe6ec;
		font-size: 14px;
		padding: 10px;
	}
</style>