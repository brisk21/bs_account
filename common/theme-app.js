import { getThemeConfig } from './theme.js'

// 应用主题到全局样式
export function applyGlobalTheme() {
	const themeKey = uni.getStorageSync('currentTheme') || 'default'
	const theme = getThemeConfig(themeKey)
	
	// 动态设置导航栏颜色
	if (uni.setNavigationBarColor) {
		uni.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: theme.primary
		})
	}
	
	// 动态设置tabBar颜色
	// #ifdef APP-PLUS || MP-WEIXIN
	if (uni.setTabBarStyle) {
		uni.setTabBarStyle({
			selectedColor: theme.primary
		})
	}
	// #endif
	
	// 设置全局CSS变量（在页面中通过var(--theme-primary)使用）
	if (typeof document !== 'undefined') {
		document.documentElement.style.setProperty('--theme-primary', theme.primary)
		document.documentElement.style.setProperty('--theme-primary-light', theme.primaryLight)
		document.documentElement.style.setProperty('--theme-primary-dark', theme.primaryDark)
		document.documentElement.style.setProperty('--theme-background', theme.background)
		document.documentElement.style.setProperty('--theme-card-background', theme.cardBackground)
	}
	
	return theme
}

// 获取当前主题颜色
export function getCurrentThemeColors() {
	const themeKey = uni.getStorageSync('currentTheme') || 'default'
	return getThemeConfig(themeKey)
}