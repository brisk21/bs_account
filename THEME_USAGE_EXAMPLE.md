# 主题切换使用示例

## 问题说明
由于项目中使用了SCSS变量 `$uni-theme-color`，这些变量是在编译时确定的，无法在运行时动态改变。因此，主题切换需要通过以下方式实现：

## 解决方案

### 方法1：使用动态样式（推荐）

在需要使用主题颜色的页面中：

```vue
<template>
  <view class="container" :style="themeStyles">
    <!-- 使用CSS变量 -->
    <view class="header" style="background-color: var(--theme-primary)">
      <text>标题</text>
    </view>
    
    <!-- 或者使用class -->
    <view class="theme-primary-bg">
      <text class="theme-primary">主题色文字</text>
    </view>
  </view>
</template>

<script>
import themeMixin from '@/common/theme-mixin.js'

export default {
  mixins: [themeMixin],
  data() {
    return {
      // themeStyles 会自动由混入提供
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: var(--theme-background);
}

.header {
  padding: 30rpx;
  color: #fff;
}
</style>
```

### 方法2：使用计算属性

```vue
<template>
  <view class="container">
    <view class="header" :style="{ backgroundColor: themePrimary }">
      <text>标题</text>
    </view>
  </view>
</template>

<script>
import themeMixin from '@/common/theme-mixin.js'

export default {
  mixins: [themeMixin],
  data() {
    return {}
  }
}
</script>
```

### 方法3：修改现有页面（示例）

如果现有页面使用了 `$uni-theme-color`，可以修改为：

**原代码：**
```scss
.top {
  background-color: $uni-theme-color;
}
```

**修改为：**
```scss
.top {
  background-color: var(--theme-primary, #42b479);
}
```

然后在页面中引入主题混入：
```javascript
import themeMixin from '@/common/theme-mixin.js'

export default {
  mixins: [themeMixin],
  // ...
}
```

## 可用的CSS变量

- `--theme-primary` - 主题主色
- `--theme-primary-light` - 主题浅色
- `--theme-primary-dark` - 主题深色
- `--theme-background` - 页面背景色
- `--theme-card-background` - 卡片背景色

## 可用的类名

- `.theme-primary` - 主题色文字
- `.theme-primary-bg` - 主题色背景
- `.theme-primary-light` - 主题浅色文字
- `.theme-primary-light-bg` - 主题浅色背景
- `.theme-primary-dark` - 主题深色文字
- `.theme-primary-dark-bg` - 主题深色背景
- `.theme-background` - 页面背景
- `.theme-card-background` - 卡片背景
- `.theme-border` - 主题色边框
- `.theme-icon` - 主题色图标

## 注意事项

1. 主题切换后，导航栏和tabBar颜色会自动更新
2. 使用主题混入的页面会自动监听主题变化
3. CSS变量需要浏览器支持（现代浏览器都支持）
4. 在H5环境下，主题样式会通过JavaScript动态注入
5. 对于使用SCSS变量的页面，建议逐步迁移到使用CSS变量或动态样式