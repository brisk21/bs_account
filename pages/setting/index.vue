<template>
	<view class="container">
		<view class="menu-container">
			<view class="menu-list">
				<u-cell-group>
					<u-cell-item @click="wkf()" title="数据导出" icon="order">
					</u-cell-item>
          <u-cell-item  @click="wkf()" title="联系客服" icon="kefu-ermai"></u-cell-item>
        <!--<button type="default" open-type="contact" class="list-item">
						<u-cell-item title="联系客服">
						</u-cell-item>
					</button>-->
					<u-cell-item @click="wkf()" title="推荐好友" icon="share"></u-cell-item>
					<u-cell-item   title="协议阅读" icon="order">
            <u-link :href="'https://jz.api.alipay168.cn/api/agreement/register'" :under-line="false">注册协议</u-link>
          </u-cell-item>
					<u-cell-item   title="协议阅读" icon="order">
            <u-link :href="'https://jz.api.alipay168.cn/api/agreement/privacy'" :under-line="false">隐私政策</u-link>
          </u-cell-item>

          <u-cell-item  title="关于我们" icon="info-circle">
            <u-link :href="'https://jz.api.alipay168.cn/api/agreement/about'" :under-line="false">关于我们</u-link>
          </u-cell-item>

          <u-cell-item @click="wkf()" title="反馈&建议" icon="volume"></u-cell-item>

					<u-cell-item v-if="hasLogin" @click="logout()" title="退出登录" icon="close-circle">
					</u-cell-item>
				</u-cell-group>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		getCode
	} from '@/common/login.js'
	export default {
		components: {

		},
		data() {
			return {
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
					notice: '/pages/notification/index'
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
			// #ifdef MP
			getCode,
			// #endif
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
			// #ifdef MP-WEIXIN
			getUserInfoWx() {
				wx.getUserProfile({
					desc: '获取头像信息，用于展示',
					lang: 'zh_CN',
					success: (res) => {
						let info = res.userInfo
						let data = {
							avatar: info.avatarUrl,
							city: info.city,
							country: info.country,
							gender: info.gender,
							nick_name: info.nickName,
							province: info.province,
						}
						this.updateProfile(data)
					}
				})
			},
			// #endif
			// #ifdef MP-TOUTIAO
			getUserInfoTt() {
				tt.getUserInfo({
					desc: '获取头像信息，用于展示',
					lang: 'zh_CN',
					success: (res) => {
						let info = res.userInfo
						let data = {
							avatar: info.avatarUrl,
							city: info.city,
							country: info.country,
							gender: info.gender,
							nick_name: info.nickName,
							province: info.province,
						}
						this.updateProfile(data)
					}
				})
			},
			// #endif
			onGetUserInfo(e) {
				let info = e.detail.userInfo
				let data = {
					avatar: info.avatarUrl,
					city: info.city,
					country: info.country,
					gender: info.gender,
					nick_name: info.nickName,
					province: info.province,
				}
				this.updateProfile(data)
			},
			updateProfile(data) {
				this.$u.api.updateProfile(data).then(res => {
					this.$store.dispatch('getUserInfo')
				})
			},
			goto(key, auth = true) {
				if (auth && !this.hasLogin) {
					this.$u.toast('请登录后查看');
					return
				}
				uni.navigateTo({
					url: this.paths[key]
				})
			}
		},
		onLoad(options) {},
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
