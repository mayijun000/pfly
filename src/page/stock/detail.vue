<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width: 1000px;margin: 0 auto;">
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
							<span class="bodyLabel"></span><span></span>
						</li>

					</ul>

					<el-form :model="findForm" ref="findForm" :inline="true" style="margin-top: 40px;">
						<el-form-item label="调整人">
							<el-input placeholder="调整人" v-model="findForm.trackUserId"></el-input>
						</el-form-item>
						<el-form-item label="调整日期">
							<el-date-picker v-model="findForm.date" type="daterange" align="right" placeholder="选择日期范围" :picker-options="pickerOptions2">
							</el-date-picker>
						</el-form-item>
						<el-button type="primary" @click="find" style="margin-left: 10px;">查询</el-button>
					</el-form>

					<el-table :data="productData" border stripe style="width:100%;margin: 20px 0;" align="center">
						<el-table-column label="调整人" prop="trackUserName">
						</el-table-column>
						<el-table-column label="调整日期" prop="trackDate">
						</el-table-column>
						<el-table-column label="库存调整量(吨)" prop="number">
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
	import { getStockInfo, getStockChangeList } from '@/api/getData'
	export default {
		data() {
			return {
				dialogFormVisible: false,
				productData: [],
				formData: {

				},
				findForm: {
					date: '',
					trackUserId: '',
				},
				pickerOptions2: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
			}
		},
		created() {
			this.getOrderInfoData();
			//this.find();
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
			async find() {
				try {
					let data = {};
					if(this.findForm.date != "" && this.findForm.date != ",") {
						let dates = this.findForm.date;
						data.trackDateStart = dates[0].format("yyyy-MM-dd");
						data.trackDateEnd = dates[1].format("yyyy-MM-dd");
					}
					if(this.findForm.trackUserId != "") {
						data.trackUserId = this.findForm.trackUserId;
					}
					const returnData = await getStockChangeList({
						search: data
					});
					if(returnData.result == "success") {
						returnData.list.forEach(item => {
							item.trackDate = item.trackDate.substr(0, 10);
						});

						this.productData = returnData.list;
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

		}
	}
</script>
<style lang="less" scoped>
	.demo-formData .el-input,
	.demo-formData .el-input__inner {
		width: 360px;
		display: inline-block;
	}
	
	.demo-formData .el-date-editor.el-input {
		width: 360px;
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
	
	.button_submit {
		margin-left: 200px;
	}
	
	.contractBody li .itemSpan {
		width: 780px;
	}
</style>