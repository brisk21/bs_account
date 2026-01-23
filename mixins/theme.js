import { getThemeConfig } from '@/common/theme.js'

export default {
	computed: {
		themeColors() {
			const themeKey = this.$store.getters['theme/currentTheme'] || 'default'
			return getThemeConfig(themeKey)
		},
		themePrimary() {
			return this.themeColors.primary
		}
	},
	onLoad() {
		// 监听主题变化
		uni.$on('themeChange', this.onThemeChange)
	},
	onUnload() {
		// 移除主题变化监听
		uni.$off('themeChange', this.onThemeChange)
	},
	methods: {
		onThemeChange(theme) {
			// 主题变化时刷新页面
			uni.reLaunch({
				url: `/${this.$scope.route}`
			})
		}
	}
}