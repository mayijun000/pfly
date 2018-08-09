<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width: 1000px;margin: 0 auto;">
					<header class="contractTitle">基本信息</header>
					<ul class="contractBody">
						<li>
							<span class="bodyLabel">计划周期：</span><span>{{formData.requireDate}}</span>

							<span class="bodyLabel">需求方：</span><span>{{formData.memberName}}</span>
						</li>
						<li>
							<span class="bodyLabel">说明：</span><span>{{formData.remark}}</span>
							<span class="bodyLabel"></span><span></span>
						</li>
					</ul>
					<header class="contractTitle">标的物</header>
					<el-table :data="productData" style="width:100%;margin: 20px 0;" align="center">
						<el-table-column label="产品名称" prop="name">
						</el-table-column>
						<el-table-column label="材质" prop="material">
						</el-table-column>
						<el-table-column label="规格型号" prop="specifiModel">
						</el-table-column>
						<el-table-column label="单位" prop="unitId">
						</el-table-column>
						<el-table-column label="数量" prop="number">
						</el-table-column>
						<el-table-column label="单价" prop="productPrice">
						</el-table-column>
						<el-table-column label="金额" prop="totalAmount">
						</el-table-column>
					</el-table>
					<div style="text-align: center;margin-top: 50px;">
						<el-button type="primary" @click="toBack">返回</el-button>
					</div>
				</el-card>
			</el-col>
		</el-row>

	</section>
</template>
<script>
	import { getRequirementInfo } from '@/api/getData'
	export default {
		data() {
			return {
				productData: [],
				formData: {
					memberId: '',
					requireDate: '',
				},

			}
		},
		created() {
			this.getRequirementInfoData();
		},
		methods: {
			toBack() {
				this.$router.go(-1);
			},
			//获取会员信息
			async getRequirementInfoData() {
				try {
					const returnData = await getRequirementInfo({
						requirementId: this.$route.query.requirementId
					});
					if(returnData.result == "success") {
						let item = returnData.obj
						this.formData.memberId = item.memberId;
						this.formData.memberName = item.memberName;
						this.formData.remark = item.remark;
						if(item.month == "") {
							this.formData.requireDate = item.year;
						} else if(item.week == "") {
							this.formData.requireDate = item.year + item.month;
						} else {
							this.formData.requireDate = item.year + "第" + item.week + "周";
						}
						this.productData = item.itemList;
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

		}
	}
</script>
<style lang="less" scoped>
	.demo-formData .el-input,
	.demo-formData .el-input__inner {
		width: 360px;
		display: inline-block;
	}
	
	.demo-formData .el-date-editor.el-input {
		width: 360px;
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
		width: 100%;
	}
	
	.contractBody li span {
		float: left;
		width: 300px;
		display: flex;
		height: 60px;
		border-top: 1px solid #dfe6ec;
		border-right: 1px solid #dfe6ec;
		align-items: center;
		padding: 0 10px;
	}
	
	.contractBody li .bodyLabel {
		width: 137px;
		text-align: right;
		background-color: #eef1f6;
		justify-content: flex-end;
	}
	
	.contractTitle {
		background-color: #f5f5f5;
		line-height: 60px;
		color: #48576a;
		font-size: 24px;
		text-align: center;
	}
	
	.button_submit {
		margin-left: 200px;
	}
	
	.contractBody li .itemSpan {
		width: 780px;
	}
</style>