<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card>
					<header class="contractTitle">发货单</header>
					<ul v-model="outData" class="contractBody">
						<li>
							<span class="bodyLabel">所属仓库：</span><span>{{outData.executerName}}</span>
							<span class="bodyLabel">合同编号：</span><span>{{outData.contractNo}}</span>
						</li>
						<li>
							<span class="bodyLabel">计划发货总量(吨)：</span><span>{{outData.deliveryNumber}}</span>
							<span class="bodyLabel">实出总量(吨)：</span><span>{{outData.outNumberCount}}</span>
						</li>
					</ul>
					<el-table :data="productData" border stripe style="width:100%;margin: 20px 0;" align="center">
						<el-table-column label="产品名称" prop="name" width="200">
						</el-table-column>
						<el-table-column label="材质" prop="material">
						</el-table-column>
						<el-table-column label="规格型号" prop="specifiModel">
						</el-table-column>
						<el-table-column label="计划发货量(吨)" prop="number">
						</el-table-column>
						<el-table-column label="已选出库量(吨)" prop="outBoundNumber">
						</el-table-column>
						<el-table-column label="已选采购单" prop="order" width="400">
							<template scope="scope">
								<el-table :data="scope.row.orderData" v-show="scope.row.tableshow" style="width:100%;margin: 20px 0;" align="center">
									<el-table-column label="采购单号" prop="orderNo" width="150">
									</el-table-column>
									<el-table-column label="出库量(吨)" prop="number">
									</el-table-column>
									<el-table-column label="操作">
										<template scope="scopeData">
											<el-button size="small" type="danger" @click="handleDelete(scope.row,scopeData.row,scopeData.$index)">删除</el-button>
										</template>
									</el-table-column>
								</el-table>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="80">
							<template scope="scope">
								<el-button size="small" type="primary" @click="addProduct(scope.row)">选单</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
				<div style="text-align: center;margin-top: 50px;">
					<el-button type="primary" size="large" @click="saveOutBound">出库</el-button>
					<el-button type="primary" size="large" @click="toBack">取消</el-button>
				</div>
			</el-col>
		</el-row>
		<el-dialog title="选单" size="large" :visible.sync="dialogTableVisible" class="orderDialog" top="1%">
			<el-card>
				<el-row>
					<el-col :span="8">
						所属仓库：<span>{{outData.executerName}}</span>
					</el-col>
					<el-col :span="6">
						产品名称：<span>{{varRow.name}}</span>
					</el-col>
					<el-col :span="5">
						材质：<span>{{varRow.material}}</span>
					</el-col>
					<el-col :span="5">
						规格：<span>{{varRow.specifiModel}}</span>
					</el-col>
				</el-row>
			</el-card>
			<el-form :model="findForm" :inline="true" class="demo-form-inline">
				<el-form-item label="订单编号">
					<el-input placeholder="订单编号" v-model="findForm.orderNum"></el-input>
				</el-form-item>
				<el-form-item label="入库日期">
					<el-date-picker v-model="findForm.date" type="daterange" align="right" placeholder="选择日期范围">
					</el-date-picker>
				</el-form-item>
				<el-button type="primary" @click="find" style="margin-left: 10px;">查询</el-button>
			</el-form>
			<el-table :data="orderDialogData" border stripe>
				<el-table-column width="55">
					<template scope="scope">
						<input type="checkbox" v-model="scope.row.checkTrue" />
					</template>
				</el-table-column>
				<el-table-column prop="orderNum" label="订单编号" width="150"></el-table-column>
				<el-table-column prop="createDate" label="入库日期"></el-table-column>
				<el-table-column prop="remaindeStock" label="订单剩余量"></el-table-column>
				<el-table-column prop="price" label="采购单价"></el-table-column>
				<el-table-column label="出单量" width="200">
					<template scope="scope">
						<el-input v-model="scope.row.outNum" placeholder="请输入出单量"></el-input>
					</template>
				</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogTableVisible = false">取 消</el-button>
			    <el-button type="primary" :plain="true" @click="saveOrder">确 定</el-button>
			</span>
		</el-dialog>
	</section>
