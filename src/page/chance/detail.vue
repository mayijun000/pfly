<template>
	<section>
		<el-row>
			<el-col :span="24">
				<el-card style="width:800px;margin: 0 auto;padding-bottom: 10px;">
					<header class="contractTitle">项目机会详情</header>
					<ul class="contractBody">
						<li>
							<span class="bodyLabel">企业客户: </span><span>{{formData.companyName}}</span>
							<span class="bodyLabel">项目名称: </span><span>{{formData.projectName}}</span>
						</li>
						<li>
							<span class="bodyLabel">发布时间: </span><span>{{formData.publishDate}}</span>
							<span class="bodyLabel">采购编号: </span><span>{{formData.purchaseNo}}</span>
						</li>
					</ul>
					<div class="edit_container">
						<div class="editerTitle">招标正文: </div>
						<quill-editor v-model="formData.content" ref="myQuillEditor" class="editer" :options="editorOption">
						</quill-editor>
					</div>

					<div class="button_submit">
						<el-button type="primary" @click="toBack">返回</el-button>
					</div>
				</el-card>

			</el-col>
		</el-row>
	</section>
</template>

<script>
	import { quillEditor } from 'vue-quill-editor'
	import { getChanceInfo } from '@/api/getData'
	export default {
		data() {
			return {
				formData: {
					projectName: '',
					publishDate: '',
					purchaseNo: '',
					content: '',
				},
				content: "",
				editorOption: {
					readOnly: true,
					modules: {
						toolbar: false
					},
				}
			}
		},
		components: {
			quillEditor,
		},
		computed: {
			editor() {
				return this.$refs.myQuillEditor.quill
			}
		},
		created() {
			this.getChanceInfoData();
		},
		methods: {
			toBack() {
				this.$router.go(-1);
			},

			//获取会员信息
			async getChanceInfoData() {
				try {
					const returnData = await getChanceInfo({
						chanceId: this.$route.query.chanceId
					});
					if(returnData.result == "success") {
						let item = returnData.obj;
						this.formData.companyName = item._memberId;
						this.formData.chanceId = item.chanceId;
						this.formData.projectName = item.projectName;
						this.formData.content = item.content;
						this.formData.purchaseNo = item.purchaseNo;
						this.formData.publishDate = item.publishDate.substr(0, 10);
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
		},
	}
</script>

<style scoped>
	.button_submit {
		text-align: center;
		margin-top: 50px;
		clear: both;
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
	}
	
	.contractBody li span {
		float: left;
		width: 257.5px;
		display: flex;
		height: 60px;
		border-top: 1px solid #dfe6ec;
		border-right: 1px solid #dfe6ec;
		align-items: center;
		padding: 0 10px;
	}
	
	.contractBody li .bodyLabel {
		width: 80px;
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
	
	.editerTitle {
		background-color: #eef1f6;
		width: 728px;
		line-height: 60px;
		font-size: 14px;
		color: #48576a;
		border-right: 1px solid #dfe6ec;
		border-left: 1px solid #dfe6ec;
		padding-left: 30px;
	}
	
	.editer {
		width: 100%;
		color: #48576a;
	}
	
	.ql-container.ql-snow {
		border: 1px solid #dfe6ec;
	}
</style>