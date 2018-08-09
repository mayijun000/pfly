<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width:1000px;margin: 0 auto;">
					<el-form :model="findForm" :inline="true">
						<el-form-item label="合同编号">
							<el-select style="width:200px" filterable v-model="findForm.contractNum" placeholder="请选择合同编号">
								<el-option v-for="item in contractList" :key="item.contractNum" :label="item.contractNum" :value="item.contractNum">
								</el-option>
							</el-select>
							<!--<el-input style="width:150px" v-model="findForm.contractNum" placeholder="请输入合同编号"></el-input>-->
						</el-form-item>
						<el-form-item label="仓库" label-width="100">
							<el-select style="width:300px" filterable v-model="findForm.wareId" placeholder="请选择仓库">
								<el-option v-for="item in warehouseList" :key="item.wareId" :label="item.address" :value="item.wareId">
								</el-option>
							</el-select>
							<el-button type="primary" @click="find" style="margin-left:10px">查询</el-button>
						</el-form-item>
					</el-form>
					<el-form v-show="findResult" :model="formData" ref="formData" label-width="300" class="demo-formData">
						<header class="contractTitle">发货单</header>
						<ul class="contractBody">
							<li>
								<span class="bodyLabel">项目名称: </span><span>{{formData.projectName}}</span>
								<span class="bodyLabel">收货单位: </span><span>{{formData.demand}}</span>

							</li>
							<li>
								<span class="bodyLabel">执行方: </span><span>{{formData.executerId}}</span>
								<span class="bodyLabel">进场时间: </span><span>
									<el-date-picker style="width:200px;" v-model="formData.enterDate" type="date" placeholder="选择日期">
									</el-date-picker>
								</span>
							</li>
							<li>
								<span class="bodyLabel">收货地址: </span><span>
									<el-select style="width:200px" v-model="formData.addressId" placeholder="请选择收货地址">
										<el-option v-for="item in addrList"  :key="item.id" :label="item.name" :value="item.id">
										</el-option>
									</el-select>
								</span>
								<span class="bodyLabel"></span><span></span>
							</li>
							<li>
								<span class="bodyLabel">物流公司: </span><span>
								<el-select style="width:200px" v-model="formData.logisticsId" @visible-change="selectChange" placeholder="请选择">
									<el-option v-for="item in customerList" :key="item.memberId" :label="item.name" :value="item.memberId">
									</el-option>
								</el-select>
							</span>
								<span class="bodyLabel">司机: </span><span>
									<el-select style="width:200px" @visible-change="selectDriver" v-model="formData.driverId" placeholder="请选择">
										<el-option v-for="item in driverList" :key="item.driverId" :label="item.userName" :value="item.driverId">
										</el-option>
									</el-select>
								</span>

							</li>
							<li>
								<span class="bodyLabel">联系方式: </span><span>{{formData.mobile}}</span>
								<span class="bodyLabel">车牌号: </span><span>{{formData.carNum}}</span>
							</li>
						</ul>

						<el-table v-show="findResult" :data="formData.tableData" border stripe style="width:100%;margin-bottom: 20px;" align="center">
							<el-table-column label="产品名称" prop="name">
							</el-table-column>
							<el-table-column label="材质" prop="material">
							</el-table-column>
							<el-table-column label="规格型号" prop="specifiModel">
							</el-table-column>
							<el-table-column label="合同剩余量(吨)" prop="deliveredNumber">
							</el-table-column>
							<el-table-column label="计划发货量(吨)">
								<template scope="scope">
									<el-input v-model="scope.row.receiptNumber"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="库存量(吨)" prop="stockNumber">
							</el-table-column>
						</el-table>
					</el-form>
					<div v-show="findResult" class="button_submit">
						<el-button type="primary" @click="saveDelivery('formData')">保存</el-button>
						<el-button type="primary" @click="toBack">取消</el-button>
					</div>

				</el-card>
			</el-col>
		</el-row>

	</section>

</template>

