<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card>
					<header class="contractTitle">已选发货单</header>
					<div style="width:100%;" class="el-table el-table--fit el-table--striped el-table--border el-table--enable-row-hover el-table--enable-row-transition">
						<div class="el-table__header-wrapper">
							<table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width:100%;">
								<colgroup>
									<col name="el-table_1_column_1" width="50">
									<col name="el-table_1_column_1" width="155">
									<col name="el-table_1_column_2" width="150">
									<col name="el-table_1_column_3" width="150">
									<col name="el-table_1_column_4" width="150">
									<col name="el-table_1_column_5" width="142">
									<col name="el-table_1_column_6" width="132">
									<col name="el-table_1_column_7" width="132">
								</colgroup>
								<thead>
									<tr>
										<th colspan="1" rowspan="1" class="el-table_1_column_1 is-leaf">
											<div class="cell"></div>
										</th>
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
											<div class="cell">发货数量</div>
										</th>
										<th colspan="1" rowspan="1" class="el-table_1_column_6 is-leaf">
											<div class="cell">收货数量</div>
										</th>
										<th colspan="1" rowspan="1" class="el-table_1_column_7 is-leaf">
											<div class="cell">单价</div>
										</th>
										<th colspan="1" rowspan="1" class="el-table_1_column_8 is-leaf">
											<div class="cell">结算总价</div>
										</th>
									</tr>
								</thead>
							</table>
						</div>
						<div class="el-table__body-wrapper">
							<table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width:100%;">
								<colgroup>
									<col name="el-table_1_column_1" width="50">
									<col name="el-table_1_column_1" width="155">
									<col name="el-table_1_column_2" width="150">
									<col name="el-table_1_column_3" width="150">
									<col name="el-table_1_column_4" width="150">
									<col name="el-table_1_column_5" width="142">
									<col name="el-table_1_column_6" width="132">
									<col name="el-table_1_column_7" width="132">
								</colgroup>
								<tbody>
									<tr v-for="item in selectProductDataList" class="el-table__row">
										<td :rowspan="item.deliveryNumspan" :class="{hidden: item.deliveryNumdis}">
											<div class="cell">
												<el-checkbox v-model='item.selectedStatus' @change="selectProduct(item)"></el-checkbox>
											</div>
										</td>
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
											<div class="cell">{{item.balancePrice}}</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<ul class="contractBody">
						<li>
							<span class="bodyLabel">总重量：</span><span>{{totalWeightEnd}}</span>
							<span class="bodyLabel">总价：</span><span>{{totalFeeEnd}}</span>
						</li>
					</ul>
				</el-card>
				<el-card style="margin-top: 20px;">
					<el-form :model="findForm" :inline="true" class="demo-form-inline">
						<el-form-item label="发货单号">
							<el-input placeholder="发货单号" v-model="findForm.deliveryNum"></el-input>
						</el-form-item>
						<el-form-item label="供应商">
							<el-select v-model="findForm.supplierId" clearable placeholder="请选择供应商">
								<el-option v-for="item in customerList" :key="item.memberId" :label="item.name" :value="item.memberId">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="收货时间">
							<el-date-picker v-model="findForm.date" type="daterange" align="right" placeholder="选择日期范围">
							</el-date-picker>
						</el-form-item>
						<el-button type="primary" @click="query" style="margin-left: 10px;">查询</el-button>
					</el-form>
					<el-form :model="findFormReg" ref="tableData">
						<div style="width:100%;" class="el-table el-table--fit el-table--striped el-table--border el-table--enable-row-hover el-table--enable-row-transition">
							<div class="el-table__header-wrapper">
								<table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width:100%;">
									<colgroup>
										<col name="el-table_1_column_1" width="50">
										<col name="el-table_1_column_1" width="155">
										<col name="el-table_1_column_2" width="150">
										<col name="el-table_1_column_3" width="150">
										<col name="el-table_1_column_4" width="150">
										<col name="el-table_1_column_5" width="142">
										<col name="el-table_1_column_6" width="132">
										<col name="el-table_1_column_7" width="132">
									</colgroup>
									<thead>
										<tr>
											<th colspan="1" rowspan="1" class="el-table_1_column_1 is-leaf">
												<div class="cell"></div>
											</th>
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
												<div class="cell">发货数量</div>
											</th>
											<th colspan="1" rowspan="1" class="el-table_1_column_6 is-leaf">
												<div class="cell">收货数量</div>
											</th>
											<th colspan="1" rowspan="1" class="el-table_1_column_7 is-leaf">
												<div class="cell">单价</div>
											</th>
											<th colspan="1" rowspan="1" class="el-table_1_column_8 is-leaf">
												<div class="cell">结算总价</div>
											</th>
										</tr>
									</thead>
								</table>
							</div>
							<div class="el-table__body-wrapper">
								<table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width:100%;">
									<colgroup>
										<col name="el-table_1_column_1" width="50">
										<col name="el-table_1_column_1" width="155">
										<col name="el-table_1_column_2" width="150">
										<col name="el-table_1_column_3" width="150">
										<col name="el-table_1_column_4" width="150">
										<col name="el-table_1_column_5" width="142">
										<col name="el-table_1_column_6" width="132">
										<col name="el-table_1_column_7" width="132">
									</colgroup>
									<tbody>
										<tr prop="productDataList" v-for="item in findFormReg.productDataList" class="el-table__row">
											<td :rowspan="item.deliveryNumspan" :class="{hidden: item.deliveryNumdis}">
												<div class="cell">
													<el-checkbox v-model='item.selected' @change="changeSelect(item)"></el-checkbox>
												</div>
											</td>
											<td :rowspan="item.deliveryNumspan" :class="{hidden: item.deliveryNumdis}">
												<div class="cell">{{item.deliveryNum}}</div>
											</td>
											<td :rowspan="item.deliveryNumspan" :class="{hidden: item.deliveryNumdis}">
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
												<div class="cell">{{item.balancePrice}}</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</el-form>
				</el-card>
				<el-col class="button_submit">
					<el-button type="primary" @click="saveContract('tableData')">保存</el-button>
					<el-button type="primary" @click="toBack">取消</el-button>
				</el-col>
			</el-col>
		</el-row>
	</section>
