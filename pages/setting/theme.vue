<template>
	<view class="theme-container" :style="themeStyles">
		<view class="theme-header">
			<text class="title">主题切换</text>
			<text class="subtitle">选择你喜欢的主题风格</text>
			<text class="subtitle">切换后部分机型需重新启动应用，清理缓存后主题将重新恢复默认！</text>
		</view>
		
		<view class="theme-list">
			<view 
				v-for="(theme, key) in themes" 
				:key="key"
				class="theme-item"
				:class="{ 'active': currentTheme === key }"
				:style="{ borderColor: currentTheme === key ? theme.primary : '#e5e5e5' }"
				@click="selectTheme(key)"
			>
				<view class="theme-preview" :style="{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryLight} 100%)` }">
					<view class="preview-card" :style="{ backgroundColor: theme.cardBackground }"></view>
				</view>
				<view class="theme-info">
					<text class="theme-name">{{ theme.name }}</text>
					<text v-if="currentTheme === key" class="check-icon">✓</text>
				</view>
			</view>
		</view>
		
		<!-- 自定义主题区域 -->
		<view class="custom-theme-section">
			<view class="section-title">
				<text>自定义主题</text>
			</view>
			<view class="custom-theme-content">
				<view class="color-picker-item">
					<text class="label">选择主色调</text>
					<view class="color-picker-wrapper">
						<view 
							class="color-preview" 
							:style="{ backgroundColor: customColor }"
							@click="showColorPicker = true"
						>
							<text class="color-value">{{ customColor }}</text>
							<text class="color-hint">点击选择</text>
						</view>
						<button class="apply-btn" @click="applyCustomTheme">应用</button>
					</view>
				</view>
				<!-- 预设颜色 -->
				<view class="preset-colors">
					<text class="preset-label">快速选择：</text>
					<view class="preset-list">
						<view 
							v-for="color in presetColors" 
							:key="color"
							class="preset-color-item"
							:style="{ backgroundColor: color }"
							:class="{ 'active': customColor === color }"
							@click="selectPresetColor(color)"
						></view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="theme-footer">
			<text class="tip">选择主题后将立即应用到整个应用</text>
		</view>
		
		<!-- 颜色选择器弹窗 -->
		<u-popup v-model="showColorPicker" mode="center" :border-radius="20" :closeable="true">
			<view class="color-picker-popup">
				<view class="popup-header">
					<text class="popup-title">选择颜色</text>
				</view>
				<view class="color-grid">
					<view 
						v-for="color in colorPalette" 
						:key="color"
						class="color-grid-item"
						:style="{ backgroundColor: color }"
						:class="{ 'active': customColor === color }"
						@click="selectColor(color)"
					>
						<text v-if="customColor === color" class="selected-icon">✓</text>
					</view>
				</view>
				<view class="popup-footer">
					<view class="current-color-display">
						<text class="current-color-label">当前选择：</text>
						<view class="current-color-preview" :style="{ backgroundColor: customColor }">
							<text class="current-color-value">{{ customColor }}</text>
						</view>
					</view>
					<button class="confirm-btn" @click="confirmColor">确定</button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { getAllThemes, applyTheme, saveCustomTheme, generateThemeFromColor } from '@/common/theme.js'
import themeMixin from '@/common/theme-mixin.js'

export default {
	mixins: [themeMixin],
	data() {
		return {
			currentTheme: 'default',
			themes: getAllThemes(),
			customColor: '#42b479',
			showColorPicker: false,
			presetColors: [
				'#42b479', // 默认绿色
				'#d4af37', // 金色
				'#3b82f6', // 蓝色
				'#8b5cf6', // 紫色
				'#ef4444', // 红色
				'#f59e0b', // 橙色
				'#10b981', // 翠绿
				'#ec4899', // 粉色
				'#6366f1', // 靛蓝
				'#14b8a6', // 青色
			],
			colorPalette: [
				// 红色系
				'#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2',
				// 橙色系
				'#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5',
				'#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7',
				// 黄色系
				'#eab308', '#facc15', '#fde047', '#fef08a', '#fef9c3',
				// 绿色系
				'#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#dcfce7',
				'#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5',
				'#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#ccfbf1',
				'#42b479', '#6cd299', '#8addb8', '#b3e6d7', '#d8f2e6',
				// 蓝色系
				'#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe',
				'#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe',
				'#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff',
				// 紫色系
				'#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe',
				'#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff', '#f3e8ff',
				'#d946ef', '#e879f9', '#f0abfc', '#f5d0fe', '#fae8ff',
				'#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8', '#fce7f3',
				// 灰色系
				'#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6',
				// 棕色系
				'#78350f', '#92400e', '#b45309', '#d97706', '#f59e0b',
			]
		}
	},
	onLoad() {
		this.currentTheme = this.$store.getters['theme/currentTheme'] || 'default'
		// 如果当前是自定义主题，获取保存的颜色
		if (this.currentTheme === 'custom') {
			const customTheme = uni.getStorageSync('customTheme')
			if (customTheme) {
				this.customColor = customTheme.primary
			}
		}
	},
	methods: {
		selectTheme(themeKey) {
			// 先保存到store
			this.$store.dispatch('theme/setTheme', themeKey)
			// 更新当前显示的主题
			this.currentTheme = themeKey
			// 应用主题
			applyTheme(themeKey)
			// 提示用户
			this.$u.toast('主题切换成功')
			
			// 延迟返回，确保主题已经保存
			setTimeout(() => {
				uni.navigateBack()
			}, 500)
		},
		selectPresetColor(color) {
			this.customColor = color
		},
		selectColor(color) {
			this.customColor = color
		},
		confirmColor() {
			this.showColorPicker = false
		},
		applyCustomTheme() {
			// 生成主题配置
			const themeConfig = generateThemeFromColor(this.customColor)
			// 保存自定义主题
			saveCustomTheme(themeConfig)
			// 更新主题列表
			this.themes = getAllThemes()
			// 应用自定义主题
			this.selectTheme('custom')
		}
	}
}
</script>

