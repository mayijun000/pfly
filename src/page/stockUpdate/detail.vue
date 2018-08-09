<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width: 1000px;margin: 0 auto;text-align: center;">
					<header class="contractTitle">库存详情</header>
					<ul class="contractBody">
						<li>
							<span class="bodyLabel">订单：</span><span>{{formData.orderNum}}</span>
							<span class="bodyLabel">所属仓库：</span><span>{{formData._wareId}}</span>
						</li>
						<li>
							<span class="bodyLabel">产品名称：</span><span>{{formData.name}}</span>
							<span class="bodyLabel">材质：</span><span>{{formData.material}}</span>

						</li>
						<li>
							<span class="bodyLabel">型号：</span><span>{{formData.specifiModel}}</span>
							<span class="bodyLabel">入库日期：</span><span>{{formData.createDate}}</span>

						</li>
						<li>
							<span class="bodyLabel">入库数量(吨)：</span><span>{{formData.number}}</span>
							<span class="bodyLabel">采购单价：</span><span>{{formData.price}}</span>

						</li>
						<li>
							<span class="bodyLabel">库存量(吨)：</span><span>{{formData.remaindeStock}}</span>
							<span class="bodyLabel">库存调整量(吨)：</span><span>
								<el-form :model="numForm" ref="numForm" :rules="rules" :inline="true">
									<el-form-item  prop="number">
										<el-input-number :step="0.1" v-model="numForm.number"></el-input-number>
									</el-form-item>
								</el-form>	
							</span>
						</li>

					</ul>

					<div class="button_submit">
						<el-button type="primary" @click="saveStock('numForm')">保存</el-button>
						<el-button type="primary" @click="toBack">取消</el-button>
					</div>
				</el-card>
			</el-col>

		</el-row>

	</section>
</template>
<script>
	import { getStockInfo, getStockSave } from '@/api/getData'
	export default {
		data() {
			var checkNumber = (rule, value, callback) => {
				if(!value) {
					callback(new Error('数量不能为空'));
				} else if(!/^(\-|\+)?[0-9]{1,20}(.[0-9]{0,3})?$/.test(value)) {
					callback(new Error('请输入正确的数字格式'));
				} else {
					callback();
				}
			};
			return {
				dialogFormVisible: false,
				productData: [],
				formData: {

				},
				numForm: {
					number: "",
					inId: '',
					wareId: ''
				},
				rules: {
					number: [{
						required: true,
						validator: checkNumber,
						trigger: 'blur'
					}, ],
				},
			}
		},
		created() {
			this.getOrderInfoData();
		},
		methods: {
			toBack() {
				this.$router.go(-1);
			},
			//获取订单信息
			async getOrderInfoData() {
				try {
					const returnData = await getStockInfo({
						stockinId: this.$route.query.inId
					});
					if(returnData.result == "success") {
						returnData.obj.createDate = returnData.obj.createDate.substr(0, 10);
						this.formData = returnData.obj;
						this.numForm.inId = returnData.obj.inId;
						this.numForm.wareId = returnData.obj.wareId;
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
			saveStock(numForm) {
				this.$refs[numForm].validate(async(valid) => {
					if(valid) {
						try {
							const result = await getStockSave(this.numForm);
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

		}
	}
</script>
<style lang="less" scoped>
	.button_submit {
		text-align: center;
		margin-top: 50px;
	}
	
	.contractBody {
		border-bottom: 1px solid #dfe6ec;
		border-left: 1px solid #dfe6ec;
		/*-moz-border-radius-bottomleft: 4px;
		-moz-border-radius-bottomright: 4px;
		-webkit-border-bottom-left-radius: 4px;
		-webkit-border-bottom-right-radius: 4px;*/
	}
	
	.contractBody li {
		font-size: 14px;
		color: #48576a;
		height: 61px;
		width: 100%;
	}
	
	.contractBody li span {
		float: left;
		width: 300px;
		display: flex;
		height: 60px;
		border-top: 1px solid #dfe6ec;
		border-right: 1px solid #dfe6ec;
		align-items: center;
		padding: 0 10px;
	}
	
	.contractBody li .bodyLabel {
		width: 137px;
		text-align: right;
		background-color: #eef1f6;
		justify-content: flex-end;
	}
	
	.contractTitle {
		background-color: #f5f5f5;
		line-height: 60px;
		color: #48576a;
		font-size: 24px;
		text-align: center;
	}
	
	.contractBody li .itemSpan {
		width: 780px;
	}
	
	.el-form-item {
		margin-bottom: 0px;
	}
</style>