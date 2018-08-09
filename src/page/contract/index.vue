<template>
	<section>
		<el-row>
			<el-col :span="24">
				<div class="tableTitle">合同列表</div>
				<el-form :model="findForm" :inline="true" class="demo-form-inline">
					<el-form-item label="所属项目">
						<el-input placeholder="所属项目" v-model="findForm.projectName"></el-input>
					</el-form-item>
					<el-form-item label="买方">
						<el-input placeholder="买方" v-model="findForm.demand"></el-input>
					</el-form-item>
					<el-form-item label="卖方">
						<el-input placeholder="卖方" v-model="findForm.supplier"></el-input>
					</el-form-item>
					<el-form-item label="签订日期">
						<el-date-picker v-model="findForm.signDate" align="right" type="date" placeholder="选择订单日期">
						</el-date-picker>
					</el-form-item>
					<el-button type="primary" @click="find" style="margin-left: 10px;">查询</el-button>
					<el-button type="primary" @click="add">添加</el-button>
				</el-form>
				<el-table :data="tableData" border stripe>
					<el-table-column prop="contractNum" label="合同编号" min-width="100">
					</el-table-column>
					<el-table-column prop="projectName" label="所属项目" min-width="100">
					</el-table-column>
					<el-table-column prop="totalAmount" label="总金额">
					</el-table-column>
					<el-table-column prop="demand" label="买方">
					</el-table-column>
					<el-table-column prop="supplier" label="卖方">
					</el-table-column>
					<el-table-column prop="deliverySignAdrrId" label="签订地址" min-width="100">
					</el-table-column>
					<el-table-column prop="signDate" label="签订日期" min-width="110">
					</el-table-column>
					<el-table-column prop="statusName" label="状态" width="80">
					</el-table-column>
					<el-table-column label="操作" width="280">
						<template scope="scope">
							<el-button size="small" type="success" v-show="scope.row.hideBtn" @click="contractEnd(scope.$index,scope.row)">结束合同</el-button>
							<el-button size="small" type="info" @click="detail(scope.row)">详情</el-button>
							<el-button size="small" type="warning" v-show="scope.row.hideBtn" @click="modify(scope.row)">编辑</el-button>
							<el-button size="small" type="danger" v-show="scope.row.hideBtn" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
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
	import { getContractList, getContractDelete, getContractEnd } from '@/api/getData'
	export default {
		data() {
			return {
				findForm: {
					projectName: '',
					demand: '',
					supplier: '',
					signDate: ''
				},
				tableData: [],
				limit: 10,
				count: 0,
				currentPage: 1,
			}
		},
		created() {
			this.initData();
		},
		methods: {
			contractEnd(index, row) {
				this.$confirm('此操作将结束合同, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					try {
						let returnData = getContractEnd({
							contractId: row.contractId
						});
						if(returnData.result == "success") {
							this.tableData.splice(index, 1);
							this.$message({
								type: 'success',
								message: '操作成功!'
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
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消结束合同操作'
					});
				});
			},
			detail(row) {
				this.$router.push({
					path: 'detail',
					query: {
						contractId: row.contractId
					}
				})
			},
			add() {
				this.$router.push({
					path: 'add'
				});
			},
			modify(row) {
				this.$router.push({
					path: 'modify',
					query: {
						contractId: row.contractId
					}
				});
			},
			find() {
				this.initData();
			},

			async initData() {
				try {
					if(this.findForm.signDate != "") {
						this.findForm.signDate = this.findForm.signDate.format("yyyy-MM-dd");
					}
					const stockData = await getContractList({
						search: this.findForm,
						page: {
							currentPage: this.currentPage.toString(),
							pageSize: this.limit.toString()
						}
					});
					if(stockData.result == "success") {
						this.tableData = [];
						this.count = Number(stockData.page.maxPage);
						stockData.list.forEach((item, index) => {
							const tableData = {};
							tableData.contractId = item.contractId;
							tableData.projectName = item.projectName;
							tableData.contractNum = item.contractNum;
							tableData.supplier = item.supplierName;
							tableData.demand = item._demand;
							tableData.signDate = item.signDate.substr(0, 10);
							tableData.deliverySignAdrrId = item.deliverySignAdrrId;
							tableData.totalAmount = item.totalAmount;
							tableData.status = item.status;
							if(tableData.status == "1") {
								tableData.statusName = "已结束";
								tableData.hideBtn = false;
							} else {
								tableData.statusName = "执行中";
								tableData.hideBtn = true;
							}
							this.tableData.push(tableData);
						})
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
			async handleDeleteData(index, row) {
				try {
					let returnData = await getContractDelete({
						contractId: row.contractId
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

			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.initData();
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