# OpenClash 使用手册 · 实用整编版

33 章中文手册，整合原有 OpenClash 教程与 [hoochanlon/fq-book](https://github.com/hoochanlon/fq-book) 的实用主题；附 86 篇原书导读、45 个视频索引、配置生成与浏览器本地验收清单。

- GitHub Pages：https://patrickmlrose.github.io/openclash-handbook/
- fq-book 来源提交：`345bc276f60a24a34c90042c19d28c0fc01e87e2`
- 原有章节研究日期：2026-09-05；本次整编日期：2026-11-02。

## 本地开发与构建

需要 Node.js 22.13 或更新版本（本次使用 Node.js 24）。

```sh
npm ci
npm run dev
npm run check
npm run build
```

`dist/` 是完整静态站点，使用相对资源路径与 hash 路由，支持 GitHub Pages 子路径。无需后端、API key、订阅或数据库。生产服务器应将网站目录作为静态目录提供 HTTP 服务。

## GitHub Pages 发布

```sh
npm run prepare:pages
# 审查 docs/ 与源文件变化，再正常提交并推送 main
```

在仓库 Settings → Pages 中，选择 Deploy from a branch、`main`、`/docs` 并保存。每次更新重新生成并提交 `docs/`，GitHub 会发布最新构建。不要手工修改 `docs/assets`。

项目保留原有 `vite.config.ts`、`next.config.ts` 和 `dev:worker`/`build:worker` 入口作为原框架记录；正式网站使用 `vite.static.config.ts`。Sites 的配置单独保存在 `.openai/hosting.json`，GitHub 镜像不需要该站点身份文件。

## 内容维护

- `content/openclash-guide.md`：原有第 1—21 章。
- `content/fq-book-guide.md`：新增第 22—33 章。
- `content/fq-book-index.json`：原书全部 86 个 Markdown 页面的固定版本出处、分类、整编章节映射。
- `content/integration-notes.md`：来源、许可、纠错及核对范围。
- `scripts/build-content.mjs`：生成阅读数据和 Markdown/JSON 下载文件。

原有 21 章的版本信息是 2026-09-05 的快照，不代表当前最新版。原书服务、旧工具与图片未逐项验证。真实网络仍须自行按第 21 章验收。

## 来源与许可

fq-book：《这本书能让你连接互联网》，hoochanlon 及贡献者。上游 README 标注 [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)。本站新增实用整编同样采用该许可，已重组、改写并校正部分内容；保留逐章出处与变更说明。

原书的第三方转载和图片仍属于各自权利人。本站不重新分发这些全文或图片，仅提供原文入口及自己的实用说明。原有视频资料和其他引用保留原有来源，不因本次整编统一变更权利归属。

不得把真实节点、订阅 URL、账号、密钥、路由器备份或日志凭据提交到公开仓库。
