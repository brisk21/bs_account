<template>
	<view class="container">
		<view class="menu-container">
			<view class="menu-list">
				<u-cell-group>
            <u-cell-item @click="gotoPath('/pages/setting/safe/avatar')" title="修改头像和昵称" :icon="userInfo.avatar || '/static/missing-face.png'" >
              {{userInfo.nick_name}}
            </u-cell-item>
          <u-cell-item @click="gotoPath('/pages/setting/safe/account')" title="修改账号" icon="account" >
              登录账号每个月只能修改一次
            </u-cell-item>
					<u-cell-item @click="gotoPath('/pages/setting/safe/edit_pwd')" title="修改密码" icon="lock-open">
            建议定期修改，更安全
          </u-cell-item>
          <u-cell-item @click="gotoPath('/pages/setting/safe/email')" title="邮箱" icon="email">
            <text v-if="userInfo.email" style="color: #999;">{{ userInfo.email }}</text>
            <text v-else style="color: #e90808;">未绑定</text>
          </u-cell-item>
          <u-cell-item @click="gotoPath('/pages/setting/safe/data')" title="数据管理" icon="order">
            导入和导出账单数据
          </u-cell-item>
          <u-cell-item @click="gotoPath('/pages/setting/safe/cancel_account')" title="注销账号" icon="warning">
            <text v-if="userInfo.cancel_expire">{{userInfo.cancel_expire}}将彻底注销</text>
            <text v-else>注销账号，数据将清空</text>
          </u-cell-item>


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
