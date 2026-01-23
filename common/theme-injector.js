/**
 * 主题样式注入器
 * 动态注入主题样式到页面
 */

export function injectThemeStyles(theme) {
	// 创建样式元素
	const styleId = 'theme-dynamic-styles'
	let styleElement = document.getElementById(styleId)
	
	if (!styleElement) {
		styleElement = document.createElement('style')
		styleElement.id = styleId
		document.head.appendChild(styleElement)
	}
	
	// 定义动态样式
	const styles = `
		.theme-primary { color: ${theme.primary} !important; }
		.theme-primary-bg { background-color: ${theme.primary} !important; }
		.theme-primary-light { color: ${theme.primaryLight} !important; }
		.theme-primary-light-bg { background-color: ${theme.primaryLight} !important; }
		.theme-primary-dark { color: ${theme.primaryDark} !important; }
		.theme-primary-dark-bg { background-color: ${theme.primaryDark} !important; }
		.theme-background { background-color: ${theme.background} !important; }
		.theme-card-background { background-color: ${theme.cardBackground} !important; }
		.theme-border { border-color: ${theme.primary} !important; }
		.theme-icon { color: ${theme.primary} !important; }
	`
	
	styleElement.textContent = styles
}

// 在应用启动时调用
export function initThemeInjector() {
	// #ifdef H5
	const themeKey = uni.getStorageSync('currentTheme') || 'default'
	const theme = require('./theme.js').getThemeConfig(themeKey)
	injectThemeStyles(theme)
	
	// 监听主题变化
	uni.$on('themeChange', (theme) => {
		injectThemeStyles(theme)
	})
	// #endif
}