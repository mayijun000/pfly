<template>
	<section>
		<el-row>
			<el-col :span="24">
				<div class="tableTitle">企业客户沟通列表</div>
				<el-form :model="findForm" :inline="true" class="demo-form-inline">
					<el-form-item label="企业客户">
						<el-select v-model="findForm.memberId" filterable clearable @change="selectChange" placeholder="请选择客户">
							<el-option v-for="item in customerList" :key="item.memberId" :label="item.name" :value="item.memberId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="联系人">
						<el-select v-model="findForm.contactsId" filterable clearable placeholder="请选择联系人">
							<el-option v-for="item in linkManList" :key="item.contactsId" :label="item.name" :value="item.contactsId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="沟通日期">
						<el-date-picker v-model="findForm.communicationDate" type="date" placeholder="选择日期">
						</el-date-picker>
					</el-form-item>
					<el-button type="primary" @click="find" style="margin-left: 10px;">查询</el-button>
					<el-button type="primary" @click="add">添加</el-button>
				</el-form>

				<el-table :data="tableData" border style="width: 100%">
					<el-table-column prop="memberName" label="企业客户">
					</el-table-column>
					<el-table-column prop="contactsName" label="联系人">
					</el-table-column>
					<el-table-column prop="salerId" label="业务员">
					</el-table-column>
					<el-table-column prop="communicationDate" label="沟通日期">
					</el-table-column>
					<el-table-column prop="content" label="沟通内容">
					</el-table-column>

					<el-table-column label="操作" width="250">
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
	import { getCommunicateList, getCommunicateDelete, getMemberSelect, getLinkManSelect } from '@/api/getData'
	export default {
		data() {
			return {
				customerList: [],
				linkManList: [],
				findForm: {
					memberId: "",
					contactsId: "",
					communicationDate: "",
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
			async getLinkManSelectData() {
				try {
					if(this.findForm.memberId != "") {
						const returnData = await getLinkManSelect({
							memberId: this.findForm.memberId
						});
						this.linkManList = [];
						if(returnData.result == "success") {
							returnData.list.forEach((item, index) => {
								const data = {};
								data.name = item.name;
								data.contactsId = item.contactsId;
								this.linkManList.push(data);
							})
						} else {
							this.$message({
								type: 'error',
								message: returnData.message
							});
						}
					}
				} catch(err) {
					console.log('获取数据失败', err);
				}
			},
			selectChange() {
				this.getLinkManSelectData();
			},
			async getMemberSelectData() {
				try {
					const returnData = await getMemberSelect({
						search: {
							typeId: "4"
						}
					});
					this.customerList = [];
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
					let page = {
						currentPage: this.currentPage.toString(),
						pageSize: this.limit.toString()
					}
					if(this.findForm.communicationDate != "") {
						this.findForm.communicationDate = this.findForm.communicationDate.format("yyyy-MM-dd");
					}
					const communicateData = await getCommunicateList({
						search: JSON.stringify(this.findForm),
						page: page,
					});
					if(communicateData.result == "success") {
						this.tableData = [];
						this.count = Number(communicateData.page.maxPage);
						communicateData.list.forEach((item, index) => {
							const tableData = {};
							tableData.communicationId = item.communicationId;
							tableData.memberName = item.memberName
							tableData.salerId = item.userName;
							tableData.contactsName = item.contactsName;
							tableData.communicationDate = item.communicationDate.substr(0, 10);
							tableData.content = item.content;
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
					let returnData = await getCommunicateDelete({
						communicationId: row.communicationId
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
						communicationId: row.communicationId
					}
				})
			},
			detail(row) {
				this.$router.push({
					path: 'detail',
					query: {
						communicationId: row.communicationId
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