# Cherry v2 — dithercn 全量替换说明

分支：`v2-dither`（本轮不直接改 `main`，不推送、不合并、不改仓库设置，改动经验证后交父代理复核再推）

> 本文档取代 `docs/v2-dither.md`（上一阶段手写 Bayer 组件方案）。手写版 `src/components/dither/` 与 `src/lib/dither.ts` 已全部删除，凡引用处均改走真正的 dithercn 引擎/组件。

## 用了哪些真实 dithercn 组件 / 引擎文件

安装方式：`npx shadcn init -d -t next -b radix` 后，用 `npx shadcn@latest add https://dithercn.dev/r/<name>.json` 安装；`components.json` 的 `registries` 已补 `"@dithercn": "https://dithercn.dev/r/{name}.json"`。skill 已从 `src/.agents` / `src/.claude` 移到仓库根 `.agents/skills/dithercn` 与 `.claude/skills/dithercn`（内容不动）。

引擎（`src/lib/dither/`，dither-core 源码形式装入）：`index.ts`、`shader.tsx`、`pattern.tsx`、`fill.tsx`、`style.ts`、`tokens.ts`、`matrices.ts`、`blue-noise.ts`、`color.ts`、`diffuse.ts`、`export.ts`、`glsl.ts`、`motion.ts`。

示例组件（`src/components/dithercn/`，均来自 dithercn registry）：

- `dither-button.tsx`（`DitherButton`：`filled` / `outline` 变体，`color`、`size`、`bloom`、`cell`、`loading`、`asChild`）
- `dither-card.tsx`（`DitherCard`：`glow`、`reach`、`strength`、`interactive`、`color`、`fill`、`matrix`、`cell`、`rim`、`radius`）
- `dither-glow.tsx`（`DitherGlow`，内部即一个 `DitherShader`）
- `divider.tsx`（`Divider`：`orientation`、`label`、`thickness`、`fade`、`strength`、`color`、`fill`、`matrix`、`cell`）
- `dither-number.tsx`（`DitherNumber`：`value`、`format`、`effect`（`roll` / `resolve`）、`size`、`color`、`accent`）
- `dither-text.tsx`（`DitherText`：画布背景文字，`as`、`color`、`direction`、`animate`、`speed`、`cell`、`matrix`、`palette`）
- `avatar.tsx`（`Avatar`：按名字生成的镜像实色 / 棋盘抖动格，`shape`（`circle` / `square`）、`ring`、`status`、`bloom`）

自有组合（`src/components/dithercn/cherry-dither.tsx`，不复制示例源码）：

- `HeroGlow`：全站唯一的 WebGL shader（`DitherGlow`，`position="top"`，`radius 0.7`，`intensity 0.6`，`speed 0.25`，`stillTime 6`），慢速、离屏暂停、reduced motion 下引擎自动静止。
- `PageDither`：整页底层静态点阵（`fillStyle("dotted", { color: "green" })`，无逐帧 JS 开销）。
- `CherryMeter`：统计用抖动占比条（轨道 `fillStyle("dotted", { color: "grey" })`，填充 `fillStyle("gradient", { color, edge: "right", length: 48, to: 0.25 })`，带 `role="progressbar"` 与 aria 值）。

## 替换范围（全部界面）

- 首页：Hero（`HeroGlow` + `DitherText` 标题，旧 CSS 模糊辉光已删）、搜索框与建议框（`DitherCard`）、链接卡片（`DitherCard`，选中红 / 否则绿）、统计弹窗（`DitherCard` 壳 + `CherryMeter` + `DitherNumber` 总访问量）。
- 分支视图：分支标题下分隔改 `Divider`，上一页 / 下一页改 `DitherButton`（outline），标签筛选盒改 `DitherCard`，无结果清除筛选改 `DitherButton`。
- 布局：Header 用户路径前加 `Avatar`（square、green），分支下拉菜单壳改 `DitherCard`；Dock 首页 / 分支间改垂直 `Divider`；Footer 顶部改 `Divider`（去掉 border-t）。
- 登录页：外壳 `DitherCard`，标题上方加 `Avatar`（cherry），提交与 GitHub / Google 按钮改 `DitherButton`。
- 后台：侧边栏与主区域壳改 `DitherCard`（主区域滚动用 Tailwind v4 写法 `overflow-y-auto!`，见“仍需复核”）；统计卡与系统状态面板改 `DitherCard`，迷你趋势改 `FillPattern` 抖动填充；branches 页壳改 `DitherCard`；各管理表单（link-manager、branch-list、branch-form-dialog、link-modal、password-form、settings-form、config-manager）的主按钮 / 增删改按钮 / 分页按钮改 `DitherButton`，表单壳改 `DitherCard`；admin-header 登出改 `DitherButton`；sidebar 导航底部加 `Divider`。
- 弹窗：确认弹窗、帮助弹窗、快捷键弹窗壳改 `DitherCard`，确认 / 开始使用按钮改 `DitherButton`。
- 错误与加载页：`not-found`、`error`、`global-error`、`admin/loading` 壳改 `DitherCard`，按钮改 `DitherButton`（global-error 的根 layout 崩溃场景下仍自带 html/body）；`page.static.tsx` 只是复用已替换的 `ClientApp`，仅把加载回落字体改为 `font-code`。
- 残留检查：`src/` 下已无 `terminal-card` / `cyber-card` / `button-retro` 直写壳（`globals.css` 的定义保留作历史样式，不再被组件引用）。

