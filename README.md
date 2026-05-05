# Regulation Management System

多监管管理中心 - OWS平台的监管规则管理系统

## 📋 项目概述

这是一个企业级的监管规则管理系统，用于管理OWS平台的多监管规则（V1、V2、ASIC、FCA）。系统支持复杂的表单字段联动、数据验证、列表展示等功能。

## ✨ 功能特性

- ✅ **8字段复杂表单**：支持Regulation、Description、License、Code等8个字段
- ✅ **字段联动逻辑**：Regulation类型变化自动显示/隐藏License字段
- ✅ **Code自动生成**：根据Regulation和License自动生成唯一Code
- ✅ **唯一性校验**：实时校验Code的唯一性
- ✅ **多注册类型**：支持域名、国籍、国家等多种注册归类模式
- ✅ **国家管理**：支持白名单/黑名单国家限制
- ✅ **DataTable列表**：高级表格展示，支持搜索、筛选、分页
- ✅ **响应式设计**：支持桌面端、平板端、移动端
- ✅ **localStorage存储**：前端数据持久化

## 🛠️ 技术栈

### 前端框架
- **HTML5** - 页面结构
- **Bootstrap 5.3.0** - UI框架和响应式布局
- **jQuery 3.7.0** - DOM操作和AJAX
- **DataTables.js 1.13.6** - 高级表格组件
- **Font Awesome 6.4.0** - 图标库

### 数据存储
- **localStorage** - 前端数据持久化
- **JSON文件** - 主数据（国家列表、国籍列表）

### 样式系统
- **CSS变量** - 主题颜色和间距
- **Bootstrap组件** - 基础UI组件
- **自定义样式** - 表单增强和特殊交互

## 📁 项目结构

```
multi_regulation/
├── index.html                           # 主页面（包含导航菜单和路由）
├── pages/
│   ├── regulation-form.html             # 表单页面（8个字段）
│   └── regulation-list.html             # 列表页面（DataTable）
├── assets/
│   ├── css/
│   │   ├── variables.css                # CSS变量定义
│   │   ├── layout.css                   # 布局样式（导航、主内容区）
│   │   ├── components.css               # 组件样式（按钮、卡片、标签）
│   │   └── form.css                     # 表单样式（Phase 3）
│   ├── js/
│   │   ├── app.js                       # 应用初始化
│   │   ├── router.js                    # 前端路由
│   │   ├── data-service.js              # 数据服务（CRUD）
│   │   ├── field-logic.js               # 字段联动逻辑（Phase 3）
│   │   ├── form-validation.js           # 表单验证（Phase 3）
│   │   └── table-config.js              # DataTable配置（Phase 4）
│   └── data/
│       ├── countries.json               # 国家列表（95条）
│       ├── nationalities.json           # 国籍列表（95条）
│       └── regulations.json             # 监管规则数据
└── README.md                            # 项目文档
```

## 🚀 快速开始

### 1. 克隆项目

项目位于：`/Users/chelsey.chang/Claude Research/multi_regulation/`

### 2. 启动本地服务器

由于项目使用了AJAX加载HTML文件，需要通过HTTP服务器运行（不能直接打开index.html）。

**方法1：使用Python（推荐）**

```bash
cd "/Users/chelsey.chang/Claude Research/multi_regulation"
python3 -m http.server 8000
```

**方法2：使用Node.js**

```bash
cd "/Users/chelsey.chang/Claude Research/multi_regulation"
npx http-server -p 8000
```

**方法3：使用PHP**

```bash
cd "/Users/chelsey.chang/Claude Research/multi_regulation"
php -S localhost:8000
```

### 3. 访问应用

在浏览器中打开：`http://localhost:8000`

## 📖 使用说明

### 创建新监管规则

1. 点击导航栏 **"Regulation Management"** > **"Create Regulation"**
2. 填写表单字段：
   - **Regulation**：选择监管类型（V1、V2、ASIC、FCA）
   - **Description**：输入简介（最多30字符）
   - **License**：当选择V1或V2时显示（最多5字符）
   - **Code**：自动生成，只读
   - **Registration Type**：选择归类模式（域名、国籍、国家）
   - **Restriction Country**：设置国家限制（白名单/黑名单）
   - **CP/IBP Domain**：设置默认域名和备用域名
3. 点击 **"Save Regulation"** 保存

### 查看监管列表

1. 点击 **"Regulation List"**
2. 使用搜索框进行筛选
3. 点击 **"Edit"** 编辑现有规则
4. 点击 **"Delete"** 删除规则（需确认）

### 字段联动说明

1. **Regulation → License**
   - 选择V1或V2时，License字段显示并变为必填
   - 选择ASIC或FCA时，License字段隐藏

2. **Regulation + License → Code**
   - ASIC → "ASIC"
   - FCA → "FCA"
   - V1 + SVG → "V1SVG"
   - V2 + SCA → "V2SCA"

3. **Registration Type → 相关字段**
   - 选择"域名" → 显示域名输入框
   - 选择"国籍" → 显示国籍下拉框
   - 选择"国家" → 显示国家下拉框

