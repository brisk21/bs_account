module.exports = {
	computed: {
		hasLogin() {
			// console.log(this.$store.getters)
			if (this.$store.getters.user === undefined) {
				return false
			}
			return !!this.$store.getters.user.user_code
		}
	},
	methods: {
		goToLoginPage() {
			uni.navigateTo({
				url: "/pages/login/index"
			})
		}
	},
}
