import { baseUrl } from './env'
import { getCookie, getStore, setStore } from '@/config/mUtils'
import Vue from 'vue'
import router from '@/router'
var scopeVue = new Vue({
	router,
	methods: {
		messageFunction: function(msg) {
			this.$message({
				message: msg,
				type: 'warning'
			});
		},
		loadingFunction: function(msg) {
			let loading = this.$loading({
				fullscreen:true,
				lock:true,
				text:"拼命加载中"
			});
			return loading;
		},
		toLogin: function() {
			this.$router.push("/");
		}
	}
})
//前端统一封装请求后台的方法
export default async(url = '', data = {}, sysName = '', method = 'fetch') => {
	let token = getStore("token");
//	let loading = scopeVue.loadingFunction();
	if(window.fetch && method == 'fetch') {
		let reqHeaders = new Headers({
			'Content-Type': 'application/json;charset=UTF-8',
			'partnerId': "1",
			'timeStamp': '' + (new Date().getTime()),
			'sys': sysName,
			'uri': url,
			'token': token
		})
		let requestConfig = {
			credentials: 'include', //传递cookie
			method: 'POST',
			headers: reqHeaders,
			//mode: "no-cors",
			//cache: "force-cache"
		}
		//post请求是参数设置
		Object.defineProperty(requestConfig, 'body', {
			value: JSON.stringify(data)
		});
		try {
			//设置后台请求地址，加配置
			const response = await fetch(baseUrl, requestConfig);
//			if(response.status == 200){
//				loading.close();
//			}
			//返回json格式数据
			const responseJson = await response.json();

			if(responseJson == null || responseJson == undefined) {
				scopeVue.messageFunction("系统异常，获取数据失败");
			}
			if(responseJson.errorCode > 1 && responseJson.errorCode < 21) {
				scopeVue.messageFunction(responseJson.message);
				scopeVue.toLogin();
			}
			return responseJson
		} catch(error) {
			throw new Error(error);
		}
	} else {
		return new Promise((resolve, reject) => {
			let requestObj;
			if(window.XMLHttpRequest) {
				requestObj = new XMLHttpRequest();
			} else {
				requestObj = new ActiveXObject;
			}
			//post请求设置，请求参数数据
			let sendData = JSON.stringify(data);

			requestObj.open('POST', baseUrl, true);
			requestObj.withCredentials = true;
			requestObj.setRequestHeader("Content-type", "application/json;charset=UTF-8");
			requestObj.setRequestHeader("partnerId", "1");
			requestObj.setRequestHeader("timeStamp", new Date().getTime());
			requestObj.setRequestHeader("sys", sysName);
			requestObj.setRequestHeader("uri", url);
			requestObj.setRequestHeader("token", token);
			requestObj.send(sendData);

			requestObj.onreadystatechange = () => {
				if(requestObj.readyState == 4) {
					if(requestObj.status == 200) {
						let obj = requestObj.response;
						if(typeof obj !== 'object') {
							obj = JSON.parse(obj);
						}
						resolve(obj); //完成时返回
					} else {
						reject(requestObj); //失败时返回
					}
				}
			}
		}).catch((err) => {
			console.log(err)
		})
	}
}