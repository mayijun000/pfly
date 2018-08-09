<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width:800px;margin: 0 auto;">
					<el-form label-width="140px" :rules="rules" :label-position="labelPosition" :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
						<el-form-item label="企业客户">
							<el-select style="width:200px" filterable @change="selectChange" v-model="formInline.memberId" placeholder="请选择企业客户">
								<el-option v-for="item in customerList" :key="item.memberId" :label="item.name" :value="item.memberId">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="联系人" prop="contactsId">
							<el-select style="width:200px" filterable v-model="formInline.contactsId" placeholder="请选择联系人">
								<el-option v-for="item in linkManList" :key="item.contactsId" :label="item.name" :value="item.contactsId">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="业务员">
							<span v-model="formInline.salerId" style="width:200px;display: block;">{{user.userName}}</span>
						</el-form-item>
						<el-form-item label="沟通日期" prop="communicationDate">
							<el-date-picker style="width:200px;" v-model="formInline.communicationDate" type="date" placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="沟通内容" prop="content">
							<el-input type="textarea" placeholder="请输入内容" style="width:555px" v-model="formInline.content">
							</el-input>
						</el-form-item>
					</el-form>

					<div class="button_submit">
						<el-button type="primary" @click="saveCommunicate('formInline')">保存</el-button>
						<el-button type="primary" @click="toBack">取消</el-button>
					</div>
				</el-card>
			</el-col>
		</el-row>
	</section>
</template>

<script>
	import { getCommunicateSave, getMemberSelect, getLinkManSelect } from '@/api/getData'
	import { getStore } from '@/config/mUtils'
	export default {
		data() {
			return {
				customerList: [],
				linkManList: [],
				labelPosition: 'right',
				formInline: {
					memberId: '',
					salerId: '',
					contactsId: '',
					communicationDate: '',
					content: '',
				},
				user: {},
				rules: {
					contactsId: [{
						required: true,
						message: '请选择联系人'
					}],
					communicationDate: [{
						required: true,
						message: '请选择沟通日期'
					}],
					content: [{
							required: true,
							message: '请输入内容',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 2000,
							message: '长度在 2到 2000个字符',
							trigger: 'blur'
						}
					]
				}
			}
		},
		created() {
			this.getMemberSelectData();
			this.user = JSON.parse(getStore("user"));
		},
		methods: {
			async getLinkManSelectData() {
				try {
					if(this.formInline.memberId != "") {
						const returnData = await getLinkManSelect({
							memberId: this.formInline.memberId
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
						this.formInline.memberId = returnData.list[0].memberId;
						this.getLinkManSelectData();
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
			toBack() {
				this.$router.go(-1);
			},
			saveCommunicate(formInline) {
				this.$refs[formInline].validate(async(valid) => {
					if(valid) {
						try {
							let data = {
								memberId: this.formInline.memberId,
								salerId: this.user.userId,
								contactsId: this.formInline.contactsId,
								communicationDate: this.formInline.communicationDate.format('yyyy-MM-dd'),
								content: this.formInline.content,
							}

							const result = await getCommunicateSave(data);
							if(result.result == "success") {
								this.$message({
									type: 'success',
									message: '保存成功'
								});
								this.$router.push('index');

							} else {
								this.$message({
									type: 'error',
									message: result.message
								});
							}
						} catch(err) {
							console.log(err)
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
			}
		}
	}
</script>

<style scoped>
	.button_submit {
		text-align: center;
		margin-top: 50px;
	}
</style>