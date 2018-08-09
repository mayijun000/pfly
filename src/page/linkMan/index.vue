<template>
	<section>
		<el-row>
			<el-col :span="24">
				<div class="tableTitle">{{this.linkManForm.companyName}}&nbsp;&nbsp;联系人列表</div>
				<el-form :model="findForm" :inline="true" class="demo-form-inline">
					<el-form-item label="姓名">
						<el-input placeholder="姓名" v-model="findForm.name"></el-input>
					</el-form-item>
					<el-form-item label="职务">
						<el-input placeholder="职务" v-model="findForm.post"></el-input>
					</el-form-item>
					<el-form-item label="联系电话">
						<el-input placeholder="联系电话" v-model="findForm.linkPhone"></el-input>
					</el-form-item>
					<el-button type="primary" @click="find" style="margin-left: 10px;">查询</el-button>
					<el-button type="primary" @click="add">添加</el-button>
				</el-form>
				<el-table :data="tableData" border stripe style="width: 100%">
					<el-table-column prop="name" label="姓名">
					</el-table-column>
					<el-table-column prop="post" label="职务">
					</el-table-column>
					<el-table-column prop="linkPhone" label="联系电话">
					</el-table-column>
					<el-table-column label="操作" width="300">
						<template scope="scope">
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
		<el-dialog title="联系人" :visible.sync="dialogFormVisible" top="1%" size="tiny">
			<el-form :model="linkManForm" ref="linkManForm" label-width="100px" :rules="rules">
				<el-form-item label="企业" prop="companyName">
					<span v-model="linkManForm.companyName" style="width:200px;display: block;">{{linkManForm.companyName}}</span>
				</el-form-item>
				<el-form-item label="姓名" prop="name">
					<el-input style="width:195px;" v-model="linkManForm.name"></el-input>
				</el-form-item>
				<el-form-item label="职务" prop="post">
					<el-input style="width:195px;" v-model="linkManForm.post"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" prop="linkPhone">
					<el-input style="width:195px;" v-model="linkManForm.linkPhone" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveLinkMan('linkManForm')">确 定</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { getLinkManList, getLinkManSave, getLinkManDelete } from '@/api/getData'
	export default {
		data() {
			var checkLinkPhone = (rule, value, callback) => {
				if(!value) {
					callback(new Error('联系电话不能为空'));
				} else if(!/^1[3|4|5|7|8][0-9]\d{8}$/.test(value)) {
					callback(new Error('请输入正确的联系电话'));
				} else {
					callback()
				}
			};
			return {

				dialogFormVisible: false,
				findForm: {
					linkPhone: "",
					name: "",
					post: "",
					memberId: this.$route.query.memberId
				},
				linkManForm: {
					memberId: this.$route.query.memberId,
					companyName: this.$route.query.name,
					linkPhone: "",
					name: "",
					post: "",
					contactsId: '',
				},
				tableData: [],
				limit: 10,
				count: 0,
				currentPage: 1,
				rules: {
					post: [{
							required: true,
							message: '请输入职务',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 10,
							message: '长度在 2到 1 0个字符',
							trigger: 'blur'
						}
					],
					name: [{
							required: true,
							message: '请输入姓名',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 10,
							message: '长度在 2到 10个字符',
							trigger: 'blur'
						}
					],
					linkPhone: [{
						required: true,
						validator: checkLinkPhone,
						trigger: 'blur'
					}]
				}
			};
		},
		created() {
			this.initData();
		},
		methods: {
			async initData() {
				try {
					const stockData = await getLinkManList({
						search: this.findForm,
						page: {
							currentPage: this.currentPage.toString(),
							pageSize: this.limit.toString()
						}
					});
					if(stockData.result == "success") {
						this.tableData = [];
						this.count = Number(stockData.page.maxPage);
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
			saveLinkMan(linkManForm) {

				this.$refs[linkManForm].validate(async(valid) => {
					if(valid) {
						try {
							const result = await getLinkManSave(this.linkManForm);
							if(result.result == "success") {
								this.$message({
									type: 'success',
									message: '保存成功'
								});
								this.dialogFormVisible = false;
								this.initData();
							}
						} catch(err) {
							this.$message.error('保存失败');
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
			async handleDeleteData(index, row) {
				try {
					let returnData = await getLinkManDelete({
						contactsId: row.contactsId
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
							message: stockData.message
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
			add() {
				this.dialogFormVisible = true;
			},
			modify(row) {
				this.linkManForm.linkPhone = row.linkPhone;
				this.linkManForm.name = row.name;
				this.linkManForm.post = row.post;
				this.linkManForm.contactsId = row.contactsId;
				this.dialogFormVisible = true;
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