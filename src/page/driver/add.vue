<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width:500px;margin: 0 auto;">
					<el-form :model="driverData" ref="driverData" label-width="140px" :label-position="labelPosition" :rules="rules">
						<el-form-item label="物流公司">
							<el-select style="width:250px" v-model="driverData.memberId" placeholder="请选择">
								<el-option v-for="item in customerList" :key="item.memberId" :label="item.name" :value="item.memberId">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="姓名" prop="userName">
							<el-input style="width:250px" v-model="driverData.userName"></el-input>
						</el-form-item>
						<el-form-item label="手机号" prop="mobile">
							<el-input style="width:250px" v-model="driverData.mobile"></el-input>
						</el-form-item>
						<el-form-item label="车牌号" prop="carNum">
							<el-input style="width:250px" v-model="driverData.carNum"></el-input>
						</el-form-item>
					</el-form>
					<div class="button_submit">
						<el-button type="primary" @click="saveDriverData('driverData')">保存</el-button>
						<el-button type="primary" @click="toBack">取消</el-button>
					</div>
				</el-card>

			</el-col>
		</el-row>
	</section>

</template>

<script>
	import { getDriverSave, getMemberSelect } from '@/api/getData'
	export default {
		data() {
			var checkLinkPhone = (rule, value, callback) => {
				if(!value) {
					callback(new Error('手机号不能为空'));
				} else if(!/^1[3|4|5|7|8][0-9]\d{8}$/.test(value)) {
					callback(new Error('请输入正确的手机号'));
				} else {
					callback();
				}
			};
			return {
				labelPosition: 'right',
				customerList: [],
				driverData: {
					userName: '',
					mobile: '',
					carNum: '',
					memberId: '',
				},
				rules: {
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
					],
					carNum: [{
							required: true,
							message: '请输入车牌号',
							trigger: 'blur'
						},
						{
							min: 7,
							max: 7,
							message: '长度在7个字符',
							trigger: 'blur'
						}
					],
					mobile: [{
						required: true,
						validator: checkLinkPhone,
						trigger: 'blur'
					}]
				}
			}
		},
		created() {
			this.getMemberSelectData();
		},
		methods: {
			async getMemberSelectData() {
				try {
					const returnData = await getMemberSelect({
						search: {
							typeId: "5"
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
						this.driverData.memberId = returnData.list[0].memberId;
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
			saveDriverData(data) {
				this.$refs[data].validate(async(valid) => {
					if(valid) {
						try {
							const result = await getDriverSave(this.driverData);
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
		}
	}
</script>

<style scoped>
	.button_submit {
		text-align: center;
		margin-top: 50px;
	}
</style>