## BS记账

### 简介
记账APP后台，uniapp（vue2）+ thinkphp8开发,管理后台用element ui

后端开源仓库：[https://gitee.com/brisklan/bs_account_backend](https://gitee.com/brisklan/bs_account_backend)

系统是之前开发自用的，本着够用就行，难免有bug，如有疑问，或者需要定制开发欢迎交流，微信号：woyekeyiha。

本项目是基于[https://ext.dcloud.net.cn/plugin?id=6553](https://ext.dcloud.net.cn/plugin?id=6553)魔改的，调整了样式，移除了一些不需要的功能。

我主要是编译成安卓端自用，其他端的兼容问题需要自己去调整。

### 和本项目配套的后台接口

### 使用说明
- const.js 里面配置你的后端接口和加密秘钥（具体看const.js.example文件）
### 系统功能
<img alt="系统功能" src="./unpackage/demo-image/app功能.png"   title="系统功能"/>

 :grin: 个人或者家庭使用就用master分支即可，如果是小团体、小微企业使用推荐使用pro专业版

### 分支对比，在线版本是pro版本
| 功能模块/子模块      | Master    | Pro        |
|---------------|-----------|------------|
| **账单记录**      | ✔️        | ✔️         |
| **分类管理**      | ✔️        | ✔️         |
| **预算管理**      | ✔️        | ✔️         |
| **账本管理**      | ✔️        | ✔️         |
| **数据统计**      | ✔️        | ✔️         |
| **安全中心**      | ✔️        | ✔️         |
| - 信息修改        | ✔️        | ✔️         |
| - 账号修改        | ✔️        | ✔️         |
| - 隐私管理        | ✔️        | ✔️         |
| - 数据导入导出      | ✔️        | ✔️         |
| - 支付宝和微信账单导入  | ✔️        | ✔️         |
| **帮助中心**      | ✔️        | ✔️         |
| **插件中心**      | ✔️        | ✔️         |
| **消息中心**      | ✔️        | ✔️         |
| **账簿管理**      | ✔️        | ✔️         |
| **其它基础功能**    | ✔️        | ✔️         |
| **APP在线更新**   | ✔️        | ✔️         |
| **私有化部署**     | ✔️        | ✔️         |
 | **php代码费用**   | 开源        | ￥200       |
| **帮忙私有化部署费用** | ￥100      | ￥100       |
| -  php版本      | 8.0+      | 8.0+       |
| - 前端框架        | vue2      | vue2       |
| - 接口后端框架      | thinkphp8 | thinkphp8  |
| - 数据库         | mysql     | mysql      |
| - 管理后台前端框架    | element UI | element UI |
| - 文件储存方式      | 本地        | 本地、七牛云     |
| **账单多附件**     | ❌         | ✔️         |
| **报销管理**      | ❌         | ✔️         |
| **账单多附件**     | ❌         | ✔️         |
| **管理用户状态**    | ❌         | ✔️         |
| **H5在线更新**    | ❌         | ✔️         |
| **管理后台在线更新**  | ❌         | ✔️         |
| **记账日历**      | ✔️粗糙版     | ✔️精致版      |
| **员工管理**      | ✔️     | ✔️     |

### 系统展示
<img src="./unpackage/demo-image/gh_8d928c988fe5_258.jpg" width="200" title="微信小程序" />

<img alt="首页" src="./unpackage/demo-image/首页.png" width="150" title="首页"/>

<img alt="我的" src="./unpackage/demo-image/我的.png" width="150" title="我的"/>

<img alt="所有记录" src="./unpackage/demo-image/所有账单.png" width="150" title="记录"/>

<img alt="添加记录" src="./unpackage/demo-image/记账.png" width="150" title="添加"/>

<img alt="统计" src="./unpackage/demo-image/统计1.png" width="150" title="统计"/>

<img alt="统计" src="./unpackage/demo-image/统计2.png" width="150" title="统计"/>

<img alt="设置" src="./unpackage/demo-image/设置.png" width="150" title="设置中心"/>


### 使用
#### 1.自己编译

克隆本项目：git clone https://gitee.com/brisklan/bs_account

1. 用Hbuilder打开项目
2. 安装依赖
```shell
#安装crypto-js
npm install crypto-js@^3.3.0
#安装mp-html
npm install mp-html@^2.5.0
```
3. 修改配置文件
- 复制const.js.example文件，重命名为const.js，修改里面的配置，如：
 ```plantuml
export default {
    key: '12563456132465789465132465789465',//敏感数据加密秘钥，和后端保持一致
    baseUrl: 'http://jz.test.top/api',//接口请求地址
}
```
4. 选择自己的编译模式生成相关平台文件(APP记得配置图标)

#### 2.使用线上系统
1. 下载最新版APP(https://jz.alipay168.cn/#/pages/packageA/h5/index)，注册账号，登录
2.  使用微信小程序，搜索“极简随手记”即可使用最新版
 <img src="./unpackage/demo-image/gh_8d928c988fe5_258.jpg" width="200" title="微信小程序" />
3.  在网页使用浏览器打开：https://jz.alipay168.cn


### 加群讨论（请备注【bs记账】）
微信：woyekeyiha

遇到问题可以加微信交流。请备注：bs记账


### 投喂2分吧
<img alt="赞助" src="./unpackage/demo-image/微信收款码.jpg" width="200" title="赞助"/>

<img alt="赞助" src="./unpackage/demo-image/支付宝收款码.jpg" width="200" title="赞助"/>

### 赞助者
1.  [brisklan](https://gitee.com/brisklan)
