<template>
	<section>
		<el-row>
			<el-col :span="24">
				<div class="tableTitle">发货列表</div>
				<el-form :model="findForm" :inline="true" class="demo-form-inline">
					<el-form-item label="合同编号">
						<el-select v-model="findForm.contractId" placeholder="请选择合同编号">
							<el-option v-for="item in contractList" :key="item.contractNum" :label="item.contractNum" :value="item.contractNum">
							</el-option>
						</el-select>
					</el-form-item>
					<el-button type="primary" @click="find" style="margin-left: 10px;">查询</el-button>
					<el-button type="primary" @click="add">添加</el-button>
				</el-form>
				<el-table :data="tableData" border stripe style="width: 100%">
					<el-table-column prop="_contractId" label="合同编号">
					</el-table-column>
					<el-table-column prop="deliveryNum" label="发货单号">
					</el-table-column>
					<el-table-column prop="deliveryNumber" label="计划发货总量(吨)">
					</el-table-column>
					<el-table-column prop="_addressId" label="收货地址">
					</el-table-column>
					<el-table-column prop="enterDate" label="入场时间">
					</el-table-column>
					<el-table-column label="操作" width="300">
						<template scope="scope">
							<el-button size="small" type="success" v-show="scope.row.btnShow" @click="deliveryAudit(scope.row)">申请出库</el-button>
							<el-button size="small" type="info" @click="detail(scope.row)">详情</el-button>
							<!--<el-button size="small" type="warning" @click="modify(scope.row)">编辑</el-button>-->
							<el-button size="small" type="danger" v-show="scope.row.btnShow" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="block">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10" layout="prev, pager, next" :page-count="count">
					</el-pagination>
				</div>
			</el-col>
		</el-row>

	</section>
</template>
<script>
	import { getDeliveryList, getDeliveryDelete, getDeliveryAudit, fetchForDelivery } from '@/api/getData'
	export default {
		data() {
			return {
				findForm: {
					contractId: '',
				},
				contractList: [],
				tableData: [],
				limit: 10,
				count: 0,
				currentPage: 1,
			}
		},
		created() {
			this.fetchForDeliveryData();
			this.initData();
		},
		methods: {
			async fetchForDeliveryData() {
				try {
					const returnData = await fetchForDelivery();
					if(returnData.result == "success") {
						this.contractList = returnData.list;
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
					let page = {
						currentPage: this.currentPage.toString(),
						pageSize: this.limit.toString()
					}
					const stockData = await getDeliveryList({
						search: this.findForm,
						page: page,
					});
					if(stockData.result == "success") {
						stockData.list.forEach(item => {
							if(item.status > 1) {
								item.btnShow = false;
							} else {
								item.btnShow = true;
							}
							item.enterDate = item.enterDate.substr(0, 10);
						});
						this.tableData = stockData.list;
						this.count = Number(stockData.page.maxPage);
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
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.initData();
			},
			async handleDeleteData(index, row) {
				try {
					let returnData = await getDeliveryDelete({
						deliverId: row.deliverId
					});
					if(returnData.result == "success") {
						this.tableData.splice(index, 1);
						this.$message({
							message: "删除成功！",
							type: 'success'
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
			handleDelete(index, row) {
				this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.handleDeleteData(index, row);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除操作'
					});
				});

			},
			add() {
				this.$router.push({
					path: 'add'
				})
			},
			modify(row) {
				this.$router.push({
					path: 'modify',
					query: {
						deliverId: row.deliverId
					}
				})
			},
			detail(row) {
				this.$router.push({
					path: 'detail',
					query: {
						deliverId: row.deliverId
					}
				})
			},
			find() {
				this.initData();
			},
			async getDeliveryAuditData(row) {
				try {
					let returnData = await getDeliveryAudit({
						deliverId: row.deliverId
					});
					if(returnData.result == "success") {
						this.initData();
						this.$message({
							message: "申请成功！",
							type: 'success'
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
			deliveryAudit(row) {
				this.$confirm('申请后将不可更改, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.getDeliveryAuditData(row);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消申请操作'
					});
				});
			},
		}
	};
</script>
<style scoped>
	.el-pagination {
		text-align: center;
		margin-top: 30px;
	}
	
	.el-message-box__btns .cancel {
		float: right;
		margin-left: 10px;
	}
</style>