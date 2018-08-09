<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width:1000px;margin: 0 auto;">
					<el-form :model="formData" ref="formData" :rules="rules" label-width="300px" class="demo-formData">
						<el-form-item label="基本信息" style="background-color: #f5f5f5;" label-width="100px">

						</el-form-item>
						<el-form-item label="采购方">
							<span v-model="formData.demandName" style="width:200px;display: block;">{{companyInfo.name}}</span>
						</el-form-item>
						<el-form-item label="供应商">
							<el-select style="width:250px" v-model="formData.supplier" filterable placeholder="请选择供应商">
								<el-option v-for="item in customerList" :key="item.memberId" :label="item.name" :value="item.memberId">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="签订地点" prop="signAddr">
							<el-input style="width:250px" v-model="formData.signAddr"></el-input>
						</el-form-item>
						<el-form-item label="签订日期" prop="signDate">
							<el-date-picker style="width:250px" v-model="formData.signDate" type="date" placeholder="选择日期">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="标的物" style="background-color: #f5f5f5;" label-width="100px">
							<el-button @click="addProduct" size="small" type="primary">添加产品</el-button>
						</el-form-item>
						<el-table :data="productData" style="width:100%;margin-bottom: 20px;" align="center">
							<el-table-column label="产品名称" prop="productName">
							</el-table-column>
							<el-table-column label="材质" prop="meterialName">
							</el-table-column>
							<el-table-column label="规格型号" prop="specName">
							</el-table-column>
							<el-table-column label="单位" prop="unitId">
							</el-table-column>
							<el-table-column label="数量" prop="number">
							</el-table-column>
							<el-table-column label="单价" prop="price">
							</el-table-column>
							<el-table-column label="金额" prop="totalAmount">
							</el-table-column>
							<el-table-column label="厂商备注" prop="manufactor">
							</el-table-column>
							<el-table-column label="备注" prop="remarks">
							</el-table-column>
							<el-table-column label="操作">
								<template scope="scope">
									<el-button size="small" type="danger" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-form>
					<div class="button_submit">
						<el-button type="primary" @click="saveOrder('formData')">保存订单</el-button>
						<el-button type="primary" @click="toBack">取消</el-button>
					</div>
				</el-card>
			</el-col>
		</el-row>
		<el-dialog title="添加产品" :visible.sync="dialogFormVisible" top="1%" size="tiny">
			<el-form :model="productForm" :rules="productRules" ref="productForm" label-width="100px">
				<el-form-item label="产品分类">
					<el-select v-model="productForm.category" placeholder="请选择产品分类" @visible-change="selectChange">
						<el-option v-for="item in classifiCation" :key="item.classifiCationId" :label="item.name" :value="item.classifiCationId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="产品名称">
					<el-select v-model="productForm.productName" placeholder="请选择产品名称" @visible-change="selectChangeProduct">
						<el-option v-for="item in productNameData" :key="item.classifiCationId" :label="item.name" :value="item.classifiCationId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="材质">
					<el-select v-show="yes_meterial" v-model="productForm.meterial" placeholder="请选择材质">
						<el-option v-for="item in meterialData" :key="item.classifiCationId" :label="item.name" :value="item.name"></el-option>
					</el-select>
					<span v-show="no_meterial" style="color:#ff4949;">该产品下没有材质，无需选择</span>
				</el-form-item>
				<el-form-item label="规格型号">
					<el-select v-show="yes_spec" v-model="productForm.spec" placeholder="请选择规格型号">
						<el-option v-for="item in specData" :key="item.classifiCationId" :label="item.name" :value="item.name"></el-option>
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
				<el-form-item label="单价" prop="price">
					<el-input style="width:195px;" v-model="productForm.price" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="厂商要求">
					<el-input style="width:195px;" v-model="productForm.manufactor" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input style="width:195px;" v-model="productForm.remarks" auto-complete="off"></el-input>
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
	import { getClassification, getOrderSave, queryProductExistence, getMemberSelect } from '@/api/getData';
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
					callback(new Error('单价不能为空'));
				} else if(!/^[0-9]{1,20}(.[0-9]{0,3})?$/.test(value)) {
					callback(new Error('请输入正确的数字格式'));
				} else {
					callback();
				}
			};
			return {
				dialogFormVisible: false,
				yes_meterial: true,
				no_meterial: false,
				yes_spec: true,
				no_spec: false,
				customerList:[],
				productData: [],
				companyInfo: {},
				//分类数据
				parentClassifiCationId: '',
				classifiCation: [],
				productNameData: [],
				meterialData: [],
				specData: [],
				formData: {
					orderType:"0",
					signDate: '',
					signAddr: '',
					orderNum: '',
					supplier: '',
					demand: '',
					status: '0',
					statusName: "",
				},
				productForm: {
					category: '',
					productName: '',
					meterial: '',
					spec: '',
					unitId: '',
					number: '',
					price: '',
					manufactor: '',
					remarks: '',
				},
				rules: {
					signAddr: [{
							required: true,
							message: '请输入签订地点',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 50,
							message: '长度在 2到 50个字符',
							trigger: 'blur'
						}
					],
					signDate: [{
						required: true,
						message: '请选择签订日期'
						/*,
												trigger: 'change'*/
					}]
				},
				productRules: {
					number: [{
						required: true,
						validator: checkNumber,
						trigger: 'blur'
					}, ],
					price: [{
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
			this.getMemberSelectData();
			this.companyInfo = this.$store.getters.getCompany;
		},
		methods: {
			async getMemberSelectData() {
				try {
					const returnData = await getMemberSelect({
						search: {
							typeId: "3"
						}
					});
					if(returnData.result == "success") {
						if(returnData.list.length > 0) {
							this.formData.supplier = returnData.list[0].memberId;
							returnData.list.forEach((item, index) => {
								const data = {};
								data.name = item.name;
								data.memberId = item.memberId;
								this.customerList.push(data);
							})
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
					this.productForm.spec = "";
					this.productForm.meterial = "";
					this.getProductNameData(this.productForm.category);
				}
			},
			selectChangeProduct(value) {
				if(!value) {
					this.productForm.spec = "";
					this.productForm.meterial = "";
					this.getMeterialData(this.productForm.productName);
				}
			},
			//二级分类
			async getClassificationData(id) {
				try {
					if(this.classifiCation.length == 0) {
						const returnData = await getClassification({
							"parentId": id,
						});
						this.classifiCation = [];
						if(returnData.result == "success") {
							this.productForm.category = returnData.list[0].classifiCationId;
							this.classifiCation = returnData.list;
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
						this.productForm.productName = returnData.list[0].classifiCationId;
						this.productNameData = returnData.list;
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
								let data1 = {};
								data1.classifiCationId = item.classifiCationId;
								data1.name = item.name;
								this.specData.push(data1);
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
			//删除一行的方法
			handleDelete(index, row) {
				//计算总金额
				this.formData.totalAmount = (parseFloat(this.formData.totalAmount) - parseFloat(row.number * row.price)).toFixed(2);
				//传入form表单的对象
				this.productData.splice(index, 1);
			},
			async saveProduct(formName) {
				this.$refs[formName].validate(async(valid) => {
					if(valid) {
						let productName = "";
						this.productNameData.forEach(item => {
							if(item.classifiCationId == this.productForm.productName) {
								productName = item.name;
								return false;
							}
						});
						//检查产品是否存在
						const returnData = await queryProductExistence({
							"classificationId": this.productForm.category,
							"productName": productName,
							"material": this.productForm.meterial,
							"specifiModel": this.productForm.spec
						});
						if(returnData.result == "success") {
							if(returnData.list.length != 0) {
								const productItem = {
									productId: returnData.list[0].id,
									productName: productName,
									meterialName: this.productForm.meterial,
									specName: this.productForm.spec,
									unitId: this.productForm.unitId,
									number: this.productForm.number,
									price: this.productForm.price,
									manufactor: this.productForm.manufactor,
									remarks: this.productForm.remarks,
								}
								productItem.totalAmount = parseFloat(this.productForm.number * this.productForm.price).toFixed(2);
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
			saveOrder(formData) {
				this.$refs[formData].validate(async(valid) => {
					if(valid) {
						try {
							if(typeof(this.formData.signDate) != "string") {
								this.formData.signDate = this.formData.signDate.format('yyyy-MM-dd');
							}
							this.formData.demand = this.companyInfo.companyId;
							//对象复制
							Object.assign(this.formData, {
								itemList: this.productData
							});
							const result = await getOrderSave(this.formData);
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
			//删除一行的方法
			modify(row) {
				this.productForm = row;
				this.dialogFormVisible = true;
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