<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="text-align: center;">
					<el-form style="width:80%;margin: 0 auto;" label-width="200px" :inline="true" :model="chanceForm" ref="chanceForm" :rules="rules">
						<el-form-item label="企业客户" style="margin-left: -150px;">
							<el-select style="width:150px" v-model="chanceForm.memberId" placeholder="请选择客户">
								<el-option v-for="item in customerList" :key="item.memberId" :label="item.name" :value="item.memberId">
								</el-option>
							</el-select>
							<el-button type="primary" @click="toCustomer">一键维护联系人</el-button>
						</el-form-item>
						<el-form-item label="项目名称" prop="projectName">
							<el-input style="width:295px" v-model="chanceForm.projectName"></el-input>
						</el-form-item>
						<el-form-item label="发布时间" style="margin-left: -150px;" prop="publishDate">
							<el-date-picker style="width:285px" v-model="chanceForm.publishDate" type="date" placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="采购编号" prop="purchaseNo">
							<el-input style="width:295px" v-model="chanceForm.purchaseNo"></el-input>
						</el-form-item>
						<el-form-item label="招标正文" style="margin-left: -150px;" prop="content">
							<div class="edit_container">
								<quill-editor v-model="chanceForm.content" ref="myQuillEditor" class="editer" :options="editorOption" @ready="onEditorReady($event)">
								</quill-editor>
							</div>
						</el-form-item>
					</el-form>

					<div class="button_submit">
						<el-button type="primary" @click="saveChance('chanceForm')">保存</el-button>
						<el-button type="primary" @click="toBack">取消</el-button>
					</div>
				</el-card>
			</el-col>
		</el-row>
	</section>

</template>

<script>
	import { quillEditor } from 'vue-quill-editor'
	import { getChanceInfo, getChanceSave, getMemberSelect } from '@/api/getData'
	export default {
		data() {
			return {
				customerList: [],
				chanceForm: {
					chanceId: '',
					memberId: '',
					projectName: '',
					purchaseNo: '',
					publishDate: '',
					content: '',
				},
				editorOption: {

				},
				rules: {
					projectName: [{
							required: true,
							message: '请输入统项目名称',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 50,
							message: '长度在 2到 5 0个字符',
							trigger: 'blur'
						}
					],
					purchaseNo: [{
							required: true,
							message: '请输入采购编号',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 50,
							message: '长度在2到 5 0个字符',
							trigger: 'blur'
						}
					],
					content: [{
							required: true,
							message: '请输入招标正文',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 20000,
							message: '长度在 2到 20000个字符',
							trigger: 'blur'
						}
					],
					publishDate: [{
						required: true,
						message: '请选择发布时间'
					}]
				}
			}
		},
		components: {
			quillEditor,
		},
		computed: {
			editor() {
				return this.$refs.myQuillEditor.quill
			}
		},
		mounted() {
			this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler);
		},
		created() {
			this.getMemberSelectData();
			this.initData();
		},
		methods: {
			imgHandler() {
				//alert();
			},
//			onEditorReady(editor) {
//				console.log('editor ready!', editor)
//			},
			toBack() {
				this.$router.go(-1);
			},
			async getMemberSelectData() {
				try {
					const returnData = await getMemberSelect({
						search: {
							typeId: "4"
						}
					});
					if(returnData.result == "success") {
						this.chanceForm.memberId = returnData.list[0].memberId;
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
					const returnData = await getChanceInfo({
						chanceId: this.$route.query.chanceId
					});
					if(returnData.result == "success") {
						let item = returnData.obj;
						this.chanceForm.chanceId = item.chanceId;
						this.chanceForm.memberId = item.memberId;
						this.chanceForm.projectName = item.projectName;
						this.chanceForm.content = item.content;
						this.chanceForm.purchaseNo = item.purchaseNo;
						this.chanceForm.publishDate = item.publishDate;
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
			saveChance(chanceForm) {
				console.log(this.chanceForm.content);
				this.$refs[chanceForm].validate(async(valid) => {
					if(valid) {
						try {
							if(typeof(this.chanceForm.publishDate) != "string") {
								this.chanceForm.publishDate = this.chanceForm.publishDate.format('yyyy-MM-dd');
							}
							this.chanceForm.content = this.chanceForm.content.replace(/\"/g, "'").replace(/=/g, "$$");
							const result = await getChanceSave(this.chanceForm);
							if(result.result == "success") {
								this.$message({
									type: 'success',
									message: '保存成功'
								});
								this.$router.push('index');
							}else{
								this.$message({
									type: 'error',
									message: result.message
								});
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
			toCustomer() {
				this.$router.push({
					path: "/customer/index"
				})
			},

		}
	}
</script>

<style scoped>
	.edit_container {
		margin-bottom: 40px;
	}
	
	.editer {
		height: 350px;
		width: 780px;
		line-height: initial;
	}
	
	.button_submit {
		text-align: center;
		margin-top: 50px;
	}
</style>