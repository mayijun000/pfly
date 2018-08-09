<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width: 1000px;margin: 0 auto;">
					<el-form :model="receForm" ref="receForm" :rules="rules">
						<header class="contractTitle">收货信息</header>
						<ul class="contractBody">
							<li>
								<span class="bodyLabel">签收总量(吨)：</span><span>
									<el-form-item  prop="receiptNumber">
										<el-input v-model="receForm.receiptNumber"></el-input>
									</el-form-item>
								</span>
								<span class="bodyLabel">收货人：</span><span>
									<el-form-item  prop="receipter">
										<el-input v-model="receForm.receipter"></el-input>
									</el-form-item>
								</span>
							</li>
							<li>
								<span class="bodyLabel">签收日期：</span><span>
									<el-form-item  prop="receiptDate">
										<el-date-picker v-model="receForm.receiptDate" align="right" type="date" placeholder="请选择收货日期">
										</el-date-picker>
									</el-form-item>
								</span>
								<span class="bodyLabel"></span><span></span>
							</li>
						</ul>
						<div>
							<div class="editerTitle">上传附件：</div>
							<div class="editer">
								<upload-ali-oss :url.sync="uploadForm.content.path" :multiple="true" :id="uploadForm.id" :ossClient="ossClient" :inputName="uploadForm.inputName" :path="uploadForm.upload.path" :uploadRes.sync="uploadForm.uploadRes"></upload-ali-oss>
								<div v-show="uploadForm.uploadRes" v-for="item in files">
									<a :href="item.imgSrc" target="_Blank">{{item.name}}</a>
								</div>
							</div>
						</div>
					</el-form>
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
							<span class="bodyLabel">收货地址：</span><span>{{formData._addressId}}</span>
						</li>
						<li>
							<span class="bodyLabel">进场时间：</span><span>{{formData.enterDate}}</span>
							<span class="bodyLabel">物流公司：</span><span>{{formData.logisticsName}}</span>
						</li>
						<li>
							<span class="bodyLabel">司机：</span><span>{{formData._driverId}}</span>
							<span class="bodyLabel">联系方式：</span><span>{{formData.mobile}}</span>
						</li>
						<li>
							<span class="bodyLabel">车牌号：</span><span>{{formData.carNum}}</span>
							<span class="bodyLabel"></span><span></span>
						</li>
					</ul>
					<el-table :data="formData.itemList" style="width:100%;" align="center">
						<el-table-column label="产品名称" prop="name">
						</el-table-column>
						<el-table-column label="材质" prop="material">
						</el-table-column>
						<el-table-column label="规格型号" prop="specifiModel">
						</el-table-column>
						<el-table-column label="实收量(吨)" prop="itemRealDeliveryNumber">
						</el-table-column>
						<!--<el-table-column label="单价" prop="price">
						</el-table-column>
						<el-table-column label="金额" prop="total">
						</el-table-column>-->
					</el-table>
					<div class="button_submit">
						<el-button type="primary" @click="saveReceiving('receForm')">保存</el-button>
						<el-button type="primary" @click="toBack">返回</el-button>
					</div>
				</el-card>
			</el-col>
		</el-row>

	</section>
