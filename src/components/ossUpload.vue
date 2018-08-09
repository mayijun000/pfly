<template>
	<div class="upload-demo">
		<div @dragend="selectFile" @click="selectFile" class="el-upload el-upload--text">
			<div class="el-upload-dragger"><i class="el-icon-upload"></i>
				<div class="el-upload__text"><em>点击上传</em></div>
			</div>
			<input @change="doUpload" type="file" :id="id" name="file" :multiple="multiple" class="el-upload__input">
		</div>
		<!--<div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
		<ul class="el-upload-list el-upload-list--text"></ul>
	</div>
</template>
<script>
	import { getUUID } from '@/config/mUtils';
	export default {
		props: {
			ossClient: {
				type: Object,
				twoWay: false
			},
			multiple: {
				type: Boolean,
				twoWay: false
			},
			id: {
				type: String,
				twoWay: false
			},
			url: {
				type: String,
				twoWay: true
			},
			uploadRes: {
				type: Boolean,
				twoWay: true
			},
			inputName: {
				type: String,
			},
			path: {
				type: String,
			},
		},
		data() {
			return {
				resultUpload: '',
				content: {
					path: this.path,
				}
			};
		},
		methods: {
			selectFile(e){
				document.getElementsByName("file")[0].click();
			},
			doUpload() {
				const _this = this;
				const files = document.getElementById(_this.id);
				let fileLen = files.files;
				let urls = [];
				if(fileLen) {
					for(let i = 0; i < fileLen.length; i++) {
						let file = fileLen[i];
						let storeAs = file.name;
						let suffix = storeAs.split(".")[1];
						let storeKey = _this.content.path + getUUID() + '.' + suffix;
						urls.push(storeKey);
						_this.ossClient.multipartUpload(storeKey, file, {}).then((results) => {
							this.$emit('update:uploadRes', true);
						}).catch((err) => {
							console.log(err);
						});
					}
					this.resultUpload = urls.join(",");
					_this.$emit('update:url', this.resultUpload);
				}
			}
		},
		mounted() {}
	};
</script>

<style type="text/css">
	.oss_file {
		position: relative;
		display: inline-block;
		background: #D0EEFF;
		border: 1px solid #99D3F5;
		border-radius: 4px;
		padding: 4px 12px;
		overflow: hidden;
		color: #1E88C7;
		text-decoration: none;
		text-indent: 0;
		line-height: 20px;
	}
	
	.oss_file input {
		position: absolute;
		font-size: 100px;
		right: 0;
		top: 0;
		opacity: 0;
	}
	
	.oss_file:hover {
		background: #AADFFD;
		border-color: #78C3F3;
		color: #004974;
		text-decoration: none;
	}
</style>