<script>
	import { getCityList, getMemberSelect, getDriverList, getDeliverySave, getItemFetch, getWarehouseList, fetchForDelivery, deliveryAddrList } from '@/api/getData'
	export default {
		data() {
			return {
				findResult: false,
				addrList: [],
				contractList: [],
				warehouseList: [],
				customerList: [],
				driverList: [],
				findForm: {
					contractNum: "",
					wareId: "",
				},
				formData: {
					enterDate: "",
					logisticsId: "",
					driver: {},
					mobile: "",
					carNum: "",
					address: "",
					countryId: "",
					cityId: "",

				},
			}
		},
		created() {
			this.fetchForDeliveryData();
			this.getWarehouseListData();
		},
		methods: {
			async deliveryAddrListData(id) {
				try {
					const returnData = await deliveryAddrList({
						search: {
							contractId: id
						}
					});
					if(returnData.result == "success") {
						if(returnData.list.length > 0) {
							this.addrList = [];
							returnData.list.forEach(item => {
								this.addrList.push({
									id: item.deliveryId,
									name: item._provinceId + item._cityId + item.address
								});
							});
							this.formData.addressId = returnData.list[0].deliveryId;
						}
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
			async fetchForDeliveryData() {
				try {
					const returnData = await fetchForDelivery();
					if(returnData.result == "success") {
						this.contractList = returnData.list;
						this.findForm.contractNum = returnData.list[0].contractNum;
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
			async getWarehouseListData() {
				try {
					const returnData = await getWarehouseList();
					if(returnData.result == "success") {
						this.warehouseList = [];
						if(returnData.list.length > 0) {
							this.findForm.wareId = returnData.list[0].wareId;
							returnData.list.forEach((item, index) => {
								const data = {};
								data.wareId = item.wareId;
								data.address = item.memberName + "仓库";
								this.warehouseList.push(data);
							});
						} else {
							this.$message({
								type: 'warning',
								message: "没有仓库数据"
							});
						}
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
			async getMemberSelectData() {
				try {
					const returnData = await getMemberSelect({
						search: {
							typeId: "5"
						}
					});

					if(returnData.result == "success") {
						this.customerList = [];
						if(returnData.list.length > 0) {
							this.formData.logisticsId = returnData.list[0].memberId;
							returnData.list.forEach((item, index) => {
								const data = {};
								data.name = item.name;
								data.memberId = item.memberId;
								this.customerList.push(data);
							})
							this.getDriverListData(returnData.list[0].memberId);
						}
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
			async getItemFetchData() {
				try {
					if(this.findForm.contractNum == "") {
						this.$message({
							type: 'warning',
							message: "请输入合同编号"
						});
						return false;
					}
					let data = {
						contractNum: this.findForm.contractNum,
						wareId: this.findForm.wareId,
					}
					const returnData = await getItemFetch({
						search: data
					});
					if(returnData.result == "success") {
						let item = returnData.obj;
						this.formData.projectName = item.projectName;
						this.formData.contractId = item.contractId;
						this.formData.totalAmount = item.totalAmount;
						this.formData.demand = item._demand;
						this.formData.receiptCompany = item.demand;
						this.formData.executerId = item._executerId;
						this.formData.tableData = item.itemList;
						this.formData.deliveryWareId = this.findForm.wareId;
						this.deliveryAddrListData(item.contractId);
						this.getMemberSelectData();
						this.findResult = true;
					} else if(returnData.errorCode == "82") {
						this.$message({
							type: 'warning',
							message: returnData.message
						});
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
			selectChange(value) {
				if(!value) {
					this.getDriverListData(this.formData.logisticsId);
				}
			},
			selectDriver(value) {
				if(!value) {
					this.driverList.forEach(item =>{
						if(item.driverId == this.formData.driverId){
							this.formData.mobile = item.mobile;
							this.formData.carNum = item.carNum;
						}
					});
				}
			},
			async getDriverListData(id) {
				try {
					let page = {
						currentPage: "1",
						pageSize: "100"
					}
					let data = {
						memberId: id
					}
					const communicateData = await getDriverList({
						search: data,
						page: page,
					});
					if(communicateData.result == "success") {
						this.driverList = communicateData.list;
						this.formData.mobile = communicateData.list[0].mobile;
						this.formData.carNum = communicateData.list[0].carNum;
						this.formData.driverId = communicateData.list[0].driverId;
						//this.formData.driver = communicateData.list[0];
					} else {
						this.$message({
							type: 'error',
							message: communicateData.message
						});
					}
				} catch(err) {
					console.log('获取数据失败', err);
				}
			},
			toBack() {
				this.$router.go(-1);
			},
			find() {
				this.getItemFetchData();
			},
			saveDelivery(formData) {
				this.$refs[formData].validate(async(valid) => {
					if(valid) {
						try {
							if(this.formData.addressId == "") {
								this.$message({
									type: 'warning',
									message: '请输入详细地址'
								});
								return false;
							}
							if(this.formData.enterDate != "") {
								if(typeof(this.formData.enterDate) != "string") {
									this.formData.enterDate = this.formData.enterDate.format("yyyy-MM-dd");
								}
							} else {
								this.$message({
									type: 'warning',
									message: '请输入进场时间'
								});
								return false;
							}
							//this.formData.driverId = this.formData.driver.driverId;
							let itemList = [];
							let noSubmit = true;
							let reg = /^[0-9]{1,20}(.[0-9]{0,3})?$/;
							this.formData.tableData.forEach(item => {
								if(item.receiptNumber != undefined && item.receiptNumber != "") {
									if(!reg.test(item.receiptNumber)) {
										this.$message({
											message: '发货数量格式不正确',
											type: 'warning'
										});
										noSubmit = false;
										return false;
									}
									if(parseFloat(item.receiptNumber) > parseFloat(item.stockNumber)) {
										this.$message({
											type: 'warning',
											message: '发货数量大于库存量'
										});
										noSubmit = false;
										return false;
									} else if(parseFloat(item.receiptNumber) > parseFloat(item.deliveredNumber)) {
										this.$message({
											type: 'warning',
											message: '发货数量大于剩余量'
										});
										noSubmit = false;
										return false;
									}
									let data = {};
									data.contractId = this.formData.contractId;
									data.productId = item.productId;
									data.number = item.receiptNumber;
									data.price = item.price;
									itemList.push(data);
								}

							});
							if(!noSubmit) {
								return false;
							}
							if(itemList.length == 0) {
								this.$message({
									type: 'warning',
									message: '请填写相应产品的发货数量'
								});
								return false;
							}

							this.formData.itemList = itemList;
							const result = await getDeliverySave(this.formData);
							if(result.result == "success") {
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
		}
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
		width: 337.5px;
		display: flex;
		height: 60px;
		border-top: 1px solid #dfe6ec;
		border-right: 1px solid #dfe6ec;
		align-items: center;
		padding: 0 10px;
	}
	
	.contractBody li .bodyLabel {
		width: 100px;
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