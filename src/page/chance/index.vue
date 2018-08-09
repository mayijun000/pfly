<template>
	<section>
		<el-row>
			<el-col :span="24">
				<div class="tableTitle">项目机会列表</div>
				<el-form :model="findForm" :inline="true" class="demo-form-inline">
					<el-form-item label="企业客户">
						<el-select v-model="findForm.memberId" clearable placeholder="请选择客户">
							<el-option v-for="item in customerList" :key="item.memberId" :label="item.name" :value="item.memberId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="项目名称">
						<el-input placeholder="项目名称" v-model="findForm.projectName"></el-input>
					</el-form-item>
					<el-form-item label="发布时间">
						<el-date-picker v-model="findForm.publishDate" type="date" placeholder="选择日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="采购编号">
						<el-input placeholder="采购编号" v-model="findForm.purchaseNo"></el-input>
					</el-form-item>
					<el-button type="primary" @click="find" style="margin-left: 10px;">查询</el-button>
					<el-button type="primary" @click="add">添加</el-button>

				</el-form>

				<el-table :data="tableData" border stripe style="width: 100%">
					<el-table-column prop="name" label="企业客户">
					</el-table-column>
					<el-table-column prop="projectName" label="项目名称">
					</el-table-column>
					<el-table-column prop="publishDate" label="发布时间">
					</el-table-column>
					<el-table-column prop="purchaseNo" label="采购编号">
					</el-table-column>
					<el-table-column label="操作" width="200">
						<template scope="scope">
							<el-button size="small" type="info" @click="detail(scope.row)">详情</el-button>
							<el-button size="small" type="warning" @click="modify(scope.row)">编辑</el-button>
							<el-button size="small" type="danger" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
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
	import { getChanceList, getChanceDelete, getMemberSelect } from '@/api/getData'
	export default {
		data() {
			return {
				customerList: [],
				findForm: {
					memberId: "",
					publishDate: "",
					projectName: "",
					purchaseNo: "",
				},
				tableData: [],
				limit: 10,
				count: 0,
				currentPage: 1,
			};
		},
		created() {
			this.getMemberSelectData();
			this.initData();
		},
		methods: {
			async getMemberSelectData() {
				try {
					const returnData = await getMemberSelect({
						search: {
							typeId: "4"
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
					if(this.findForm.publishDate != "") {
						this.findForm.publishDate = this.findForm.publishDate.format("yyyy-MM-dd");
					}
					const stockData = await getChanceList({
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
							tableData.chanceId = item.chanceId;
							tableData.memberId = item.memberId;
							tableData.projectName = item.projectName;
							tableData.name = item._memberId;
							tableData.subject = item.subject;
							tableData.publishDate = item.publishDate.substr(0, 10);
							tableData.purchaseNo = item.purchaseNo;
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
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.initData();
			},
			async handleDeleteData(index, row) {
				try {
					let returnData = await getChanceDelete({
						chanceId: row.chanceId
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
			find() {
				this.initData();
			},
			modify(row) {
				this.$router.push({
					path: 'modify',
					query: {
						chanceId: row.chanceId
					}
				})
			},
			detail(row) {
				this.$router.push({
					path: 'detail',
					query: {
						chanceId: row.chanceId
					}
				})
			},
			add() {
				this.$router.push({
					path: 'add'
				})

			}

		}
	}
</script>

<style scoped>
	.el-pagination {
		text-align: center;
		margin-top: 30px;
	}
</style>