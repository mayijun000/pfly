<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width: 1000px;margin: 0 auto;">
					<header class="contractTitle">基本信息</header>
					<ul class="contractBody">
						<li>
							<span class="bodyLabel">订单编号：</span><span>{{formData.orderNum}}</span>
							<span class="bodyLabel">订单类型：</span><span>{{formData.orderType}}</span>
						</li>
						<li>
							<span class="bodyLabel">采购方：</span><span>{{formData.demand}}</span>
							<span class="bodyLabel">供应商：</span><span>{{formData.supplier}}</span>
						</li>
						<li>
							<span class="bodyLabel">签订地点：</span><span>{{formData.signAddr}}</span>
							<span class="bodyLabel">签订日期：</span><span>{{formData.signDate}}</span>
						</li>
						<li>
							<span class="bodyLabel">状态：</span><span>{{formData.statusName}}</span>
							<span class="bodyLabel"></span><span></span>
						</li>
					</ul>
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
						<el-table-column label="单价" prop="price">
						</el-table-column>
						<el-table-column label="金额" prop="totalAmount">
						</el-table-column>
						<el-table-column label="厂商要求" prop="manufactor">
						</el-table-column>
						<el-table-column label="备注" prop="remarks">
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
	import { getOrderInfo } from '@/api/getData'
	export default {
		data() {
			return {
				dialogFormVisible: false,
				productData: [],
				formData: {
					orderNum: '',
					demand: '',
					supplier: '',
					signDate: '',
					signAddr: "",
					statusName: ''
				},
			}
		},
		created() {
			this.getOrderInfoData();
		},
		methods: {
			toBack() {
				this.$router.go(-1);
			},

			//获取订单信息
			async getOrderInfoData() {
				try {
					const returnData = await getOrderInfo({
						orderId: this.$route.query.orderId
					});
					if(returnData.result == "success") {
						let item = returnData.obj;
						this.formData.orderNum = item.orderNum;
						this.formData.supplier = item._supplier;
						this.formData.demand = item._demand;
						this.formData.signDate = item.signDate;
						this.formData.signAddr = item.signAddr;
						if(item.orderType == "0") {
							this.formData.orderType = "临采";
						} else {
							this.formData.orderType = "集采";
						}
						if(item.status == "0") {
							this.formData.statusName = "未审核";
						} else if(item.status == "-1") {
							this.formData.statusName = "驳回";
						} else if(item.status == "1") {
							this.formData.statusName = "审核中";
						} else if(item.status == "2") {
							this.formData.statusName = "审核通过";
						} else if(item.status == "5") {
							this.formData.statusName = "入库成功";
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