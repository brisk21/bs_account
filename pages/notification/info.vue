<template>
	<view class="content">
		<mp-html :content="html" />
	</view>
</template>

<script>
	import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html'
	export default {
		components: {
			mpHtml
		},
		data() {
			return {
				id: null,
				info: {}
			};
		},
		computed: {
			html() {
				return this.info.msg_id ? this.info.content : ''
			}
		},
		methods: {
			getData() {
				this.$u.api.getNotificationInfo(this.id).then(res => {
					if (res.code == 1) {
						this.$u.toast(res.msg);
						return
					}
          console.log(res.data)
					this.info = res.data
				})
			}
		},
		onLoad(opt) {
			if (opt.id) {
				this.id = opt.id
				this.getData()
			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding: 30rpx;
	}
</style>
