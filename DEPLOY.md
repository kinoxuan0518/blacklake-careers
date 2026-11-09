# 部署说明（DEPLOY）

> **2026-11-09 起**：站点为 **Vite + React 构建的纯静态站**（旧 React 18 + Babel standalone 版已移除）。
> 本仓库根目录的 `index.html` + `assets/` + `fonts/` 等即构建产物，由运维脚本原样同步到服务器目录。
> 职位数据链路不变：`jobs.json`（飞书招聘每日同步）驱动，站点运行时 `fetch("jobs.json")` 渲染。

## 1. 站点形态

- 入口：`index.html`（中文，页内可切换英文）
- 技术栈：Vite + React 19，构建后无运行时依赖、无外部 CDN 请求
- 资源均为相对路径（`./assets/…`、`../fonts/…`），可部署在根域名或任意子路径

## 2. 构建设置

| 项 | 值 |
|---|---|
| 源码仓库 | `/Users/kino/blacklake-careers-v3`（本地，无远端） |
| 发布分支 | `redesign/all-roles`（构建工作区 `.claude/worktrees/site`） |
| 构建命令 | `cd <源码目录> && npm run build` → 产物在 `dist/` |
| 构建产物 | `index.html`、`assets/`、`fonts/`、`favicon*`、`apple-touch-icon.png` |

### 同步到本仓库

```bash
rsync -a --delete \
  --exclude '.git' --exclude '.gitignore' --exclude '.DS_Store' \
  --exclude '.gitlab-ci.yml' --exclude 'DEPLOY.md' --exclude 'SYNC.md' \
  --exclude 'scripts' --exclude 'jobs.json' \
  <源码目录>/dist/ ./
```

> `jobs.json` 不随站点构建同步（dist 里的是构建时快照），本仓库的 `jobs.json` 由每日同步脚本维护，见 `SYNC.md`。

## 3. 环境与发布

| 环境 | 访问范围 | 域名 |
|---|---|---|
| 测试 | 内网（先连**飞连**） | https://job-test.blacklake.tech |
| 生产 | 外网 | https://job.blacklake.cn |
| GitHub Pages 镜像 | 外网 | https://kinoxuan0518.github.io/blacklake-careers/ |

发布流程（`.gitlab-ci.yml`）：

1. `git push gitlab main` → **测试站自动发布**（`deploy-test`，执行 `/root/job-update-test.sh`）
2. 生产站**手动发布**：打开流水线页面 → 最新流水线 → `deploy-prod` 点 ▶ 运行（执行 `/root/job-update-prod.sh`）
   - 流水线：https://gitlab.blacklake.tech/xuanzhenglong/blacklake-careers/-/pipelines
3. 推送 `origin`（GitHub）会同步更新 GitHub Pages 镜像（子路径 `/blacklake-careers/` 访问）

## 4. 验证清单（每次发版）

1. 生产/测试站 `index.html` 引用的构建哈希与本地 `dist/index.html` 一致
2. 全部资源 200：`assets/index-*.js`、`assets/index-*.css`、`fonts/bl-serif-*.woff2`、`assets/og-card.png`、`jobs.json`
3. 旧构建文件返回 404（整目录替换，无残留）
4. 页面内：职位数 = `jobs.json` 的 `count`；中英切换正常；投递链接指向飞书招聘官方详情页
5. 桌面 1440 与手机 390 宽无横向溢出、控制台 0 报错
6. 若浏览器仍是旧版：⌘⇧R 强制刷新（HTML 走 ETag/Last-Modified 校验）

## 5. 已知边界

- `src/pages/Home.tsx` 中 logo 使用根绝对路径 `/assets/logo-blacklake.png`：正式站（根域名）正常；GitHub Pages 子路径镜像下该图不显示
- 首页底部「在招职位」为精选 6 个岗位；完整 57 个在「你想做什么?」检索弹窗（导航「在招职位 57」或底部按钮打开）——产品设计如此，非数据缺失
- 职位数据无薪酬/JD 描述，详情与投递在飞书官方页完成
