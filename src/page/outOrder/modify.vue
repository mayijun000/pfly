<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width:1000px;margin: 0 auto;">
					<el-form :model="formData" ref="formData" :rules="rules" label-width="300px" class="demo-formData">
						<el-form-item label="订单编号">
							<span v-model="formData.orderNum" style="width:200px;display: block;">{{formData.orderNum}}</span>
						</el-form-item>
						<el-form-item label="采购方">
							<span v-model="formData.supplier" style="width:200px;display: block;">{{formData.demand}}</span>
						</el-form-item>
						<el-form-item label="供应商">
							<span v-model="formData.demand" style="width:200px;display: block;">{{formData.supplier}}</span>
						</el-form-item>
						<el-form-item label="状态">
							<span v-model="formData.statusName" style="width:200px;display: block;">{{formData.statusName}}</span>
						</el-form-item>
						<el-form-item label="签订地点" prop="signAddr">
							<el-input style="width:250px" v-model="formData.signAddr"></el-input>
						</el-form-item>
						<el-form-item label="签订日期" prop="signDate">
							<el-date-picker style="width:250px" v-model="formData.signDate" type="date" placeholder="选择日期">
							</el-date-picker>
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
							<el-table-column label="单价" prop="price">
							</el-table-column>
							<el-table-column label="金额" prop="totalAmount">
							</el-table-column>
							<el-table-column label="厂商要求" prop="manufactor">
							</el-table-column>
							<el-table-column label="备注" prop="remarks">
							</el-table-column>
							<el-table-column label="操作">
								<template scope="scope">
									<el-button size="small" type="warning" @click="modify(scope.row)">修改</el-button>
								</template>
							</el-table-column>
						</el-table>
						<div class="button_submit">
							<el-button type="primary" @click="saveOrder('formData')">保存</el-button>
							<el-button type="primary" @click="toBack">取消</el-button>
						</div>
					</el-form>
				</el-card>
			</el-col>
		</el-row>
		<el-dialog title="添加产品" :visible.sync="dialogFormVisible" top="1%" size="tiny">
			<el-form :model="productForm" :rules="productRules" ref="productForm" label-width="100px">
				<el-form-item label="产品名称">
					<span v-model="productForm.name" style="width:195px;display: block;">{{productForm.name}}</span>
				</el-form-item>
				<el-form-item label="材质">
					<span v-model="productForm.material" style="width:195px;display: block;">{{productForm.material}}</span>
				</el-form-item>
				<el-form-item label="规格型号">
					<span v-model="productForm.specifiModel" style="width:195px;display: block;">{{productForm.specifiModel}}</span>
				</el-form-item>
				<el-form-item label="单位">
					<span v-model="productForm.unitId" style="width:195px;display: block;">{{productForm.unitId}}</span>
				</el-form-item>
				<el-form-item label="数量" prop="number">
					<el-input style="width:195px;" v-model="productForm.number"></el-input>
				</el-form-item>
				<el-form-item label="单价" prop="price">
					<el-input style="width:195px;" v-model="productForm.price"></el-input>
				</el-form-item>
				<el-form-item label="厂商要求" prop="manufactor">
					<el-input style="width:195px;" v-model="productForm.manufactor"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remarks">
					<el-input style="width:195px;" v-model="productForm.remarks"></el-input>
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
	import { getClassification, getOrderSave, queryProductExistence, getOrderInfo } from '@/api/getData';
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
				dialogFormVisible: false,
				//分类数据
				parentClassifiCationId: '',
				productData: [],
				formData: {
					signDate: '',
					signAddr: '',
					orderNum: '',
					supplier: '',
					demand: '',
					status: '',
					statusName: "",
				},
				productForm: {
					name: '',
					material: '',
					specifiModel: '',
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
				},
			}
		},
		created() {
			this.getOrderInfoData();
		},
		methods: {
			async getOrderInfoData() {
				try {
					let data = {
						orderId: this.$route.query.orderId
					}
					const returnData = await getOrderInfo(data);
					if(returnData.result == "success") {
						let item = returnData.obj;
						this.formData.orderId = item.orderId;
						this.formData.orderNum = item.orderNum;
						this.formData.supplier = item._supplier;
						this.formData.demand = item._demand;
						this.formData.signDate = item.signDate;
						this.formData.signAddr = item.signAddr;
						this.formData.status = item.status;
						if(item.status == "0") {
							this.formData.statusName = "创建";
						} else if(item.status == "-1") {
							this.formData.statusName = "驳回";
						} else if(item.status == "1") {
							this.formData.statusName = "审核中";
						} else if(item.status == "2") {
							this.formData.statusName = "审核通过";
						} else if(item.status == "5") {
							this.formData.statusName = "入库成功";
						}
						this.productData = item.itemList;
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
			saveProduct(formName) {

				this.$refs[formName].validate(async(valid) => {
					if(valid) {
						let productItem = {
							itemId: this.productForm.itemId,
							name: this.productForm.name,
							material: this.productForm.material,
							specifiModel: this.productForm.specifiModel,
							unitId: this.productForm.unitId,
							number: this.productForm.number,
							price: this.productForm.price,
							manufactor: this.productForm.manufactor,
							remarks: this.productForm.remarks,
						}
						productItem.totalAmount = parseFloat(this.productForm.number * this.productForm.price).toFixed(2);
						this.productData.forEach(item => {
							if(this.productForm.itemId == item.itemId) {
								item = productItem
							}
						});
						this.dialogFormVisible = false;
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