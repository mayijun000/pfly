<template>
	<section>
		<el-row>
			<el-col :span="24">
				<div class="tableTitle">客户结算列表</div>
				<el-form :model="findForm" :inline="true" class="demo-form-inline">
					<el-form-item label="结算单号">
						<el-input placeholder="结算单号" v-model="findForm.balanceNum"></el-input>
					</el-form-item>
					<el-button type="primary" @click="query" style="margin-left: 10px;">查询</el-button>
					<el-button type="primary" @click="add">添加</el-button>
				</el-form>
				<el-table :data="tableData" border stripe style="width: 100%">
					<el-table-column prop="balanceNum" label="结算单号">
					</el-table-column>
					<el-table-column prop="createUserName" label="创建人">
					</el-table-column>
					<el-table-column prop="createDate" label="创建日期">
					</el-table-column>
					<el-table-column prop="status" label="状态">
					</el-table-column>
					<el-table-column label="操作" width="250">
						<template scope="scope">
							<el-button size="small" type="success" v-show="scope.row.successStatus" @click="settlement(scope.$index,scope.row)">申请结算</el-button>
							<el-button size="small" type="info" @click="detail(scope.row)">详情</el-button>
							<el-button size="small" type="warning" v-show="scope.row.successStatus" @click="modify(scope.row)">编辑</el-button>
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
	import { getBalanceList, getBalanceAudit } from '@/api/getData'
	export default {
		data() {
			return {
				findForm: {
					balanceNum: '',
					//客户结算
					feeType: "1"
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
					const stockData = await getBalanceList({
						search: this.findForm,
						page: page,
					});
					if(stockData.result == "success") {
						this.tableData = [];
						this.count = Number(stockData.page.maxPage);
						stockData.list.forEach((item, index) => {
							const tableData = {};
							tableData.number = item.number;
							tableData.createDate = item.createDate.substr(0, 10);
							tableData.balanceNum = item.balanceNum;
							tableData.balanceId = item.balanceId;
							tableData.memberId = item.memberId;
							tableData.name = item.name;
							tableData.balanceDate = item.balanceDate;
							tableData.createUserName = item.createUserName
							if(item.status == "-1") {
								tableData.status = "驳回";
								tableData.successStatus = true;
							} else if(item.status == "0") {
								tableData.status = "未提交";
								tableData.successStatus = true;
							} else if(item.status == "1") {
								tableData.status = "审核中";
								tableData.successStatus = true;
							} else {
								tableData.status = "审核通过";
								tableData.successStatus = true;
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
			//查询
			query() {
				this.initData();
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
						balanceId: row.balanceId
					}
				});
			},
			detail(row) {
				this.$router.push({
					path: 'detail',
					query: {
						balanceId: row.balanceId
					}
				});
			},

			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.initData();
			},
			async getDeliveryAuditData(index, row) {
				try {
					let returnData = await getBalanceAudit({
						balanceId: row.balanceId
					});
					if(returnData.result == "success") {
						this.tableData.splice(index, 1);
						this.$message({
							message: "提交结算审核成功！",
							type: 'success'
						});
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
			//结算
			settlement(index, row) {
				this.$confirm('结算后将不可更改, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.getDeliveryAuditData(index, row);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消结算操作'
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