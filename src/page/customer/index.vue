<template>
	<section>
		<el-row>
			<el-col :span="24">
				<div class="tableTitle">客户列表</div>
				<el-form :model="findForm" :inline="true" class="demo-form-inline">
					<el-form-item label="企业名称">
						<el-input placeholder="企业名称" v-model="findForm.name"></el-input>
					</el-form-item>
					<el-button type="primary" @click="find" style="margin-left: 10px;">查询</el-button>
					<el-button type="primary" @click="add">添加</el-button>
				</el-form>

				<el-table :data="tableData" border stripe style="width: 100%">
					<el-table-column prop="companyCode" label="企业编号">
					</el-table-column>
					<el-table-column prop="shortName" label="企业简称">
					</el-table-column>
					<el-table-column prop="name" label="企业名称">
					</el-table-column>
					<el-table-column prop="city" label="城市">
					</el-table-column>
					<el-table-column prop="createDate" label="创建时间">
					</el-table-column>
					<el-table-column label="操作" width="300">
						<template scope="scope">
							<el-button size="small" type="success" @click="toLinkMan(scope.row)">维护联系人</el-button>
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
	import { getMemberList, getMemberDelete } from '@/api/getData'

	export default {
		data() {
			return {
				findForm: {
					name: '',
					typeId: "4",
				},
				tableData: [],
				limit: 10,
				count: 0,
				currentPage: 1,
			};
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
					const stockData = await getMemberList({
						search: this.findForm,
						page: page,
					});
					if(stockData.result == "success") {
						this.tableData = [];
						this.count = Number(stockData.page.maxPage);
						stockData.list.forEach((item, index) => {
							const tableData = {};
							tableData.companyCode = item.companyCode;
							tableData.memberId = item.memberId;
							tableData.name = item.name;
							tableData.city = item.educationName + item.politicsName;
							tableData.shortName = item.shortName;
							tableData.createDate = item.createDate.substr(0, 10);
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
					let returnData = await getMemberDelete({
						memberId: row.memberId
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
						memberId: row.memberId
					}
				})
			},
			detail(row) {
				this.$router.push({
					path: 'detail',
					query: {
						memberId: row.memberId
					}
				})
			},
			find() {
				this.initData();
			},
			toLinkMan(row) {
				this.$router.push({
					path: "/linkman/index",
					query: {
						memberId: row.memberId,
						name: row.name
					}
				})
			},

		}
	}
</script>

<style scoped>
	.el-pagination {
		text-align: center;
		margin-top: 30px;
	}
</style>