</template>
<script>
	import { getDeliverInfo, getStockSelectList, getStockOutSave } from '@/api/getData'
	export default {
		data() {
			return {
				dialogTableVisible: false,
				findForm: {
					orderNum: '',
					productId: '',
					wareId: "",
					startDate: "",
					endDate: "",
					date: "",
				},
				outData: {
					contractNo: "",
					executerName: "",
					deliveryNumber: "",
					outNumberCount: "",
					deliveryWareId: "",
				},
				productData: [],
				orderDialogData: [],
				selectData: [],
				varRow: {}
			}
		},
		created() {
			this.getDeliverInfoData();
		},
		methods: {
			find() {
				this.getStockListData(this.varRow);
			},
			async getDeliverInfoData() {
				try {
					let data = {
						deliverId: this.$route.query.deliverId
					}
					const returnData = await getDeliverInfo(data);
					if(returnData.result == "success") {
						let item = returnData.obj;
						this.outData.executerName = item._deliveryWareId;
						this.outData.contractNo = item._contractId;
						this.outData.contractId = item.contractId;
						this.outData.deliveryNumber = item.deliveryNumber;
						this.outData.deliveryWareId = item.deliveryWareId;
						item.itemList.forEach(item => {
							item.orderData = [];
							item.tableshow = false;
						});
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
			async getStockListData(row) {
				try {
					let page = {
						currentPage: "1",
						pageSize: "100"
					}
					if(this.findForm.date != "" && this.findForm.date != ",") {
						let dates = this.findForm.date;
						this.findForm.startDate = dates[0].format("yyyy-MM-dd");
						this.findForm.endDate = dates[1].format("yyyy-MM-dd");
					}
					this.findForm.productId = row.productId;
					this.findForm.contractId = this.outData.contractId;
					this.findForm.wareId = this.outData.deliveryWareId;
					const returnData = await getStockSelectList({
						search: this.findForm,
						page: page,
					});
					if(returnData.result == "success") {
						this.selectData = [];
						this.orderDialogData = [];
						returnData.list.forEach(item => {
							item.createDate = item.createDate.substr(0, 10);
							if(row.orderData.length > 0) {
								row.orderData.forEach(data => {
									if(item.inId == data.inId) {
										item.checkTrue = true;
										item.outNum = data.number;
									} else if(!item.checkTrue) {
										item.checkTrue = false;
									}
								});
							} else {
								item.outNum = "";
							}
						});
						this.orderDialogData = returnData.list;

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
			addProduct(row) {
				this.getStockListData(row);
				this.varRow = row;
				this.dialogTableVisible = true;
			},
			//删除一行的方法
			handleDelete(item, row, index) {
				item.outBoundNumber = parseFloat(item.outBoundNumber) - parseFloat(row.number);
				let outNumberCount = this.outData.outNumberCount;
				//传入form表单的对象
				item.orderData.splice(index, 1);
				if(item.orderData.length == 0) {
					item.tableshow = false;
				}
				outNumberCount = parseFloat(outNumberCount) - parseFloat(row.number);
				this.outData.outNumberCount = outNumberCount;
			},
			handleSelect(row) {
				if(row.checkTrue) {
					this.selectData.push(row);
				} else {
					this.selectData.forEach((item, index) => {
						if(item == row) {
							this.selectData.splice(index, 1);
						}
					});
				}
			},
			saveOrder() {
				const obj = this;
				let isTrue = true;
				let reg = /^[0-9]{1,20}(.[0-9]{0,3})?$/;
				let outNumCount = 0; //总出库量
				obj.selectData = [];
				let noSelectNum = 0;//没有选择的数量
				this.orderDialogData.forEach(function(item) {
					if(item.checkTrue) {
						if(!reg.test(item.outNum)) {
							obj.$message({
								message: '出库量格式不正确',
								type: 'warning'
							});
							isTrue = false;
							return false;
						}
						if(item.remaindeStock < parseFloat(item.outNum)) {
							obj.$message({
								message: '订单编号为' + item.orderNum + '的出库量大于剩余量',
								type: 'warning'
							});
							isTrue = false;
							return false;
						} else {
							outNumCount += parseFloat(item.outNum);
							obj.selectData.push(item);
						}
					}else{
						noSelectNum++;
					}
				});
				if(noSelectNum == this.orderDialogData.length){
					this.$message({
						message: '请勾选要出库的采购单',
						type: 'warning'
					});
					return false;
				}

				if(isTrue) {

					let i = 0; //判断执行次数
					this.productData.forEach(function(item) { //判断哪个产品选的单
						if(obj.varRow.itemId == item.itemId) {
							obj.selectData.forEach(function(data) {
								const orderTable = {
									orderNo: data.orderNum,
									number: data.outNum,
									inId: data.inId
								};
								if(i == 0) { //把之前选中的清空
									item.orderData = [];
									i++;
								}
								item.orderData.push(orderTable);
								item.outBoundNumber = outNumCount.toFixed(3); //单个产品应出总量
								item.tableshow = true; //显示选择完的订单编号表格
							});
						}

					});

					let count = 0;
					this.productData.forEach(function(item) {
						item.orderData.forEach(function(child) {
							count += parseFloat(child.number);
						});
					});
					this.outData.outNumberCount = count.toFixed(3); //显示出库单的总出库量
					this.dialogTableVisible = false;
				}
			},
			toBack() {
				this.$router.go(-1);
			},
			async saveOutBoungData() {
				try {
					
					let param = [];
					this.productData.forEach(item => {
						let data = {};
						data.itemId = item.itemId;
						data.deliverId = item.deliverId;
						data.productId = item.productId;
						data.wareId = this.outData.deliveryWareId;
						data.price = item.price;
						data.number = item.outBoundNumber;
						data.itemList = item.orderData;
						param.push(data);
					});
					const result = await getStockOutSave({
						list: param
					});
					if(result.result == "success") {
						this.$message({
							type: 'success',
							message: '出库成功'
						});
						this.$router.push('index');
					}
				} catch(err) {
					this.$message.error('出库失败');
					console.log('获取数据失败', err);
				}
			},
			saveOutBound() {
				this.$confirm('此操作将进行产品出库, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.saveOutBoungData();
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消出库'
					});
				});
			}
		}
	}
</script>
<style scoped>
	.demo-formData .el-input,
	.demo-formData .el-input__inner {
		width: 360px;
		display: inline-block;
	}
	
	.demo-formData .el-date-editor.el-input {
		width: 360px;
	}
	
	.contractBody li {
		padding: 20px;
		font-size: 14px;
		color: #48576a;
	}
	
	.contractBody li span {
		float: left;
		width: 30%;
		height: 60px;
		display: block;
	}
	
	.contractBody li .bodyLabel {
		width: 20%;
		text-align: right;
		display: block;
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
	
	.orderDialog .el-table__body-wrapper {
		max-height: 300px;
	}
</style>