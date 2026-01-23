<template>
	<view class="theme-container" :style="themeStyles">
		<view class="theme-header">
			<text class="title">主题切换</text>
			<text class="subtitle">选择你喜欢的主题风格，切换后需重新启动应用</text>
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
		
		<view class="theme-footer">
			<text class="tip">选择主题后将立即应用到整个应用</text>
		</view>
	</view>
</template>

<script>
import { getAllThemes, applyTheme } from '@/common/theme.js'
import themeMixin from '@/common/theme-mixin.js'

export default {
	mixins: [themeMixin],
	data() {
		return {
			currentTheme: 'default',
			themes: getAllThemes()
		}
	},
	onLoad() {
		this.currentTheme = this.$store.getters['theme/currentTheme'] || 'default'
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

.theme-footer {
	text-align: center;
	padding: 40upx 20upx;
	
	.tip {
		font-size: 24upx;
		color: #999;
	}
}
</style>