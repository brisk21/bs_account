<template>
	<view class="container">
		<view class="menu-container">
			<view class="menu-list">
				<u-cell-group>
					<u-cell-item @click="goto('feedback',true)" title="反馈&建议" icon="volume"></u-cell-item>
					<!--<u-cell-item @click="wkf()" title="数据导出" icon="order">
					</u-cell-item>
					<u-cell-item @click="wkf()" title="联系客服" icon="kefu-ermai"></u-cell-item>-->
					<!--<button type="default" open-type="contact" class="list-item">
						<u-cell-item title="联系客服">
						</u-cell-item>
					</button>-->
					<!--<u-cell-item @click="wkf()" title="推荐好友" icon="share"></u-cell-item>-->
					<u-cell-item title="协议阅读" icon="order">
						<u-link :href="'https://jz.api.alipay168.cn/api/agreement/register'"
							:under-line="false">注册协议</u-link>
					</u-cell-item>
					<u-cell-item title="协议阅读" icon="order">
						<u-link :href="'https://jz.api.alipay168.cn/api/agreement/privacy'"
							:under-line="false">隐私政策</u-link>
					</u-cell-item>

					<u-cell-item title="关于我们" icon="info-circle">
						<u-link :href="'https://jz.api.alipay168.cn/api/agreement/about'"
							:under-line="false">关于我们</u-link>
					</u-cell-item>



					<u-cell-item   @click="check_update()" title="当前版本" icon="reload">
              <text >{{app_version}}</text>
						 <u-badge v-if="show_version" count="有新版本" :absolute="false" slot="right-icon"></u-badge>

					</u-cell-item>

					<u-cell-item v-if="hasLogin" @click="logout()" title="退出登录" icon="close-circle">
					</u-cell-item>
				</u-cell-group>
			</view>
		</view>
    <ad-custom v-if="userInfo && userInfo.position.setting_page" unit-id="adunit-1709c673b8c4e1e0" bindload="adLoad" binderror="adError" bindclose="adClose"></ad-custom>


	</view>
</template>

<script>
	// #ifdef APP-PLUS
	import checkappupdate from 'js_sdk/wonyes-checkappupdate/wonyes/checkappupdate.js'
	// #endif
	import constConfig from '@/const.js'
	import {
		getCode
	} from '@/common/login.js'
	export default {
		components: {

		},
		data() {
			return {
        app_version: null,
				show_version: false,
				phone_height: "0",
				scroll_view_height: "100",
				bill_title: "默认账单",

				select_bill_show: false,
				default_bill_index: [0],
				bill_list: [{
					value: '0',
					label: '默认账单',
					extra: '0'
				}],
				paths: {
					notice: '/pages/notification/index',
          feedback: '/pages/setting/feedback'
				}
			}
		},
		computed: {
			userInfo() {
				return this.$store.getters.user
			},
			unreadCount() {
				return this.$store.getters.unread_count || 0
			}

		},
		methods: {

      //获取系统版本信息
      getSystemInfo() {
				let info = uni.getSystemInfoSync();

        this.app_version = info.appVersion

        this.check_app(info);
			},

      check_app(info) {
        let that = this
        this.$u.api.checkAppVersion({platform:info.platform,version:info.appVersion}).then(res => {
					if (res.code == 0) {
					    that.show_version = true;
					}
				})
			},


			check_update() {
        if (uni.getSystemInfoSync().platform=='h5'){
          this.$u.toast('请在APP端更新')
          return
        }
        // #ifdef APP-PLUS
				checkappupdate.check({
					title: "检测到有新版本！",
					content: "请升级app到最新版本！",
					canceltext: "暂不升级",
					oktext: "立即升级",
					api: constConfig.baseUrl + '/update',
					barbackground: "rgba(50,50,50,0.8)", //进度条背景色，默认灰色，可自定义rgba形式色值
					barbackgroundactive: "rgba(32,165,58,1)" //进度条前景色色，默认绿色，可自定义rgba形式色值
				})
        // #endif


			},



			share() {
				console.log('非小程序分享')
			},

			// 点击选择账单
			selectBill() {
				this.select_bill_show = !this.select_bill_show;
			},
			// 选择账单回调
			billConfirm(e) {
				console.log(e);
			},

			message() {},
			pickerConfirm() {

			},
			logout() {
				uni.showModal({
					title: '确定退出登录？',
					success: (res) => {
						if (res.confirm) {
							this.$store.dispatch('logout')
							uni.reLaunch({
								url: '/pages/login/index'
							})
						}
					}
				})
			},
			wkf() {
				this.$u.toast('该功能暂未开放');
			},
			categorySet() {
				uni.navigateTo({
					url: "/pages/setting/category"
				})
			},
			goto(key, auth = true) {
				if (auth && !this.hasLogin) {
					this.$u.toast('请先登录');
					return
				}
				uni.navigateTo({
					url: this.paths[key]
				})
			}
		},
		onLoad(options) {
      this.getSystemInfo()
    },
		onShow() {
			if (this.hasLogin) {
				this.$store.dispatch('getUserInfo')
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background-color: #f5f5f5;
		height: 100%;
		max-height: 100%;
		overflow: hidden;
	}

	%flex-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	%section {
		display: flex;
		justify-content: space-around;
		align-content: center;
		background: #fff;
		border-radius: 10upx;
	}






	.menu-list {
		margin-top: 30upx;
		background: #fff;
		border-radius: 10upx;

		switch {
			transform: scale(0.7, 0.7)
		}
	}

	.list-item {
		width: 100%;
		padding: 0rpx;
		background-color: #FFFFFF !important;
		border: initial;
		text-align: initial;
	}

	.list-item::after {
		border: initial;
	}
</style>
