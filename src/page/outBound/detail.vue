<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width: 1000px;margin: 0 auto;">
					<header class="contractTitle">发货单</header>
					<ul class="contractBody">
						<li>
							<span class="bodyLabel">合同编号：</span><span>{{formData._contractId}}</span>

							<span class="bodyLabel">仓库：</span><span>{{formData._deliveryWareId}}</span>
						</li>
						<li>
							<span class="bodyLabel">项目名称：</span><span>{{formData.projectName}}</span>
							<span class="bodyLabel">收货单位：</span><span>{{formData._receiptCompany}}</span>
						</li>
						<li>
							<span class="bodyLabel">执行方：</span><span>{{formData.executerName}}</span>
							<span class="bodyLabel">进场时间：</span><span>{{formData.enterDate}}</span>
						</li>
						<li>
							<span class="bodyLabel">物流公司：</span><span>{{formData.logisticsName}}</span>
							<span class="bodyLabel">司机：</span><span>{{formData._driverId}}</span>
						</li>
						<li>
							<span class="bodyLabel">联系方式：</span><span>{{formData.mobile}}</span>
							<span class="bodyLabel">车牌号：</span><span>{{formData.carNum}}</span>
						</li>
						<div class="address">
							<span class="bodyLabel">收货地址：</span>
							<span v-show="noStatus">
								{{formData._addressId}}
								<el-button v-show="updateBtn" type="warning" style="margin-left: 20px;" @click="update">修改</el-button>
							</span>
							<span v-show="updateStatus">
								<el-select style="width:200px" v-model="formData.addressId" placeholder="请选择收货地址">
									<el-option v-for="item in addrList"  :key="item.id" :label="item.name" :value="item.id">
									</el-option>
								</el-select>
							</span>
						</div>
					</ul>
					<el-table :data="formData.itemList" border stripe style="width:100%;" align="center">
						<el-table-column label="产品名称" prop="name">
						</el-table-column>
						<el-table-column label="材质" prop="material">
						</el-table-column>
						<el-table-column label="规格型号" prop="specifiModel">
						</el-table-column>
						<el-table-column v-if="itemClass" label="实发量(吨)" prop="itemRealDeliveryNumber">
						</el-table-column>
						<el-table-column v-if="itemClass5" label="计划发货量(吨)" prop="number">
						</el-table-column>
						<el-table-column v-if="itemClass5" label="库存量(吨)" prop="deliveryWareStock">
						</el-table-column>
					</el-table>
					<div style="text-align: center;margin-top: 50px;">
						<el-button type="primary" @click="toBack">返回</el-button>
					</div>
				</el-card>
			</el-col>
		</el-row>

	</section>
</template>
<script>
	import { getDeliverInfo, deliveryAddrList, updateAddress } from '@/api/getData'
	export default {
		data() {
			return {
				productData: [],
				formData: {},
				itemClass:false,
				itemClass5:true,
				noStatus: true,
				updateStatus: false,
				updateBtn: true,
				addrList: [],
				rules: {
					address: [{
							required: true,
							message: '请输入详细地址',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 50,
							message: '长度在 2到 5 0个字符',
							trigger: 'blur'
						}
					],
				},
			}
		},
		created() {
			this.getDeliverInfoData();
		},
		methods: {
			toBack() {
				this.$router.go(-1);
			},
			async getDeliverInfoData() {
				try {
					let data = {
						deliverId: this.$route.query.deliverId
					}
					const returnData = await getDeliverInfo(data);
					if(returnData.result == "success") {
						let item = returnData.obj;
						item.enterDate = item.enterDate.substr(0, 10);
						if(item.status == 5) {
							this.updateBtn = false;
						}
						if(item.status > 2) {
							this.itemClass = true;
							this.itemClass5 = false;
						}else{
							this.itemClass = false;
							this.itemClass5 = true;
						}
						this.formData = item;
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
			async deliveryAddrListData(id) {
				try {
					const returnData = await deliveryAddrList({
						search: {
							contractId: id
						}
					});
					if(returnData.result == "success") {
						if(returnData.list.length > 0) {
							returnData.list.forEach(item => {
								this.addrList.push({
									id: item.deliveryId,
									name: item._provinceId + item._cityId + item.address
								});
							});
							this.formData.addressId = returnData.list[0].deliveryId;
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
			async saveAddress(addressForm) {
				this.$refs[addressForm].validate(async(valid) => {
					if(valid) {
						try {
							let data = {
								deliverId: this.formData.deliverId,
								addressId: this.formData.addressId
							}
							const result = await updateAddress(data);
							if(result.result == "success") {
								this.$message({
									type: 'success',
									message: '保存成功'
								});
								this.formData.addressId = data.addressId;
								this.returnAddress();

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
			},
			returnAddress() {
				this.updateStatus = false;
				this.noStatus = true;
			},
			update() {
				this.deliveryAddrListData(this.formData.contractId);
				this.updateStatus = true;
				this.noStatus = false;
			},
			

		}
	}
</script>
<style lang="less" scoped>
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
		width: 137.5px;
		text-align: right;
		background-color: #eef1f6;
		justify-content: flex-end;
	}
	
	.contractTitle {
		background-color: #20a0ff;
		line-height: 60px;
		color: #fff;
		font-size: 24px;
		text-align: center;
		-moz-border-radius-topleft: 4px;
		-moz-border-radius-topright: 4px;
		-webkit-border-top-left-radius: 4px;
		-webkit-border-top-right-radius: 4px;
	}
	
	.button_submit {
		margin-left: 200px;
	}
	
	.contractBody li .itemSpan {
		width: 780px;
	}
	
	.address {
		display: flex;
		height: 60px;
		border-top: 1px solid #dfe6ec;
		border-right: 1px solid #dfe6ec;
		align-items: center;
		color: #48576a;
		font-size: 14px;
	}
	
	.address span {
		padding: 0 10px;
	}
	
	.address .bodyLabel {
		color: #48576a;
		height: 60px;
		width: 139px;
		display: flex;
		background-color: #eef1f6;
		align-items: center;
		justify-content: flex-end;
	}
</style>