原有功能保留：键盘导航 j/k/h/l、搜索、收藏、分支切换、后台增删改、登录流程、主题 / 语言切换均未改逻辑，只换了壳与按钮组件；`confirm-modal` 的 `modalRef` 经 React 19 ref-as-prop 透传到 `DitherCard` 的 div（tsc 通过）。

## 主题映射

`src/app/globals.css`：shadcn 令牌全部由 oklch 改为 Cherry 映射（改写后 oklch 出现次数为 0），`--dither-cell: 4px` 共 4 处。

- 深色 `:root`（默认）：`--background: var(--cherry-bg)`、`--foreground: var(--cherry-text)`、`--card: var(--card-bg)`、`--primary: var(--cherry-green)`、`--primary-foreground: #050505`、`--secondary / --muted / --accent: var(--cherry-bg-secondary)`、`--destructive: var(--cherry-red)`、`--border / --input: var(--border-color)`、`--ring: var(--cherry-green)`，chart-1..5 依次 green / cyan / red / amber / purple，`--radius: 0.125rem`，sidebar 系列同样映射。
- 亮色 `:root[data-theme='light']`：同样结构（`--primary-foreground: #ffffff`，其余用亮色 cherry 值），亮色 dither 令牌 green #009926、cyan #0891b2、red #d0006f、amber #d97706、purple #7e22ce。
- `.dark` 块：与深色 `:root` 一致的 Cherry 映射。
- dither 令牌：`--dither-ink: var(--cherry-green)`、`--dither-paper: var(--cherry-bg)`、`--dither-cell: 4px`；命名色 blue→cherry-cyan、purple→cherry-purple、green→cherry-green、pink→cherry-red、orange→cherry-amber、red→cherry-red、grey→cherry-muted；bloom 亮色 0.6、深色 1。
- 旧手写 `.dither-card` 样式已删；reduced-motion 规则针对 `[data-slot="card"]` / `[data-slot="button"]` 关闭过渡，dithercn shader 在 reduced motion 下由引擎自动静止。

## 字体映射

- `src/app/layout.tsx`：删掉 shadcn init 加进来的 Geist 字体（导入与 `geist.variable` 均删），仅保留 VT323（`--font-pixel`）与 Fira_Code（`--font-code`）；favicon 仍为 `${basePath}/pixels/cherry.svg`。
- `globals.css` 的 `@theme inline`：`--font-heading: var(--font-pixel)`、`--font-sans: var(--font-pixel)`（原先是自引用 `--font-sans: var(--font-sans)`，已修正）、`--font-mono: var(--font-code)`。
- html 字体规则：`'Fira Code', 'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', monospace`（保留中文字体回落）。
- 追加规则：`[data-slot="button"]` 用 VT323 展示字体（letter-spacing 0.05em），覆盖 shadcn Button 与 dithercn DitherButton；`.font-code` 显式定义为 Fira Code + 中文字体回落（此前该类在代码中到处使用但 globals 里并无定义）。

## 图标重生成清单

`public/pixels/` 下 18 个文件全部替换为 16×16 网格、4×4 超采样光栅化的半调 / Bayer 点阵 SVG（`viewBox="0 0 16 16"`，覆盖率 ≥0.75 满格、0.5–0.75 为 0.6 居中圆点、0.25–0.5 为 0.36 居中小点、<0.25 为空；除 cherry 外统一 `fill="currentColor"` 跟随主题文字色）：