</template>
<script>
	import { combineCell } from '@/config/mUtils'
	import { balanceInfo, balanceSave, balanceList, getMemberSelect } from '@/api/getData'
	export default {
		data() {
			return {
				//添加 总价字段 单价*数量
				findForm: {
					deliveryNum: '',
					supplierId: "",
					date: ''
				},
				tableData: [],
				findFormReg: {
					productDataList: []
				},
				selectProductDataList: [],
				totalFeeEnd: "0",
				totalWeightEnd: "0",
				customerList: [],
			}
		},
		mounted() {
			this.getMemberSelectData();
			this.initData();
		},
		methods: {
			async getMemberSelectData() {
				try {
					const returnData = await getMemberSelect({
						search: {
							typeId: "3"
						}
					});
					if(returnData.result == "success") {
						returnData.list.forEach((item, index) => {
							const data = {};
							data.name = item.name;
							data.memberId = item.memberId;
							this.customerList.push(data);
						})
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
			async initData() {
				try {

					const stockData = await balanceInfo({
						search: this.findForm,
						balanceId: this.$route.query.balanceId
					});
					if(stockData.result == "success") {
						let tableData = [];
						let totalFee = 0;
						let totalWeight = 0;
						stockData.obj.itemList.forEach((item, index) => {
							item.selectedStatus = true;
							item.selected = true;
							if(item.price == "" || item.price == undefined || item.price == null || item.receiveNumber == "" || item.receiveNumber == undefined || item.receiveNumber == null) {
								item.balancePrice = "";
							} else {
								item.balancePrice = parseFloat(item.receiveNumber) * parseFloat(item.price);
							}
							totalFee = parseFloat(totalFee) + parseFloat(item.receiveNumber * item.price);
							totalWeight = parseFloat(totalWeight) + parseFloat(item.receiveNumber);
							tableData.push(item);
						})
						this.totalFeeEnd = totalFee.toFixed(2);
						this.totalWeightEnd = totalWeight.toFixed(3);
						//复杂表格数据处理
						this.selectProductDataList = combineCell(tableData);

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
			async findData() {
				try {
					if(this.findForm.date == "" && this.findForm.supplierId == "" && this.findForm.deliveryNum == "") {
						this.$message({
							type: 'warning',
							message: '请输入查询条件'
						});
						return false;
					}
					//发货时间转化
					if(this.findForm.date != "" && this.findForm.date != ",") {
						let dates = this.findForm.date;
						this.findForm.receiptStartDate = dates[0].format("yyyy-MM-dd");
						this.findForm.receiptEndDate = dates[1].format("yyyy-MM-dd");
					}
					let page = {
						currentPage: "1",
						pageSize: "100"
					}
					const stockData = await balanceList({
						search: this.findForm,
						page: page,
					});
					if(stockData.result == "success") {
						this.tableData = [];
						this.count = Number(stockData.page.maxPage);
						stockData.list.forEach((item, index) => {
							item.selected = false;
							if(item.price == "" || item.price == undefined || item.price == null || item.receiveNumber == "" || item.receiveNumber == undefined || item.receiveNumber == null) {
								item.balancePrice = "";
							} else {
								item.balancePrice = parseFloat(item.receiveNumber) * parseFloat(item.price);
							}
							this.tableData.push(item);
						})
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
			selectProduct(item) {
				//如果去掉勾选，删除该发货单
				this.selectProductDataList.forEach((data, index) => {
					if(!item.selectedStatus) {
						if(data.deliveryNum == item.deliveryNum) {
							item.selected = false;
							this.selectProductDataList.splice(index, 1);
							this.totalFeeEnd = (parseFloat(this.totalFeeEnd) - parseFloat(item.receiveNumber * item.price)).toFixed(2);
							this.totalWeightEnd = (parseFloat(this.totalWeightEnd) - parseFloat(item.receiveNumber)).toFixed(3);
							for(let i = 1; i < Number(data.deliveryNumspan); i++) { //判断合并的行数

								let obj = this.selectProductDataList[index];
								obj.selected = false;
								this.totalFeeEnd = (parseFloat(this.totalFeeEnd) - parseFloat(obj.receiveNumber * obj.price)).toFixed(2);
								this.totalWeightEnd = (parseFloat(this.totalWeightEnd) - parseFloat(obj.receiveNumber)).toFixed(3);
								this.selectProductDataList.splice(index, 1);
							}
						}
					}
				});
			},
			changeSelect(obj) {
				if(obj.selected) {
					let isHas = false;
					this.selectProductDataList.forEach(data => {
						if(data.deliveryNum == obj.deliveryNum) {
							this.$message({
								type: 'warning',
								message: '已经选择该发货单'
							});
							isHas = true;
							obj.selected = false;
							return false;
						}
					});
					if(isHas) {
						return false;
					}
					let j = 0; //判断合并行
					let totalFee = 0; //判断总价格
					let totalWeight = 0; //判断总重量
					this.findFormReg.productDataList.forEach((item, index) => {
						if(j != 0) {
							totalFee += parseFloat(item.receiveNumber * item.price);
							totalWeight += parseFloat(item.receiveNumber);
							item.selectedStatus = true;
							this.selectProductDataList.push(item);
							j--;
						}
						// 选中
						if(item.selected) {
							if(this.selectProductDataList.length == 0) {
								totalFee += parseFloat(item.receiveNumber * item.price);
								totalWeight += parseFloat(item.receiveNumber);
								item.selectedStatus = true;
								this.selectProductDataList.push(item);
								j = Number(item.deliveryNumspan) - 1; //判断合并的行数
							} else {
								let isTrue = false;
								this.selectProductDataList.forEach(data => {
									if(data.deliveryNum == item.deliveryNum) {
										isTrue = true;
										return false;
									}
								});
								if(!isTrue) {
									item.selectedStatus = true;
									this.selectProductDataList.push(item);
									totalFee += parseFloat(item.receiveNumber * item.price);
									totalWeight += parseFloat(item.receiveNumber);
									j = Number(item.deliveryNumspan) - 1; //判断合并的行数
								}
							}
						}
					});
					this.totalFeeEnd = (parseFloat(this.totalFeeEnd) + totalFee).toFixed(2);
					this.totalWeightEnd = (parseFloat(this.totalWeightEnd) + totalWeight).toFixed(3);
				}
			},
			saveContract(tableData) {

				this.$refs[tableData].validate(async(valid) => {
					if(valid) {
						if(this.selectProductDataList.length == 0) {
							this.$message({
								type: 'warning',
								message: '请先选择要结算的发货单'
							});
						} else {
							this.saveSingle();
						}
					} else {
						this.$notify.error({
							title: '错误',
							message: '请检查输入是否正确',
							offset: 100
						});
						return false;
					}
				});

			},
			async saveSingle() {

				try {

					let itemList2Array = [];
					let itemList1Arr = [];
					let deliverIdsId = "";

					let itemList1 = {};
					let itemList2Obj = {};
					let deliverList = {
						deliverId: "",
						itemList: []
					};
					this.selectProductDataList.forEach((item, index) => {
						if(item.selected) {
							//存已选中的运费和单号			
							itemList1.total = "0"
							itemList1.deliverId = item.deliverId
							itemList1.contractId = item.contractId

							deliverIdsId = item.deliverId;
							let itemList2Obj = {};
							itemList2Obj.deliverId = item.deliverId;
							itemList2Obj.itemId = item.itemId;
							itemList2Obj.productId = item.productId;
							itemList2Obj.price = item.price;
							itemList2Array.push(itemList2Obj);
							//totalAmount += parseFloat(item.total)
						};
					});

					itemList1Arr.push(itemList1);
					let data = {};
					let dataObj = {};
					dataObj.feeType = "0" //结算类型
					dataObj.itemList = itemList1Arr;
					dataObj.totalAmount = this.totalFeeEnd;
					dataObj.balanceId = this.$route.query.balanceId;
					data.obj = dataObj;

					let itemListObj = {};
					let deliverObj = {};
					deliverObj.deliverId = deliverIdsId;
					itemListObj = itemList2Array;
					deliverObj.itemList = itemListObj;
					data.delivery = deliverObj;
					const result_2 = await balanceSave(data);
					if(result_2.result == "success") {
						this.$message({
							type: 'success',
							message: '保存成功'
						});
						this.$router.push('index');
					}
				} catch(err) {
					this.$message.error('保存失败');
					console.log('获取数据失败', err);
				}

			},
			toBack() {
				this.$router.push({
					path: 'index'
				});
			},
			query() {
				this.findData();
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
	
	.contractTitle {
		background-color: #f5f5f5;
		line-height: 60px;
		color: #48576a;
		font-size: 24px;
		text-align: center;
	}
</style>