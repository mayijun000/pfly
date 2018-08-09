import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const index = r => require.ensure([], () => r(require('@/page/index')), 'index');
const main = r => require.ensure([], () => r(require('@/page/main')), 'main');

//用户管理
const userIndex = r => require.ensure([], () => r(require('@/page/user/index')), 'userIndex');
const userAdd = r => require.ensure([], () => r(require('@/page/user/add')), 'userAdd');
const userModify = r => require.ensure([], () => r(require('@/page/user/modify')), 'userModify');
//维护联系人
const linkManIndex = r => require.ensure([], () => r(require('@/page/linkman/index')), 'linkManIndex');
//客户维护
const customerIndex = r => require.ensure([], () => r(require('@/page/customer/index')), 'customerIndex');
const customerAdd = r => require.ensure([], () => r(require('@/page/customer/add')), 'customerAdd');
const customerModify = r => require.ensure([], () => r(require('@/page/customer/modify')), 'customerModify');
const customerDetail = r => require.ensure([], () => r(require('@/page/customer/detail')), 'customerDetail');
//客户沟通
const communicateIndex = r => require.ensure([], () => r(require('@/page/communicate/index')), 'communicateIndex');
const communicateModify = r => require.ensure([], () => r(require('@/page/communicate/modify')), 'communicateModify');
const communicateDetail = r => require.ensure([], () => r(require('@/page/communicate/detail')), 'communicateDetail');
const communicateAdd = r => require.ensure([], () => r(require('@/page/communicate/add')), 'communicateAdd');
//项目机会
const chanceIndex = r => require.ensure([], () => r(require('@/page/chance/index')), 'chanceIndex');
const chanceAdd = r => require.ensure([], () => r(require('@/page/chance/add')), 'chanceAdd');
const chanceDetail = r => require.ensure([], () => r(require('@/page/chance/detail')), 'chanceDetail');
const chanceModify = r => require.ensure([], () => r(require('@/page/chance/modify')), 'chanceModify');
//供应商维护
const supplierIndex = r => require.ensure([], () => r(require('@/page/supplier/index')), 'supplierIndex');
const supplierAdd = r => require.ensure([], () => r(require('@/page/supplier/add')), 'supplierAdd');
const supplierDetail = r => require.ensure([], () => r(require('@/page/supplier/detail')), 'supplierDetail');
const supplierModify = r => require.ensure([], () => r(require('@/page/supplier/modify')), 'supplierModify');
//物流管理
const logisticsIndex = r => require.ensure([], () => r(require('@/page/logistics/index')), 'logisticsIndex');
const logisticsAdd = r => require.ensure([], () => r(require('@/page/logistics/add')), 'logisticsAdd');
const logisticsModify = r => require.ensure([], () => r(require('@/page/logistics/modify')), 'logisticsModify');
const logisticsDetail = r => require.ensure([], () => r(require('@/page/logistics/detail')), 'logisticsDetail');
//司机管理
const driverIndex = r => require.ensure([], () => r(require('@/page/driver/index')), 'driverIndex');
const driverAdd = r => require.ensure([], () => r(require('@/page/driver/add')), 'driverAdd');
const driverDetail = r => require.ensure([], () => r(require('@/page/driver/detail')), 'driverDetail');
const driverModify = r => require.ensure([], () => r(require('@/page/driver/modify')), 'driverModify');
//合同管理
const contractIndex = r => require.ensure([], () => r(require('@/page/contract/index')), 'contractIndex');
const contractAdd = r => require.ensure([], () => r(require('@/page/contract/add')), 'contractAdd');
const contractModify = r => require.ensure([], () => r(require('@/page/contract/modify')), 'contractModify');
const contractDetail = r => require.ensure([], () => r(require('@/page/contract/detail')), 'contractDetail');
//需求计划
const demandIndex = r => require.ensure([], () => r(require('@/page/demand/index')), 'demandIndex');
const demandAdd = r => require.ensure([], () => r(require('@/page/demand/add')), 'demandAdd');
const demandModify = r => require.ensure([], () => r(require('@/page/demand/modify')), 'demandModify');
const demandDetail = r => require.ensure([], () => r(require('@/page/demand/detail')), 'demandDetail');
//临采订单
const outOrderIndex = r => require.ensure([], () => r(require('@/page/outOrder/index')), 'outOrderIndex');
const outOrderModify = r => require.ensure([], () => r(require('@/page/outOrder/modify')), 'outOrderModify');
const outOrderAdd = r => require.ensure([], () => r(require('@/page/outOrder/add')), 'outOrderAdd');
const outOrderDetail = r => require.ensure([], () => r(require('@/page/outOrder/detail')), 'outOrderDetail');
//临采订单审核
const outOrderReviewIndex = r => require.ensure([], () => r(require('@/page/outOrderReview/index')), 'outOrderReviewIndex');
const outOrderReviewDetail = r => require.ensure([], () => r(require('@/page/outOrderReview/detail')), 'outOrderReviewDetail');
//集采订单
const inOrderIndex = r => require.ensure([], () => r(require('@/page/inOrder/index')), 'inOrderIndex');
const inOrderDetail = r => require.ensure([], () => r(require('@/page/inOrder/detail')), 'inOrderDetail');
const inOrderAdd = r => require.ensure([], () => r(require('@/page/inOrder/add')), 'inOrderAdd');
const inOrderModify = r => require.ensure([], () => r(require('@/page/inOrder/modify')), 'inOrderModify');
//我的订单
const myOrderIndex = r => require.ensure([], () => r(require('@/page/myOrder/index')), 'myOrderIndex');
const myOrderDetail = r => require.ensure([], () => r(require('@/page/myOrder/detail')), 'myOrderDetail');
//库存查询
const stockIndex = r => require.ensure([], () => r(require('@/page/stock/index')), 'stockIndex');
const stockDetail = r => require.ensure([], () => r(require('@/page/stock/detail')), 'stockDetail');
//库存调整
const stockUpdateIndex = r => require.ensure([], () => r(require('@/page/stockUpdate/index')), 'stockUpdateIndex');
const stockUpdateDetail = r => require.ensure([], () => r(require('@/page/stockUpdate/detail')), 'stockUpdateDetail');
//发货管理
const deliveryIndex = r => require.ensure([], () => r(require('@/page/delivery/index')), 'deliveryIndex');
const deliveryAdd = r => require.ensure([], () => r(require('@/page/delivery/add')), 'deliveryAdd');
const deliveryModify = r => require.ensure([], () => r(require('@/page/delivery/modify')), 'deliveryModify');
const deliveryDetail = r => require.ensure([], () => r(require('@/page/delivery/detail')), 'deliveryDetail');
//出库管理
const outBoundIndex = r => require.ensure([], () => r(require('@/page/outBound/index')), 'outBoundIndex');
const outBoundDetail = r => require.ensure([], () => r(require('@/page/outBound/detail')), 'outBoundDetail');
const outBoundSelect = r => require.ensure([], () => r(require('@/page/outBound/select')), 'outBoundSelect');
//收货管理
const receivingIndex = r => require.ensure([], () => r(require('@/page/receiving/index')), 'receivingIndex');
const receivingDetail = r => require.ensure([], () => r(require('@/page/receiving/detail')), 'receivingDetail');
//供应商结算
const supplierBalanceIndex = r => require.ensure([], () => r(require('@/page/supplierBalance/index')), 'supplierBalanceIndex');
const supplierBalanceAdd = r => require.ensure([], () => r(require('@/page/supplierBalance/add')), 'supplierBalanceAdd');
const supplierBalanceModify = r => require.ensure([], () => r(require('@/page/supplierBalance/modify')), 'supplierBalanceModify');
const supplierBalanceDetail = r => require.ensure([], () => r(require('@/page/supplierBalance/detail')), 'supplierBalanceDetail');
//物流结算
const logisticsBalanceIndex = r => require.ensure([], () => r(require('@/page/logisticsBalance/index')), 'logisticsBalanceIndex');
const logisticsBalanceAdd = r => require.ensure([], () => r(require('@/page/logisticsBalance/add')), 'logisticsBalanceAdd');
const logisticsBalanceModify = r => require.ensure([], () => r(require('@/page/logisticsBalance/modify')), 'logisticsBalanceModify');
const logisticsBalanceDetail = r => require.ensure([], () => r(require('@/page/logisticsBalance/detail')), 'logisticsBalanceDetail');
//客户结算
const customerBalanceIndex = r => require.ensure([], () => r(require('@/page/customerBalance/index')), 'customerBalanceIndex');
const customerBalanceAdd = r => require.ensure([], () => r(require('@/page/customerBalance/add')), 'customerBalanceAdd');
const customerBalanceModify = r => require.ensure([], () => r(require('@/page/customerBalance/modify')), 'customerBalanceModify');
const customerBalanceDetail = r => require.ensure([], () => r(require('@/page/customerBalance/detail')), 'customerBalanceDetail');
//财务审核
const financeIndex = r => require.ensure([], () => r(require('@/page/finance/index')), 'financeIndex');
const financeDetail = r => require.ensure([], () => r(require('@/page/finance/detail')), 'financeDetail');
//我的发货单
const myDeliveryIndex = r => require.ensure([], () => r(require('@/page/myDelivery/index')), 'myDeliveryIndex');
const myDeliveryDetail = r => require.ensure([], () => r(require('@/page/myDelivery/detail')), 'myDeliveryDetail');
//我的结算
const myBalanceIndex = r => require.ensure([], () => r(require('@/page/myBalance/index')), 'myBalanceIndex');
const myBalanceDetail = r => require.ensure([], () => r(require('@/page/myBalance/detail')), 'myBalanceDetail');