ai、caret-down、chart、cherry、docs、export、github、google、home、import、language、learn、theme_dark、theme_light、tools、x、x_b、youtube。

- cherry.svg 单独处理：果实组 `fill="var(--cherry-red)"`、茎叶组 `fill="var(--cherry-green)"`（主题变量，深 / 浅色自动跟随）。
- 文件名全部未变：`src/data/data.json` 的 shortcuts / 分支图标引用与各组件的 `pixels/*.svg` 引用路径均未变；`x_b.svg` 在 `src/` 与 `public/` 中无引用（疑似遗留文件），仍按任务要求重新生成；favicon 路径不变。
- 生成脚本在仓库外（`/tmp/gen_icons.py`），如需复现须重建；新图标未经浏览器截图验证，品牌图标（尤其 github 猫头、google G、youtube）的几何近似是否足够可辨，须目视确认。

## 性能与可访问性

- 全站 WebGL shader 仅 Hero 一个（`DitherGlow` → 一个 `DitherShader`，远低于 8 个上下文上限）；`DitherText` 内部用画布而非 WebGL，不计入上限；其余均为静态 SVG / CSS 填充。
- Hero shader 慢速（speed 0.25）、离屏暂停（引擎自带）、reduced motion 下引擎自动静止，另有 globals 中的过渡关闭规则。
- 文字与背景对比度沿用原 cherry 霓虹色与深 / 浅主题映射，未做单独的对比度数值测量。

## 验证结果

- `npx tsc --noEmit`：通过（修复过程：`admin/loading.tsx`、`config-manager.tsx`、`confirm-modal.tsx` 三处 DitherCard 闭合定位错误，均为脚本锚点推断问题，逐一修正后通过；各文件 DitherCard 开闭标签数已逐一核对平衡）。
- `NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1 npm run build:static`：通过（静态导出 3 页 + `out/`，构建脚本事后已恢复所有临时排除文件）。
- 已知原项目问题，未为此改业务代码：完整构建缺 `POSTGRES_URL`、`npm run lint` 在 Next 16 下失效。
- 验证后已清理：删除 `out/`、`.next/`、`tsconfig.tsbuildinfo`，还原 `next-env.d.ts`；diff 只含源码与配置（另见下）。

## 仍未做的事 / 仍需复核的点

1. 新点阵图标未经浏览器截图验证，品牌图标可辨度须目视确认（见上）。
2. `header.tsx` 下拉菜单壳、`admin/page.tsx` 统计卡与状态面板的 `</DitherCard>` 闭合定位依赖脚本锚点推断——tsc 已通过且开闭数平衡，但嵌套语义仍建议在预览中目视确认。
3. `admin/layout.tsx` 主区域：原 `!overflow-y-auto`（Tailwind v3 写法）在 Tailwind v4 下不生效，已改为 v4 写法 `overflow-y-auto!` 以压过 DitherCard 自带的 `overflow-hidden`；须在预览中确认后台主区域可滚动。
4. `DitherCard` 的 ref 透传（confirm-modal 的 `modalRef`）与 `DitherText` 在 Hero 标题上的实际渲染效果，须以实际渲染为准（tsc 已通过）。
5. 对比度未做数值测量；`DitherText` 画布文字在深 / 浅主题下的实际效果须目视确认。
6. 未推送、未开新 PR、未动 Netlify、未改仓库设置、未合并 PR #1；下一步是否以新提交更新 PR #1 或另开 PR，待父代理复核后决定。

## 降噪修复（2026-11-05，用户看 Netlify 预览截图反馈“太乱”后）

问题：全页 PageDither 底纹（opacity 40%）+ Hero 光晕 + DitherCard 默认 rim 点阵 + DitherText 画布标题 + 点阵图标叠加，导致首页满屏绿点、樱桃变黑团、CHERRY 标题和搜索框占位文字被点阵吃掉、Dock 图标几乎看不见。
修复：删掉整页 PageDither 底纹；Hero 光晕缩小到 48、透明度 15%、强度 0.35；CHERRY 标题改回实色 VT323，不再用 DitherText 画布；搜索框和建议下拉改回干净边框壳，不再用 DitherCard；DitherCard 默认强度 0.5→0.3、rim 默认关，抖动只剩角落光晕、悬停时才加强；public/pixels/ 18 个图标全部恢复到 main 分支的原版实色图标（小图标必须可辨，抖动只留给大面积表面）。
