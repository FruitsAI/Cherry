# Cherry v2 — Dither 重构说明

分支：`v2-dither`（本轮不直接改 `main`，改动经构建验证后以 PR 形式交付）

## 做了什么

### 界面：Dither 设计系统（新增，不替换原有终端身份）

新增 `src/components/dither/`，只从 `src/components/dither/index.ts` 引用：

- `DitherBackground`：静态 SVG Bayer 抖动层，`density` 0..1 控制点密度。
- `DitherCard`：统一卡片——硬边框 + 偏移阴影 + 悬停淡入抖动填充。
  已替换 `CommitCard` 的 `terminal-card` 直写样式，选中态、动画延迟、
  键盘 Enter 行为保持不变。
- `DitherButton`：方角硬边按钮，悬停抖动填充生长、按下沉入阴影。
- `DitherMeter`：抖动填充占比条，带 `role="progressbar"`，用于统计弹窗的分类占比。

落地点：

- 首页底层：整页静态抖动，密度 0.08，不抢正文。
- Hero：樱桃图标后加红色抖动光晕层（静态 SVG）。
- 统计弹窗：分类使用分布改为 `DitherMeter`，分母为最高分类次数。

### 性能：刻意不做 WebGL

- dithercn 的 WebGL 路径适合“会动、逐像素变化”的场景；Cherry 是起始页，
  第一职责是快。全部抖动层均为渲染一次的静态 SVG，无逐帧绘制、
  无 `mousemove` 重渲染，离屏也不产生持续开销。
- 生产构建用 `next.config.mjs` 的 `compiler.removeConsole` 去掉
  `console.*`（保留 `error`/`warn`），顺带清掉了 `ClientApp` 里
  每次执行命令的一次 `console.log` 之外的日志噪音。
- 模态框继续沿用已有的 `React.lazy` 代码分割；本轮未新增任何
  运行时依赖，包体积增量仅为几个小组件。

### 规范化

- 设计令牌集中在 `src/lib/dither.ts`：4x4 Bayer 矩阵、`bayerCells(density)`
  纯函数、`--dither-paper/--dither-ink/--dither-cell` CSS 变量
  （`src/app/globals.css`），深/浅主题复用现有 Cherry 变量。
- 无障碍与减动效：抖动层全部 `aria-hidden`、装饰性；进度条带
  `progressbar` 语义；`prefers-reduced-motion` 下关闭抖动过渡。
- 顺手修了一个小规范问题：`ClientApp` 里 `...commit, ...commit` 的
  重复展开已去掉。

## 为什么没有直接 `shadcn add` 三个库

如实说明取舍，用户可再定：

- Cherry 没有 `components.json`、没有 shadcn/Radix、没有 Motion，
  且用的是 Tailwind v4 CSS-first 写法。直接装 dithercn/ditherui/
  dither-kit 的 registry 组件会先引入一整套 shadcn 依赖与配置，
  对一个 4,385 行的起始页来说改动面和回归风险不成比例。
- 因此本轮是“按三家文档的语言与参数手写同款原语”
  （Bayer 矩阵、密度、格子尺寸、悬停生长、抖动占比条），
  源码为本项目自有，后续如需某一家的完整组件（例如 dither-kit
  的可 scrub 图表），可再按单个组件评估引入，不必整库迁移。
- 参考链接：[dithercn.dev](https://dithercn.dev/)、
  [ditherui.dev](https://ditherui.dev/)、dither-kit（tripwire.sh）。

## 后续可选项（未在本轮做，需用户确认）

1. 后台 `/admin` 也统一换成 `DitherCard`/`DitherButton`（目前只动了前台与统计弹窗）。
2. 把抖动做到登录页与 Dock，成为全站统一视觉。
3. 引入 dither-kit 的完整图表替换统计弹窗的纯列表。
4. 补一个视觉回归截图（桌面/移动、深/浅主题各一张）进 PR。

## 验证

- `npm run build`（含类型检查）通过为交付门槛；`npm run lint` 结果
  随构建一并记录，见 PR 描述。
