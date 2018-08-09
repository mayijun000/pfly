<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width: 1000px;margin: 0 auto;">
					<header class="contractTitle">基本信息</header>
					<ul class="contractBody">
						<li>
							<span class="bodyLabel">合同编号：</span><span>{{formData.contractNum}}</span>
							<span class="bodyLabel">所属项目：</span><span>{{formData.projectName}}</span>
						</li>
						<li>
							<span class="bodyLabel">买方：</span><span>{{formData.demand}}</span>
							<span class="bodyLabel">卖方：</span><span>{{formData.supplier}}</span>
						</li>
						<li>
							<span class="bodyLabel">签订地点：</span><span>{{formData.deliverySignAdrrId}}</span>
							<span class="bodyLabel">签订日期：</span><span>{{formData.signDate}}</span>
						</li>
						<li>
							<span class="bodyLabel">执行方：</span><span>{{formData.executerId}}</span>
							<span class="bodyLabel">总金额：</span><span>{{formData.totalAmount}}</span>

						</li>
						<li>
							<span class="bodyLabel">状态：</span><span>{{formData.status}}</span>
							<span class="bodyLabel">合同附件：</span><span><a v-if="formData.fileId != null" :href="formData.fileId" target="_Blank">附件图片</a></span>
						</li>
					</ul>
					<header class="contractTitle">标的物</header>
					<el-table :data="productData" style="width:100%;margin: 20px 0;" align="center">
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
					</el-table>
					<header class="contractTitle">交货地</header>
					<ul class="contractBody">
						<li v-for="(item,index) in addrData">
							<span class="bodyLabel">{{index+1}}、</span><span class="itemSpan">{{item.name}}<el-button type="success" style="margin-left: 20px;" @click="createQrcode(item)">生成二维码</el-button></span>
						</li>
					</ul>
					<header class="contractTitle">条款</header>
					<ul class="contractBody">
						<li v-for="(item,index) in termData">
							<span class="bodyLabel">{{index+1}}、</span><span class="itemSpan">{{item.name}}</span>
						</li>
					</ul>
					<div style="text-align: center;margin-top: 50px;">
						<el-button type="primary" @click="toBack">返回</el-button>
					</div>
				</el-card>
			</el-col>
		</el-row>

	</section>
</template>
<script>
	import { getContractInfo } from '@/api/getData'
	export default {
		data() {
			return {
				dialogFormVisible: false,
				productData: [],
				termData: [],
				addrData: [],
				formData: {
					projectName: '',
					contractNum: '',
					supplier: '',
					demand: '',
					project: '',
					signDate: '',
					totalAmount: '',
					deliverySignAdrrId: '',
					status: '',
				},

			}
		},
		created() {
			this.getContractInfoData();
		},
		methods: {
			toBack() {
				this.$router.go(-1);
			},
			async getContractInfoData() {
				try {
					let data = {
						contractId: this.$route.query.contractId
					}
					const returnData = await getContractInfo(data);
					if(returnData.result == "success") {
						let item = returnData.obj;
						this.formData.projectName = item.projectName;
						this.formData.contractNum = item.contractNum;
						this.formData.supplier = item.supplierName;
						this.formData.demand = item._demand;
						this.formData.signDate = item.signDate.substr(0, 10);
						this.formData.deliverySignAdrrId = item.deliverySignAdrrId;
						this.formData.totalAmount = item.totalAmount;
						this.formData.status = item.status == 1 ? "已结束" : "执行中";
						this.formData.fileId = item.fileId;
						this.formData.executerId = item._executerId;
						this.termData = item.termList;
						this.productData = item.itemList;
						item.deliveryList.forEach(data => {
							this.addrData.push({
								id:data.deliveryId,
								name:data._provinceId+data._cityId+data.address
							});
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
			createQrcode(item){
				let uri = "http://47.94.151.103:8081";
				//设置地址
//				switch(process.env.NODE_ENV) {
//					case 'online':
//						uri = 'http://admin.cloud-chain.cn';
//					break;
//				}
				window.open(uri+"/qrcode?id="+item.id+"&type='ADDRESS'&display="+item.name)
			}

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
		width: 337.5px;
		display: flex;
		height: 60px;
		border-top: 1px solid #dfe6ec;
		border-right: 1px solid #dfe6ec;
		align-items: center;
		padding: 0 10px;
	}
	
	.contractBody li .bodyLabel {
		width: 100px;
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
		width: 817px;
	}
</style>