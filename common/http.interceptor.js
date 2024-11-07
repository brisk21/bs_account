import constConfig from '@/const.js'
//import { encrypt } from './crypto.js';
const install = (Vue, vm) => {
	Vue.prototype.$u.http.setConfig({
			baseUrl: constConfig.baseUrl, // 请求的本域名
			method: 'POST',
			// 设置为json，返回后会对数据进行一次JSON.parse()
			dataType: 'json',
			showLoading: false, // 是否显示请求中的loading
			loadingText: '正在加载...', // 请求loading中的文字提示
			loadingTime: 800, // 在此时间内，请求还没回来的话，就显示加载中动画，单位ms
			originalData: true, // 是否在拦截器中返回服务端的原始数据
			loadingMask: true, // 展示loading的时候，是否给一个透明的蒙层，防止触摸穿透
			// 配置请求头信息
			header: {
				'content-type': 'application/json;charset=UTF-8'
			},
		}),
		// 请求拦截部分，如配置，每次请求前都会执行
		Vue.prototype.$u.http.interceptor.request = (config) => {
			//console.log(vm.$u.sys(),'sys')
			config.header.platform = vm.$u.sys().platform
			config.header.version = vm.$u.sys().appVersion
			config.header.versionCode = vm.$u.sys().appVersionCode
			config.header.Authorization = 'Bearer ' + (uni.getStorageSync('UserToken') || '');
			// 可以对某个url进行特别处理，此url参数为this.$u.get(url)中的url值
			if (config.url == 'code2token') config.header.noToken = true;

			// 对需要加密的参数进行加密处理

			// 对需要加密的参数进行加密处理
			//console.log(config.method)
			/*if (config.method === 'POST' || config.method === 'PUT' ) {
				// 假设只有POST请求需要加密，并且不是免Token的接口
				config.data =  encrypt(config.data);
				console.log('加密参数', config.data)
			}*/

			// 最后需要将config进行return
			return config;
			// 如果return一个false值，则会取消本次请求
			// if(config.url == '/user/rest') return false; // 取消某次请求
		},
		// 响应拦截，如配置，每次请求结束都会执行本方法
		Vue.prototype.$u.http.interceptor.response = (res) => {
			//console.log(res,'xx')
			if (res.statusCode > 300 && res.statusCode != 401) {
				// 如果返回false，则会调用Promise的reject回调，
				// 并将进入this.$u.post(url).then().catch(res=>{})的catch回调中，res为服务端的返回值
				if (res.data.message) {
					vm.$u.toast(res.data.message);
				}
				return false;
			} else if (res.statusCode == 401) {
				console.log('执行了 401')
				// 退出登录 清理本地缓存
				vm.$store.dispatch('logout')
				vm.$u.toast('登录状态已过期，请重新登录')
				return false;
			} else {
				if (res.data.code == 401){
					console.log('执行了 401')
					vm.$store.dispatch('logout')
					return false
				}
				return res.data
			}
		}
}

export default {
	install
}
