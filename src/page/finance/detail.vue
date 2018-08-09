<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card>
					<el-form :model="findFormReg" ref="findFormReg">
						<div style="width:100%;" class="el-table el-table--fit el-table--striped el-table--border el-table--enable-row-hover el-table--enable-row-transition">
							<div class="el-table__header-wrapper">
								<table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width:100%;">
									<colgroup>
										<col name="el-table_1_column_1" width="150">
										<col name="el-table_1_column_2" width="150">
										<col name="el-table_1_column_3" width="150">
										<col name="el-table_1_column_4" width="100">
										<col name="el-table_1_column_5" width="100">
										<col name="el-table_1_column_6" width="100">
										<col name="el-table_1_column_7" width="120">
										<col name="el-table_1_column_8" width="120">
										<col v-show="showFee" name="el-table_1_column_9" width="300">
									</colgroup>
									<thead>
										<tr>
											<th colspan="1" rowspan="1" class="el-table_1_column_1 is-leaf">
												<div class="cell">发货单</div>
											</th>
											<th colspan="1" rowspan="1" class="el-table_1_column_2 is-leaf">
												<div class="cell">产品名称</div>
											</th>
											<th colspan="1" rowspan="1" class="el-table_1_column_3 is-leaf">
												<div class="cell">材质</div>
											</th>
											<th colspan="1" rowspan="1" class="el-table_1_column_4 is-leaf">
												<div class="cell">规格型号</div>
											</th>
											<th colspan="1" rowspan="1" class="el-table_1_column_5 is-leaf">
												<div class="cell">发货数量(吨)</div>
											</th>
											<th colspan="1" rowspan="1" class="el-table_1_column_6 is-leaf">
												<div class="cell">收货数量(吨)</div>
											</th>
											<th colspan="1" rowspan="1" class="el-table_1_column_7 is-leaf">
												<div class="cell">单价</div>
											</th>
											<th colspan="1" rowspan="1" class="el-table_1_column_8 is-leaf">
												<div class="cell">结算价</div>
											</th>
											<th v-show="showFee" colspan="1" rowspan="1" class="el-table_1_column_9 is-leaf">
												<div class="cell">运费</div>
											</th>
										</tr>
									</thead>
								</table>
							</div>
							<div class="el-table__body-wrapper">
								<table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width:100%;">
									<colgroup>
										<col name="el-table_1_column_1" width="150">
										<col name="el-table_1_column_2" width="150">
										<col name="el-table_1_column_3" width="150">
										<col name="el-table_1_column_4" width="100">
										<col name="el-table_1_column_5" width="100">
										<col name="el-table_1_column_6" width="100">
										<col name="el-table_1_column_7" width="120">
										<col name="el-table_1_column_8" width="120">
										<col v-show="showFee" name="el-table_1_column_9" width="300">
									</colgroup>
									<tbody>
										<tr prop="productDataList" v-for="item in findFormReg.productDataList" class="el-table__row">
											<td :rowspan="item.deliveryNumspan" :class="{hidden: item.deliveryNumdis}">
												<div class="cell">{{item.deliveryNum}}</div>
											</td>
											<td>
												<div class="cell">{{item.name}}</div>
											</td>
											<td>
												<div class="cell">{{item.material}}</div>
											</td>
											<td>
												<div class="cell">{{item.specifiModel}}</div>
											</td>
											<td>
												<div class="cell">{{item.number}}</div>
											</td>
											<td>
												<div class="cell">{{item.receiveNumber}}</div>
											</td>
											<td>
												<div class="cell">{{item.price}}</div>
											</td>
											<td>
												<div class="cell">{{item.priceNum}}</div>
											</td>
											<td v-show="showFee" :rowspan="item.deliveryNumspan" :class="{hidden: item.deliveryNumdis}">
												<div class="cell">{{item.total}}</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</el-form>
					<ul class="contractBody">
						<li>
							<span class="bodyLabel">总重量：</span><span>{{totalWeightEnd}}</span>
							<span class="bodyLabel">总价：</span><span>{{totalFeeEnd}}</span>
						</li>
					</ul>
					<div style="text-align: center;margin-top: 50px;">
						<el-button type="primary" size="large" @click="toBack">返回</el-button>
					</div>
				</el-card>

			</el-col>
		</el-row>
	</section>
</template>
<script>
	import { combineCell } from '@/config/mUtils'
	import { balanceInfo } from '@/api/getData'

	export default {
		data() {

			return {
				showFee: false,
				//添加 总价字段 单价*数量
				findForm: {
					outNo: '',
					supplier: '',
					date: ''
				},
				tableData: [],
				findFormReg: {
					productDataList: []
				},
				totalFeeEnd: "0",
				totalWeightEnd: "0"
			}

		},
		created() {
			//复杂表格数据处理
			this.initData();
		},
		methods: {
			async initData() {
				try {
					const stockData = await balanceInfo({
						balanceId: this.$route.query.balanceId
					});
					if(stockData.result == "success") {
						this.tableData = [];
						let totalFee = 0;
						let totalWeight = 0;
						if(stockData.obj.feeType < 2) {
							this.showFee = false;
						} else {
							this.showFee = true;
						}
						stockData.obj.itemList.forEach((item, index) => {
							item.priceNum = parseFloat(item.number * item.price).toFixed(2);
							totalFee = parseFloat(totalFee) + parseFloat(item.receiveNumber * item.price);
							totalWeight = parseFloat(totalWeight) + parseFloat(item.receiveNumber);
							this.tableData.push(item);
						})
						this.totalFeeEnd = totalFee.toFixed(2);
						this.totalWeightEnd = totalWeight.toFixed(3);
						//复杂表格数据处理
						this.findFormReg.productDataList = combineCell(this.tableData);

					} else {
						this.$message({
							type: 'error',
							message: stockData.message
						});
					}
				} catch(err) {
					console.log('获取数据失败', err);
				}
			},

			toBack() {
				this.$router.go(-1);
			},

		}
	}
</script>
<style scoped>
	.button_submit {
		text-align: center;
		margin-top: 50px;
	}
	
	.contractBody li {
		padding: 20px;
		font-size: 14px;
		color: #48576a;
	}
	
	.contractBody li span {
		float: left;
		width: 200px;
		height: 20px;
	}
	
	.contractBody li .bodyLabel {
		width: 100px;
		text-align: right;
		display: block;
	}
	
	.hidden {
		display: none;
	}
</style>