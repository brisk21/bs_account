import { getThemeConfig } from './theme.js'

/**
 * 主题混入
 * 在需要使用主题的页面中引入此混入
 * 使用方式：
 * import themeMixin from '@/common/theme-mixin.js'
 * export default {
 *   mixins: [themeMixin],
 *   ...
 * }
 */
export default {
	data() {
		return {
			themeStyles: {}
		}
	},
	computed: {
		// 当前主题配置
		themeConfig() {
			const themeKey = this.$store.getters['theme/currentTheme'] || 'default'
			return getThemeConfig(themeKey)
		},
		// 主题主色
		themePrimary() {
			return this.themeConfig.primary
		},
		// 主题浅色
		themePrimaryLight() {
			return this.themeConfig.primaryLight
		},
		// 主题深色
		themePrimaryDark() {
			return this.themeConfig.primaryDark
		},
		// 主题背景色
		themeBackground() {
			return this.themeConfig.background
		},
		// 卡片背景色
		themeCardBackground() {
			return this.themeConfig.cardBackground
		}
	},
	onLoad() {
		// 应用当前主题颜色
		this.applyThemeColors()
		// 监听主题变化事件
		uni.$on('themeChange', this.handleThemeChange)
	},
	onShow() {
		// 每次显示时重新应用主题颜色
		this.applyThemeColors()
		// 更新当前页面的导航栏颜色
		this.updateNavigationBarColor()
	},
	onUnload() {
		// 移除主题变化监听
		uni.$off('themeChange', this.handleThemeChange)
	},
	methods: {
		// 应用主题颜色到页面
		applyThemeColors() {
			const theme = this.themeConfig
			this.themeStyles = {
				'--theme-primary': theme.primary,
				'--theme-primary-light': theme.primaryLight,
				'--theme-primary-dark': theme.primaryDark,
				'--theme-background': theme.background,
				'--theme-card-background': theme.cardBackground
			}
			// 强制更新视图
			this.$forceUpdate()
		},
		// 更新导航栏颜色
		updateNavigationBarColor() {
			const theme = this.themeConfig
			// #ifdef APP-PLUS || MP-WEIXIN || H5
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: theme.primary,
				animation: {
					duration: 300,
					timingFunc: 'easeIn'
				}
			})
			// #endif
		},
		// 主题变化处理函数，子页面可以重写
		handleThemeChange(theme) {
			// 重新应用主题颜色
			this.applyThemeColors()
			// 更新导航栏颜色
			this.updateNavigationBarColor()
		}
	}
}