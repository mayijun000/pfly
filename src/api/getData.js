import fetch from '@/config/fetch'

export const updatepwd = data => fetch('/token/updatepwd', data, 'console');//修改密码
export const getAuthList = data => fetch('/microModule/listWithFun', data, 'console');//权限列表
export const getRoleList = data => fetch('/role/fetch', data, 'console');//角色列表
export const login = data => fetch('	/erp/user/login', data, 'erp');//登录接口
export const logout = data => fetch('/erp/user/logout', data, 'erp');//登出接口
export const getUserList = data => fetch('/user/fetch', data, 'console');//用户列表
export const getUserSave = data => fetch('/user/save', data, 'console');//用户保存
export const getUserInfo = data => fetch('/user/info', data, 'console');//用户查询
export const getUserDelete = data => fetch('/user/delete', data, 'console');//用户删除

export const getCompanyInfo = data => fetch('/company/info', data, 'console');//查询公司信息
export const getCityList = data => fetch('/placeInfo/subList', data, 'console');//查询省市
export const getClassification = data => fetch('/classification/Queryclassification', data, 'erp');//产品分类
export const queryProductExistence = data => fetch('/product/queryProductExistence', data, 'erp');//判断产品是否存在

export const getLinkManList = data => fetch('/erp/customer/list/contacts', data, 'erp');//联系人列表
export const getLinkManSave = data => fetch('/erp/customer/save/contact', data, 'erp');//保存联系人
export const getLinkManDelete = data => fetch('/erp/customer/delete/contact', data, 'erp');//删除联系人
export const getLinkManSelect = data => fetch('/erp/customer/list/contactsAll', data, 'erp');//选择联系人
		
export const getDriverList = data => fetch('/logistics/driver/fetch', data, 'logistics');//司机列表
export const getDriverSave = data => fetch('/logistics/driver/save', data, 'logistics');//保存司机
export const getDriverInfo = data => fetch('/logistics/driver/info', data, 'logistics');//司机详情
export const getDriverDelete = data => fetch('/logistics/driver/delete', data, 'logistics');//删除司机

export const getMemberSave = data => fetch('/erp/member/save', data, 'erp');//保存客户
export const getMemberInfo = data => fetch('/erp/member/info', data, 'erp');//客户详情
export const getMemberList = data => fetch('/erp/member/fetch', data, 'erp');//客户列表
export const getMemberDelete = data => fetch('/erp/member/delete', data, 'erp');//删除客户
export const getMemberSelect = data => fetch('/erp/member/list', data, 'erp');//选择客户
	
export const getChanceList = data => fetch('/erp/projectchance/fetch', data, 'erp');//项目机会列表
export const getChanceDelete = data => fetch('/erp/projectchance/delete', data, 'erp');//删除项目机会
export const getChanceInfo = data => fetch('/erp/projectchance/info', data, 'erp');//项目机会详情
export const getChanceSave = data => fetch('/erp/projectchance/save', data, 'erp');//保存项目机会

export const getCommunicateList = data => fetch('/erp/communication/fetch', data, 'erp');//客户沟通列表
export const getCommunicateInfo = data => fetch('/erp/communication/info', data, 'erp');//客户沟通详情
export const getCommunicateSave = data => fetch('/erp/communication/save', data, 'erp');//客户沟通保存
export const getCommunicateDelete = data => fetch('/erp/communication/delete', data, 'erp');//客户沟通删除

export const getContractList = data => fetch('/erp/contract/fetch', data, 'erp');//合同列表
export const getContractDelete = data => fetch('/erp/contract/delete', data, 'erp');//删除合同
export const getContractInfo = data => fetch('/erp/contract/info', data, 'erp');//合同详情
export const getContractSave = data => fetch('/erp/contract/save', data, 'erp');//保存合同
export const getContractEnd = data => fetch('/erp/contract/end', data, 'erp');//结束合同
export const fetchForDelivery = data => fetch('/erp/contract/fetchForDelivery', data, 'erp');//合同下拉列表
export const deliveryAddrList = data => fetch('/erp/contract/delivery/fetch', data, 'erp');//合同交割地列表