</template>
<script>
	import ossUpload from '@/components/ossUpload';
	import { getDeliverInfo, getDeliveryReceiver } from '@/api/getData'
	export default {
		data() {
			var checkNumber = (rule, value, callback) => {
				if(!value) {
					callback(new Error('数量不能为空'));
				} else if(!/^[0-9]{1,20}(.[0-9]{0,3})?$/.test(value)) {
					callback(new Error('请输入正确的数字格式'));
				} else {
					callback();
				}
			};
			return {
				dialogFormVisible: false,
				productData: [],
				formData: {},
				rules: {
					receiptNumber: [{
						required: true,
						validator: checkNumber,
						trigger: 'blur'
					}],
					receiptDate: [{
						required: true,
						message: '请选择收货日期'
					}],
					receipter: [{
							required: true,
							message: '请输入收货人',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 20,
							message: '长度在 2到 20个字符',
							trigger: 'blur'
						}
					]

				},
				receForm: {
					receiptNumber: "",
					receipter: "",
					receiptDate: "",
					deliverId: this.$route.query.deliverId
				},
				ossClient: null,
				uploadForm: {
					id: 'imgFile',
					inputName: '上传图片', // 自定义
					content: {
						path: '',
					},
					upload: {
						path: '', // 自定义路径
					},
					uploadRes: false,
				},
				files: []
			}
		},
		components: {
			'upload-ali-oss': ossUpload
		},
		created() {
			this.getDeliverInfoData();
		},
		methods: {
			saveReceiving(receForm) {
				this.$refs[receForm].validate(async(valid) => {
					if(valid) {
						try {
							if(typeof(this.receForm.receiptDate) != "string"){
								this.receForm.receiptDate = this.receForm.receiptDate.format("yyyy-MM-dd");
							}
							if(this.files.length > 0) {
								let src = "";
								this.files.forEach(item => {
									src += item.imgSrc + ",";
								});
								this.receForm.receiptFileId = src.substr(0, src.length - 1);
							}
							const result = await getDeliveryReceiver(this.receForm);
							if(result.result == "success") {
								this.$message({
									type: 'success',
									message: '保存成功'
								});
								this.$router.push('index');
							}else{
								this.$message({
									type: 'error',
									message: result.message
								});
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
						this.receForm.receiptNumber = returnData.obj.receiptNumber;
						if(returnData.obj.receiptDate != ""){
							this.receForm.receiptDate = returnData.obj.receiptDate.substr(0, 10);;
						}
						this.receForm.receipter = returnData.obj.receipter;
						if(returnData.obj.receiptFileId != ""){
							let file = returnData.obj.receiptFileId;
							let files = file.split(",");
							files.forEach(item =>{
								let str = item.substr(item.lastIndexOf("\/")+1,item.length);
								let data = {
									imgSrc:item,
									name:str
								}
								this.files.push(data);
							});
							
							this.uploadForm.uploadRes = true;
						}
						
						let item = returnData.obj;
						item.enterDate = item.enterDate.substr(0, 10);
						item.itemList.forEach(data => {
							data.total = parseFloat(data.price * data.number).toFixed(2);
						});
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
			//初始化OSS 权限, 建议后台提供获取oss临时权限的接口
			initOSSAuth() {
				//let ossSts = JSON.parse(localStorage.getItem('ossSts'));
				let Oss = OSS.Wrapper;
				this.ossClient = new Oss({
					region: 'oss-cn-beijing',
					accessKeyId: 'LTAIuk53PS2CWbo6',
					accessKeySecret: 'GiXSjrZUdvOKhozq9N0ADkZiPghu4o',
					//stsToken: '',
					bucket: 'pfxzkj',
					//endpoint: '',
				});
			},
			showUploadContent() {
				let path = this.uploadForm.content.path;
				if(path) {
					let paths = path.split(",");
					paths.forEach(item => {
						let data = {
							imgSrc: "http://image.pfxzqy.com/" + item,
							name: item
						}
						this.files.push(data);
					});
				}
			}

		},
		watch: {
			'uploadForm.content.path': {
				handler: function(val, oldVal) {
					if('' !== val) {
						this.showUploadContent();
					}
				}
			}
		},
		mounted() {
			this.initOSSAuth();
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
		/*-moz-border-radius-topleft: 4px;
		-moz-border-radius-topright: 4px;
		-webkit-border-top-left-radius: 4px;
		-webkit-border-top-right-radius: 4px;*/
	}
	
	.contractBody li .itemSpan {
		width: 780px;
	}
	
	.editerTitle {
		background-color: #eef1f6;
		width: 882px;
		line-height: 60px;
		font-size: 14px;
		color: #48576a;
		border-right: 1px solid #dfe6ec;
		border-left: 1px solid #dfe6ec;
		padding-left: 76px;
	}
	
	.editer {
		width: 938px;
		color: #48576a;
		border: 1px solid #dfe6ec;
		font-size: 14px;
		padding: 10px;
	}
	
	.button_submit {
		text-align: center;
		margin-top: 50px;
	}
	
	.el-form-item {
		margin-bottom: 0px;
	}
</style>