<style lang="scss" scoped>
.theme-container {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding: 30upx;
}

.theme-header {
	padding: 40upx 20upx;
	text-align: center;
	
	.title {
		display: block;
		font-size: 40upx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10upx;
	}
	
	.subtitle {
		display: block;
		font-size: 28upx;
		color: #999;
	}
}

.theme-list {
	display: flex;
	flex-direction: column;
	gap: 30upx;
	margin-bottom: 40upx;
}

.theme-item {
	background-color: #fff;
	border-radius: 20upx;
	padding: 30upx;
	border: 3upx solid #e5e5e5;
	transition: all 0.3s;
	
	&.active {
		box-shadow: 0 8upx 20upx rgba(0, 0, 0, 0.1);
		transform: translateY(-2upx);
	}
}

.theme-preview {
	height: 120upx;
	border-radius: 12upx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 20upx;
	position: relative;
	overflow: hidden;
	
	.preview-card {
		width: 80upx;
		height: 60upx;
		border-radius: 8upx;
		box-shadow: 0 4upx 12upx rgba(0, 0, 0, 0.1);
	}
}

.theme-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	
	.theme-name {
		font-size: 32upx;
		font-weight: 500;
		color: #333;
	}
	
	.check-icon {
		font-size: 40upx;
		font-weight: bold;
		color: #42b479;
	}
}

.custom-theme-section {
	background-color: #fff;
	border-radius: 20upx;
	padding: 30upx;
	margin-bottom: 40upx;
	
	.section-title {
		font-size: 32upx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30upx;
	}
}

.custom-theme-content {
	.color-picker-item {
		margin-bottom: 30upx;
		
		.label {
			display: block;
			font-size: 28upx;
			color: #666;
			margin-bottom: 20upx;
		}
		
		.color-picker-wrapper {
			display: flex;
			align-items: center;
			gap: 20upx;
		}
		
		.color-preview {
			flex: 1;
			height: 80upx;
			border-radius: 12upx;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 2upx solid #e5e5e5;
			position: relative;
			
			.color-value {
				font-size: 24upx;
				color: #333;
				font-weight: 500;
			}
			
			.color-hint {
				position: absolute;
				right: 20upx;
				font-size: 20upx;
				color: #999;
			}
		}
		
		.apply-btn {
			padding: 20upx 40upx;
			background-color: var(--theme-primary, #42b479);
			color: #fff;
			border: none;
			border-radius: 12upx;
			font-size: 28upx;
		}
	}
}

.preset-colors {
	.preset-label {
		display: block;
		font-size: 28upx;
		color: #666;
		margin-bottom: 20upx;
	}
	
	.preset-list {
		display: flex;
		flex-wrap: wrap;
		gap: 20upx;
	}
	
	.preset-color-item {
		width: 60upx;
		height: 60upx;
		border-radius: 12upx;
		border: 3upx solid transparent;
		transition: all 0.3s;
		
		&.active {
			border-color: #333;
			transform: scale(1.1);
		}
	}
}

.color-picker-popup {
	width: 650upx;
	max-height: 80vh;
	background-color: #fff;
	border-radius: 20upx;
	overflow: hidden;
	
	.popup-header {
		padding: 30upx;
		text-align: center;
		border-bottom: 1upx solid #e5e5e5;
		
		.popup-title {
			font-size: 36upx;
			font-weight: bold;
			color: #333;
		}
	}
	
	.color-grid {
		padding: 30upx;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 15upx;
		max-height: 500upx;
		overflow-y: auto;
		
		.color-grid-item {
			width: 100%;
			padding-bottom: 100%;
			position: relative;
			border-radius: 12upx;
			border: 3upx solid transparent;
			transition: all 0.3s;
			
			&.active {
				border-color: #333;
				transform: scale(1.1);
			}
			
			.selected-icon {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				font-size: 40upx;
				font-weight: bold;
				color: #fff;
				text-shadow: 0 0 4upx rgba(0, 0, 0, 0.5);
			}
		}
	}
	
	.popup-footer {
		padding: 30upx;
		border-top: 1upx solid #e5e5e5;
		
		.current-color-display {
			display: flex;
			align-items: center;
			gap: 20upx;
			margin-bottom: 20upx;
			
			.current-color-label {
				font-size: 28upx;
				color: #666;
			}
			
			.current-color-preview {
				flex: 1;
				height: 60upx;
				border-radius: 12upx;
				display: flex;
				align-items: center;
				justify-content: center;
				border: 2upx solid #e5e5e5;
				
				.current-color-value {
					font-size: 24upx;
					color: #333;
					font-weight: 500;
				}
			}
		}
		
		.confirm-btn {
			width: 100%;
			padding: 25upx;
			background-color: var(--theme-primary, #42b479);
			color: #fff;
			border: none;
			border-radius: 12upx;
			font-size: 32upx;
			font-weight: bold;
		}
	}
}

.theme-footer {
	text-align: center;
	padding: 40upx 20upx;
	
	.tip {
		font-size: 24upx;
		color: #999;
	}
}
</style>