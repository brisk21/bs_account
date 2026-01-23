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
	// 如果是自定义主题，从本地存储获取
	if (themeKey === 'custom') {
		const customTheme = uni.getStorageSync('customTheme')
		if (customTheme) {
			return customTheme
		}
	}
	return themes[themeKey] || themes.default
}

// 获取所有主题列表
export function getAllThemes() {
	const customTheme = uni.getStorageSync('customTheme')
	const themeList = { ...themes }
	
	// 如果有自定义主题，添加到列表中
	if (customTheme) {
		themeList.custom = customTheme
	}
	
	return themeList
}

// 保存自定义主题
export function saveCustomTheme(themeConfig) {
	uni.setStorageSync('customTheme', themeConfig)
	return themeConfig
}

// 删除自定义主题
export function removeCustomTheme() {
	uni.removeStorageSync('customTheme')
}

// 根据颜色生成主题配置
export function generateThemeFromColor(primaryColor) {
	// 简单的颜色变体生成
	const hex = primaryColor.replace('#', '')
	const r = parseInt(hex.substr(0, 2), 16)
	const g = parseInt(hex.substr(2, 2), 16)
	const b = parseInt(hex.substr(4, 2), 16)
	
	// 生成浅色版本（增加亮度）
	const lightR = Math.min(255, r + 40)
	const lightG = Math.min(255, g + 40)
	const lightB = Math.min(255, b + 40)
	const primaryLight = `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`
	
	// 生成深色版本（降低亮度）
	const darkR = Math.max(0, r - 40)
	const darkG = Math.max(0, g - 40)
	const darkB = Math.max(0, b - 40)
	const primaryDark = `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`
	
	// 根据主色调生成背景色
	const bgR = Math.min(255, r + 240)
	const bgG = Math.min(255, g + 240)
	const bgB = Math.min(255, b + 240)
	const background = `#${bgR.toString(16).padStart(2, '0')}${bgG.toString(16).padStart(2, '0')}${bgB.toString(16).padStart(2, '0')}`
	
	return {
		name: '自定义主题',
		primary: primaryColor,
		primaryLight: primaryLight,
		primaryDark: primaryDark,
		background: background,
		cardBackground: '#ffffff'
	}
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