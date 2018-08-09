<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width:1000px;margin: 0 auto;">
					<el-form :model="formData" ref="formData" label-width="300px" class="demo-formData">
						<el-form-item label="计划周期">
							<el-select style="width:100px" @change="dateChange" v-model="formData.requirementType" placeholder="请选择日期">
								<el-option v-for="item in requirementDateList" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
							<el-date-picker style="width:146px" v-model="formData.week" v-show="weekShow" type="week" format="yyyy 第 WW 周" placeholder="选择周">
							</el-date-picker>
							<el-date-picker style="width:146px" v-model="formData.month" v-show="monthShow" type="month" placeholder="选择月">
							</el-date-picker>
							<el-date-picker style="width:146px" v-model="formData.year" v-show="yearShow" align="right" type="year" placeholder="选择年">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="需求方">
							<span v-model="formData.memberName" style="width:200px;display: block;">{{companyInfo.name}}</span>
						</el-form-item>
						<el-form-item label="说明">
							<el-input style="width:250px" v-model="formData.remark"></el-input>
						</el-form-item>

						<el-form-item label="标的物" style="background-color: #f5f5f5;" label-width="100px">
							<el-button @click="addProduct" size="small" type="primary">添加产品</el-button>
						</el-form-item>
						<el-table :data="productData" style="width:100%;margin-bottom: 20px;" align="center">
							<el-table-column label="产品名称" prop="name">
							</el-table-column>
							<el-table-column label="材质" prop="material">
							</el-table-column>
							<el-table-column label="规格型号" prop="specifiModel">
							</el-table-column>
							<el-table-column label="单位" prop="unitId">
							</el-table-column>
							<el-table-column label="数量" prop="number">
							</el-table-column>
							<el-table-column label="单价" prop="productPrice">
							</el-table-column>
							<el-table-column label="金额" prop="totalAmount">
							</el-table-column>
							<el-table-column label="操作">
								<template scope="scope">
									<el-button size="small" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
						<div class="button_submit">
							<el-button type="primary" @click="saveRequirement('formData')">保存</el-button>
							<el-button type="primary" @click="toBack">取消</el-button>
						</div>
					</el-form>
				</el-card>
			</el-col>
		</el-row>
		<el-dialog title="添加产品" :visible.sync="dialogFormVisible" top="1%" size="tiny">
			<el-form :model="productForm" :rules="productRules" ref="productForm" label-width="100px">
				<el-form-item label="产品分类">
					<el-select v-model="productForm.category" placeholder="请选择产品分类" @visible-change="selectChange">
						<el-option v-for="item in classifiCation" :key="item.classifiCationId" :label="item.name" :value="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="产品名称">
					<el-select v-model="productForm.productName" placeholder="请选择产品名称" @visible-change="selectChangeProduct">
						<el-option v-for="item in productNameData" :key="item.classifiCationId" :label="item.name" :value="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="材质">
					<el-select v-show="yes_meterial" v-model="productForm.meterial" placeholder="请选择材质">
						<el-option v-for="item in meterialData" :key="item.classifiCationId" :label="item.name" :value="item"></el-option>
					</el-select>
					<span v-show="no_meterial" style="color:#ff4949;">该产品下没有材质，无需选择</span>
				</el-form-item>
				<el-form-item label="规格型号">
					<el-select v-show="yes_spec" v-model="productForm.spec" placeholder="请选择规格型号">
						<el-option v-for="item in specData" :key="item.classifiCationId" :label="item.name" :value="item"></el-option>
					</el-select>
					<span v-show="no_spec" style="color:#ff4949;">该产品下没有型号，无需选择</span>
				</el-form-item>
				<el-form-item label="单位" prop="unitId">
					<el-select v-model="productForm.unitId" placeholder="请选择单位">
						<el-option label="吨" value="吨"></el-option>
						<el-option label="件" value="件"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="数量" prop="number">
					<el-input style="width:195px;" v-model="productForm.number" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="单价" prop="productPrice">
					<el-input style="width:195px;" v-model="productForm.productPrice" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveProduct('productForm')">确 定</el-button>
			</div>
		</el-dialog>
	</section>

