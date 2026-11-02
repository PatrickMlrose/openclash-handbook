# 七尺宇 OpenClash 视频与来源索引

核对日期：2026-09-05。范围：[频道公开视频列表](https://www.youtube.com/@qichiyu/videos)。

本次将 Videos 页面翻至最早条目，并读取 45 个公开视频的页面元数据。按与 OpenClash 使用的关联划分为 12 个核心视频、13 个相关专题和 20 个范围筛查条目。分类是本报告的研究选择，不是博主的官方播放列表；不只按标题是否出现 OpenClash 筛选。

核心视频总时长：5 小时 51 分 1 秒；核心加相关专题：11 小时 45 分 27 秒。这些是页面标注时长之和，**不是本次实际观看时长**。

**证据边界：**45 个页面的可读取播放器元数据均未列出字幕轨道，基础篇和 2026 版的浏览器字幕导出也不可用。本报告没有逐分钟观看/听写全部视频；以下内容分析依据标题、完整说明、章节及部分配套文章，具体操作用官方文档补足。视频中的未取得口述、画面演示不作声称。

日期统一转换为北京时间，可能与网页使用其他时区时显示的日期或博文日期相差一天。标题保留页面原文；标题中的“唯一”“最细”等是原作者措辞，不代表本报告作了比较验证。

## 1. 核心视频：逐条资料分析

### C01 · 建立入门路径

[【全网最全】OpenClash零基础入门教程 | openclash优缺点、网络设置、安装、内核更新与上传、基础设置，新手使用指南，openwrt软路由OpenClash从入门到精通系列教程之基础篇](https://www.youtube.com/watch?v=7wiu1YA8Pbc)

2024-06-26 · 21:34 · [配套入口](https://www.qichiyu.com/33.html)

说明与章节覆盖组网、插件安装、核心安装和基础设置。适合第一遍学习时分清插件与核心；今天操作应核对包管理器和架构，旧安装包名称不再照抄。指南第 2—6 节。

### C02 · 理解设置之间的关系

[【全网最全】OpenClash进阶教程，详细讲解每项设置的作用以及注意事项、Fake-IP增强、TUN、混合模式、DNS污染、顺便解决谷歌商店无法下载、NAS无法访问、家庭局域网设备直连代理控制等](https://www.youtube.com/watch?v=NZdDmnwxcAo)

2024-06-27 · 40:00 · [配套入口](https://www.qichiyu.com/40.html)

说明列出 Fake-IP、Redir-Host、TUN、DNS、规则、设备控制、NAS 与商店下载。可作为概念目录；不能把不同层次的模式混成一个开关，也不能把所有选项全部打开当成优化。指南第 7—9、12 节。

### C03 · 把个人分流从临时修改变成长期模板

[【全网唯一】定制OpenClash在线分流规则模板、在线订阅转换模板 自定义规则、策略组、分流策略、配置文件、clash规则、搭建订阅转换后端 一并解决很多问题，BT下载、广告拦截、家庭设备指定节点](https://www.youtube.com/watch?v=D841V_xgykg)

2024-07-01 · 56:40 · [配套入口](https://www.qichiyu.com/42.html)

说明强调更新订阅、换服务商和重装后保留个人规则，介绍转换模板及后端。这个维护目标仍有价值；今天也可用自有 YAML/provider 或覆写模块实现，转换是可选路线。指南第 6、10、11 节。

### C04 · 把常见故障拆成独立业务

[openclash新手教程系列附加篇、DNS泄露、openclash搭配Adguardhome、openclash远程访问、订阅失败、BT直连等问题解决](https://www.youtube.com/watch?v=5-eSqP-iNnc)

2024-07-06 · 46:19 · [文章已核对](https://www.qichiyu.com/45.html)

说明涉及 DNS 泄露、AGH、远程访问、订阅与 BT 直连。本文保留按场景拆分的方式，进一步区分 DNS 入口、业务出口与应用可达；旧域名列表与容器目录需要现场核对。指南第 12、14、17、18 节。

### C05 · 主路由与旁路的 IPv6 共存

[openwrt主路由和旁路由模式下的ipv6和openclash共存问题](https://www.youtube.com/watch?v=PvvJpcA_IXE)

2024-07-18 · 17:51 · [文章已核对](https://www.qichiyu.com/60.html)

聚焦代理与原生 IPv6 共存；配套资料提示不同固件/上级条件需要验证。本文将 WAN 前缀、LAN 路由、DNS AAAA、代理接管分四层讨论，不提供通用 RA 开关组合。指南第 13 节。

### C06 · 定位订阅和转换故障

[【新手必看】openclash订阅失败，某些机场和hy2、vless协议无法使用在线订阅转换，某些网站应用访问异常，一个视频全部解决。](https://www.youtube.com/watch?v=HptHzHEFRA4)

2024-07-29 · 28:49 · [文章已核对](https://www.qichiyu.com/121.html)

配套文章按网络、订阅、后端、模板、本机环境和核心分类。本文沿用分层定位；把旧后端对特定协议的限制，与今天 Mihomo 的协议支持明确分开。指南第 16、18 节。

### C07 · 降低首次配置门槛

[OpenClash全网最简单使用教程 | 订阅和上传yaml配置两种方式，并提供配置一键上传直接使用，小白福音](https://www.youtube.com/watch?v=hCe4bmMwq7M)

2024-10-16 · 14:07 · [文章已核对](https://www.qichiyu.com/264.html)

两条路线是订阅与上传 YAML，配套资料提供整套配置文件。本文强调先辨认 UCI 插件设置和 YAML，并提醒整份导入可能覆盖架构、面板凭据等本机值。指南第 5、6、16 节。

### C08 · 设计过滤器与核心之间的 DNS 链

[从零教你Nikki搭配adguardhome  |  mosdns、smartdns以及openclash同样适用，原理加实操，手把手喂饭](https://www.youtube.com/watch?v=rHGAx7JekRg)

2025-03-14 · 43:37 · [文章已核对](https://www.qichiyu.com/387.html)

标题以 Nikki 为例，但明确注明 OpenClash 等也适用。本文纳入其跨插件的 DNS 原理主题；具体监听、转发与接管入口按 OpenClash 官方说明重写，不能套用 Nikki 菜单。指南第 14 节。

### C09 · 接入自己的节点

[手把手教你在nikki和openclash上使用自建节点，打通你的任督二脉！](https://www.youtube.com/watch?v=XsKxsvv_LtE)

2025-06-27 · 18:16 · [文章已核对](https://www.qichiyu.com/718.html)

说明与配套文章围绕 Nikki/OpenClash 使用自建节点。本文把节点参数、策略组引用和实际连接三步拆开；服务端认证参数必须来自自己的部署。指南第 16.1 节。

### C10 · 了解 Smart 与模型训练

[【超详细教程】手把手教你OpenClash Nikki上使用Smart智能策略组，训练专属AI模型自动选最优节点，从此告别手动切换！](https://www.youtube.com/watch?v=ZPrIhaS8FX4)

2025-07-01 · 32:22 · [文章已核对](https://www.qichiyu.com/724.html)

章节包含策略组介绍、插件实操和训练。本文保留功能与试用路径，但旧文的 Smart strategy 字段已被后续官方变更移除；模型训练是可选，并采用隔离的 Python 环境。指南第 15 节。

### C11 · 适应 2025 新版配置流程

[更新后完全不会用了？新版 OpenClash 教程来了！](https://www.youtube.com/watch?v=1U9xkpexHOE)

2025-07-05 · 17:09 · [文章已核对](https://www.qichiyu.com/726.html)

针对升级后使用方式变化的专门教程。今天应把它放在版本演进中理解，与 2026 新版入口对照；已有配置不必仅因菜单变化就全部重做。指南第 6、10、20 节。

### C12 · 找回入口并维护例外规则

[OpenClash2026最新版教程：面板消失 / 顶部菜单少了 一键生成，规则附加规则怎么添加？/Smart怎么设置？全部解决](https://www.youtube.com/watch?v=hkqUx8FLhCw)

2026-04-04 · 14:17 · [文章已核对](https://www.qichiyu.com/920.html)

说明明确列出面板、菜单、单条规则、覆写模块、AI 辅助与 Smart GUI。本文把它作为近期界面入口参照，进一步用 v0.47.156 代码校验模块格式和规则前插行为。指南第 10、15、17 节。

## 2. 相关专题：纳入用途

| 日期 | 视频（原题） | 时长 | 本报告中的用途 | 配套资料 |
|---|---|---|---|---|
| 2024-08-15 | [软路由另一款clash系插件 openwrt-mihomo，完美实现openclash的所有功能，简约而不简单。](https://www.youtube.com/watch?v=Ho7fBTdazRw) | 21:28 | 标题直接比较 OpenClash，但主要介绍另一插件，因此纳入对照资料而非 OpenClash 操作步骤。 | [配套入口](https://www.qichiyu.com/132.html) |
| 2024-09-20 | [【完美科学方式探讨】OpenWrt 主或旁 、 Linux旁路网关、MAC旁路网关、电脑手机客户端、VPN客户端、内核对比](https://www.youtube.com/watch?v=124HAmOr6gY) | 21:12 | 不同网关和客户端部署方式的比较背景，补充第 4 节；不把标题里的“完美”当普遍评价。 | — |
| 2024-09-26 | [【全网最细】手搓yaml配置文件 \| clash/mihomo系列通用、保姆级教程、让你彻底搞懂yaml文件](https://www.youtube.com/watch?v=pm4aiZm17SU) | 27:30 | YAML 结构与手动维护配置，作为第 9、11 节先修；当前字段以 Mihomo 文档校正。 | [文章已核对](https://www.qichiyu.com/232.html) |
| 2024-10-09 | [【全网唯一】OpenWrt IPV6 完整教程 \| 主路由+旁路由，科学环境下轻松搞定直播、远程、代理！](https://www.youtube.com/watch?v=PGiGd5eB1mY) | 11:53 | 主路由与旁路的完整 IPv6 背景，补充第 13 节；最终应在终端验证双栈路径。 | [配套入口](https://www.qichiyu.com/250.html) |
| 2024-10-19 | [科学上网工具Sub-Store部署使用全攻略：管理节点与订阅的最佳方式，自建节点、多机场、多终端用户必看！](https://www.youtube.com/watch?v=nEw1iadtPvs) | 25:43 | 多订阅/多客户端的配置来源管理，补充第 16.4 节；无需使用即可完成基本安装。 | [配套入口](https://www.qichiyu.com/268.html) |
| 2024-10-26 | [【全网唯一】不依赖插件！教你如何直接运行 mihomo 内核代理(跑裸核)，极致精简。](https://www.youtube.com/watch?v=0OmO5_HsVPU) | 14:11 | 直接运行核心，帮助理解核心与插件分工；它是替代运行路线，不能与插件重复接管。 | [配套入口](https://www.qichiyu.com/282.html) |
| 2024-11-16 | [【全网最细】手把手教你从外网访问家庭内网，原理+演示+排错、动态域名解析（DDNS-GO）、反代服务器（Nginx Proxy Manager）、证书及申请全面讲解](https://www.youtube.com/watch?v=go5xfSc3VaE) | 33:45 | 外网访问、DDNS、反向代理与证书的背景。本文仅吸收远程管理需求，未将开放管理端口当默认方案。 | [配套入口](https://www.qichiyu.com/297.html) |
| 2024-12-21 | [Github镜像站搭建、解决直连环境下脚本执行、配置、规则无法下载等导致的报错问题。](https://www.youtube.com/watch?v=PDQT74-gOg8) | 10:55 | GitHub 资源下载失败的背景。本文保留资源可达性检查，未要求部署镜像站。 | [配套入口](https://www.qichiyu.com/330.html) |
| 2025-02-18 | [【全网最细】openwrt入门到精通：带你完全掌握openwrt的使用！\| openwrt基础使用教程 \| ImmortalWrt 通用教学](https://www.youtube.com/watch?v=Ok-qHkNYvU8) | 29:39 | OpenWrt 基础操作与配置入口，作为安装和只读检查的背景；不代替具体固件文档。 | — |
| 2025-03-06 | [【全网最细】家庭网络零基础快速入门指南、新手必看视频、网络基础知识、常用命令、家庭网络拓扑、软路由组网方式。](https://www.youtube.com/watch?v=V4hsLhlblNE) | 30:36 | 网关、DNS、拓扑和常用检查，作为第 3、4、18 节的先修主题。 | [配套入口](https://www.qichiyu.com/372.html) |
| 2025-03-19 | [【全网最细】手把手教你定制自己的yaml文件，mihomo/clash全平台通用，告别早已落后的订阅转换，机场订阅 \| 自建节点 \| 链式代理 \| DNS泄露 \| 二进制规则转换、等全介绍！](https://www.youtube.com/watch?v=eUqf3lOhFSw) | 66:37 | 自有 YAML 的整体维护：节点、订阅、规则和 DNS。补充第 6、8、9、11 节；标题中的评价性措辞不当成技术结论。 | [文章已核对](https://www.qichiyu.com/395.html) |
| 2025-07-23 | [告别昂贵VPS！保姆级「链式代理」教程，手把手教你用机场拉落地，低成本解锁高速与纯净IP！](https://www.youtube.com/watch?v=3oiA2Ym1Wu4) | 16:12 | 前置节点与落地出口的关系。补充第 16.2 节；当前配置采用官方 dialer-proxy，旧 relay 已标记废弃。 | [文章已核对](https://www.qichiyu.com/802.html) |
| 2025-08-08 | [【全网最细】一次彻底搞懂YAML分流规则：参数讲解+添加规则+故障排查](https://www.youtube.com/watch?v=_iG8vl3pzaM) | 44:45 | 分流参数、规则集、添加方法与排错。补充指南第 9、10、18 节；客户端覆写与防火墙接管仍要另查。 | [文章已核对](https://www.qichiyu.com/821.html) |

## 3. 其余 20 个公开视频：范围筛查

这些条目也读取了说明。主要内容属于其他代理内核/插件、虚拟化、固件或 Windows；部分含比较或相关视频链接。未把它们的菜单、配置语法当作 OpenClash 依据。它们可能有可迁移知识，但没有必要为了凑“全部”将其他软件教程混入操作指南。

| 日期 | 视频（原题） | 时长 |
|---|---|---|
| 2024-07-13 | [【全网最细】新手必看！最详细的Windows系统重装教程，全程实操演示，教你系统安装、激活、分区与扩容](https://www.youtube.com/watch?v=L3DwX26pXhA) | 33:58 |
| 2024-08-18 | [【最全系列教程】Singbox软路由端-零基础入门教程 \| sing-box内核介绍、shellcrash的使用](https://www.youtube.com/watch?v=e07XOJOo25w) | 33:32 |
| 2024-08-20 | [【全网最全】Singbox软路由端-零基础入门教程 \| sing-box配置讲解、手搓规则、规则模板、订阅转换后端、裸核运行，一个视频全部讲清楚！](https://www.youtube.com/watch?v=jMJqTVSHlHQ) | 42:11 |
| 2024-08-22 | [【全网最细】软路由openwrt唯一界面singbox插件homeproxy使用详细教程。](https://www.youtube.com/watch?v=nNRpbn9M2Lc) | 20:46 |
| 2024-08-24 | [【全网最细】软路由、openwrt、singbox插件homeproxy教程下期、手动新增分流规则、规则集二进制转换、DNS泄露](https://www.youtube.com/watch?v=Ynh1YBR_4Mc) | 18:56 |
| 2024-08-31 | [openwrt基础配置 \| openwrt固件选择、扩容、docker安装扩容、网络共享samba4安装配置、ImmortalWrt固件](https://www.youtube.com/watch?v=pGzAadV2KCY) | 24:12 |
| 2024-09-22 | [【全网唯一】openwrt完美插件MihomoTproxy教程 \| 插件安装卸载、无需使用传统订阅、无需后端、插件原理讲解、超级简单稳定。](https://www.youtube.com/watch?v=uca-CdIO7Ug) | 21:01 |
| 2024-10-30 | [【全网最细】小白2分钟，快速构建编译专属openwrt固件，超级简单，适用于官方openwrt、immortalwrt](https://www.youtube.com/watch?v=t0PCzfhwuXQ) | 22:14 |
| 2024-11-06 | [强烈推荐！全新一代网络代理软件，Clash for Windows最佳替代—专业与易用并存的跨平台科学软件MihomoParty详解 Mihomo Party 碾压 clash verge](https://www.youtube.com/watch?v=eC_GaQoJ4No) | 11:06 |
| 2024-11-19 | [openwrt与Sing-box完美搭配，官方singbox、超越插件的使用体验、解锁全部功能、自动更新配置与订阅](https://www.youtube.com/watch?v=lm-yWjc3VTQ) | 18:46 |
| 2024-11-25 | [openwrt使用singbox的终极方式、proxy/tun双模式，openwrt与Sing-box完美搭配，官方singbox、超越插件的使用体验、解锁全部功能、自动更新配置与订阅](https://www.youtube.com/watch?v=RT59f6z8TF4) | 13:07 |
| 2024-11-28 | [Linux环境下运行官方SingBox，轻松配置喂饭视频，支持所有设备！](https://www.youtube.com/watch?v=PkKbfzEmJcs) | 13:56 |
| 2024-12-03 | [【全网最细】手把手教你手搓singbox配置文件，结合sing-box官方wiki，新老版本配置讲解，机场订阅、自建节点讲解](https://www.youtube.com/watch?v=oKvYpGo_kvw) | 37:55 |
| 2025-03-09 | [【全网最全】openwrt完美插件 nikki 喂饭级教程 \| 插件安装卸载、各项设置以及注意事项讲解、各种使用方式讲解\| openwrt mihomo \| mihomotproxy](https://www.youtube.com/watch?v=sl8zK0dv7iM) | 60:15 |
| 2025-06-12 | [【新手必看】PVE安装和优化  \| 新手保姆教程  \|  All in One 基础篇](https://www.youtube.com/watch?v=Jq4TlrBnGJ8) | 25:34 |
| 2025-06-15 | [【超细】PVE安装设置ROS (RouterOS) /OpenWRT超详细教程｜小白也能轻松上手！](https://www.youtube.com/watch?v=3zvTMxB3MQg) | 50:41 |
| 2025-06-25 | [彻底搞懂 Nikki 插件｜OpenWrt 透明代理最强配置教程-实操篇](https://www.youtube.com/watch?v=yiAJD1PL8oc) | 17:47 |
| 2025-07-13 | [【超级小白教程】迄今最简单的节点搭建！无需面板，复制粘贴搞定Sing-box服务端，从VPS选购到配置，手把手教你避坑，专业的搭建高速稳定节点](https://www.youtube.com/watch?v=tfYpMZ-gx8U) | 34:38 |
| 2025-08-11 | [【全网首发】OpenWrt全新代理插件Momo！SingBox内核 适配Clash面板，超简单上手](https://www.youtube.com/watch?v=JBhiwbUciHQ) | 19:59 |
| 2025-08-22 | [【全网次发】singbox代理插件momo进阶教程、substore制作配置订阅、Fork版本内核配置文件直接添加订阅、常见问题解决！](https://www.youtube.com/watch?v=kNynF-uR-EM) | 25:37 |

## 4. 从视频说明核实的时间定位

下列时间来自视频说明中的章节。没有章节的内容不虚构时间点。

**[【全网最全】OpenClash零基础入门教程 | openclash优缺点、网络设置、安装、内核更新与上传、基础设置，新手使用指南，openwrt软路由OpenClash从入门到精通系列教程之基础篇](https://www.youtube.com/watch?v=7wiu1YA8Pbc)**

[1:50 固件选择](https://www.youtube.com/watch?v=7wiu1YA8Pbc&t=110s)；[2:45 网络设置](https://www.youtube.com/watch?v=7wiu1YA8Pbc&t=165s)；[5:55 插件安装](https://www.youtube.com/watch?v=7wiu1YA8Pbc&t=355s)；[8:40 核心安装](https://www.youtube.com/watch?v=7wiu1YA8Pbc&t=520s)；[18:00 基础设置](https://www.youtube.com/watch?v=7wiu1YA8Pbc&t=1080s)。

**[OpenClash2026最新版教程：面板消失 / 顶部菜单少了 一键生成，规则附加规则怎么添加？/Smart怎么设置？全部解决](https://www.youtube.com/watch?v=hkqUx8FLhCw)**

[0:19 面板切换与找回](https://www.youtube.com/watch?v=hkqUx8FLhCw&t=19s)；[1:04 菜单精简](https://www.youtube.com/watch?v=hkqUx8FLhCw&t=64s)；[1:22 三种使用方式](https://www.youtube.com/watch?v=hkqUx8FLhCw&t=82s)；[2:32 单条自定义规则](https://www.youtube.com/watch?v=hkqUx8FLhCw&t=152s)；[4:50 覆写模块添加规则集](https://www.youtube.com/watch?v=hkqUx8FLhCw&t=290s)；[6:37 YouTube 走代理](https://www.youtube.com/watch?v=hkqUx8FLhCw&t=397s)；[8:40 批量域名直连](https://www.youtube.com/watch?v=hkqUx8FLhCw&t=520s)；[11:25 Smart GUI](https://www.youtube.com/watch?v=hkqUx8FLhCw&t=685s)。

**[【全网最细】一次彻底搞懂YAML分流规则：参数讲解+添加规则+故障排查](https://www.youtube.com/watch?v=_iG8vl3pzaM)**

[0:00 规则讲解](https://www.youtube.com/watch?v=_iG8vl3pzaM&t=0s)；[18:05 规则集](https://www.youtube.com/watch?v=_iG8vl3pzaM&t=1085s)；[30:30 添加规则](https://www.youtube.com/watch?v=_iG8vl3pzaM&t=1830s)；[38:35 故障排查](https://www.youtube.com/watch?v=_iG8vl3pzaM&t=2315s)。

**[【超详细教程】手把手教你OpenClash Nikki上使用Smart智能策略组，训练专属AI模型自动选最优节点，从此告别手动切换！](https://www.youtube.com/watch?v=ZPrIhaS8FX4)**

[0:00 策略组介绍](https://www.youtube.com/watch?v=ZPrIhaS8FX4&t=0s)；[16:29 OpenClash/Nikki 使用](https://www.youtube.com/watch?v=ZPrIhaS8FX4&t=989s)；[27:49 模型训练](https://www.youtube.com/watch?v=ZPrIhaS8FX4&t=1669s)。

## 5. 官方核验依据与版本边界

| 来源 | 在指南中的用途 | 边界 |
|---|---|---|
| [OpenClash v0.47.156](https://github.com/vernesong/OpenClash/releases/tag/v0.47.156) | 插件版本、依赖与发布变化 | 本次核验最新发布，2026-08-10 |
| [Mihomo v1.19.30](https://github.com/MetaCubeX/mihomo/releases/tag/v1.19.30) | 上游核心版本 | 与 OpenClash 插件及 Smart 分支分开记版本 |
| [OpenClash 用户手册源码](https://github.com/vernesong/OpenClash/tree/dev/.github/skills/openclash-user-guide) | 架构、依赖、模式、DNS、覆写、订阅、日志、诊断 | dev 分支可能领先已安装版本，关键模块行为另与发布版代码核对 |
| [发布版启动脚本](https://github.com/vernesong/OpenClash/blob/v0.47.156/luci-app-openclash/root/etc/init.d/openclash) / [YAML 合并实现](https://github.com/vernesong/OpenClash/blob/v0.47.156/luci-app-openclash/root/usr/share/openclash/YAML.rb) | 核验段头、模块执行与数组前插语义 | 本地检查示例合并，不等于路由器端到端测试 |
| [DNS 字段](https://wiki.metacubex.one/config/dns/) / [解析流程](https://wiki.metacubex.one/config/dns/diagram/) | DNS 分工、Fake-IP、节点引导、回环 | 当前文档含新版字段，旧核心需核对 |
| [路由规则](https://wiki.metacubex.one/config/rules/) / [规则集合](https://wiki.metacubex.one/config/rule-providers/) | 规则顺序、no-resolve、格式与引用 | MRS 仅对应 domain/ipcidr |
| [代理集合](https://wiki.metacubex.one/config/proxy-providers/) / [代理组](https://wiki.metacubex.one/config/proxy-groups/) | provider、自有规则、自动/手动选择 | 节点数据与完整配置区分 |
| [TUN](https://wiki.metacubex.one/config/inbound/tun/) / [嗅探](https://wiki.metacubex.one/config/sniff/) | 接管、协议栈和域名线索 | OpenClash 自己的接管模式另查插件 |
| [Smart 分支说明](https://github.com/vernesong/OpenClash/releases/tag/mihomo) | Smart 字段、模型、strategy 移除 | 不能默认套用到上游 Mihomo |
| [dialer-proxy](https://wiki.metacubex.one/config/proxies/dialer-proxy/) / [relay](https://wiki.metacubex.one/config/proxy-groups/relay/) | 链式方向、旧配置迁移 | 当前官方将 relay 标记废弃 |
| [AGH 当前配置文档](https://adguard-dns.io/kb/adguard-home/configuration/) | 上游、监听、转发和配置角色 | 旧 GitHub Wiki 已指向此新版页面 |
| [MetaCubeX 规则数据](https://github.com/MetaCubeX/meta-rules-dat) | 示例 cn 域名/IP 和 YouTube MRS 资源 | 3 个实际资源本次 HTTP 200，内容会继续变化 |

## 6. 本次未能核验的内容

- 全部视频的逐分钟口述和界面演示；没有把页面说明冒充字幕。
- 早期四个教程共用的 Blogspot 原始页面本次未能读取；已核对现博客对应入口、视频说明及可获取的配套文章。
- 未公开、已删除、会员限定视频，以及未出现在本次公开 Videos 列表中的其他内容。
- 作者推广服务的线路质量、隐私、价格或可用性；本指南没有据此推荐购买。
- 你的固件、硬件、DNS、订阅与实际网络；配置示例需要据此调整。

若要将这份资料研究版提升为逐分钟视听分析版，需要能取得各视频的字幕或实际音视频内容；当前版本明确停留在上述可核验范围。
