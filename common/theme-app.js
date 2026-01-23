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
		
		// 动态更新uview-ui的primary颜色（H5环境）
		updateUviewTheme(theme.primary)
	}
	
	return theme
}

// 获取当前主题颜色
export function getCurrentThemeColors() {
	const themeKey = uni.getStorageSync('currentTheme') || 'default'
	return getThemeConfig(themeKey)
}

// 动态更新uview-ui的主题色（H5环境）
function updateUviewTheme(primaryColor) {
	if (typeof document === 'undefined') return
	
	// 创建或更新样式规则
	let styleElement = document.getElementById('uview-theme-dynamic')
	if (!styleElement) {
		styleElement = document.createElement('style')
		styleElement.id = 'uview-theme-dynamic'
		document.head.appendChild(styleElement)
	}
	
	// 动态样式规则
	const styles = `
		.u-button--primary {
			background-color: ${primaryColor} !important;
			border-color: ${primaryColor} !important;
		}
		.u-button--primary::after {
			border-color: ${primaryColor} !important;
		}
		.u-button--primary--hover {
			background-color: ${primaryColor} !important;
			opacity: 0.8;
		}
	`
	
	styleElement.textContent = styles
}

// 更新页面主题（用于主题切换后刷新页面）
export function updatePageTheme() {
	const theme = getCurrentThemeColors()
	
	// 更新导航栏
	if (uni.setNavigationBarColor) {
		uni.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: theme.primary
		})
	}
	
	// 更新tabBar
	// #ifdef APP-PLUS || MP-WEIXIN
	if (uni.setTabBarStyle) {
		uni.setTabBarStyle({
			selectedColor: theme.primary
		})
	}
	// #endif
	
	// H5环境更新uview主题
	if (typeof document !== 'undefined') {
		updateUviewTheme(theme.primary)
	}
}