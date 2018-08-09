<template>

	<el-row :span="24">
		<el-row class="managerTop" v-show="this.menu.XS01">
			<el-col :span="10" class="managerLine"></el-col>
			<el-col :span="4" class="managerTitle">
				销售管理
				<p class="smallColor">Sales management</p>
			</el-col>
			<el-col :span="10" class="managerLine"></el-col>
		</el-row>
		<el-row class="managerTop" v-show="this.menu.XS01">
			<el-col :span="6" class="colCenter" v-show="this.menu.KG01_01">
				<img src="../static/img/1.png" class="animo" @click="toCutomer" />
				<p @click="toCutomer">客户管理</p>
			</el-col>
			<el-col :span="6" class="colCenter" v-show="this.menu.XJ01_02">
				<img src="../static/img/2.png" class="animo" @click="toChance" />
				<p @click="toChance">项目机会</p>
			</el-col>
			<el-col :span="6" class="colCenter" v-show="this.menu.KT01_03">
				<img src="../static/img/3.png" class="animo" @click="toCommunicate" />
				<p @click="toCommunicate">客户沟通</p>
			</el-col>
			<el-col :span="6" class="colCenter" v-show="this.menu.HG01_04">
				<img src="../static/img/4.png" class="animo" @click="toContract" />
				<p @click="toContract">合同管理</p>
			</el-col>
		</el-row>
		<el-row class="managerTop" v-show="this.menu.CG02">
			<el-col :span="10" class="managerLine"></el-col>
			<el-col :span="4" class="managerTitle">
				采购管理
				<p class="smallColor">purchasing management</p>
			</el-col>
			<el-col :span="10" class="managerLine"></el-col>
		</el-row>
		<el-row class="managerTop" v-show="this.menu.CG02">
			<el-col :span="4" class="colCenter" v-show="this.menu.GW02_01">
				<img src="../static/img/21.png" class="animo" @click="toSupplier" />
				<p @click="toSupplier">供应商管理</p>
			</el-col>
			<el-col :span="4" class="colCenter" v-show="this.menu.JD02_02">
				<img src="../static/img/24.png" class="animo" @click="toInOrder" />
				<p @click="toInOrder">集采订单</p>
			</el-col>
			<el-col :span="4" class="colCenter" v-show="this.menu.LD02_03">
				<img src="../static/img/6.png" class="animo" @click="toOutOrder" />
				<p @click="toOutOrder">临采订单</p>
			</el-col>
			<el-col :span="4" class="colCenter" v-show="this.menu.LS02_04">
				<img src="../static/img/7.png" class="animo" @click="toOutOrderReview" />
				<p @click="toOutOrderReview">订单审核</p>
			</el-col>
			<el-col :span="4" class="colCenter" v-show="this.menu.XJ02_05">
				<img src="../static/img/5.png" class="animo" @click="toDemand" />
				<p @click="toDemand">需求计划</p>
			</el-col>
			<el-col :span="4" class="colCenter" v-show="this.menu.WD02_06">
				<img src="../static/img/18.png" class="animo" @click="toMyOrder" />
				<p @click="toMyOrder">我的订单</p>
			</el-col>
		</el-row>
		<el-row class="managerTop" v-show="this.menu.WL03">
			<el-col :span="9" class="managerLine"></el-col>
			<el-col :span="6" class="managerTitle">
				物流管理
				<p class="smallColor">Physical distribution management</p>
			</el-col>
			<el-col :span="9" class="managerLine"></el-col>
		</el-row>
		<el-row class="managerTop" v-show="this.menu.WL03">
			<el-col :span="3" class="colCenter" v-show="this.menu.KC03_01">
				<img src="../static/img/8.png" class="animo" @click="toStock" />
				<p @click="toStock">库存查询</p>
			</el-col>
			<el-col :span="3" class="colCenter" v-show="this.menu.KT03_02">
				<img src="../static/img/9.png" class="animo" @click="toStockUpdate" />
				<p @click="toStockUpdate">库存调整</p>
			</el-col>
			<el-col :span="3" class="colCenter" v-show="this.menu.WG03_03">
				<img src="../static/img/22.png" class="animo" @click="toLogistics" />
				<p @click="toLogistics">物流公司</p>
			</el-col>
			<el-col :span="3" class="colCenter" v-show="this.menu.SG03_04">
				<img src="../static/img/23.png" class="animo" @click="toDriver" />
				<p @click="toDriver">司机管理</p>
			</el-col>
			<el-col :span="3" class="colCenter" v-show="this.menu.WF03_06">
				<img src="../static/img/20.png" class="animo" @click="toMyDelivery" />
				<p @click="toMyDelivery">我的发货单</p>
			</el-col>
			<el-col :span="3" class="colCenter" v-show="this.menu.FG03_05">
				<img src="../static/img/10.png" class="animo" @click="toDelivery" />
				<p @click="toDelivery">发货管理</p>
			</el-col>
			<el-col :span="3" class="colCenter" v-show="this.menu.CG03_07">
				<img src="../static/img/11.png" class="animo" @click="toOutBound" />
				<p @click="toOutBound">出库管理</p>
			</el-col>
			<el-col :span="3" class="colCenter" v-show="this.menu.SG03_08">
				<img src="../static/img/12.png" class="animo" @click="toReciving" />
				<p @click="toReciving">收货管理</p>
			</el-col>
		</el-row>
		<el-row class="managerTop" v-show="this.menu.JS04">
			<el-col :span="10" class="managerLine"></el-col>
			<el-col :span="4" class="managerTitle">
				结算管理
				<p class="smallColor">Settlement management</p>
			</el-col>
			<el-col :span="10" class="managerLine"></el-col>
		</el-row>
		<el-row class="managerTop" v-show="this.menu.JS04">
			<el-col :span="4" class="colCenter" v-show="this.menu.GJ04_01">
				<img src="../static/img/13.png" class="animo" @click="toSupplierBalance" />
				<p @click="toSupplierBalance">供应商结算</p>
			</el-col>
			<el-col :span="4" class="colCenter" v-show="this.menu.YJ04_02">
				<img src="../static/img/14.png" class="animo" @click="toLogisticsBalance" />
				<p @click="toLogisticsBalance">运费结算</p>
			</el-col>
			<el-col :span="4" class="colCenter" v-show="this.menu.KJ04_03">
				<img src="../static/img/15.png" class="animo" @click="toCustomerBalance" />
				<p @click="toCustomerBalance">客户结算</p>
			</el-col>
			<el-col :span="4" class="colCenter" v-show="this.menu.CS04_04">
				<img src="../static/img/16.png" class="animo" @click="toFinance" />
				<p @click="toFinance">财务审核</p>
			</el-col>
			<el-col :span="4" class="colCenter" v-show="this.menu.WJ04_05">
				<img src="../static/img/19.png" class="animo" @click="toMyBalance" />
				<p @click="toMyBalance">我的结算</p>
			</el-col>
			<el-col :span="4" class="colCenter" v-show="this.menu.XS04_06">
				<img src="../static/img/17.png" class="animo" />
				<p>项目审计</p>
			</el-col>
		</el-row>
		<el-row class="managerTop" v-show="this.menu.XTGL05">
			<el-col :span="10" class="managerLine"></el-col>
			<el-col :span="4" class="managerTitle">
				系统管理
				<p class="smallColor">system management</p>
			</el-col>
			<el-col :span="10" class="managerLine"></el-col>
		</el-row>
		<el-row class="managerTop" v-show="this.menu.XTGL05">
			<el-col :span="4" class="colCenter" v-show="this.menu.BG05_01">
				<img src="../static/img/26.png" class="animo" />
				<p>部门管理</p>
			</el-col>
			<el-col :span="4" class="colCenter" v-show="this.menu.YG05_03">
				<img src="../static/img/25.png" class="animo" @click="toUser" />
				<p @click="toUser">用户管理</p>
			</el-col>
			<el-col :span="4" class="colCenter" v-show="this.menu.JG05_02">
				<img src="../static/img/27.png" class="animo"/>
				<p>角色管理</p>
			</el-col>
			<el-col :span="4" class="colCenter" v-show="this.menu.XS05_04">
				<img src="../static/img/28.png" class="animo" />
				<p>系统设置</p>
			</el-col>
			<el-col :span="4" class="colCenter" v-show="this.menu.GS05_05">
				<img src="../static/img/29.png" class="animo"/>
				<p>个性化设置</p>
			</el-col>
			<el-col :span="4" class="colCenter" v-show="this.menu.XC05_06">
				<img src="../static/img/30.png" class="animo"/>
				<p>系统日志查询</p>
			</el-col>
		</el-row>
	</el-row>
