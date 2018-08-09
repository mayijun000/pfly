<template>
	<section>
		<el-row>
			<el-col :span="24">
				<div class="tableTitle">库存列表</div>
				<el-form :model="findForm" :inline="true" class="demo-form-inline">
					<!--<el-form-item label="仓单">
						<el-input placeholder="仓单" v-model="findForm.billId"></el-input>
					</el-form-item>-->
					<el-form-item label="仓库">
						<el-select style="width:300px" clearable v-model="findForm.wareId" placeholder="请选择仓库">
							<el-option v-for="item in warehouseList" :key="item.wareId" :label="item.address" :value="item.wareId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-button type="primary" @click="find" style="margin-left: 10px;">查询</el-button>
				</el-form>
				<el-table :data="tableData" border stripe style="width: 100%">
					<el-table-column prop="orderNum" label="订单" min-width="100">
					</el-table-column>
					<el-table-column prop="orderType" label="入库类型" min-width="70">
					</el-table-column>
					<el-table-column prop="_wareId" label="仓库" min-width="100">
					</el-table-column>
					<el-table-column prop="name" label="产品名称" min-width="100">
					</el-table-column>
					<el-table-column prop="material" label="材质">
					</el-table-column>
					<el-table-column prop="specifiModel" label="规格型号" min-width="70">
					</el-table-column>
					<el-table-column prop="createDate" label="入库时间" min-width="110">
					</el-table-column>
					<el-table-column prop="number" label="入库数量(吨)" min-width="110">
					</el-table-column>
					<el-table-column prop="price" label="采购单价" min-width="100">
					</el-table-column>
					<el-table-column prop="remaindeStock" label="库存量(吨)">
					</el-table-column>
					<el-table-column label="操作" width="80">
						<template scope="scope">
							<el-button size="small" type="info" @click="detail(scope.row)">详情</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="block">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10" layout="prev, pager, next" :page-count="count">
					</el-pagination>
				</div>
			</el-col>
		</el-row>

	</section>
</template>
<script>
	import { getStockList, getWarehouseList } from '@/api/getData'
	export default {
		data() {
			return {
				findForm: {
					//					billId: '',
					wareId: "",
				},
				warehouseList: [],
				tableData: [],
				limit: 10,
				count: 0,
				currentPage: 1,
			}
		},
		created() {
			this.getWarehouseListData();
			this.initData();
		},
		methods: {
			async initData() {
				try {
					let page = {
						currentPage: this.currentPage.toString(),
						pageSize: this.limit.toString()
					}
					const stockData = await getStockList({
						search: this.findForm,
						page: page,
					});
					if(stockData.result == "success") {
						this.count = Number(stockData.page.maxPage);
						stockData.list.forEach(item => {
							item.createDate = item.createDate.substr(0, 10);
							if(item.orderType == "0") {
								item.orderType = "临采";
							} else if(item.orderType == "1") {
								item.orderType = "集采";
							}
						});
						this.tableData = stockData.list;
					} else {
						this.$message({
							type: 'error',
							message: stockData.message
						});
					}
				} catch(err) {
					console.log('获取数据失败', err);
				}
			},
			async getWarehouseListData() {
				try {
					const returnData = await getWarehouseList();
					if(returnData.result == "success") {
						this.educationData = [];
						returnData.list.forEach((item, index) => {
							const data = {};
							data.wareId = item.wareId;
							data.address = item.memberName + "仓库";
							this.warehouseList.push(data);
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
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.initData();
			},
			find() {
				this.initData();
			},
			detail(row) {
				this.$router.push({
					path: 'detail',
					query: {
						inId: row.inId
					}
				})
			},
		}
	};
</script>
<style scoped>
	.el-pagination {
		text-align: center;
		margin-top: 30px;
	}
	
	.el-message-box__btns .cancel {
		float: right;
		margin-left: 10px;
	}
</style>