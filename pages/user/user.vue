<template>
	<view class="container">
    	<fab></fab>


		<view class="user-section">

			<view class="bg"></view>
			<view class="user-info-box">
				<view class="portrait-box" @click="goto('/pages/setting/safe/avatar',true)">
					<image class="portrait" :src="userInfo.avatar || '/static/missing-face.png'">
					</image>
				</view>
				<view class="info-box">
					<view v-if="hasLogin" @click="goto('/pages/setting/safe/avatar',true)">
						<text class="username" >{{userInfo.nick_name || '游客'}}</text>
            <text @click.native.stop="goto('/pages/setting/safe/cancel_account',true)" v-if="userInfo.cancel_expire" style="color: #e90808;">（即将注销）</text>
					</view>
					<view v-else>
						<text class="username" @click="goToLoginPage()">点击登录</text>

					</view>
				</view>
        <view class="setting" >
        <view class="setting-item" @click="goto('/pages/setting/index',true)">
          <u-icon name="setting" size="50"></u-icon>
        </view>
      </view>
			</view>
		</view>
		<view class="tj-sction">
			<view class="tj-item" @click="goto('/pages/index/list',true)">
				<text class="num">{{userInfo.sign_in_day || 0}}</text>
				<text>使用天数</text>
			</view>
			<view class="tj-item" @click="goto('/pages/index/list',true)">
				<text class="num">{{userInfo.all_bill_day || 0}}</text>
				<text>总记账天数</text>
			</view>
			<view class="tj-item" @click="goto('/pages/index/list',true)">
				<text class="num">{{userInfo.all_bill_count || 0}}</text>
				<text>总记账笔数</text>
			</view>
		</view>
		<view class="menu-container">
			<view class="menu-list">
				<u-cell-group>
					<u-cell-item @click="goto('/pages/notification/index')" title="系统消息" icon="bell">
						<u-badge v-show="hasLogin && unreadCount > 0" :count="unreadCount" :absolute="false"
							slot="right-icon">
						</u-badge>
					</u-cell-item>
					<u-cell-item @click="goto('/pages/setting/category')" title="收支类型" icon="grid"></u-cell-item>

          <u-cell-item @click="goto('/pages/budget/budget',false)" title="预算管理" icon="rmb-circle">
					</u-cell-item>
          <u-cell-item @click="goto('/pages/setting/help',false)" title="帮助中心" icon="question-circle">
					</u-cell-item>
				</u-cell-group>
			</view>
		</view>


   <!-- #ifdef MP-->
    <ad-custom v-if="userInfo && userInfo.position.user_center" unit-id="adunit-2ce0331ff2925c38" bindload="adLoad" binderror="adError" bindclose="adClose"></ad-custom>
    <!-- #endif -->


	</view>


</template>

<script>
	import fab from '@/my-components/fab/index.vue'
	export default {
		components: {
			fab
		},
		data() {
			return {
        ad_show: false,
				phone_height: "0",
				scroll_view_height: "100",
				bill_title: "默认账单",

				select_bill_show: false,
				default_bill_index: [0],
				bill_list: [{
					value: '0',
					label: '默认账单',
					extra: '0'
				}]

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
			goto(path, auth = true) {
				if (auth && !this.hasLogin) {
					this.$u.toast('请登录后查看');
					return
				}
        if (!path){
          this.$u.toast('暂未开放')
          return
        }
				uni.navigateTo({
					url: path
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

	.user-section {
		padding: 100upx 30upx 0;
		position: relative;

		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background-color: $uni-theme-color;
		}
    .setting{
          position: absolute;
          right: 0;
          z-index: 10;
          // #ifdef MP-WEIXIN
           top: 80rpx;
          // #endif

          color: white;
      }

	}

	.user-info-box {
		height: 180upx;
		display: flex;
		align-items: center;
		position: relative;
		z-index: 1;

		.portrait {
			width: 130upx;
			height: 130upx;
			border: 5upx solid #fff;
			border-radius: 50%;
		}

		.username {
			font-size: 30rpx;
			color: #fff;
			margin-left: 20rpx;

			&.qq_login_btn {
				background-color: $uni-theme-color;
			}
		}
	}

	.menu-container {
		background-color: #f5f5f5;
		position: relative;
		padding-bottom: 20rpx;
	}

	.tj-sction {
		@extend %section;

		background-color: #fff;

		.tj-item {
			@extend %flex-center;
			flex-direction: column;
			height: 140upx;
			font-size: $font-sm;
			color: $uni-text-color-grey;
		}

		.num {
			font-size: 40rpx;
			color: dodgerblue;
			margin-bottom: 8upx;
		}
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

	.select_bill {
		flex: 1;
		margin-right: 10px;
		text-align: right;
		color: #FFFFFF;
	}
</style>