</template>

<script>
	import { getAuthList } from '@/api/getData'
	export default {
		data() {
			return {
				menu: {
					XS01: false,
					WL03: false,
					CG02: false,
					JS04: false,
					XTGL05: false,
				},
			}
		},
		created() {
			this.initData();
		},
		methods: {
			//权限设置
			async initData() {
				try {
					const returnData = await getAuthList({
						sys: "erp", //系统名称
						type: "0", //web
					});
					if(returnData.result == "success") {
						if(returnData.list.length > 0) {
							returnData.list.forEach(item => {
								let id = item.code;
								this.menu[id] = true;
								item.appList.forEach(data => {
									let id = data.code;
									this.menu[id] = true;
								});
							});
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
			//跳转到客户维护
			toCutomer() {
				this.$router.push({
					path: '/customer/index'
				})
			},
			//跳转项目机会
			toChance() {
				this.$router.push({
					path: '/chance/index'
				})
			},
			//跳转客户沟通
			toCommunicate() {
				this.$router.push({
					path: '/communicate/index'
				})
			},
			//跳转到合同管理
			toContract() {
				this.$router.push({
					path: '/contract/index'
				});
			},
			//需求计划
			toDemand() {
				this.$router.push({
					path: '/demand/index'
				});
			},
			//集采订单
			toInOrder() {
				this.$router.push({
					path: '/inorder/index'
				});
			},
			//临采订单
			toOutOrder() {
				this.$router.push({
					path: '/outorder/index'
				});
			},
			//临采订单审核
			toOutOrderReview() {
				this.$router.push({
					path: '/outorderreview/index'
				});
			},
			//跳转到库存查询
			toStock() {
				this.$router.push({
					path: '/stock/index'
				});
			},
			//跳转客户沟通
			toOpportunity() {
				this.$router.push({
					path: '/opportunity/index'
				});
			},
			//跳转司机管理
			toDriver() {
				this.$router.push({
					path: '/driver/index'
				});
			},
			//我的订单
			toMyOrder() {
				this.$router.push({
					path: '/myorder/index'
				});
			},
			//跳转供应商维护
			toSupplier() {
				this.$router.push({
					path: '/supplier/index'
				});
			},
			//跳转物流管理
			toLogistics() {
				this.$router.push({
					path: '/logistics/index'
				});
			},
			//跳转到库存调整
			toStockUpdate() {
				this.$router.push({
					path: '/stockupdate/index'
				});
			},
			//跳转到发货管理
			toDelivery() {
				this.$router.push({
					path: '/delivery/index'
				});
			},
			//跳转到出库管理
			toOutBound() {
				this.$router.push({
					path: '/outbound/index'
				});
			},
			//收货管理
			toReciving() {
				this.$router.push({
					path: '/receiving/index'
				});
			},
			//供应商结算
			toSupplierBalance() {
				this.$router.push({
					path: '/supplierbalance/index'
				});
			},
			//物流结算
			toLogisticsBalance() {
				this.$router.push({
					path: '/logisticsbalance/index'
				});
			},
			//客户结算
			toCustomerBalance() {
				this.$router.push({
					path: '/customerbalance/index'
				});
			},
			//财务审核
			toFinance() {
				this.$router.push({
					path: '/finance/index'
				});
			},
			//我的发货单
			toMyDelivery() {
				this.$router.push({
					path: '/mydelivery/index'
				});
			},
			//我的结算
			toMyBalance() {
				this.$router.push({
					path: '/mybalance/index'
				});
			},
			toUser() {
				this.$router.push({
					path: '/user/index'
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '../style/mixin';
	.managerLine {
		border-bottom: 1px #e9e9e9 solid;
		height: 30px;
	}
	
	.managerTop {
		margin: 60px 0;
	}
	
	.managerTitle {
		color: #5b5b5b;
		font-size: 26px;
		text-align: center;
	}
	
	.smallColor {
		font-size: 14px;
		color: #ababab;
	}
	
	.colCenter {
		text-align: center;
		cursor: pointer;
	}
	
	.colCenter p {
		color: #1f1f1f;
		font-size: 18px;
		margin-top: 20px;
	}
	
	@keyframes myfirst {
		/*0% {
			//transform: rotate(0deg);
			transform: scale(1, 1);
		}*/
		50% {
			transform: scale(0.5, 0.5);
		}
		/*100% {
			//transform: rotate(360deg);
			transform: scale(1, 1);
		}*/
	}
	
	.animo:hover {
		/*animation: myfirst 1s;*/
		/*box-shadow:0 15px 30px rgba(0,0,0,0.1);*/
		transform:translate3d(0, -5px, 0);
	}
</style>