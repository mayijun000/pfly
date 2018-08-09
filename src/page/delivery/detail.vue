<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width: 1000px;margin: 0 auto;">
					<header class="contractTitle">发货单</header>
					<ul class="contractBody">
						<li>
							<span class="bodyLabel">合同编号：</span><span>{{formData._contractId}}</span>

							<span class="bodyLabel">仓库：</span><span>{{formData._deliveryWareId}}</span>
						</li>
						<li>
							<span class="bodyLabel">项目名称：</span><span>{{formData.projectName}}</span>
							<span class="bodyLabel">收货单位：</span><span>{{formData._receiptCompany}}</span>
						</li>
						<li>
							<span class="bodyLabel">执行方：</span><span>{{formData.executerName}}</span>
							<span class="bodyLabel">收货地址：</span><span>{{formData._addressId}}</span>
						</li>
						<li>
							<span class="bodyLabel">进场时间：</span><span>{{formData.enterDate}}</span>
							<span class="bodyLabel">物流公司：</span><span>{{formData.logisticsName}}</span>
						</li>
						<li>
							<span class="bodyLabel">司机：</span><span>{{formData._driverId}}</span>
							<span class="bodyLabel">联系方式：</span><span>{{formData.mobile}}</span>
						</li>
						<li>
							<span class="bodyLabel">车牌号：</span><span>{{formData.carNum}}</span>
							<span class="bodyLabel"></span><span></span>
						</li>
					</ul>
					<el-table :data="formData.itemList" style="width:100%;" align="center">
						<el-table-column label="产品名称" prop="name">
						</el-table-column>
						<el-table-column label="材质" prop="material">
						</el-table-column>
						<el-table-column label="规格型号" prop="specifiModel">
						</el-table-column>
						<el-table-column label="合同剩余量(吨)" prop="unDeliveryNum">
						</el-table-column>
						<el-table-column label="计划发货量(吨)" prop="number">
						</el-table-column>
						<el-table-column label="库存量(吨)" prop="deliveryWareStock">
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
	import { getDeliverInfo } from '@/api/getData'
	export default {
		data() {
			return {
				dialogFormVisible: false,
				productData: [],
				formData: {},
			}
		},
		created() {
			this.getDeliverInfoData();
		},
		methods: {
			toBack() {
				this.$router.go(-1);
			},
			async getDeliverInfoData() {
				try {
					let data = {
						deliverId: this.$route.query.deliverId
					}
					const returnData = await getDeliverInfo(data);
					if(returnData.result == "success") {
						returnData.obj.enterDate = returnData.obj.enterDate.substr(0, 10);
						let item = returnData.obj;
						this.formData = item;
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
	
	.button_submit {
		margin-left: 200px;
	}
	
	.contractBody li .itemSpan {
		width: 780px;
	}
</style>