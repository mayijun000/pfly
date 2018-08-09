<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width:1000px;margin: 0 auto;">
					<el-form :model="formData" :rules="rules" ref="formData" label-width="300px" class="demo-formData">
						<el-form-item label="计划周期">
							<el-select style="width:123px" v-model="value" placeholder="请选择省">
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
							<el-input style="width:123px" v-model="formData.customer"></el-input>
						</el-form-item>
						<el-form-item label="需求方">
							<el-input style="width:250px" v-model="formData.phoneUser"></el-input>
						</el-form-item>
						<el-form-item label="说明">
							<el-input style="width:250px" v-model="formData.phoneUser"></el-input>
						</el-form-item>

						<el-form-item label="标的物" style="background-color: #f5f5f5;" label-width="100px">
							<el-button @click="addProduct" size="small" type="primary">添加产品</el-button>
						</el-form-item>
						<el-table :data="productData" style="width:100%;margin-bottom: 20px;" align="center">
							<el-table-column label="产品名称" prop="productName">
							</el-table-column>
							<el-table-column label="材质" prop="meterial">
							</el-table-column>
							<el-table-column label="规格型号" prop="spec">
							</el-table-column>
							<el-table-column label="单位" prop="unit">
							</el-table-column>
							<el-table-column label="数量" prop="number">
							</el-table-column>
							<el-table-column label="单价" prop="money">
							</el-table-column>
							<el-table-column label="金额" prop="money">
							</el-table-column>
							<el-table-column label="操作">
								<template scope="scope">
									<el-button size="small" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
						<div class="button_submit">
							<el-button type="primary" @click="preservation">保存</el-button>
							<el-button type="primary" @click="noSave">取消</el-button>
						</div>
					</el-form>
				</el-card>
			</el-col>
		</el-row>
		<el-dialog title="添加产品" :visible.sync="dialogFormVisible" top="1%" size="tiny">
			<el-form :model="productForm" :rules="productRules" ref="productForm" label-width="100px">
				<el-form-item label="产品分类">
					<el-select v-model="productForm.category" placeholder="请选择活动区域">
						<el-option label="区域一" value="shanghai"></el-option>
						<el-option label="区域二" value="beijing"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="产品名称">
					<el-select v-model="productForm.productName" placeholder="请选择活动区域">
						<el-option label="区域一" value="shanghai"></el-option>
						<el-option label="区域二" value="beijing"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="材质">
					<el-select v-model="productForm.meterial" placeholder="请选择活动区域">
						<el-option label="区域一" value="shanghai"></el-option>
						<el-option label="区域二" value="beijing"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="规格型号">
					<el-select v-model="productForm.spec" placeholder="请选择活动区域">
						<el-option label="区域一" value="shanghai"></el-option>
						<el-option label="区域二" value="beijing"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="单位">
					<el-select v-model="productForm.unit" placeholder="请选择活动区域">
						<el-option label="区域一" value="shanghai"></el-option>
						<el-option label="区域二" value="beijing"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="数量" prop="number">
					<el-input v-model="productForm.number" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="单价" prop="money">
					<el-input v-model="productForm.money" auto-complete="off"></el-input>
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
	export default {
		data() {
			return {
				dialogFormVisible: false,
				productData: [],
				formData: {
					buyer: '',
					seller: '',
					address: '',
					date: '',
					project: '',
					money: ''
				},
				rules: {
					buyer: [{
						required: true,
						message: '请输入买方',
						trigger: 'blur'
					}],
					seller: [{
						required: true,
						message: '请输入卖方',
						trigger: 'blur'
					}],
					address: [{
						required: true,
						message: '请输入签订地点',
						trigger: 'blur'
					}],
					date: [{
						required: true,
						message: '请选择签订日期',
						trigger: 'change'
					}],
					project: [{
						required: true,
						message: '请输入所属项目',
						trigger: 'blur'
					}],
					money: [{
						required: true,
						message: '请输入总金额',
						trigger: 'blur'
					}],
				},
				dynamicValidateForm: {
					domains: [{
						value: ''
					}],
				},
				productForm: {
					category: '',
					productName: '',
					meterial: '',
					spec: '',
					unit: '',
					number: '',
					money: '',
					demand: '',
					remark: '',
				},
				productRules: {

					number: [{
						required: true,
						message: '请输入数量',
						trigger: 'blur'
					}, ],
					money: [{
						required: true,
						message: '请输入单价',
						trigger: 'blur'
					}, ],

				},
			}
		},
		methods: {
			addProduct() {
				this.dialogFormVisible = true;
			},
			saveProduct(formName) {
				this.$refs[formName].validate(async(valid) => {
					if(valid) {
						const productItem = {
							productName: this.productForm.productName,
							meterial: this.productForm.meterial,
							spec: this.productForm.spec,
							unit: this.productForm.unit,
							number: this.productForm.number,
							money: this.productForm.money,
							demand: this.productForm.demand,
							remark: this.productForm.remark,
						}
						this.productData.push(productItem);
						this.dialogFormVisible = false;
					}
				});

			},
			noSave() {
				this.$router.push({
					path: '/demand/index'
				});
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
	.el-input, .el-input__inner {
	     width: 360px;
	    display: inline-block;
	}
	.button_submit {
		text-align: center;
		margin-top: 50px;
	}
</style>