<template>
	<view class="container">
		<view class="change_account_box">
      <view class="account-list" v-if="account_list.length>0">
        <u-swipe-action :show="item.show" :index="index" v-for="(item, index) in account_list" :key="item.user_code"
                        @click="click(item, index)" @open="open" :options="options" :disabled="item.is_active===1"
                        :bg-color="item.is_active===1?'#2979ff36':''" @content-click="toChange(item)">
          <view class="item u-border-bottom">
            <image mode="aspectFill" :src="item.avatar" />
            <!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
            <view class="title-wrap">
              <text class="current" v-if="item.is_active===1">当前登录账号</text>
              <text class="title u-line-2">昵称：{{ item.username }}</text>
              <text class="title u-line-2">账号：{{ item.account }}</text>
            </view>
          </view>
        </u-swipe-action>
      </view>
      <view class="menu-list">
        <u-cell-group>
          <u-cell-item v-if="account_list.length>1" title="关联管理" icon="" :arrow="false"
                       label=" 点击可以切换、按住滑动可选择解除关联">

          </u-cell-item>
        </u-cell-group><u-cell-group>
        <u-cell-item @click="gotoPath('/pages/setting/safe/bind_account')" title="添加关联" icon="plus-people-fill">
          关联后可以快速切换
        </u-cell-item>
      </u-cell-group>
      </view>
    </view>
	</view>
</template>

<script>
	import uniSwipeAction from "@/uni_modules/uni-swipe-action/components/uni-swipe-action/uni-swipe-action.vue";
	export default {
		components: {
			uniSwipeAction

		},
		data() {
			return {
				account_list: [],
				disabled: false,
				btnWidth: 180,
				show: false,
				options: [{
					text: '解除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
			}
		},

		computed: {
			userInfo() {
				return this.$store.getters.user
			},
		},
		onShow() {
			this.get_account_list()
		},
		methods: {
			toChange(item) {
				console.log(item)
				if (item.is_active === 1) {
					return
				}
				let that = this
				uni.showModal({
					title: '',
					content: '是否确定切换到' + item.username + '？',
					success: (res) => {
						if (res.confirm) {
							this.$u.api.switchAccount({
								account: item.account
							}).then((res) => {
								this.$u.toast(res.msg)
								if (res.code !== 0) {
									return
								}
								console.log(res.data.token)
								uni.setStorageSync('UserToken', res.data.token);
								setTimeout(function() {
									that.get_account_list()
									/*uni.switchTab({
									  url: '/pages/index/index'
									})*/
								}, 800)
							})
						}
					}
				})
			},
			click(item, index) {
				console.log(item, index)
				uni.showModal({
					title: '',
					content: '是否确定解除关联？',
					success: (res) => {
						if (res.confirm) {
							this.$u.api.unbindAccount({
								account: item.account
							}).then(res => {
								this.$u.toast(res.msg)
								if (res.code !== 0) {
									return
								}
								this.get_account_list()
							})
						}
					}
				})
			},
			open(index) {
				this.account_list[index].show = true;
				this.account_list.map((val, idx) => {
					if (index != idx) this.account_list[idx].show = false;
				})
			},

			get_account_list() {
				this.$u.api.getAccountList().then(res => {
					if (res.code == 0) {
						res.data.map((val, idx) => {
							res.data[idx].show = false;
						})
						console.log('account_list', res.data)
						this.account_list = res.data
					}
				})
			},
		},

	}
</script>

<style lang="scss">
	.container {
		background-color: #f5f5f5;
		height: 100%;
		max-height: 100%;
		overflow: hidden;
	}

	.current {
		color: red;
		margin-top: 20rpx;
	}

	.item {
		display: flex;
		padding: 20rpx;
	}

	image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		margin-right: 20rpx;
		border-radius: 12rpx;
	}

	.title {
		text-align: left;
		font-size: 28rpx;
		color: $u-content-color;
		margin-top: 20rpx;
	}


	.menu-list {
		margin-top: 30upx;
		background: #fff;
		border-radius: 10upx;

		switch {
			transform: scale(0.7, 0.7)
		}
	}
</style>
