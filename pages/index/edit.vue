<template>
	<BillEditer :value="id" @submit="submit"></BillEditer>
</template>

<script>
	import BillEditer from '@/my-components/bill-editer/index.vue'
	export default {
		components: {
			BillEditer,
		},
		data() {
			return {
				id: null
			}
		},
		methods: {
			submit(data) {
        uni.showModal({
          title: '',
          content: '确定修改吗？',
          success: (res) => {
            if (res.confirm) {
              this.$u.api.updateCashflow(data).then(res => {
                if (res.code == 0) {
                  uni.navigateBack()
                } else {
                  this.$u.toast(res.msg);
                }
              })
            } else if (res.cancel) {
              //this.$u.toast('已取消');
            }
          }
        })
			}
		},
		onLoad(options) {
			if (options.id) {
        this.$nextTick(() => {
          this.id = options.id
        })

			}
		},
	}
</script>

<style lang="scss">

</style>
