<template>
	<section>
		<el-row>
			<el-col :span="24">
				<div class="tableTitle">集采订单列表</div>
				<el-form :model="findForm" :inline="true" class="demo-form-inline">
					<el-form-item label="采购方">
						<el-input placeholder="采购方" v-model="findForm.demand"></el-input>
					</el-form-item>
					<el-form-item label="供应商">
						<el-input placeholder="供应商" v-model="findForm.supplier"></el-input>
					</el-form-item>
					<el-button type="primary" @click="find" style="margin-left: 10px;">查询</el-button>
					<el-button type="primary" @click="add">添加</el-button>
				</el-form>
				<el-table :data="tableData" border stripe style="width: 100%">
					<el-table-column prop="orderNum" label="订单编号" width="150">
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
							<el-button size="small" type="success" v-show="scope.row.oneStatus" @click="orderStockin(scope.row)">一键入库</el-button>
							<el-button size="small" type="success" v-show="scope.row.submitStatus" @click="orderAudit(scope.row)">提交</el-button>
							<!--<el-button size="small" type="warning" v-show="scope.row.modifyStatus" @click="modify(scope.row)">修改</el-button>-->
						</template>
					</el-table-column>
				</el-table>
				<div class="Pagination" style="text-align: left;margin-top: 10px;">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10" layout="prev, pager, next" :page-count="count">
					</el-pagination>
				</div>
			</el-col>
		</el-row>

	</section>
</template>
<script>
	import { getOrderList,getOrderStockin, getOrderAudit } from '@/api/getData'
	export default {
		data() {
			return {
				findForm: {
					demand: '',
					supplier: '',
					orderType: "1", //集采订单类型
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
			add() {
				this.$router.push({
					path: 'add'
				});
			},
			async initData() {
				try {
					let page = {
						currentPage: this.currentPage.toString(),
						pageSize: this.limit.toString()
					}
					const returnData = await getOrderList({
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
							if(item.status == "0") {
								tableData.statusName = "未审核";
								tableData.oneStatus = false;
								tableData.submitStatus = true;
								tableData.modifyStatus = true;
							} else if(item.status == "-1") {
								tableData.statusName = "驳回";
								tableData.oneStatus = false;
								tableData.submitStatus = true;
								tableData.modifyStatus = true;
							} else if(item.status == "1") {
								tableData.statusName = "审核中";
							} else if(item.status == "2") {
								tableData.statusName = "审核通过";
								tableData.oneStatus = true;
								tableData.submitStatus = false;
								tableData.modifyStatus = false;
							} else if(item.status == "5") {
								tableData.statusName = "入库成功";
								tableData.oneStatus = false;
								tableData.submitStatus = false;
								tableData.modifyStatus = false;
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
			async orderStockinFunction(row) {
				try {
					let returnData = await getOrderStockin({
						orderId: row.orderId
					});
					if(returnData.result == "success") {
						this.$message({
							type: 'success',
							message: '入库成功!'
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
			orderStockin(row) {
				this.$confirm('此操作将订单入库, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.orderStockinFunction(row);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消入库操作'
					});
				});

			},
			async orderAuditFunction(row) {
				try {
					const returnData = await getOrderAudit({
						orderId: row.orderId
					});
					if(returnData.result == "success") {
						this.$message({
							type: 'success',
							message: '提交成功!'
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
			orderAudit(row) {
				this.$confirm('此操作将提交订单审核, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.orderAuditFunction(row);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消提交操作'
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