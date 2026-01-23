# 主题切换功能使用说明

## 功能概述
已为应用添加了主题切换功能，支持以下主题：
- 默认主题（绿色）
- 金色主题
- 蓝色主题
- 紫色主题
- 红色主题

## 使用方法

### 1. 在页面中使用主题颜色

在需要使用主题颜色的页面中引入主题混入：

```javascript
import themeMixin from '@/common/theme-mixin.js'

export default {
  mixins: [themeMixin],
  data() {
    return {}
  },
  methods: {}
}
```

### 2. 在模板中使用主题颜色

```vue
<template>
  <view class="container" :style="{ backgroundColor: themeBackground }">
    <view class="header" :style="{ backgroundColor: themePrimary }">
      <text>标题</text>
    </view>
    <view class="card" :style="{ backgroundColor: themeCardBackground }">
      <text class="btn" :style="{ backgroundColor: themePrimary, color: '#fff' }">
        按钮
      </text>
    </view>
  </view>
</template>
```

### 3. 在样式中使用主题变量

```vue
<style lang="scss" scoped>
.container {
  height: 100vh;
}

.header {
  padding: 30rpx;
  color: #fff;
}

.card {
  margin: 20rpx;
  padding: 30rpx;
  border-radius: 10rpx;
}

.btn {
  padding: 20rpx 40rpx;
  border-radius: 8rpx;
  text-align: center;
}
</style>
```

## 可用的主题颜色变量

引入主题混入后，可以使用以下计算属性：

- `themeConfig` - 完整的主题配置对象
- `themePrimary` - 主题主色
- `themePrimaryLight` - 主题浅色
- `themePrimaryDark` - 主题深色
- `themeBackground` - 页面背景色
- `themeCardBackground` - 卡片背景色

## 主题配置文件位置

- 主题配置：`common/theme.js`
- 主题混入：`common/theme-mixin.js`
- 主题Store模块：`store/modules/theme.js`
- 主题切换页面：`pages/setting/theme.vue`

## 自定义主题

如需添加新主题，在 `common/theme.js` 中的 `themes` 对象中添加新主题配置：

```javascript
const themes = {
  // ... 现有主题
  custom: {
    name: '自定义主题',
    primary: '#你的颜色',
    primaryLight: '#浅色版本',
    primaryDark: '#深色版本',
    background: '#背景色',
    cardBackground: '#卡片背景色'
  }
}
```

## 注意事项

1. 主题切换后会自动保存到本地存储
2. 切换主题后会触发 `themeChange` 事件
3. 如需在主题切换后刷新页面，可以在页面的 `handleThemeChange` 方法中实现
4. 导航栏颜色会在应用启动和主题切换时自动更新