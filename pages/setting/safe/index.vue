<template>
	<view class="container">
		<view class="menu-container">
			<view class="menu-list">
				<u-cell-group>
            <u-cell-item @click="goto('/pages/setting/safe/avatar')" title="修改头像和昵称" :icon="userInfo.avatar || '/static/missing-face.png'" >
              {{userInfo.nick_name}}
            </u-cell-item>
          <u-cell-item @click="goto('/pages/setting/safe/account')" title="修改账号" icon="account" >
              登录账号每个月只能修改一次
            </u-cell-item>
					<u-cell-item @click="goto('/pages/setting/safe/edit_pwd')" title="修改密码" icon="lock-open">
            建议定期修改，更安全
          </u-cell-item>
          <u-cell-item @click="goto('/pages/setting/safe/email')" title="邮箱" icon="email">
            <text v-if="userInfo.email" style="color: #999;">{{ userInfo.email }}</text>
            <text v-else style="color: #e90808;">未绑定</text>
          </u-cell-item>
<!--          <u-cell-item @click="goto('')" title="绑定微信" icon="weixin-fill">
            小程序可快速登录
          </u-cell-item>-->

				</u-cell-group>
			</view>
		</view>
	</view>
</template>

<script>

	export default {
		components: {

		},
		data() {
			return {

			}
		},
		computed: {
      userInfo() {
				return this.$store.getters.user
			},
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
		onShow() {

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


	.menu-list {
		margin-top: 30upx;
		background: #fff;
		border-radius: 10upx;

		switch {
			transform: scale(0.7, 0.7)
		}
	}


</style>