</template>

<script>
	import { getClassification, getRequirementSave, queryProductExistence } from '@/api/getData';
	import { getStore } from '@/config/mUtils'
	export default {
		data() {
			var checkNumber = (rule, value, callback) => {
				if(!value) {
					callback(new Error('数量不能为空'));
				} else if(!/^[0-9]{1,20}(.[0-9]{0,3})?$/.test(value)) {
					callback(new Error('请输入正确的数字格式'));
				} else {
					callback();
				}
			};
			var checkPrice = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('单价不能为空'));
				} else if(!/^[0-9]{1,20}(.[0-9]{0,3})?$/.test(value)) {
					return callback(new Error('请输入正确的数字格式'));
				} else {
					callback();
				}
			};
			return {
				user: {},
				companyInfo: {},
				dialogFormVisible: false,
				yes_meterial: true,
				no_meterial: false,
				yes_spec: true,
				no_spec: false,
				weekShow: true,
				monthShow: false,
				yearShow: false,
				requirementDateList: [{
						label: "年",
						value: "1"
					},
					{
						label: "月",
						value: "2"
					},
					{
						label: "周",
						value: "3"
					},
				],
				//分类数据
				parentClassifiCationId: '',
				classifiCation: [],
				productNameData: [],
				meterialData: [],
				specData: [],

				productData: [],
				formData: {
					requirementType: '3',
					week: '',
					month: '',
					year: '',
					memberId: '',
					memberName: '',
					remark: '',
				},
				productForm: {
					category: '',
					productName: '',
					meterial: '',
					spec: '',
					unitId: '',
					number: '',
					productPrice: '',
					demand: '',
					remark: '',
				},
				productRules: {
					number: [{
						required: true,
						validator: checkNumber,
						trigger: 'blur'
					}, ],
					productPrice: [{
						required: true,
						validator: checkPrice,
						trigger: 'blur'
					}, ],
					unitId: [{
						required: true,
						message: '请选择单位',
						trigger: 'blur'
					}]
				},
			}
		},
		created() {
			this.user = this.$store.getters.getUser;
			this.companyInfo = this.$store.getters.getCompany;
		},
		methods: {
			dateChange(value) {
				if(value == "1") {
					this.yearShow = true;
					this.monthShow = false;
					this.weekShow = false;
				} else if(value == "2") {
					this.yearShow = false;
					this.monthShow = true;
					this.weekShow = false;
				} else {
					this.yearShow = false;
					this.monthShow = false;
					this.weekShow = true;
				}
			},
			//一级分类
			async getParentClassificationId(id) {
				try {
					if(this.parentClassifiCationId == "") {
						const returnData = await getClassification({
							"parentId": id,
						});
						if(returnData.result == "success") {
							this.parentClassifiCationId = returnData.list[0].classifiCationId;
							this.getClassificationData(returnData.list[0].classifiCationId);
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
			selectChange(value) {
				if(!value) {
					this.getProductNameData(this.productForm.category.classifiCationId);
				}
			},
			selectChangeProduct(value) {
				if(!value) {
					this.getMeterialData(this.productForm.productName.classifiCationId);
				}
			},
			//二级分类
			async getClassificationData(id) {
				try {

					if(this.classifiCation.length == 0) {
						const returnData = await getClassification({
							"parentId": id,
						});
						if(returnData.result == "success") {
							this.classifiCation = returnData.list;
							this.productForm.category = returnData.list[0];
							this.getProductNameData(returnData.list[0].classifiCationId);
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
			//三级分类
			async getProductNameData(id) {
				try {
					const returnData = await getClassification({
						"parentId": id,
					});
					this.productNameData = [];
					if(returnData.result == "success") {
						this.productNameData = returnData.list;
						this.productForm.productName = returnData.list[0];
						this.getMeterialData(returnData.list[0].classifiCationId);
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
			//四级分类
			async getMeterialData(id) {
				try {
					const returnData = await getClassification({
						"parentId": id,
					});
					this.meterialData = [];
					this.specData = [];
					if(returnData.result == "success") {
						returnData.list.forEach((item, index) => {
							if(item.level == "3") {
								let data = {};
								data.classifiCationId = item.classifiCationId;
								data.name = item.name;
								this.meterialData.push(data);
							} else {
								let data = {};
								data.classifiCationId = item.classifiCationId;
								data.name = item.name;
								this.specData.push(data);
							}
						});
						if(this.meterialData.length == 0) {
							this.yes_meterial = false;
							this.no_meterial = true;
						} else {
							this.yes_meterial = true;
							this.no_meterial = false;
						}
						if(this.specData.length == 0) {
							this.yes_spec = false;
							this.no_spec = true;
						} else {
							this.yes_spec = true;
							this.no_spec = false;
						}
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
			addProduct() {
				this.getParentClassificationId("0");
				this.dialogFormVisible = true;
			},
			toBack() {
				this.$router.go(-1);
			},
			saveProduct(formName) {

				this.$refs[formName].validate(async(valid) => {
					if(valid) {
						//检查产品是否存在
						const returnData = await queryProductExistence({
							"classificationId": this.productForm.category.classifiCationId,
							"productName": this.productForm.productName.name,
							"material": this.productForm.meterial.name,
							"specifiModel": this.productForm.spec.name
						});
						if(returnData.result == "success") {
							if(returnData.list.length != 0) {
								let productItem = {
									productId: returnData.list[0].id,
									name: this.productForm.productName.name,
									material: this.productForm.meterial.name,
									specifiModel: this.productForm.spec.name,
									unitId: this.productForm.unitId,
									number: this.productForm.number,
									productPrice: this.productForm.productPrice,
									manufactor: this.productForm.manufactor,
									remarks: this.productForm.remarks,

								}
								productItem.totalAmount = parseFloat(this.productForm.number * this.productForm.productPrice).toFixed(2);
								this.productData.push(productItem);
								this.dialogFormVisible = false;
							} else {
								this.$notify.error({
									title: '错误',
									message: '选择的产品不存在，请重新选择',
									offset: 100
								});
							}
						} else {
							this.$message({
								type: 'error',
								message: returnData.message
							});
						}

					}
				});

			},
			saveRequirement(formData) {
				this.$refs[formData].validate(async(valid) => {
					if(valid) {
						try {
							let data = {};
							data.memberId = this.user.companyId;
							data.remark = this.formData.remark;
							//计划周期
							if(this.formData.requirementType == "1") {
								data.year = this.formData.year.getFullYear();
							} else if(this.formData.requirementType == "2") {
								data.year = this.formData.month.getFullYear();
								data.month = this.formData.month.getMonth() + 1;
							} else {
								data.year = this.formData.week.getFullYear();
								data.week = this.formData.week.getWeekNumber();
							}
							//对象复制
							Object.assign(data, {
								itemList: this.productData
							});
							const result = await getRequirementSave(data);
							if(result.result == "success") {
								this.$message({
									type: 'success',
									message: '保存成功'
								});
								this.$router.push('index');
							}
						} catch(err) {
							this.$message({
								type: 'error',
								message: result.message
							});
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
			//删除一行的方法
			handleDelete(index) {
				//传入form表单的对象
				this.productData.splice(index, 1);
			},
		}
	}
</script>

<style scoped>
	.demo-formData .el-input,
	.demo-formData .el-input__inner {
		width: 360px;
		display: inline-block;
	}
	
	.demo-formData .el-date-editor.el-input {
		width: 360px;
	}
	
	.el-input,
	.el-input__inner {
		width: 360px;
		display: inline-block;
	}
	
	.button_submit {
		text-align: center;
		margin-top: 50px;
	}
</style>