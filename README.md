# 🎓 美高选校助手

智能匹配美国寄宿高中，帮你找到最适合的学校。

## ✨ 功能特色

### 🤖 智能选校推荐
- 输入托福、SSAT、GPA 等成绩
- 智能匹配冲刺校、匹配校、保底校
- 支持 IB、A-Level、AP、体制内等多种课程体系

### 📚 学校库
- 30 所美国顶尖寄宿高中详细信息
- 支持搜索、筛选、排序、标签过滤
- 学校详情包括学术特色、校园生活、升学走向

### ⚖️ 学校对比
- 2-3 所学校并排对比
- 费用自动计算（含城市生活成本系数）
- 最优值高亮显示

### 📅 申请时间线
- 根据课程体系和年级生成个性化规划
- 6 阶段时间线，可追踪进度
- 倒计时提醒

### 💰 费用计算器
- 详细的年度费用和一次性费用估算
- 支持多种住宿方案
- 人民币参考（按汇率换算）

### 🗺️ 学校地图
- 地图上查看学校地理位置
- 按梯队筛选（顶尖/优秀/热门）
- 点击标记查看详情

### ❤️ 收藏系统
- 收藏感兴趣的学校
- 跨页面共享

### 📤 分享功能
- 所有页面支持分享链接
- 学校详情支持复制匹配建议

## 🛠️ 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 8
- **样式**: Tailwind CSS 4
- **路由**: React Router 7
- **地图**: Leaflet + React-Leaflet
- **部署**: Vercel

## 🚀 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📁 项目结构

```
src/
├── components/          # 组件
│   ├── SchoolCard.tsx   # 学校卡片
│   ├── SchoolDetail.tsx # 学校详情弹窗
│   └── ShareButton.tsx  # 分享按钮
├── data/                # 数据
│   └── schools.ts       # 学校数据
├── pages/               # 页面
│   ├── Home.tsx         # 首页
│   ├── SchoolList.tsx   # 学校库
│   ├── Recommend.tsx    # 智能选校
│   ├── Favorites.tsx    # 收藏
│   ├── Compare.tsx      # 对比
│   ├── Timeline.tsx     # 时间线
│   ├── CostCalculator.tsx # 费用计算器
│   └── Map.tsx          # 地图
├── App.tsx              # 布局
└── main.tsx             # 入口
```

## 📊 数据说明

- 当前收录 30 所美国寄宿高中
- 排名来源：Niche（2024-2025）
- 费用数据为预估值，仅供参考

## 📝 更新日志

### 2026-06-11
- 添加 Meta 标签和 OG 图片
- 所有页面添加独立 Meta 标签
- 添加分享功能
- 添加复制建议功能
- 学校卡片显示特色亮点

## 📄 许可证

MIT License

## 👨‍💻 作者

**H-shy** - [GitHub](https://github.com/your-username)

---

> 💡 数据仅供参考，请以学校官网为准
