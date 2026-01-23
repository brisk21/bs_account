// 主题配置
const themes = {
	default: {
		name: '默认主题',
		primary: '#42b479',
		primaryLight: '#6cd299',
		primaryDark: '#2e8a56',
		background: '#f5f5f5',
		cardBackground: '#ffffff'
	},
	gold: {
		name: '金色主题',
		primary: '#d4af37',
		primaryLight: '#e8c86a',
		primaryDark: '#a88a2b',
		background: '#fffaf0',
		cardBackground: '#fffef8'
	},
	blue: {
		name: '蓝色主题',
		primary: '#3b82f6',
		primaryLight: '#60a5fa',
		primaryDark: '#2563eb',
		background: '#f0f7ff',
		cardBackground: '#ffffff'
	},
	purple: {
		name: '紫色主题',
		primary: '#8b5cf6',
		primaryLight: '#a78bfa',
		primaryDark: '#7c3aed',
		background: '#faf5ff',
		cardBackground: '#ffffff'
	},
	red: {
		name: '红色主题',
		primary: '#ef4444',
		primaryLight: '#f87171',
		primaryDark: '#dc2626',
		background: '#fef2f2',
		cardBackground: '#ffffff'
	}
}

// 获取当前主题配置
export function getThemeConfig(themeKey = 'default') {
	return themes[themeKey] || themes.default
}

// 获取所有主题列表
export function getAllThemes() {
	return themes
}

// 应用主题到页面
export function applyTheme(themeKey = 'default') {
	const theme = getThemeConfig(themeKey)
	
	// 设置CSS变量
	uni.setStorageSync('themeColors', theme)
	
	// 更新导航栏颜色
	uni.setNavigationBarColor({
		frontColor: '#ffffff',
		backgroundColor: theme.primary
	})
	
	// 动态更新tabBar颜色
	// #ifdef APP-PLUS || MP-WEIXIN
	uni.setTabBarStyle({
		selectedColor: theme.primary
	})
	// #endif
	
	// 触发页面刷新以应用新主题
	uni.$emit('themeChange', theme)
	
	return theme
}