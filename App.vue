<style lang="scss">
	@import "uview-ui/index.scss";
</style>

<script>
  // #ifdef APP-PLUS
	import checkappupdate from 'js_sdk/wonyes-checkappupdate/wonyes/checkappupdate.js'
	// #endif
  import constConfig from '@/const.js'

	import {
		getCode
	} from '@/common/login.js'
	export default {
		onLaunch: function() {
		 // #ifdef APP-PLUS
			console.log('update')
			checkappupdate.check({
				title:"检测到有新版本！",
				content:"请升级app到最新版本！",
				canceltext:"暂不升级",
				oktext:"立即升级",
				api: constConfig.baseUrl+'/update',
				barbackground:"rgba(50,50,50,0.8)",//进度条背景色，默认灰色，可自定义rgba形式色值
				barbackgroundactive:"rgba(32,165,58,1)"//进度条前景色色，默认绿色，可自定义rgba形式色值
			})
		// #endif
		},
		onShow: function() {
			let token = uni.getStorageSync('UserToken')
			if (!token) {
				// #ifdef MP
				// getCode()
				// #endif
			} else {
				this.$store.dispatch('getUserInfo')
			}
		},
		onHide: function() {
			//console.log('App Hide');
		},
		methods: {

		}
	};
</script>

<style>
	/* 解决头条小程序组件内引入字体不生效的问题 */
	/* #ifdef MP-TOUTIAO */
	@font-face {
		font-family: uniicons;
		src: url('/static/uni.ttf');
	}

	/* #endif */
</style>
<style lang='scss'>
	view,
	scroll-view,
	swiper,
	swiper-item,
	cover-view,
	cover-image,
	icon,
	text,
	rich-text,
	progress,
	button,
	checkbox,
	form,
	input,
	label,
	radio,
	slider,
	switch,
	textarea,
	navigator,
	audio,
	camera,
	image,
	video {
		box-sizing: border-box;
	}
</style>
