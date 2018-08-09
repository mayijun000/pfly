<template>
	<section>
		<el-row>
			<el-col :span="24">
				<div class="tableTitle">出库列表</div>
				<el-form :model="findForm" :inline="true" class="demo-form-inline">
					<el-form-item label="合同编号">
						<el-select v-model="findForm.contractId" placeholder="请选择合同编号">
							<el-option v-for="item in contractList" :key="item.contractNum" :label="item.contractNum" :value="item.contractNum">
							</el-option>
						</el-select>
					</el-form-item>
					<el-button type="primary" @click="find" style="margin-left: 10px;">查询</el-button>
				</el-form>
				<el-table :data="tableData" border stripe style="width: 100%">
					<el-table-column prop="_contractId" label="合同编号">
					</el-table-column>
					<el-table-column prop="deliveryNum" label="发货单号">
					</el-table-column>
					<el-table-column prop="enterDate" label="入场时间">
					</el-table-column>
					<el-table-column prop="deliveryNumber" label="计划发货总量(吨)">
					</el-table-column>
					<el-table-column prop="realDeliverTotal" label="实出总量(吨)">
					</el-table-column>
					<el-table-column prop="outDate" label="出库日期">
					</el-table-column>
					<el-table-column label="操作" width="300">
						<template scope="scope">
							<el-button size="small" type="info" @click="detail(scope.row)">查询发货单</el-button>
							<el-button size="small" v-show="scope.row.isShow" type="success" @click="selectBound(scope.row)">出库</el-button>
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
	import { getStockOutList, fetchForDelivery } from '@/api/getData'
	export default {
		data() {
			return {
				findForm: {
					orderNum: '',
				},
				contractList: [],
				tableData: [],
				limit: 10,
				count: 0,
				currentPage: 1,
			}
		},
		created() {
			this.fetchForDeliveryData();
			this.initData();
		},
		methods: {
			async fetchForDeliveryData() {
				try {
					const returnData = await fetchForDelivery();
					if(returnData.result == "success") {
						this.contractList = returnData.list;
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
			async initData() {
				try {
					let page = {
						currentPage: this.currentPage.toString(),
						pageSize: this.limit.toString()
					}
					const stockData = await getStockOutList({
						search: this.findForm,
						page: page,
					});
					if(stockData.result == "success") {
						stockData.list.forEach(item => {
							item.enterDate = item.enterDate.substr(0, 10);
							item.outDate = item.outDate.substr(0, 10);
							if(item.status > 2) {
								item.isShow = false;
							} else {
								item.isShow = true;
							}
						});
						this.tableData = stockData.list;
						this.count = Number(stockData.page.maxPage);
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
						deliverId: row.deliverId
					}
				})
			},
			selectBound(row) {
				this.$router.push({
					path: 'select',
					query: {
						deliverId: row.deliverId
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