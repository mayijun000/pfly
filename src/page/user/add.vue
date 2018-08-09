<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width:800px;margin: 0 auto;">
					<el-form label-width="140px" :label-position="labelPosition" :model="formData" ref="formData" :rules="rules">
						<el-form-item label="手机号" prop="mobile">
							<el-input style="width:250px" v-model="formData.mobile"></el-input>
						</el-form-item>
						<el-form-item label="密码" prop="loginPwd">
							<el-input style="width:250px" v-model="formData.loginPwd"></el-input>
						</el-form-item>
						<el-form-item label="姓名" prop="userName">
							<el-input style="width:250px" v-model="formData.userName"></el-input>
						</el-form-item>
						<el-form-item label="角色" prop="role">
							<el-transfer v-model="formData.roleId" :data="roleData" :props="{key: 'roleId',label: 'roleName'}" :titles="['未选角色', '已选角色']"></el-transfer>
						</el-form-item>
					</el-form>

					<div class="button_submit">
						<el-button type="primary" @click="saveUser('formData')">保存</el-button>
						<el-button type="primary" @click="toBack">取消</el-button>
					</div>
				</el-card>
			</el-col>
		</el-row>

	</section>

</template>

<script>
	import { getRoleList, getUserSave } from '@/api/getData'
	export default {
		data() {
			var checkLinkPhone = (rule, value, callback) => {
				if(!value) {
					callback(new Error('手机号不能为空'));
				} else if(!/^1[3|4|5|7|8][0-9]\d{8}$/.test(value)) {
					callback(new Error('请输入正确的手机号'));
				} else {
					callback()
				}
			};
			return {
				labelPosition: 'right',
				formData: {
					loginPwd: '',
					userName: '',
					mobile: '',
					roleId: [],
					memberId: this.$store.getters.getUser.companyId
				},
				roleData: [],
				rules: {
					mobile: [{
						required: true,
						validator: checkLinkPhone,
						trigger: 'blur'
					}],
					loginPwd: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 50,
							message: '长度在 2到 5 0个字符',
							trigger: 'blur'
						}
					],
					userName: [{
							required: true,
							message: '请输入姓名',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 10,
							message: '长度在 2到 1 0个字符',
							trigger: 'blur'
						}
					]
				}
			};
		},
		created() {
			this.initData();
		},
		methods: {
			async initData() {
				try {
					let page = {
						currentPage: "1",
						pageSize: "100"
					}
					const returnData = await getRoleList({
						search: {
							"roleName": "",
							"sys": ""
						},
						page: page
					});
					if(returnData.result == "success") {
						this.roleData = returnData.list;
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
			saveUser(formData) {
				this.$refs[formData].validate(async(valid) => {
					if(valid) {
						try {
							console.log(this.formData.roleId);
							var data = {
								obj: this.formData,
								roleIds: this.formData.roleId.join(",")
							}

							const result = await getUserSave(data);
							if(result.result == "success") {
								this.$message({
									type: 'success',
									message: '保存成功'
								});
								this.$router.push('index');
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
			toBack() {
				this.$router.go(-1);
			},
		}
	}
</script>

<style scoped>
	.button_submit {
		text-align: center;
		margin-top: 50px;
	}
</style>