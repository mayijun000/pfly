<template>
	<section>
		<el-row>
			<el-col :span="24">
				<div class="tableTitle">我的发货单列表</div>
				<el-form :model="findForm" :inline="true" class="demo-form-inline">
					<el-form-item label="司机">
						<el-select style="width:200px" filterable clearable v-model="findForm.driverId" placeholder="请选择">
							<el-option v-for="item in driverList" :key="item.driverId" :label="item._driverId" :value="item.driverId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-button type="primary" @click="find" style="margin-left: 10px;">查询</el-button>
				</el-form>
				<el-table :data="tableData" border stripe style="width: 100%">
					<el-table-column prop="deliveryNum" label="发货单号" min-width="100">
					</el-table-column>
					<el-table-column prop="_contractId" label="合同编号" min-width="100">
					</el-table-column>
					<el-table-column prop="_driverId" label="司机">
					</el-table-column>
					<el-table-column prop="carNum" label="车牌号" min-width="100">
					</el-table-column>
					<el-table-column prop="deliveryNumber" label="实发总量(吨)" min-width="100">
					</el-table-column>
					<el-table-column prop="receiptNumber" label="签收总量(吨)" min-width="100">
					</el-table-column>
					<el-table-column prop="addressId" label="收货地址" min-width="100">
					</el-table-column>
					<el-table-column prop="statusName" label="状态">
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
	import { getMyDeliveryList, getDriverList } from '@/api/getData'
	export default {
		data() {
			return {
				findForm: {
					driverId: '',
				},
				driverList: [],
				tableData: [],
				limit: 10,
				count: 0,
				currentPage: 1,
			}
		},
		created() {
			this.getDriverListData();
			this.initData();
		},
		methods: {
			async getDriverListData() {
				try {
					let page = {
						currentPage: "1",
						pageSize: "1000"
					}

					const communicateData = await getDriverList({
						page: page,
					});
					if(communicateData.result == "success") {
						this.driverList = communicateData.list;
					} else {
						this.$message({
							type: 'error',
							message: communicateData.message
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
					const stockData = await getMyDeliveryList({
						search: this.findForm,
						page: page,
					});
					if(stockData.result == "success") {
						stockData.list.forEach(item => {
							if(item.status == "3") {
								item.statusName = "已发货";
							} else if(item.status == "4") {
								item.statusName = "已收货";
							}
						});
						this.tableData = stockData.list;
						this.count = Number(stockData.page.maxPage);
					} else {
						this.$message({
							type: 'error',
							message: res.message
						});
					}
				} catch(err) {
					console.log('获取数据失败', err);
				}
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
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.initData();
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