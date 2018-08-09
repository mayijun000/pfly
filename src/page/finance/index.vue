<template>
	<section>
		<el-row>
			<el-col :span="24">
				<div class="tableTitle">财务审核列表</div>
				<el-form :model="findForm" :inline="true" class="demo-form-inline">
					<el-form-item label="结算单号">
						<el-input placeholder="结算单号" v-model="findForm.balanceNum"></el-input>
					</el-form-item>
					<el-button type="primary" @click="find" style="margin-left: 10px;">查询</el-button>
				</el-form>
				<el-table :data="tableData" border stripe style="width: 100%">
					<el-table-column prop="balanceNum" label="结算单号" width="150">
					</el-table-column>
					<el-table-column prop="feeTypeName" label="结算类型">
					</el-table-column>
					<el-table-column prop="createDate" label="提交日期">
					</el-table-column>
					<el-table-column prop="balanceDate" label="结算日期">
					</el-table-column>
					<el-table-column prop="totalAmount" label="结算额">
					</el-table-column>
					<el-table-column prop="createUserName" label="申请人">
					</el-table-column>
					<el-table-column label="操作" width="200">
						<template scope="scope">
							<el-button size="small" type="success" @click="successBalance(scope.row)">同意</el-button>
							<el-button size="small" type="warning" @click="rejectBalance(scope.row)">驳回</el-button>
							<el-button size="small" type="info" @click="detail(scope.row)">详情</el-button>
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
	import { getFetchFinanceList, getBalanceSuccess, getBalanceReject } from '@/api/getData'
	export default {
		data() {
			return {
				findForm: {
					balanceNum: '',
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
			async initData() {
				try {
					let page = {
						currentPage: this.currentPage.toString(),
						pageSize: this.limit.toString()
					}
					const stockData = await getFetchFinanceList({
						search: this.findForm,
						page: page,
					});
					if(stockData.result == "success") {
						this.count = Number(stockData.page.maxPage);
						stockData.list.forEach((item, index) => {
							item.createDate = item.createDate.substr(0, 10);
							item.balanceDate = item.balanceDate.substr(0, 10);
							if(item.feeType == "0") {
								item.feeTypeName = "供应商结算";
							} else if(item.feeType == "1") {
								item.feeTypeName = "客户结算";
							} else if(item.feeType == "2") {
								item.feeTypeName = "运费结算";
							}
							item.status = item.status == 1 ? "审核中" : "";
						})
						this.tableData = stockData.list;
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
				console.log(`当前页: ${val}`);
			},
			async successBalanceFunction(row) {
				try {
					let returnData = await getBalanceSuccess({
						balanceId: row.balanceId
					});
					if(returnData.result == "success") {
						this.$message({
							type: 'success',
							message: '审核通过!'
						});
						this.initData();
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
			async rejectBalanceFunction(row) {
				try {
					let returnData = await getBalanceReject({
						balanceId: row.balanceId
					});
					if(returnData.result == "success") {
						this.$message({
							type: 'success',
							message: '驳回成功!'
						});
						this.initData();
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
			successBalance(row) {
				this.$confirm('此操作将审核通过该结算, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.successBalanceFunction(row);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消审核操作'
					});
				});

			},
			rejectBalance(row) {
				this.$confirm('此操作将驳回该结算, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.rejectBalanceFunction(row);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消审核操作'
					});
				});
			},
			find() {
				this.initData();
			},
			detail(row) {
				this.$router.push({
					path: 'detail',
					query: {
						balanceId: row.balanceId
					}
				})
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