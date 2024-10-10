<template>
	<view class="container">
		<view class="menu-container">
			<view class="menu-list">
				<u-cell-group>

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
				</u-cell-group>
			</view>
		</view>
    <!-- #ifdef MP-->
    <ad-custom v-if="userInfo && userInfo.position.setting_page" unit-id="adunit-1709c673b8c4e1e0" bindload="adLoad" binderror="adError" bindclose="adClose"></ad-custom>
    <!-- #endif-->
	</view>
</template>

<script>

	import constConfig from '@/const.js'
	import {
		getCode
	} from '@/common/login.js'
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
