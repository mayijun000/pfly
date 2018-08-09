<template>
	<div class="login_page fillcontain" id="newBody">
		<transition name="el-collapse-transition" mode="in-out">
			<section class="form_contianer" v-show="showLogin">
				<div class="manage_tip">
					<img src="../static/img/logo.png">
				</div>
				<el-form :model="loginForm" :rules="rules" ref="loginForm" autocomplete="off" >
					<div class="loginTitle">登录</div>
					<el-form-item prop="username">
						<el-input v-model="loginForm.username" size="large" placeholder="请输入用户名"></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input type="password" placeholder="请输入密码" size="large" v-model="loginForm.password"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="large" @click="submitForm('loginForm')" class="submit_btn">登录</el-button>
					</el-form-item>
				</el-form>
			</section>
		</transition>

	</div>
</template>

<script>
	import { login,getCompanyInfo } from '@/api/getData'
	import { setCookie, setStore } from '@/config/mUtils'
	import { particlesJS } from '@/api/particles'
	export default {
		data() {
			var validatePass = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请再次输入密码'));
				} else if(value !== this.resigerForm.password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				loginForm: {
					username: '',
					password: '',
				},
				rules: {
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}, ],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
				},

				resigerForm: {
					username: '',
					password: '',
					confirmPassword: '',
					checkCode: ''
				},
				forgetForm: {
					username: '',
					password: '',
					checkCode: ''
				},
				showLogin: false,
				showResiger: false,
				showForget: false,
			}
		},
		//组件挂载完成时执行
		mounted() {
			this.showLogin = true;
			//控制头部组件显示的状态
			this.$store.commit('changeHeaderShow', false);
			this.canvasShow();
		},

		methods: {
			async getCompanyInfoData(id) {
				try {
					const returnData = await getCompanyInfo({
						"id": id,
					});
					if(returnData.result == "success") {
						if(returnData.obj != undefined){
							//控制头部组件显示的状态
							this.$store.commit('saveCompany', returnData.obj);
						}else{
							//控制头部组件显示的状态
							this.$store.commit('saveCompany', "");
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
			async submitForm(formName) {
				this.$refs[formName].validate(async(valid) => {
					if(valid) {
						const res = await login({
							loginName: this.loginForm.username,
							loginPwd: this.loginForm.password
						})
						if(res.result == "success") {
							//设置token过期时间为1天
							setStore("token", res.token);
							//控制头部组件显示的状态
							this.$store.commit('changeHeaderShow', true);
							//控制头部组件显示的状态
							this.$store.commit('saveUser', res.user);
							
							this.getCompanyInfoData(res.user.companyId);
							this.$message({
								type: 'success',
								message: '登录成功'
							});
							this.$router.push('main');
						} else {
							this.$message({
								type: 'error',
								message: res.message
							});
						}
					} else {
						this.$notify.error({
							title: '错误',
							message: '请输入正确的用户名密码',
							offset: 100
						});
						return false;
					}
				});
			},
			changeShowResiger() {
				this.showLogin = false;
				this.showResiger = true;
				this.showForget = false;
			},
			changeShowForget() {
				this.showLogin = false;
				this.showResiger = false;
				this.showForget = true;
			},
			changeShowLogin() {
				this.showLogin = true;
				this.showResiger = false;
				this.showForget = false;
			},
			isIE8() {
				var browser = navigator.appName
				var b_version = navigator.appVersion
				var version = b_version.split(";");
				if(version.length <= 1) {
					return false;
				}
				var trim_Version = version[1].replace(/[ ]/g, "");
				if(browser == "Microsoft Internet Explorer" && trim_Version == "MSIE6.0") {
					return true;
				} else if(browser == "Microsoft Internet Explorer" && trim_Version == "MSIE7.0") {
					return true;
				} else if(browser == "Microsoft Internet Explorer" && trim_Version == "MSIE8.0") {
					return true;
				} else if(browser == "Microsoft Internet Explorer" && trim_Version == "MSIE9.0") {
					return false;
				} else {
					return false;
				}
			},
			canvasShow() {
				if(!this.isIE8()) { //IE8以下浏览器不加载动画背景
					particlesJS("newBody", {
						"particles": {
							"number": {
								"value": 70,
								"density": {
									"enable": true,
									"value_area": 1000
								}
							},
							"color": {
								"value": ["#fff"]
							},

							"shape": {
								"type": "circle",
								"stroke": {
									"width": 0,
									"color": "#fff"
								},
								"polygon": {
									"nb_sides": 5
								},
								"image": {
									"src": "img/github.svg",
									"width": 100,
									"height": 100
								}
							},
							"opacity": {
								"value": 0.6,
								"random": false,
								"anim": {
									"enable": false,
									"speed": 1,
									"opacity_min": 0.5,
									"sync": false
								}
							},
							"size": {
								"value": 2,
								"random": true,
								"anim": {
									"enable": false,
									"speed": 40,
									"size_min": 1,
									"sync": false
								}
							},
							"line_linked": {
								"enable": true,
								"distance": 120,
								"color": "#ffffff",
								"opacity": 0.4,
								"width": 1
							},
						},
						"interactivity": {
							"detect_on": "canvas",
							"events": {
								"onhover": {
									"enable": true,
									"mode": "grab"
								},
								"onclick": {
									"enable": false
								},
								"resize": true
							},
							"modes": {
								"grab": {
									"distance": 140,
									"line_linked": {
										"opacity": 1
									}
								},
								"bubble": {
									"distance": 400,
									"size": 40,
									"duration": 2,
									"opacity": 8,
									"speed": 3
								},
								"repulse": {
									"distance": 200,
									"duration": 0.4
								},
								"push": {
									"particles_nb": 4
								},
								"remove": {
									"particles_nb": 2
								}
							}
						},
						"retina_detect": true
					});
				}
			}

		},
	}
</script>

<style lang="less" scoped>
	@import '../style/mixin';
	.login_page {
		background-color: #0098e1;
		margin-left: -80px;
		margin-top: -20px;
		width: 115%;
	}
	
	.manage_tip {
		position: absolute;
		width: 100%;
		top: -120px;
		left: 0;
		p {
			font-size: 34px;
			color: #fff;
		}
	}
	
	.form_contianer {
		.wh(22.5%, 34%);
		.ctp(22.5%, 20%);
		padding: 25px;
		border-radius: 5px;
		text-align: center;
		background-color: rgba(255, 255, 255, 0.1);
	}
	
	.submit_btn {
		width: 100%;
		font-size: 16px;
		background-color: #fc9a1c;
		border-color: #fc9a1c;
	}
	
	.form-fade-enter-active,
	.form-fade-leave-active {
		transition: all 1s;
	}
	
	.form-fade-enter,
	.form-fade-leave-active {
		transform: translate3d(0, -50px, 0);
		opacity: 0;
	}
	
	.loginTitle {
		line-height: 50px;
		margin-bottom: 20px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.3);
		text-align: left;
		color: #ffffff;
		font-size: 18px;
	}
	
	.loginBtn {
		text-align: left;
	}
</style>