<template>
	<section>
		<el-row>
			<el-col :span="24">
				<div class="tableTitle">用户列表</div>
				<el-form :model="findForm" :inline="true" class="demo-form-inline">
					<el-form-item label="姓名">
						<el-input placeholder="姓名" v-model="findForm.userName"></el-input>
					</el-form-item>
					<el-button type="primary" @click="find" style="margin-left: 10px;">查询</el-button>
					<el-button type="primary" @click="add">添加</el-button>
				</el-form>

				<el-table :data="tableData" border stripe style="width: 100%">
					<el-table-column prop="loginName" label="登录名">
					</el-table-column>
					<el-table-column prop="userName" label="姓名">
					</el-table-column>
					<el-table-column prop="mobile" label="手机号">
					</el-table-column>
					<el-table-column label="操作" width="300">
						<template scope="scope">
							<el-button size="small" type="info" @click="dialogFormVisible = true">修改密码</el-button>
							<el-button size="small" type="warning" @click="modify(scope.row)">编辑</el-button>
							<el-button size="small" type="danger" v-show="scope.row.noDelete" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
						</template>
					</el-table-column>

				</el-table>
				<div class="block">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10" layout="prev, pager, next" :page-count="count">
					</el-pagination>
				</div>
			</el-col>
		</el-row>
		<el-dialog title="修改密码" :visible.sync="dialogFormVisible" top="1%" size="tiny">
			<el-form :model="passForm" ref="passForm" label-width="100px" :rules="passRules">
				<el-form-item label="旧密码" prop="oldpwd">
					<el-input style="width:195px;" v-model="passForm.oldpwd"></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="newpwd">
					<el-input style="width:195px;" v-model="passForm.newpwd"></el-input>
				</el-form-item>
				<el-form-item label="确认新密码" prop="confim">
					<el-input style="width:195px;" v-model="passForm.confim"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="savePass('passForm')">确 定</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { getUserList, getUserDelete, updatepwd } from '@/api/getData'

	export default {
		data() {
			var validatePass2 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请再次输入密码'));
				} else if(value !== this.passForm.newpwd) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				dialogFormVisible: false,
				findForm: {
					userName: '',
					companyId: this.$store.getters.getUser.companyId,
				},
				passForm: {
					oldpwd: "",
					newpwd: "",
					confim: "",
				},
				passRules: {
					oldpwd: [{
						required: true,
						message: '请输入旧密码',
						trigger: 'blur'
					}, ],
					newpwd: [{
						required: true,
						message: '请输入新密码',
						trigger: 'blur'
					}, ],
					confim: [{
						required: true,
						validator: validatePass2,
						trigger: 'blur'
					}],
				},
				tableData: [],
				limit: 10,
				count: 0,
				currentPage: 1,
			};
		},
		created() {
			//this.user = this.$store.getters.getUser;
			this.initData();
		},
		methods: {
			async initData() {
				try {
					let page = {
						currentPage: this.currentPage.toString(),
						pageSize: this.limit.toString()
					}
					const stockData = await getUserList({
						companyId: this.findForm.companyId,
						search: this.findForm,
						page: page,
					});
					if(stockData.result == "success") {
						stockData.list.forEach(item => {
							if(item.userId == "1" || item.companyId == "1" || item.userId == item.companyId) {
								item.noDelete = false;
							} else {
								item.noDelete = true;
							}
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
					let returnData = await getUserDelete({
						userId: row.userId
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
						userId: row.userId
					}
				})
			},
			find() {
				this.initData();
			},
			savePass(passForm) {
				this.$refs[passForm].validate(async(valid) => {
					if(valid) {
						try {
							const result = await updatepwd(this.passForm);
							if(result.result == "success") {
								this.$message({
									type: 'success',
									message: '修改成功'
								});
								this.dialogFormVisible = false;
							} else {
								this.$message({
									message: result.message,
									type: 'error'
								});
							}
						} catch(err) {
							this.$message.error('修改失败');
							console.log('获取数据失败', err);
						}
					} else {
						this.$notify.error({
							title: '错误',
							message: '请检查输入是否正确',
							offset: 100
						});
						return false;
					}
				});
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