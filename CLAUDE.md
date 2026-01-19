# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码仓库中工作时提供指导。

## 语言规则

**重要：在此项目中，所有与 Claude 的交互必须使用中文进行。**
- 用户提问使用中文
- Claude 回复使用中文
- 代码注释建议使用中文
- 文档和说明使用中文

## 项目概述

这是一个个人/企业记账应用，技术栈如下：
- **前端**: uni-app (Vue 2) - 跨平台框架，支持 APP、微信小程序、H5 等
- **后端**: ThinkPHP 8 (独立仓库：https://gitee.com/brisklan/bs_account_backend)
- **UI 库**: uView UI
- **当前分支**: `pro-ui-upgrade` (专业版，功能增强)
- **主分支**: `master`

应用支持多币种、报销管理、账簿管理、预算跟踪、数据导入导出等功能。

## 开发环境配置

### 前置要求
- HBuilder X (uni-app 开发推荐 IDE)
- Node.js 和 npm
- PHP 8.0+ (后端)
- MySQL 数据库 (后端)

### 安装步骤

1. 安装依赖：
```bash
npm install crypto-js@^3.3.0
npm install mp-html@^2.5.0
```

2. 配置应用：
   - 复制 `const.js.example` 为 `const.js`
   - 修改 `const.js` 中的配置：
     - `key`: 32位加密密钥（必须与后端一致）
     - `baseUrl`: 后端 API 接口地址

3. 编译目标平台：
   - 在 HBuilder X 中打开项目
   - 选择编译目标（APP/微信小程序/H5 等）
   - APP 编译需在 `manifest.json` 中配置图标

## 项目架构

### 目录结构

```
├── App.vue                 # 应用入口，处理应用生命周期和更新
├── main.js                 # Vue 初始化，插件注册
├── pages.json              # 页面路由和 tabBar 配置
├── manifest.json           # 应用配置（版本、权限、平台设置）
├── const.js                # 配置文件（API 地址、加密密钥）
├── common/                 # API 定义和工具函数
│   ├── base.js            # 主要 API 方法定义（导出为 vm.$u.api）
│   ├── http.interceptor.js # HTTP 请求/响应拦截器
│   ├── crypto.js          # AES-256-CBC 加密/解密工具
│   └── wgt.js             # 热更新（wgt）管理
├── store/                  # Vuex 状态管理
│   ├── index.js           # Store 初始化，动态加载模块
│   └── modules/
│       ├── user.js        # 用户认证和个人信息状态
│       └── network.js     # 网络连接监控
├── mixins/
│   └── common.js          # 全局混入（登录检查、导航辅助）
├── pages/                  # 主要页面
│   ├── index/             # 账单列表和详情页
│   ├── bill/              # 账单表单（创建/编辑）
│   ├── statistics/        # 统计和图表
│   ├── user/              # 用户个人中心
│   ├── login/             # 登录和注册
│   ├── setting/           # 设置和安全中心
│   ├── budget/            # 预算管理
│   └── packageA/          # 分包（按需加载的页面）
│       ├── cashbook/      # 账簿管理
│       ├── baoxiao/       # 报销管理
│       ├── currency/      # 多币种支持
│       ├── amount_type/   # 收支方式管理
│       ├── amount_platform/ # 交易平台管理
│       ├── staff/         # 员工管理
│       └── statistics/    # 高级统计（日历、图表）
├── components/            # 可复用组件
└── uview-ui/              # uView UI 库
```

### 核心架构模式

#### 1. API 层 (`common/base.js`)
- 所有 API 方法在 main.js 中注册为 `vm.$u.api.*`
- 使用 uView 的 HTTP 封装和自定义拦截器
- 敏感数据（登录、密码、账号修改）使用 `crypto.js` 的 `encrypt()` 加密
- 使用示例：`this.$u.api.login(data)`、`this.$u.api.getCashflowList(cashbook_id, year, month)`

#### 2. HTTP 拦截器 (`common/http.interceptor.js`)
- **请求拦截器**：添加请求头（Authorization token、platform、version、bsfrom）
- **响应拦截器**：处理 401（退出登录）、500（错误提示）、网络错误
- Base URL 从 `const.js` 配置

#### 3. 加密机制 (`common/crypto.js`)
- 使用 AES-256-CBC 加密，随机 IV
- 发送到后端前加密敏感数据
- 密钥必须是 32 位字符，且与后端配置一致
- 返回 `{encryptedData, iv}` 对象

#### 4. 状态管理 (Vuex)
- **user 模块**：管理认证 token、用户信息、当前账簿、未读消息数
- **network 模块**：监控网络连接状态，显示 toast 通知
- 模块从 `store/modules/` 动态加载
- 用户数据持久化到 `uni.getStorageSync()`

#### 5. 全局混入 (`mixins/common.js`)
- `hasLogin`：计算属性，检查认证状态
- `gotoPath(path, auth, param, jump_type)`：通用导航辅助函数，带认证检查
- 通过 main.js 中的 `Vue.mixin()` 混入所有组件

#### 6. 应用更新
- **APP 更新**：使用 `wonyes-checkappupdate` 插件检查新版本
- **热更新 (wgt)**：`common/wgt.js` 处理增量更新，无需完整重装
- 更新 API 端点：`constConfig.baseUrl + '/update'`

#### 7. 平台条件编译
uni-app 使用条件编译实现平台特定代码：
- `// #ifdef APP-PLUS` - 仅原生 APP
- `// #ifdef MP-WEIXIN` - 仅微信小程序
- `// #ifdef H5` - 仅 Web 浏览器
- `// #endif` - 结束条件块

#### 8. 分包（按需加载）
- `pages/packageA/` 在 `pages.json` 中配置为分包
- 页面按需加载，减少初始包体积
- 用于不常访问的功能（报销、币种、员工管理）

## 常见开发任务

### 添加新的 API 接口

1. 在 `common/base.js` 中添加方法：
```javascript
const myNewApi = (params) => {
    return vm.$u.post('my-endpoint', params);
}
```

2. 在文件底部的 `vm.$u.api` 对象中导出

3. 在组件中使用：`this.$u.api.myNewApi(params)`

### 添加新页面

1. 在相应目录创建 `.vue` 文件
2. 在 `pages.json` 中注册：
```json
{
  "path": "pages/mypage/index",
  "style": {
    "navigationBarTitleText": "我的页面",
    "enablePullDownRefresh": false
  }
}
```

3. 使用混入导航：`this.gotoPath('/pages/mypage/index')`

### 处理加密数据

对于敏感操作（登录、密码修改、账号修改）：
```javascript
import { encrypt } from '@/common/crypto.js';

const sensitiveData = { password: 'secret' };
this.$u.api.someSecureEndpoint(encrypt(sensitiveData));
```

### 访问当前用户/账簿

```javascript
// 在任何组件中
this.$store.state.user.user          // 用户信息对象
this.$store.state.user.user_token    // 认证 token
this.$store.state.user.cur_cashbook  // 当前选中的账簿
this.$store.state.user.unread_count  // 未读消息数

// 或使用混入
this.hasLogin  // 布尔值：用户是否已登录？
```

### 不同平台编译

在 HBuilder X 中：
- **Android APP**：运行 → 运行到手机或模拟器 → Android
- **iOS APP**：运行 → 运行到手机或模拟器 → iOS
- **微信小程序**：运行 → 运行到小程序模拟器 → 微信开发者工具
- **H5**：运行 → 运行到浏览器
- **生产构建**：发行 → 原生 App - 云打包（APP）或 发行 → 小程序（微信）

## 重要注意事项

- **版本管理**：发布前更新 `manifest.json` 中的 `versionName` 和 `versionCode`
- **加密密钥**：`const.js` 中的 32 位密钥必须与后端配置一致
- **平台标识**：`bsfrom` 请求头标识平台（app/xcx/h5），用于后端逻辑判断
- **Token 过期**：401 响应自动触发退出登录并跳转到登录页
- **网络监控**：应用监控网络连接状态，网络变化时显示 toast 提示
- **存储机制**：使用 `uni.getStorageSync()` 持久化数据（token、用户信息、账簿）
- **多账簿**：用户可拥有多个账簿，`cur_cashbook` 跟踪当前活动账簿
- **专业版功能**：当前分支包含多币种、报销管理、多附件、员工管理等功能

## 分支信息

- **master**：基础版本，适合个人/家庭使用
- **pro-ui-upgrade**：专业版，功能增强（当前分支）
  - 额外功能：多币种、报销管理、账单多附件、员工管理、高级日历视图

## 代码规范

- 变量命名使用驼峰命名法
- 组件文件名使用 PascalCase（如 `UploadFile.vue`）
- API 方法使用下划线命名（如 `bill_list`、`export_data`）
- 敏感数据传输前必须加密
- 页面跳转优先使用 `gotoPath` 混入方法
- 避免在代码中硬编码 API 地址，使用 `const.js` 配置
