<template>

	<section>
		<el-row>
			<el-col :span="24">
				<div class="tableTitle">司机列表</div>
				<el-form :model="findForm" :inline="true" class="demo-form-inline">
					<el-form-item label="姓名">
						<el-input placeholder="姓名" v-model="findForm.userName"></el-input>
					</el-form-item>
					<el-form-item label="手机号">
						<el-input placeholder="手机号" v-model="findForm.mobile"></el-input>
					</el-form-item>
					<el-form-item label="车牌号">
						<el-input placeholder="车牌号" v-model="findForm.carNum"></el-input>
					</el-form-item>
					<el-button type="primary" @click="find" style="margin-left: 10px;">查询</el-button>
					<el-button type="primary" @click="add">添加</el-button>
				</el-form>

				<el-table :data="tableData" border style="width: 100%">
					<el-table-column prop="memberName" label="物流公司">
					</el-table-column>
					<el-table-column prop="userName" label="姓名">
					</el-table-column>
					<el-table-column prop="mobile" label="手机号">
					</el-table-column>
					<el-table-column prop="carNum" label="车牌号">
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
	import { getDriverList, getDriverDelete } from '@/api/getData'
	export default {
		data() {
			return {
				findForm: {
					carNum: "",
					userName: "",
					mobile: ""
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
					const communicateData = await getDriverList({
						search: this.findForm,
						page: page,
					});
					if(communicateData.result == "success") {
						this.tableData = [];
						this.count = Number(communicateData.page.maxPage);
						communicateData.list.forEach((item, index) => {
							const tableData = {};
							tableData.carNum = item.carNum;
							tableData.driverId = item.driverId;
							tableData.userName = item.userName;
							tableData.mobile = item.mobile;
							tableData.memberId = item._memberId;
							tableData.memberName = item.memberName;
							this.tableData.push(tableData);
						})
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
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.initData();
			},
			async handleDeleteData(index, row) {
				try {
					let returnData = await getDriverDelete({
						driverId: row.driverId
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
						driverId: row.driverId
					}
				})
			},
			detail(row) {
				this.$router.push({
					path: 'detail',
					query: {
						driverId: row.driverId
					}
				})
			},
			find() {
				this.initData();
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