<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width:500px;margin: 0 auto;">
					<el-form :model="formData" ref="formData" label-width="140px" :label-position="labelPosition">
						<el-form-item label="统一社会信用代码" prop="licenseCode">
							<el-input style="width:250px" v-model="formData.licenseCode"></el-input>
						</el-form-item>
						<el-form-item label="供应商简称" prop="shortName">
							<el-input style="width:250px" v-model="formData.shortName"></el-input>
						</el-form-item>
						<el-form-item label="供应商名称" prop="name">
							<el-input style="width:250px" v-model="formData.name"></el-input>
						</el-form-item>
						<el-form-item label="城市">
							<el-select style="width:123px" v-model="formData.cityId" @visible-change="selectChange" placeholder="请选择省">
								<el-option v-for="item in educationData" :key="item.placeId" :label="item.placeName" :value="item.placeId">
								</el-option>
							</el-select>
							<el-select style="width:123px" v-model="formData.countyId" placeholder="请选择市">
								<el-option v-for="item in politicsData" :key="item.placeId" :label="item.placeName" :value="item.placeId">
								</el-option>
							</el-select>
						</el-form-item>
					</el-form>
					<div class="button_submit">
						<el-button type="primary" @click="saveMember('formData')">保存</el-button>
						<el-button type="primary" @click="toBack">取消</el-button>
					</div>
				</el-card>

			</el-col>
		</el-row>
	</section>

</template>

<script>
	import { getCityList, getMemberSave, getMemberInfo } from '@/api/getData'
	export default {
		data() {
			return {
				labelPosition: 'right',
				formData: {
					memberId: '',
					shortName: '',
					name: '',
					cityId: '',
					countyId: '',
					licenseCode: '',
				},
				educationData: [],
				politicsData: [],
				rules: {
					licenseCode: [{
							required: true,
							message: '请输入统一社会信用代码',
							trigger: 'blur'
						},
						{
							min: 18,
							max: 18,
							message: '长度在18个字符',
							trigger: 'blur'
						}
					],
					shortName: [{
							required: true,
							message: '请输入企业简称',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 50,
							message: '长度在 2到 5 0个字符',
							trigger: 'blur'
						}
					],
					name: [{
							required: true,
							message: '请输入企业名称',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 50,
							message: '长度在2到 5 0个字符',
							trigger: 'blur'
						}
					]
				}
			}
		},
		created() {
			//查询会员用户信息
			this.getMemberInfoData();
			this.initData();
		},
		methods: {
			toBack() {
				this.$router.go(-1);
			},
			selectChange(value) {
				if(!value) {
					this.getPoliticsDataChange(this.formData.cityId);
				}
			},
			async initData() {
				try {
					const returnData = await getCityList({
						id: "0"
					});
					if(returnData.result == "success") {
						this.educationData = [];
						returnData.list.forEach((item, index) => {
							const data = {};
							data.placeId = item.placeId;
							data.placeName = item.placeName;
							this.educationData.push(data);
						});
						//this.formData.education = this.formData.cityId;
						this.getPoliticsData(this.formData.cityId);
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
			async getPoliticsData(id) {
				try {
					const returnData = await getCityList({
						id: id
					});
					if(returnData.result == "success") {
						this.politicsData = [];
						returnData.list.forEach((item, index) => {
							const data = {};
							data.placeId = item.placeId;
							data.placeName = item.placeName;
							this.politicsData.push(data);
						})
						this.formData.politics = this.formData.countyId;
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
			async getPoliticsDataChange(id) {
				try {
					const returnData = await getCityList({
						id: id
					});
					if(returnData.result == "success") {
						this.politicsData = [];
						returnData.list.forEach((item, index) => {
							const data = {};
							data.placeId = item.placeId;
							data.placeName = item.placeName;
							this.politicsData.push(data);
						})
						this.formData.countyId = this.politicsData[0].placeId;
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
			//获取会员信息
			async getMemberInfoData() {
				try {
					const returnData = await getMemberInfo({
						memberId: this.$route.query.memberId
					});
					if(returnData.result == "success") {
						let item = returnData.obj;
						this.formData.memberId = item.memberId;
						this.formData.shortName = item.shortName;
						this.formData.name = item.name;
						this.formData.cityId = item.education;
						this.formData.countyId = item.politics;
						this.formData.licenseCode = item.licenseCode;
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
			saveMember(formData) {
				this.$refs[formData].validate(async(valid) => {
					if(valid) {
						try {
							let company = {
								licenseCode: this.formData.licenseCode,
								cityId: this.formData.cityId,
								countyId: this.formData.countyId,
								shortName: this.formData.shortName,
								name: this.formData.name
							};
							let obj = {
								shortName: this.formData.shortName,
								name: this.formData.name,
								education: this.formData.cityId,
								politics: this.formData.countyId,
								memberId: this.formData.memberId,
							}
							let data = {};
							data.company = company;
							data.obj = obj;
							data.typeId = '3';
							const result = await getMemberSave(data);
							if(result.result == "success") {
								this.$message({
									type: 'success',
									message: '保存成功'
								});
								this.$router.push('index');
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