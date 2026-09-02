# 部署说明（DEPLOY）

黑湖科技招聘官网 —— 纯静态站，无构建步骤、无运行时依赖、无外部 CDN 请求。
本文件面向运维/前端基建同学，描述把本站挂到公司服务器（careers.blacklake.cn 或 www.blacklake.cn/careers）所需的一切。

## 1. 站点形态

- 入口：`index.html`（中文版）、`index-en.html`（英文版），两个独立 HTML，互链切换
- 技术栈：React 18 + Babel standalone，全部内置在 `lib/` 本地目录，浏览器端直接加载，**不需要 npm install、不需要 build**
- 所有资源（JS 库 / 字体 / 图片 / 样式）均为**本地相对路径**，无任何外部 CDN / Google Fonts 请求
- 因为全是相对路径，部署在**根域名或任意子路径**下都不需要改代码

## 2. 文件清单

部署必需（原样拷贝即可）：

```
index.html          中文版入口
index-en.html       英文版入口
styles.css          全站样式
app.jsx             应用入口与场景调度（中）
app-en.jsx          应用入口与场景调度（英）
components.jsx      公共组件（中英共用）
sections.jsx        场景组件（中）
sections-en.jsx     场景组件（英）
data.jsx            内容与职位数据（中）
data-en.jsx         内容与职位数据（英）
fog.js              Hero 背景动效
logo.png            顶栏品牌 Logo
lib/                react.min.js / react-dom.min.js / babel.min.js（本地化三方库）
assets/             图片与字体（fonts/ 为本地 woff2：Geist Mono + Sarasa Mono SC）
```

不需要部署（开发痕迹，留在仓库里不影响运行）：

```
proto-*.html        历史设计原型
_screens/           验证截图
serve.mjs           本地预览小服务器（仅开发用：node serve.mjs）
package.json        仅声明 dev 脚本，无依赖
```

## 3. 部署方式

### 3.1 独立域名 careers.blacklake.cn（首选）

任意静态文件服务器指向本目录即可。Nginx 示例：

```nginx
server {
    listen 443 ssl;
    server_name careers.blacklake.cn;

    # ssl_certificate / ssl_certificate_key 按公司证书配置

    root /var/www/blacklake-careers;   # 本仓库内容
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # HTML 不缓存（入口带 ?v= 版本号控制静态资源）
    location ~* \.html$ {
        add_header Cache-Control "no-cache";
    }

    # 字体/图片/库文件长缓存（内容变更靠 index.html 里的 ?v= 版本号刷新）
    location ~* \.(woff2|jpg|png|css)$ {
        expires 7d;
    }
    location /lib/ {
        expires 30d;
    }
}
```

### 3.2 子路径 www.blacklake.cn/careers（备选）

```nginx
location /careers/ {
    alias /var/www/blacklake-careers/;
    index index.html;
}
```

全站资源均为相对路径，子路径下可直接工作，无需改代码。
（已于 2026-09-02 本地模拟子路径实测：中英双版序章完播 `8/8 · OK`、零外部请求、零 JS 报错。）
注意：`alias` 末尾的 `/` 必须保留。

## 4. GitLab CI 自动发布（示例）

纯静态站的最简流水线——push 到 main 即同步到服务器目录：

```yaml
# .gitlab-ci.yml（示例，按公司基建实际调整 runner / 目标机）
deploy:
  stage: deploy
  only:
    - main
  script:
    - rsync -av --delete
        --exclude '.git' --exclude '_screens' --exclude 'proto-*.html'
        --exclude 'serve.mjs' --exclude 'package.json'
        ./ /var/www/blacklake-careers/
```

如果公司已有 v1 的流水线规范（测试自动 / 生产手动），直接复用即可，本站对流水线无任何特殊要求。

## 5. 版本号约定

`index.html` / `index-en.html` 中通过 query 版本号做缓存刷新：

```
styles.css?v=12
data.jsx / components.jsx / sections.jsx / app.jsx ?v=23
```

**每次修改 css 或 jsx 后，手动 bump 两个 HTML 里对应的 `?v=` 数字**，否则客户端可能读到旧缓存。

## 6. 内容维护

- 职位列表 / JD：编辑 `data.jsx`（中）与 `data-en.jsx`（英）中的 `JOBS` 数组，提交发版即生效
- 9 个职位的飞书招聘投递链接（applyUrl）待 HR 提供后填入（当前为占位）
- 若后续接入公司 CMS 自维护，再议（需 CMS 侧确认支持）

## 7. 验证清单（发版后）

1. 打开首页，Hero 序章动画完播后 HUD 显示 `8/8 · OK`
2. 切换英文版 `index-en.html` 正常
3. 浏览器 DevTools → Network：全部请求均为本站域名，**无 unpkg / Google Fonts 等外部请求**
4. 职位卡片点击展开正常

---

临时预览（GitHub Pages）：https://kinoxuan0518.github.io/blacklake-careers/