const routes = [{
		path: '/',
		component: login,
		//meta:{requireAuth: false}, 
	},
	{
		path: '/index',
		component: index,
		//meta:{requireAuth: false}, 
	},
	{
		path: '/main',
		component: main,
		//meta:{requireAuth: true}, 
	}, {
		path: '/linkman/index', //联系人管理
		component: linkManIndex,
		meta: ['联系人维护']
	}, {
		path: '/customer/index', //客户管理
		component: customerIndex,
		meta: ['客户管理']
	}, {
		path: '/customer/add',
		component: customerAdd,
		meta: ['客户管理', '添加']
	}, {
		path: '/customer/modify',
		component: customerModify,
		meta: ['客户管理', '编辑']
	}, {
		path: '/customer/detail',
		component: customerDetail,
		meta: ['客户管理', '详情']
	}, {
		path: '/communicate/index', //客户沟通查询页面
		component: communicateIndex,
		meta: ['客户沟通']
	}, {
		path: '/communicate/modify',
		component: communicateModify,
		meta: ['客户沟通', '编辑']
	}, {
		path: '/communicate/add',
		component: communicateAdd,
		meta: ['客户沟通', '添加']
	}, {
		path: '/communicate/detail',
		component: communicateDetail,
		meta: ['客户沟通', '详情']
	}, {
		path: '/myorder/index', //我的订单
		component: myOrderIndex,
		meta: ['我的订单']
	}, {
		path: '/myorder/detail',
		component: myOrderDetail,
		meta: ['我的订单', '详情']
	}, {
		path: '/chance/index', //项目机会
		component: chanceIndex,
		meta: ['项目机会']
	}, {
		path: '/chance/add',
		component: chanceAdd,
		meta: ['项目机会', '添加']
	}, {
		path: '/chance/detail',
		component: chanceDetail,
		meta: ['项目机会', '编辑']
	}, {
		path: '/chance/modify',
		component: chanceModify,
		meta: ['项目机会', '详情']
	}, {
		path: '/supplier/index', //供应商维护
		component: supplierIndex,
		meta: ['供应商管理']
	}, {
		path: '/supplier/add',
		component: supplierAdd,
		meta: ['供应商管理', '添加']
	}, {
		path: '/supplier/detail',
		component: supplierDetail,
		meta: ['供应商管理', '详情']
	}, {
		path: '/supplier/modify',
		component: supplierModify,
		meta: ['供应商管理', '编辑']
	}, {
		path: '/logistics/index', //物流公司
		component: logisticsIndex,
		meta: ['物流公司']
	}, {
		path: '/logistics/add',
		component: logisticsAdd,
		meta: ['物流公司', '添加']
	}, {
		path: '/logistics/modify',
		component: logisticsModify,
		meta: ['物流公司', '编辑']
	}, {
		path: '/logistics/detail',
		component: logisticsDetail,
		meta: ['物流公司', '详情']
	}, {
		path: '/driver/index', //司机管理
		component: driverIndex,
		meta: ['司机管理']
	}, {
		path: '/driver/add',
		component: driverAdd,
		meta: ['司机管理', '添加']
	}, {
		path: '/driver/detail',
		component: driverDetail,
		meta: ['司机管理', '详情']
	}, {
		path: '/driver/modify',
		component: driverModify,
		meta: ['司机管理', '编辑']
	}, {
		path: '/contract/index', //合同管理查询页面
		component: contractIndex,
		meta: ['合同管理']
	}, {
		path: '/contract/add',
		component: contractAdd,
		meta: ['合同管理', '添加']
	}, , {
		path: '/contract/modify',
		component: contractModify,
		meta: ['合同管理', '编辑']
	},
	{
		path: '/contract/detail',
		component: contractDetail,
		meta: ['合同管理', '详情']
	},
	{
		path: '/demand/index', //需求计划查询页面
		component: demandIndex,
		meta: ['需求计划']
	}, {
		path: '/demand/add',
		component: demandAdd,
		meta: ['需求计划', '添加']
	}, , {
		path: '/demand/modify',
		component: demandModify,
		meta: ['需求计划', '编辑']
	},
	{
		path: '/demand/detail',
		component: demandDetail,
		meta: ['需求计划', '详情']
	}, {
		path: '/outorder/index', //临采订单查询页面
		component: outOrderIndex,
		meta: ['临采订单']
	},
	{
		path: '/outorder/detail',
		component: outOrderDetail,
		meta: ['临采订单', '详情']
	}, {
		path: '/outorder/modify',
		component: outOrderModify,
		meta: ['临采订单', '编辑']
	},
	{
		path: '/outorder/add',
		component: outOrderAdd,
		meta: ['临采订单', '添加']
	},
	{
		path: '/outorderreview/index', //临采订单查询页面
		component: outOrderReviewIndex,
		meta: ['订单审核']
	},
	{
		path: '/outorderreview/detail',
		component: outOrderReviewDetail,
		meta: ['订单审核', '详情']
	},

	{
		path: '/inorder/index', //集采订单查询页面
		component: inOrderIndex,
		meta: ['集采订单']
	},
	{
		path: '/inorder/add', 
		component: inOrderAdd,
		meta: ['集采订单', '添加']
	},
	{
		path: '/inorder/modify', 
		component: inOrderModify,
		meta: ['集采订单', '修改']
	},
	{
		path: '/inorder/detail',
		component: inOrderDetail,
		meta: ['集采订单', '详情']
	},

	{
		path: '/stock/index',
		component: stockIndex,
		meta: ['库存查询']
	},
	{
		path: '/stock/detail',
		component: stockDetail,
		meta: ['库存详情']
	},
	{
		path: '/stockupdate/index',
		component: stockUpdateIndex,
		meta: ['库存调整']
	},
	{
		path: '/stockupdate/modify',
		component: stockUpdateDetail,
		meta: ['库存调整', '调整']
	},
	{
		path: '/delivery/index',
		component: deliveryIndex,
		meta: ['发货管理']
	}, {
		path: '/delivery/add',
		component: deliveryAdd,
		meta: ['发货管理', '添加']
	},
	{
		path: '/delivery/modify',
		component: deliveryModify,
		meta: ['发货管理', '编辑']
	},
	{
		path: '/delivery/detail',
		component: deliveryDetail,
		meta: ['发货管理', '详情']
	},
	{
		path: '/outbound/index',
		component: outBoundIndex,
		meta: ['出库管理']
	},
	{
		path: '/outbound/detail',
		component: outBoundDetail,
		meta: ['出库管理', '详情']
	},
	{
		path: '/outbound/select',
		component: outBoundSelect,
		meta: ['出库管理', '选库']
	},
	{
		path: '/receiving/index',
		component: receivingIndex,
		meta: ['收货管理']
	},
	{
		path: '/receiving/detail',
		component: receivingDetail,
		meta: ['收货管理', '收货信息']
	},
	{
		path: '/supplierbalance/index',
		component: supplierBalanceIndex,
		meta: ['供应商结算']
	},
	{
		path: '/supplierbalance/add',
		component: supplierBalanceAdd,
		meta: ['供应商结算', '添加']
	},
	{
		path: '/supplierbalance/modify',
		component: supplierBalanceModify,
		meta: ['供应商结算', '编辑']
	},
	{
		path: '/supplierbalance/detail',
		component: supplierBalanceDetail,
		meta: ['供应商结算', '详情']
	},
	{
		path: '/logisticsbalance/index',
		component: logisticsBalanceIndex,
		meta: ['运费结算']
	},
	{
		path: '/logisticsbalance/add',
		component: logisticsBalanceAdd,
		meta: ['运费结算', '添加']
	},
	{
		path: '/logisticsbalance/modify',
		component: logisticsBalanceModify,
		meta: ['运费结算', '编辑']
	},
	{
		path: '/logisticsbalance/detail',
		component: logisticsBalanceDetail,
		meta: ['运费结算', '详情']
	},
	{
		path: '/customerbalance/index',
		component: customerBalanceIndex,
		meta: ['客户结算']
	},
	{
		path: '/customerbalance/add',
		component: customerBalanceAdd,
		meta: ['客户结算', '添加']
	},
	{
		path: '/customerbalance/modify',
		component: customerBalanceModify,
		meta: ['客户结算', '编辑']
	},
	{
		path: '/customerbalance/detail',
		component: customerBalanceDetail,
		meta: ['客户结算', '详情']
	},
	{
		path: '/finance/index',
		component: financeIndex,
		meta: ['财务审核']
	},
	{
		path: '/finance/detail',
		component: financeDetail,
		meta: ['财务审核','详情']
	},
	{
		path: '/mydelivery/index',
		component: myDeliveryIndex,
		meta: ['我的发货单']
	},
	{
		path: '/mydelivery/detail',
		component: myDeliveryDetail,
		meta: ['我的发货单', '详情']
	},
	{
		path: '/mybalance/index',
		component: myBalanceIndex,
		meta: ['我的结算']
	},
	{
		path: '/mybalance/detail',
		component: myBalanceDetail,
		meta: ['我的结算','详情']
	},
	{
		path: '/user/index',
		component: userIndex,
		meta: ['用户管理']
	},
	{
		path: '/user/add',
		component: userAdd,
		meta: ['用户管理','添加']
	},
	{
		path: '/user/modify',
		component: userModify,
		meta: ['用户管理','修改']
	},
	

]

export default new Router({
	mode: 'history',
	routes,
	strict: process.env.NODE_ENV !== 'production',
	//解决路由跳转滚动条没有回到顶部的问题
	scrollBehavior(to, from, savedPosition) {
		if(savedPosition) {
			return savedPosition
		} else {
			return {
				x: 0,
				y: 0
			}
		}
	},
	
})