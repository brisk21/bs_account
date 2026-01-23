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
			themeStyles: {},
			themeStyleId: 'theme-style-' + Date.now() + Math.random().toString(36).substr(2, 9)
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
		// 移除动态样式
		this.removeDynamicStyles()
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
			// 注入动态样式（用于小程序和APP）
			this.injectDynamicStyles(theme)
			// 强制更新视图
			this.$forceUpdate()
		},
		// 注入动态样式
		injectDynamicStyles(theme) {
			// #ifdef H5
			this.removeDynamicStyles()
			const style = document.createElement('style')
			style.id = this.themeStyleId
			style.textContent = `
				.${this.themeStyleId}-container .bs-green { color: ${theme.primary} !important; }
				.${this.themeStyleId}-container .amount-green { color: ${theme.primary} !important; }
				.${this.themeStyleId}-container .u-button--primary { background-color: ${theme.primary} !important; border-color: ${theme.primary} !important; }
			`
			document.head.appendChild(style)
			// #endif
		},
		// 移除动态样式
		removeDynamicStyles() {
			// #ifdef H5
			const style = document.getElementById(this.themeStyleId)
			if (style) {
				style.remove()
			}
			// #endif
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