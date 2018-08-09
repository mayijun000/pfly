<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width: 1000px;margin: 0 auto;">
					<el-form :rules="rules" :model="formData" ref="formData" label-width="300px" class="demo-formData">
						<el-form-item label="基本信息" style="background-color: #f5f5f5;" label-width="100px">

						</el-form-item>
						<el-form-item label="买方">
							<el-select style="width:360px" v-model="formData.demand" filterable placeholder="请选择买方">
								<el-option v-for="item in customerList" :key="item.memberId" :label="item.name" :value="item.memberId">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="卖方">
							<span v-model="formData.supplierName" style="width:200px;display: block;">{{companyInfo.name}}</span>
						</el-form-item>
						<el-form-item label="执行方">
							<el-select style="width:360px" v-model="formData.executerId" filterable placeholder="请选择执行方">
								<el-option v-for="item in executerList" :key="item.memberId" :label="item.name" :value="item.memberId">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="签订地点">
							<el-input v-model="formData.deliverySignAdrrId" placeholder="请输入签订地点"></el-input>
						</el-form-item>
						<el-form-item label="签订日期">
							<el-date-picker v-model="formData.signDate" align="right" type="date" placeholder="请选择签订日期">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="所属项目">
							<el-input v-model="formData.projectName" placeholder="请输入所属项目"></el-input>
						</el-form-item>
						<el-form-item label="总金额">
							<el-input v-model="formData.totalAmount" :disabled="true"></el-input>
						</el-form-item>

						<el-form-item label="上传合同附件">
							<upload-ali-oss :url.sync="uploadForm.content.path" :multiple="false" :id="uploadForm.id" :ossClient="ossClient" :inputName="uploadForm.inputName" :path="uploadForm.upload.path" :uploadRes.sync="uploadForm.uploadRes"></upload-ali-oss>
							<div v-show="uploadForm.uploadRes">
								<a :href="this.imgSrc" target="_Blank">{{uploadForm.content.path}}</a>
							</div>
							<!--<div>
								<img v-if="uploadForm.uploadRes" :src="this.imgSrc">
							</div>-->
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
							<el-table-column label="单价" prop="price">
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
						<el-form-item label="交货地" style="background-color: #f5f5f5;" label-width="100px">
							<el-button @click="addAddr" size="small" type="primary">添加交货地</el-button>
						</el-form-item>

						<el-form label-width="100px" class="demo-dynamic">
							<el-form-item v-for="(domain, index) in addrList" :label="'交货地' + (index+1)" :key="domain.key" :prop="'termList.' + index + '.remarks'">
								<el-select style="width:200px" v-model="domain.provinceId" @change="selectCity(domain)" placeholder="请选择省">
									<el-option v-for="item in educationData" :key="item.placeId" :label="item.placeName" :value="item.placeId">
									</el-option>
								</el-select>
								<el-select style="width:200px" v-model="domain.cityId" placeholder="请选择市">
									<el-option v-for="item in countryData" :key="item.placeId" :label="item.placeName" :value="item.placeId">
									</el-option>
								</el-select>
								<el-input v-model="domain.address" placeholder="请输入详细地址"></el-input>
								<el-button @click.prevent="removeAddr(domain)">删除</el-button>
							</el-form-item>
						</el-form>
						<el-form-item label="条款" style="background-color: #f5f5f5;" label-width="100px">
							<el-button @click="addDomain" size="small" type="primary">添加条款</el-button>
						</el-form-item>

						<el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
							<el-form-item v-for="(domain, index) in dynamicValidateForm.termList" :label="'条款' + (index+1)" :key="domain.key" :prop="'termList.' + index + '.remarks'" :rules="{
							      required: true, message: '条款不能为空', trigger: 'blur' }">

								<el-input v-model="domain.remarks"></el-input>
								<el-button @click.prevent="removeDomain(domain)">删除</el-button>
							</el-form-item>
						</el-form>

					</el-form>
					<div class="button_submit">
						<el-button type="primary" @click="saveContract('formData')">保存合同</el-button>
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
				<el-form-item v-show="yes_spec" label="规格型号">
					<el-select v-model="productForm.spec" placeholder="请选择规格型号">
						<el-option v-for="item in specData" :key="item.classifiCationId" :label="item.name" :value="item.name"></el-option>
					</el-select>
					<span v-show="no_spec" style="color:#ff4949;">该产品下没有型号，无需选择</span>
				</el-form-item>
				<el-form-item label="单位">
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
	import ossUpload from '@/components/ossUpload';
	import { getUUID } from '@/config/mUtils';
	import { getClassification, getContractSave, getContractInfo, getMemberSelect, queryProductExistence, getCityList } from '@/api/getData';
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
				user: {},
				companyInfo: {},
				productData: [],
				executerList: [],
				customerList: [],
				//分类数据
				parentClassifiCationId: '',
				classifiCation: [],
				productNameData: [],
				meterialData: [],
				specData: [],

				addrList: [],
				//省市
				educationData: [],
				countryData: [],
				formData: {
					contractId: '',
					demand: '',
					supplier: '',
					projectName: '',
					signDate: '',
					deliverySignAdrrId: '',
					totalAmount: '0',
					fileId: ''
				},
				rules: {
					//					deliverySignAdrrId: [{
					//							required: true,
					//							message: '请输入签订地点',
					//							trigger: 'blur'
					//						},
					//						{
					//							min: 2,
					//							max: 50,
					//							message: '长度在 2到 50个字符',
					//							trigger: 'blur'
					//						}
					//					],
					//					signDate: [{
					//						required: true,
					//						message: '请选择签订日期',
					//						trigger: 'change'
					//					}],
					projectName: [{
							required: true,
							message: '请输入所属项目',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 50,
							message: '长度在 2到 50个字符',
							trigger: 'blur'
						}
					],
				},
				//条款列表
				dynamicValidateForm: {
					termList: [{
						remarks: '',
						sort: '1',
					}],
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
					}],
					unitId: [{
						required: true,
						message: '请选择单位',
						trigger: 'blur'
					}]

				},
				ossClient: null,
				uploadForm: {
					id: 'imgFile',
					inputName: '上传图片', // 自定义
					content: {
						path: '',
					},
					upload: {
						path: '', // 自定义路径
					},
					uploadRes: false,
				},
				imgSrc: ''

			}
		},
		components: {
			'upload-ali-oss': ossUpload
		},
		created() {
			this.getMemberSelectAllData();
			this.getMemberSelectData();
			this.getContractInfoData();
			this.user = this.$store.getters.getUser;
			this.companyInfo = this.$store.getters.getCompany;
		},
		methods: {
			async getContractInfoData() {
				try {
					let data = {
						contractId: this.$route.query.contractId
					}
					const returnData = await getContractInfo(data);
					if(returnData.result == "success") {
						let item = returnData.obj;
						this.formData.contractId = item.contractId;
						this.formData.projectName = item.projectName;
						this.formData.contractNum = item.contractNum;
						this.formData.supplier = item.supplier;
						this.formData.demand = item.demand;
						this.formData.executerId = item.executerId;
						this.formData.signDate = item.signDate;
						this.formData.deliverySignAdrrId = item.deliverySignAdrrId;
						this.formData.totalAmount = item.totalAmount;
						this.formData.status = item.status;
						this.dynamicValidateForm.termList = item.termList;
						this.productData = item.itemList;
						this.uploadForm.content.path = item.fileId;
						this.uploadForm.uploadRes = true;
						this.addrList = item.deliveryList;
						this.addrList.forEach(obj => {
							this.getCityListData(obj);
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
			async getMemberSelectData() {
				try {
					const returnData = await getMemberSelect({
						search: {
							typeId: "4"
						}
					});
					if(returnData.result == "success") {
						//this.formData.demand = returnData.list[0].memberId;
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
			async getMemberSelectAllData() {
				try {
					const returnData = await getMemberSelect({
						search: {
							typeId: "7"
						}
					});
					if(returnData.result == "success") {
						//this.formData.executerId = returnData.list[0].memberId;
						returnData.list.forEach((item, index) => {
							const data = {};
							data.name = item.name;
							data.memberId = item.memberId;
							this.executerList.push(data);
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
			async getCityListData(obj) {
				try {
					if(this.educationData.length == 0){
						const returnData = await getCityList({
							id: "0"
						});
						if(returnData.result == "success") {
							this.educationData = returnData.list;
							if(returnData.list.length > 0 && obj.provinceId == "") {
								obj.provinceId = returnData.list[0].placeId;
							}
							this.getCountryListData(obj);
						} else {
							this.$message({
								type: 'error',
								message: returnData.message
							});
						}
					}else{
						this.getCountryListData(obj);
					}
					
				} catch(err) {
					console.log('获取数据失败', err);
				}
			},
			async getCountryListData(obj) {
				try {
					let len = this.countryData.length;
					const returnData = await getCityList({
						id: obj.provinceId
					});
					if(returnData.result == "success") {
						this.countryData = returnData.list;
						if(returnData.list.length > 0 && len != 0) {
							obj.cityId = returnData.list[0].placeId;
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
			selectCity(value) {
				if(value.provinceId != "") {
					this.getCountryListData(value);
				}
			},
			addProduct() {
				this.getParentClassificationId("0");
				this.dialogFormVisible = true;
			},
			removeDomain(item) {
				var index = this.dynamicValidateForm.termList.indexOf(item)
				if(index !== -1) {
					this.dynamicValidateForm.termList.splice(index, 1)
				}
			},
			addDomain() {
				this.dynamicValidateForm.termList.push({
					remarks: '',
					sort: this.dynamicValidateForm.termList.length + 1,
					key: Date.now()
				});
			},
			//删除一行的方法
			handleDelete(index, row) {
				//计算总金额
				this.formData.totalAmount = (parseFloat(this.formData.totalAmount) - parseFloat(row.number * row.price)).toFixed(2);
				//传入form表单的对象
				this.productData.splice(index, 1);
			},
			saveProduct(formName) {
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
									name: productName,
									material: this.productForm.meterial,
									specifiModel: this.productForm.spec,
									unitId: this.productForm.unitId,
									number: this.productForm.number,
									price: this.productForm.price,
									manufactor: this.productForm.manufactor,
									remarks: this.productForm.remarks,
								}
								this.formData.totalAmount = (parseFloat(this.formData.totalAmount) + parseFloat(this.productForm.number * this.productForm.price)).toFixed(2);
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
								message: res.message
							});
						}
					}
				});

			},
			toBack() {
				this.$router.go(-1);
			},
			saveContract(formData) {
				this.$refs[formData].validate(async(valid) => {
					if(valid) {
						try {
							if(this.imgSrc != "") {
								this.formData.fileId = this.imgSrc;
							} else {
								this.$message({
									type: 'warning',
									message: '请上传合同附件'
								});
								return false;
							}
							if(typeof(this.formData.signDate) != "string") {
								this.formData.signDate = this.formData.signDate.format("yyyy-MM-dd");
							}
							this.formData.supplier = this.user.companyId; //卖方
							if(this.productData.length == 0){
								this.$message({
									type: 'warning',
									message: '请选择标的物'
								});
								return false;
							}
							this.formData.itemList = this.productData;
							this.formData.termList = this.dynamicValidateForm.termList;
							this.formData.deliveryList = this.addrList;
							const result = await getContractSave(this.formData);
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
			//初始化OSS 权限, 建议后台提供获取oss临时权限的接口
			initOSSAuth() {
				//let ossSts = JSON.parse(localStorage.getItem('ossSts'));
				let Oss = OSS.Wrapper;
				this.ossClient = new Oss({
					region: 'oss-cn-beijing',
					accessKeyId: 'LTAIuk53PS2CWbo6',
					accessKeySecret: 'GiXSjrZUdvOKhozq9N0ADkZiPghu4o',
					//stsToken: '',
					bucket: 'pfxzkj',
					//endpoint: '',
				});
			},
			showUploadContent() {
				let path = this.uploadForm.content.path;
				if(path != "") {
					if(path.indexOf("image.pfxzqy.com") != -1){
						this.imgSrc = path;
					}else{
						this.imgSrc = "http://image.pfxzqy.com/" + path;
					}
				}
			}
		},
		watch: {
			'uploadForm.content.path' (val, oldVal) {
				//console.log('new: %s, old: %s', val, oldVal)
				if('' !== val) {
					this.showUploadContent();
				}
			}
		},
		mounted() {
			this.initOSSAuth();
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