export const getRequirementList = data => fetch('/erp/requirement/fetch', data, 'erp');//需求计划列表
export const getRequirementDelete = data => fetch('/erp/requirement/delete', data, 'erp');//删除需求计划
export const getRequirementInfo = data => fetch('/erp/requirement/info', data, 'erp');//需求计划详情
export const getRequirementSave = data => fetch('/erp/requirement/save', data, 'erp');//保存需求计划


export const getTempOrderList = data => fetch('/erp/order/fetchTempOrder', data, 'erp');//临采订单列表
export const getOrderList = data => fetch('/erp/order/fetch', data, 'erp');//订单列表
export const fetchAuditList = data => fetch('/erp/order/fetchAuditList', data, 'erp');//订单审核列表
export const getOrderInfo = data => fetch('/erp/order/info', data, 'erp');//订单详情
export const getOrderAudit = data => fetch('/erp/order/audit', data, 'erp');//订单提交
export const getOrderSave = data => fetch('/erp/order/save', data, 'erp');//订单保存
export const getOrderStockin = data => fetch('/logistics/stockinbill/onekey/stockin', data, 'logistics');//订单一键入库
export const getOrderSuccess = data => fetch('/erp/order/success', data, 'erp');//订单审核成功
export const getOrderReject = data => fetch('/erp/order/reject', data, 'erp');//订单驳回
export const getMyOrderList = data => fetch('/erp/order/my/order', data, 'erp');//我的订单

export const getStockList = data => fetch('/logistics/stockin/fetchStockIn', data, 'logistics');//库存列表
export const getStockSelectList = data => fetch('/logistics/stockin/fetch', data, 'logistics');//库存列表
export const getStockInfo = data => fetch('	/logistics/stockin/info', data, 'logistics');//库存详情
export const getStockChangeList = data => fetch('/logistics/stockChange/fetch', data, 'logistics');//库存调整记录列表
export const getStockSave = data => fetch('/logistics/stockChange/save', data, 'logistics');//库存调整保存

export const getDeliveryList = data => fetch('/erp/delivery/fetch', data, 'erp');//发货列表
export const getDeliveryDelete = data => fetch('/erp/delivery/delete', data, 'erp');//删除发货
export const getDeliverySave = data => fetch('/erp/delivery/save', data, 'erp');//保存发货
export const getDeliveryReceiver = data => fetch('/erp/delivery/receiver', data, 'erp');//保存收货
export const getDeliverInfo = data => fetch('/erp/delivery/info', data, 'erp');//发货单详情
export const getDeliveryAudit = data => fetch('/erp/delivery/audit', data, 'erp');//提交发货单
export const getItemFetch = data => fetch('/erp/contract/detail', data, 'erp');//查询合同和仓库信息
export const getMyDeliveryList = data => fetch('/erp/delivery/my/delivery', data, 'erp');//我的发货单 
export const updateAddress = data => fetch('/erp/delivery/updateAddress', data, 'erp');//修改收货地址



export const getWarehouseList = data => fetch('/logistics/warehouse/fetchForSelect', data, 'logistics');//仓库列表	
	
export const getStockOutList = data => fetch('/erp/delivery/outList', data, 'erp');//出库列表
export const getStockOutSave = data => fetch('/logistics/stockout/saveList', data, 'logistics');//保存出库
export const getReceiveList = data => fetch('/erp/delivery/receiveList', data, 'erp');//收货列表
	
export const getBalanceList = data => fetch('/erp/balance/fetch', data, 'erp');//结算列表

export const getFetchFinanceList = data => fetch('/erp/balance/fetchFinance', data, 'erp');//结算审核列表


export const getBalanceAudit = data => fetch('/erp/balance/audit', data, 'erp');//提交审核
export const getBalanceReject = data => fetch('/erp/balance/audit/reject', data, 'erp');//结算审核驳回
export const getBalanceSuccess = data => fetch('/erp/balance/audit/success', data, 'erp');//结算审核通过
export const getMyBalanceList = data => fetch('/erp/balance/my/balance', data, 'erp');//我的结算列表
	

export const balanceList = data => fetch('/erp/delivery/item/balanceList', data, 'erp');//列表
export const balanceSave = data => fetch('/erp/balance/save', data, 'erp');//运费结算保存
export const balanceInfo = data => fetch('/erp/balance/info', data, 'erp');//运费结算列表详情




