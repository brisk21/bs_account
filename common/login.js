import store from '@/store'

export function getCode() {
	uni.login({
		success: (data) => {
			loginHandle(data.code)
		}
	})
}

export function loginHandle(code) {
	store.dispatch('code2token', code).then(res => {
		if (res.code !==0){
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
			return ;
		}
		console.log(res)
		store.dispatch('getUserInfo').then(res => {
		  uni.switchTab({
			url: '/pages/index/index'
		   })
		})
	})
}
