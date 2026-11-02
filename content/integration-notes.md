# 整编范围、来源与许可

## 2026-11-02 更新

本次保留原有 21 章、45 个视频索引、配置生成和本地验收清单，新增第 22—33 章；原书导读覆盖 fq-book 的 `docs/` 目录下全部 **86 个 Markdown 页面**（包括前言、目录、后记、参考资料与未列入侧栏的页面）。

来源：[hoochanlon/fq-book](https://github.com/hoochanlon/fq-book)，《这本书能让你连接互联网》，作者 hoochanlon 及贡献者；固定提交 [345bc276f60a24a34c90042c19d28c0fc01e87e2](https://github.com/hoochanlon/fq-book/tree/345bc276f60a24a34c90042c19d28c0fc01e87e2)。本次将选取主题重新组织、改写和补充为操作流程，未逐字镜像全书。

## 授权与署名

上游 README 标注 **CC BY-NC 4.0**：[许可全文](https://creativecommons.org/licenses/by-nc/4.0/legalcode.zh-hans)。新增整编文档保留作者、作品名、固定版本链接、许可链接与修改说明，并按 CC BY-NC 4.0 提供。上游转载作品及图片的原作者和权利声明不变，不能据此推断全部第三方作品都由仓库维护者授权。本站导读仅保留标题、来源链接与编辑说明，不镜像第三方文章正文、图片、脚本或节点列表。

原书部分转载署名包括 Pines_Cheng、R0UTER、iSkyun、孙鹏、长眼慢慢、XUranus、何必等明天、Chitanda Akari；IPFS 资料含 Mr.Maple、卡瓦邦噶、Chris Dixon；链接解析含逗比及大隐中心。对应关系与完整署名以固定版本源页为准。

## 主题映射

| 新增章节 | 原书来源主题 | 修改方式 |
|---|---|---|
| 22 代理与接管 | 快速开始、互联协议、正向/反向/透明代理 | 按实际流量路径重组 |
| 23 DNS 与 Hosts | DNS、DNSCrypt、Hosts、解析干扰 | 区分解析、传输与证书 |
| 24 终端与 Git | README 的 Git、Mac 代理设置 | 改为单次设置，增加远端 DNS 对照 |
| 25 协议兼容 | SS/SSR、V2Ray、订阅链接 | 按输入格式与核心参数核对 |
| 26 SSH 与应用代理 | SSH-Tunnel、Privoxy、Proxifier | 自有服务器、回环监听、可撤销实验 |
| 27 NAT 与虚拟机 | NAT、VMware、宿主机代理、游戏 | 纠正 NAT 编号混用与全局放行建议 |
| 28 TLS 与 RST | 数字证书、SSL_ERR_SYSCALL | 按 DNS/TCP/TLS/HTTP 分层取证 |
| 29 隐私与浏览器 | 隐私、Chrome、出口 IP | 不沿用匿名保证与身份材料操作 |
| 30 自建与维护 | 自建服务器、连接方式 | 转为维护与回退流程 |
| 31 扩展网络与存档 | Tor、IPFS、网页时光机、搜索 | 说明用途、可用性与保密边界 |
| 32 旧教程迁移 | 全书各类历史工具与主题 | 处置说明及完整原文索引 |
| 33 来源与网站维护 | 项目 README 与部署说明 | 静态构建、GitHub Pages、授权说明 |

## 核对边界

原有第 1—21 章保留 2026-09-05 的研究日期和版本记录；不能把其中“最新发布”理解为今天的最新版本。新增内容依据当前可读的 Mihomo DNS/端口说明、curl、OpenSSH、GitHub Pages、IPFS 与 Tor 官方文档进行重点校正，各章列出链接。

本次没有连接路由器、使用真实订阅或测试原书服务商。视频字幕仍未取得；原书所有图片、商业服务、下载地址与旧软件没有逐项复测。网站验收仅覆盖内容结构、搜索、导航、下载、构建和页面交互。

下载：[完整整合指南](./downloads/openclash-guide.md) · [新增整编文档](./downloads/fq-book-guide.md) · [86 篇来源映射](./downloads/fq-book-index.json)。

---

以下为保留的原版视频研究记录。
