<template>
	<section>
		<el-row>
			<el-col :span="24">
				<div class="tableTitle">订单审核列表</div>
				<el-form :model="findForm" :inline="true" class="demo-form-inline">
					<el-form-item label="采购方">
						<el-input placeholder="采购方" v-model="findForm.demand"></el-input>
					</el-form-item>
					<el-form-item label="供应商">
						<el-input placeholder="供应商" v-model="findForm.supplier"></el-input>
					</el-form-item>
					<el-button type="primary" @click="find" style="margin-left: 10px;">查询</el-button>
				</el-form>
				<el-table :data="tableData" border stripe style="width: 100%">
					<el-table-column prop="orderNum" label="订单编号" width="150">
					</el-table-column>
					<el-table-column prop="orderType" label="订单类型" width="100">
					</el-table-column>
					<el-table-column prop="demand" label="采购方">
					</el-table-column>
					<el-table-column prop="supplier" label="供应商">
					</el-table-column>
					<el-table-column prop="statusName" label="状态" width="100">
					</el-table-column>
					<el-table-column label="操作" width="200">
						<template scope="scope">
							<el-button size="small" type="info" @click="detail(scope.row)">详情</el-button>
							<el-button size="small" type="success" @click="orderSuccess(scope.row)">同意</el-button>
							<el-button size="small" type="warning" @click="orderReject(scope.row)">驳回</el-button>
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
	import { fetchAuditList, getOrderSuccess, getOrderReject } from '@/api/getData'
	export default {
		data() {
			return {
				findForm: {
					demand: '',
					supplier: '',
					status: "1", //审核中
					//orderType: "0", //临采订单类型
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
			detail(row) {
				this.$router.push({
					path: 'detail',
					query: {
						orderId: row.orderId
					}
				})
			},
			modify(row) {
				this.$router.push({
					path: 'modify',
					query: {
						orderId: row.orderId
					}
				})
			},
			find() {
				this.initData();
			},
			async initData() {
				try {
					let page = {
						currentPage: this.currentPage.toString(),
						pageSize: this.limit.toString()
					}
					const returnData = await fetchAuditList({
						search: this.findForm,
						page: page,
					});
					if(returnData.result == "success") {
						this.tableData = [];
						this.count = Number(returnData.page.maxPage);
						returnData.list.forEach((item, index) => {
							const tableData = {};
							tableData.orderId = item.orderId;
							tableData.supplier = item._supplier;
							tableData.demand = item._demand;
							tableData.orderNum = item.orderNum;
							tableData.status = item.status;
							if(item.orderType == "0") {
								tableData.orderType = "临采";
							} else {
								tableData.orderType = "集采";
							}
							if(item.status == "0") {
								tableData.statusName = "未审核";
							} else if(item.status == "-1") {
								tableData.statusName = "驳回";
							} else if(item.status == "1") {
								tableData.statusName = "审核中";
							} else if(item.status == "2") {
								tableData.statusName = "审核通过";
							} else if(item.status == "5") {
								tableData.statusName = "入库成功";
							}
							this.tableData.push(tableData);
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
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.initData();
			},
			async orderSuccessFunction(row) {
				try {
					const returnData = await getOrderSuccess({
						orderId: row.orderId
					});
					if(returnData.result == "success") {
						this.$message({
							type: 'success',
							message: '审核成功!'
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
			orderSuccess(row) {
				this.$confirm('此操作将审核通过订单, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.orderSuccessFunction(row);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消审核操作'
					});
				});

			},
			async orderRejectFunction(row) {
				try {
					let returnData = await getOrderReject({
						orderId: row.orderId
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
			orderReject(row) {
				this.$confirm('此操作将驳回订单, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.orderRejectFunction(row);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消驳回操作'
					});
				});
			}
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