4. **Registration Type → Restriction Country**
   - 未选择"国籍"且未选择"国家"时，显示Restriction Country字段

## 🎨 设计系统

### 颜色方案（OWS风格）

- **Primary Color**: `#00B4B4` (青色)
- **Success Color**: `#52C41A` (绿色)
- **Danger Color**: `#FF4D4F` (红色)
- **Warning Color**: `#FAAD14` (橙色)
- **Info Color**: `#1890FF` (蓝色)

### 字体系统

- **Font Family**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
- **Base Size**: 14px
- **Line Height**: 1.5

### 间距系统（8px基准）

- `--spacing-xs`: 4px
- `--spacing-sm`: 8px
- `--spacing-md`: 16px
- `--spacing-lg`: 24px
- `--spacing-xl`: 32px

## 🔧 开发进度

### ✅ Phase 1: Foundation (已完成)
- ✅ 项目目录结构
- ✅ CSS变量系统
- ✅ 导航菜单和布局
- ✅ 前端路由系统
- ✅ 数据服务基础

### ✅ Phase 2: Data Layer (已完成)
- ✅ DataService类实现
- ✅ countries.json（95个国家）
- ✅ nationalities.json（95个国籍）
- ✅ localStorage集成
- ✅ CRUD操作

### 🚧 Phase 3: Form Page (进行中)
- ✅ 基础表单HTML（临时）
- ⏳ 完整的8字段表单
- ⏳ field-logic.js（字段联动）
- ⏳ form-validation.js（表单验证）
- ⏳ 字符计数器
- ⏳ Code自动生成

### 📅 Phase 4: List Page (待开始)
- ✅ 基础列表页（临时）
- ⏳ table-config.js
- ⏳ 高级搜索和筛选
- ⏳ 编辑和删除功能

### 📅 Phase 5: Integration & Polish (待开始)
- ⏳ Toast通知系统
- ⏳ 加载动画
- ⏳ 表单编辑模式
- ⏳ 响应式优化
- ⏳ 错误处理

## 📊 数据模型

### Regulation对象结构

```javascript
{
  id: 1714820400000,                    // 时间戳ID
  regulation: "V2",                      // 监管类型
  description: "V2监管-新加坡SCA",        // 简介
  license: "SCA",                        // License（仅V1/V2）
  code: "V2SCA",                        // 自动生成的唯一Code
  
  // 注册归类模式
  registrationTypes: ["域名", "国家"],
  registrationValues: {
    "域名": "vantagemarkets.sg",
    "国家": "Singapore"
  },
  
  // 禁开国组护
  restrictionCountry: {
    enabled: true,
    type: "whitelist",                  // whitelist 或 blacklist
    countries: ["CN", "US", "UK"]
  },
  
  // CP/IBP域名
  cpibpDomain: {
    default: "cp.vantagemarkets.sg",   // 默认域名
    backup: "ibp.vantagemarkets.sg"    // 备用域名
  },
  
  // 审计字段
  createdAt: "2024-05-04T12:00:00Z",
  updatedAt: "2024-05-04T12:00:00Z"
}
```

## 🧪 测试清单

### 功能测试
- [x] 导航菜单正常显示
- [x] 路由切换正常
- [x] Regulation下拉选择正常
- [x] License字段条件显示
- [x] Code自动生成
- [ ] Code唯一性校验
- [ ] 表单提交成功
- [ ] 列表页展示数据
- [ ] 编辑功能正常
- [ ] 删除功能正常

### 样式测试
- [x] 侧边栏样式正确
- [x] 主色调为#00B4B4
- [x] 按钮样式正确
- [ ] 表单样式完整
- [ ] 表格样式正确

### 响应式测试
- [x] 桌面端（1920x1080）
- [ ] 平板端（768x1024）
- [ ] 手机端（375x667）

## 🚀 部署（可选）

### Vercel部署

1. 安装Vercel CLI：
   ```bash
   npm install -g vercel
   ```

2. 在项目目录运行：
   ```bash
   cd "/Users/chelsey.chang/Claude Research/multi_regulation"
   vercel
   ```

3. 按提示完成配置
4. 获得部署URL

### GitHub Pages部署

1. 将项目推送到GitHub
2. 在仓库设置中启用GitHub Pages
3. 选择main分支
4. 访问`https://yourusername.github.io/multi_regulation/`

## 🔮 未来增强（Phase 6+）

1. **Select2集成** - 更好的多选体验
2. **暗色主题** - 支持主题切换
3. **批量操作** - 批量删除、批量导出
4. **数据导出** - 导出为Excel或CSV
5. **数据导入** - 从Excel批量导入
6. **审计日志** - 记录所有操作历史
7. **权限管理** - 不同角色的访问控制
8. **API集成** - 连接真实后端API
9. **国际化** - 支持中英文切换

## 👨‍💻 开发者

- **Chelsey Chang**
- 开发时间：2024年5月
- 项目位置：`/Users/chelsey.chang/Claude Research/multi_regulation/`

## 📝 许可证

MIT License

## 🤝 贡献指南

如有问题或建议，请联系开发者。

---

**注意**：当前版本为开发版本，部分功能仍在实现中。完整功能预计在Phase 5完成。
