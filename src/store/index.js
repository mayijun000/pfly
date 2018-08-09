import Vue from 'vue'
//import Vuex from 'vuex'
import { setStore, getStore} from '@/config/mUtils'

//Vue.use(Vuex)

const state = {
	headerShow: true,
	user: null,
	company:null,
}
const getters = {
	getHeaderShow(state) {
		return state.headerShow;
	},
	getUser(state){
		if(state.user == null){
			let user = getStore('user');
			if(user == "undefined"){
				return "";
			}else{
				return JSON.parse(getStore('user'));
			}
		}
		return state.user;
	},
	getCompany(state){
		if(state.company == null){
			let company = getStore('company');
			if(company == "undefined" || company == ""){
				return "";
			}else{
				return JSON.parse(getStore('company'));
			}
		}
		return state.company;
	}
}

const mutations = {
	changeHeaderShow(state, headerShow) {
		state.headerShow = headerShow;
	},
	saveUser(state, user) {
		state.user = user;
		//保存登录用户对象
		setStore('user', user);
	},
	saveCompany(state, company) {
		state.company = company;
		//保存登录用户对象
		setStore('company', company);
	}
	
}

const actions = {
	//	async getAdminData({commit}){
	//		try{
	//			const res = await getAdminInfo()//异步编程的最高境界
	//			if (res.status == 1) {
	//				commit('saveAdminInfo', res.data);
	//				console.log(res.data)
	//			}else{
	//				throw new Error(res)
	//			}
	//		}catch(err){
	//			console.log('您尚未登陆或者session失效')
	//		}
	//	},

}
export default new Vuex.Store({
	state,
	actions,
	mutations,
	getters,
})