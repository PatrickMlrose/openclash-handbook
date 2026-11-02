# OpenClash 使用指南

依据七尺宇频道公开教程资料，并结合 OpenClash、Mihomo 官方文档整理。

资料核对日期：2026 年 9 月 5 日。适用对象：使用 OpenWrt、ImmortalWrt、iStoreOS 等系统的家庭用户。菜单以近期 OpenClash 为参照；固件集成版本可能不同。

配套文件：[视频与来源索引](/downloads/video-index.md) · [provider 配置示例](/downloads/provider-example.yaml) · [YouTube 规则覆写模块](/downloads/youtube-overwrite.conf)

## 阅读前说明

本次把[七尺宇频道](https://www.youtube.com/@qichiyu/videos)的视频列表翻至最早一条，并读取了当时公开列出的 **45 个视频的标题、说明、日期和时长**。按主题确定了 **12 个直接涉及 OpenClash 使用的核心视频、13 个相关专题视频**，其余 20 个条目也进行了范围筛查。完整清单、纳入理由与视频定位见同目录《视频与来源索引》。

**这份指南是公开资料研究版，并非所有视频的逐字稿或逐分钟视听分析。**本次读取的页面元数据均未提供字幕轨道；浏览器分别尝试导出基础篇、2026 版视频字幕，也返回不可用。因此，作者观点只归因于能核实的视频说明、章节和配套博客/配置仓库。具体操作还依据官方文档补充；没有取得的口述和画面细节不作推断。未公开、已删除或会员限定的视频不在可核验范围内。

本次查询时，OpenClash 最新发布为 **v0.47.156，2026-08-10**；Mihomo 上游最新发布链接指向 **v1.19.30**。二者是不同软件的版本号，Smart 核心又有自己的分支。官方 `dev` 分支手册可能走在固件预装版本前面；不能仅凭本文的菜单名称判断自己的安装损坏。[OpenClash 发布页](https://github.com/vernesong/OpenClash/releases/tag/v0.47.156)、[Mihomo 发布页](https://github.com/MetaCubeX/mihomo/releases/tag/v1.19.30)

全文命令是供读者按条件使用的操作示例。本次没有连接或修改你的路由器，也没有以你的订阅完成上网测试。

## 目录

| 入门与配置 | 进阶与维护 |
|---|---|
| [1. 使用路线](#1-先确定一条清晰的使用路线) | [12. 设备与应用分流](#12-按设备和应用分流) |
| [2. 核心概念](#2-分清-openclash核心订阅规则和面板) | [13. IPv6](#13-ipv6先决定谁接管再决定开关) |
| [3. 安装前检查](#3-安装前系统网络和备份) | [14. AdGuard Home 等 DNS 组件](#14-adguard-homesmartdnsmosdns-如何配合) |
| [4. 主路由与旁路](#4-主路由和旁路网关怎么接) | [15. Smart](#15-smart-智能策略组) |
| [5. 插件与核心安装](#5-安装插件和核心) | [16. 自建节点与链式代理](#16-自建节点链式代理和订阅转换) |
| [6. 订阅与配置文件](#6-导入订阅与认识两种配置文件) | [17. 面板与远程管理](#17-控制面板域名嗅探与远程管理) |
| [7. 模式区别](#7-三组容易混淆的模式) | [18. 故障排查](#18-故障排查从现象到证据) |
| [8. DNS](#8-dns配置中最需要理解的一部分) | [19. 升级与维护](#19-升级回退和日常维护) |
| [9. 策略组与规则](#9-策略组和分流规则) | [20. 教程演进与观看顺序](#20-怎样理解这套视频的演进) |
| [10. 自定义规则与覆写模块](#10-保存自定义规则优先使用界面和覆写模块) | [21. 验收清单](#21-完成标准一次安装至少验收这些项目) |
| [11. provider 配置示例](#11-一份容易维护的-provider-配置) | |

第一次安装按第 1—8 节顺序阅读；已有配置只想加规则，先看第 6.3、9、10 节；网络出错直接从第 18 节开始。

## 1. 先确定一条清晰的使用路线

如果第一次安装，建议按以下顺序完成：

1. 确认关闭代理时，路由器和一台测试设备都能正常上网。
2. 确认系统、CPU 架构、包管理器和防火墙类型，保存备份。
3. 安装 OpenClash 和匹配的 Mihomo 核心。
4. 先导入一份完整、有效的 Mihomo/Clash 配置，或使用后文的 provider 示例。
5. 使用规则模式，先验证一台设备；再扩大到其他设备。
6. 用控制面板确认国内请求、代理请求和局域网访问符合预期。
7. 最后再加自定义规则、IPv6、AdGuard Home、Smart、链式代理。

这里的先后顺序是为了让故障能定位到最近一次改变。它不是必须永久关闭高级功能的建议。

三条常见配置路线如下。

| 路线 | 适合谁 | 配置由谁维护 | 主要注意点 |
|---|---|---|---|
| A. 完整配置订阅 | 刚入门，服务商提供可用的完整配置 | 服务商提供基础配置，个人需求通过覆写保存 | 更新订阅可能替换原始规则 |
| B. 自有 YAML + `proxy-providers` | 想长期维护自己的分流、合并多个订阅 | 自己维护规则和策略组，provider 更新节点 | 订阅必须返回核心支持的节点格式 |
| C. 在线订阅转换 | 原始订阅格式不匹配，或已有转换模板 | 转换后端按模板生成配置 | 增加后端、模板、协议兼容和订阅保密等环节 |

我的默认建议是：新手先用 A 验证线路；需要独立规则后用 B。C 仍有适用场景，并未因为有 provider 就失去用途。七尺宇从 2024 年转换模板教程，延伸到 2025 年自有 YAML 和 2026 年覆写模块教程，反映的是不同维护路线；不应把几个时代的文件不加区分地叠在一起。[转换模板教程](https://www.youtube.com/watch?v=D841V_xgykg)、[自有 YAML 教程](https://www.youtube.com/watch?v=eUqf3lOhFSw)、[2026 版教程](https://www.youtube.com/watch?v=hkqUx8FLhCw)

## 2. 分清 OpenClash、核心、订阅、规则和面板

| 名词 | 实际作用 | 不能据此推断的事 |
|---|---|---|
| OpenClash | OpenWrt 的 LuCI 插件，管理配置、核心、DNS 接管和防火墙 | 能打开页面不代表核心启动成功 |
| Mihomo / Clash Meta | 真正处理连接、DNS 和路由规则的核心 | 更新核心不等于更新插件 |
| Smart 核心 | 增加 Smart 策略组等功能的 Mihomo 分支 | 上游 Mihomo 不能默认识别所有 Smart 字段 |
| 节点 | 一个具体代理服务器及其认证、协议参数 | 延迟测试成功不代表所有应用都可用 |
| 订阅 | 获取配置或节点的地址 | 不是所有订阅都返回完整 YAML |
| 策略组 | 把节点、其他组和直连等出口组织起来 | 组名叫“美国”不证明实际出口位于美国 |
| 路由规则 | 决定某个连接交给哪个出口 | 规则只有在流量进入核心且匹配时才有作用 |
| 控制面板 | 查看连接、切换节点、检查规则与日志的前端 | 面板空白与核心停止是两类故障 |

OpenClash 官方将自身定义为运行于 OpenWrt 的 Mihomo 客户端。[项目说明](https://github.com/vernesong/OpenClash)

一次普通访问可以拆成两条路径：

```text
DNS 查询：终端 → 路由器上的 DNS 入口 → Mihomo DNS → 指定上游 DNS

业务连接：终端 → 网关 → OpenClash 防火墙接管 → Mihomo 规则
                                             ├→ DIRECT → 目标站点
                                             ├→ 策略组 → 节点 → 目标站点
                                             └→ REJECT
```

具体 DNS 入口也可能直接重定向到 Mihomo，或先经过 AdGuard Home。理解这两条路径很有用：DNS 能回答，不代表业务连接走对出口；业务请求走了代理，也不代表 DNS 查询符合你的设计。

## 3. 安装前：系统、网络和备份

### 3.1 先记录设备条件

在 LuCI 的“状态 → 概览”“系统 → 软件包”中确认固件版本、内核、架构和可用空间。若用 SSH，以下是只读检查：

```sh
cat /etc/openwrt_release
ubus call system board
uname -m
uname -r
command -v opkg
command -v apk
command -v fw4
df -h /overlay /tmp
free -m
date
ip -4 route show default
```

`opkg` 对应 IPK 包，`apk` 对应 APK 包；这里的 APK 是 OpenWrt 包格式，不是 Android 应用。看实际设备使用什么，不凭“OpenWrt”这个名称猜。防火墙方面，常见新固件使用 firewall4/nftables，较旧系统使用 firewall3/iptables。[官方安装分支](https://github.com/vernesong/OpenClash/releases/tag/v0.47.156)

还要记录：路由器是主路由还是旁路网关、LAN 地址、上级路由地址、DHCP 由谁提供、是否在运行其他透明代理或 DNS 程序。需要检查的是它们是否争用 DNS 监听端口、重定向和策略路由；多套程序同时安装与多套透明接管同时运行不是一回事。

### 3.2 保存可以恢复的备份

优先使用 LuCI“系统 → 备份/升级”导出系统配置，再用 OpenClash 自带备份功能保存插件设置。已安装的用户还应保存原始 YAML、自定义规则和覆写模块。

有 SSH 时，可生成系统配置备份：

```sh
sysupgrade -b /tmp/before-openclash.tar.gz
```

把文件下载到电脑。`/tmp` 通常是内存文件系统，重启后不能依靠它保留备份。配置中可能包含订阅 token、节点密码和面板密钥，备份不要公开发布。系统备份的包含范围与固件有关，不能假定它自动包含整个插件目录、所有核心和外部存储。

## 4. 主路由和旁路网关怎么接

### 4.1 主路由

```text
光猫/上级网络 → OpenWrt 主路由 → 交换机/AP → 手机、电脑等终端
```

举例：OpenWrt 的 LAN 地址是 `192.168.10.1`，终端从它获取地址，IPv4 默认网关和 DNS 都指向 `192.168.10.1`。WAN 的拨号或 DHCP 按你原有网络配置。

这时大多数终端出站流量天然经过 OpenWrt，便于统一接管。接入点若只是扩展 Wi-Fi，应确认它没有另外建立一套意外的 NAT/DHCP 网络。

### 4.2 旁路网关

```text
主路由 192.168.10.1
       ├→ OpenWrt 旁路网关 192.168.10.2
       └→ 终端 192.168.10.100
```

一个便于先测单机的 IPv4 方案：

| 对象 | 默认网关 | DNS |
|---|---|---|
| OpenWrt 旁路网关自身 | 主路由 `192.168.10.1` | 不依赖尚未工作的代理链，使用可达上游 |
| 希望接管的测试终端 | 旁路网关 `192.168.10.2` | 旁路网关 `192.168.10.2` |
| 暂时不接管的终端 | 主路由 `192.168.10.1` | 主路由或既有正常 DNS |

地址只是示例，实际应使用自己的网段。旁路网关的固定地址要避免与 DHCP 地址池发生冲突。同一广播域通常由一个明确的 DHCP 服务下发地址；不要无意中开两个相互竞争的 DHCP 服务。

两个常见错误：只改 DNS，业务连接仍绕过旁路网关；只改网关，终端的 DNS 仍绕过 Mihomo。后者还可能受到浏览器安全 DNS、Android 私人 DNS等影响。

单臂旁路存在去程与回程不对称的可能。“旁路网关兼容”是处理特定兼容问题的选项，不是所有旁路设备都必须勾选。先检查终端路由、转发和连接，再按日志验证；也不要为了套教程随意拆桥、关闭整个防火墙。[官方模式与流量说明](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/08-settings-mode-traffic.md)

IPv6 的默认路由由 RA 等机制决定，修改 IPv4 网关不会自动改变 IPv6 路径，详见第 13 节。

## 5. 安装插件和核心

### 5.1 安装入口

1. 固件应用商店若提供与该固件匹配的 OpenClash，优先按商店流程安装。
2. 没有对应入口时，从 OpenClash 官方 Releases 取得 IPK 或 APK。
3. 在软件包页面上传安装；如果依赖报错，先查对应固件仓库是否提供匹配依赖。

不要拿旧教程中的一个文件名当永久最新版。插件包名称里的 `all` 不代表核心也不区分架构。

官方依赖包括 Ruby/YAML、curl、证书包、`dnsmasq-full` 等；nftables 与 iptables 所需的透明代理依赖不同，TUN 还涉及 `kmod-tun`。若 `dnsmasq` 与 `dnsmasq-full` 冲突，先确认固件的替换方式并备份 DHCP/DNS 配置，不能通过强制覆盖随便解决。[依赖清单](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/02-dependencies.md)

禁止把“更新软件包索引”与“升级全部软件包”混为一谈。一般安装依赖需要刷新索引，不需要做一次全系统 `opkg upgrade`。特别是 `kmod-*` 必须匹配正在运行的内核，跨固件包和强制跳过依赖不是正常修复步骤。

### 5.2 选择核心架构

| 设备/系统架构示例 | 常见核心类型 | 核对要点 |
|---|---|---|
| x86-64 小主机 | `linux-amd64` 对应构建 | 老 CPU 注意指令集兼容版本 |
| 64 位 ARM 系统 | `linux-arm64` | 不能用 amd64 或 armv7 |
| 32 位 ARM 系统 | 对应 ARM 构建 | 按系统 ABI/浮点能力匹配 |
| MIPS/MIPSel | 对应大小端和软硬浮点构建 | 尤其不能只按芯片营销名称选 |

优先用插件中的核心更新功能，并确认“内核编译版本”与设备相符。手动上传时按该版本的核心上传入口操作；官方常见二进制位置是 `/etc/openclash/core/clash_meta`，压缩包要经上传功能解压或正确处理后才可执行。首次使用优先普通 Mihomo 核心，Smart 留到有需要时再试。

验证可以用：

```sh
/etc/openclash/core/clash_meta -v
```

出现 `Exec format error` 首先怀疑架构不符；`Illegal instruction` 可能是指令集不兼容；显示版本号只证明二进制能执行，并不证明代理正常。

## 6. 导入订阅与认识两种配置文件

### 6.1 完整配置订阅

一般从“配置订阅”添加名称、地址和必要的 UA，先只用一个订阅做测试。完整 Mihomo 配置可先关闭在线转换，减少诊断环节。保存后更新订阅，到“配置管理”确认生成文件，再切换/启用正确的配置。

检查实际内容：完整配置通常有 `proxies` 或 `proxy-providers`，并有 `proxy-groups`、`rules` 等部分。包含一堆 `vless://`、`ss://` 链接的文本、Base64 字符串或网站 HTML，不能当成完整 YAML 直接使用。服务商可按 UA 返回不同格式，因此下载成功但内容不对时，也要检查 UA。

### 6.2 自有 YAML + provider

`proxy-providers` 负责更新节点；`proxy-groups` 和 `rules` 保留在自己的主配置里。不同订阅可分别定义为不同 provider，再在策略组的 `use` 中同时引用。

这解决了“更新节点就丢规则”的常见问题，但不会把任何订阅自动变成可用格式。如果对方只给通用分享链接，仍需合适的转换方式或手动写节点。七尺宇 2024 年博客里“多条订阅必须开启转换”的说法，是当时该配置订阅操作路线的条件，不能扩大为 Mihomo 不支持多个 provider。[作者订阅排障资料](https://www.qichiyu.com/121.html)、[Mihomo 代理集合文档](https://wiki.metacubex.one/config/proxy-providers/)

### 6.3 原始配置与运行配置

| 文件 | 典型位置 | 应怎样使用 |
|---|---|---|
| 插件设置 | `/etc/config/openclash` | LuCI 选项的持久化数据，不是 YAML |
| 原始配置 | `/etc/openclash/config/名称.yaml` | 上传、订阅和手动维护的基础文件 |
| 运行配置 | `/etc/openclash/名称.yaml` | 经插件加工后交给核心的实际内容 |
| 自定义规则/脚本 | `/etc/openclash/custom/` | 保存个人规则与兼容脚本 |
| 新版覆写模块 | `/etc/openclash/overwrite/` | 按配置匹配和排序应用的模块 |

实际生效结果必须看运行配置。插件可能覆写端口、运行模式、DNS、规则、Smart 等内容；在原始 YAML 里写了某值，不保证最终仍是该值。直接编辑运行配置通常也无法作为持久维护方案。[官方架构说明](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/01-architecture.md)、[配置管理说明](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/12-subscribe-config.md)

## 7. 三组容易混淆的“模式”

### 7.1 规则 / 全局 / 直连：决定出口

| 模式 | 含义 | 使用建议 |
|---|---|---|
| 规则 `rule` | 按规则选择出口 | 日常默认 |
| 全局 `global` | 已进入核心的连接使用 GLOBAL 所选出口 | 临时判断规则是否有问题 |
| 直连 `direct` | 已进入核心的连接直接连接目标 | 临时对照测试 |

“全局”不保证网络里所有流量都进入核心。IPv6 绕行、设备访问控制和防火墙提前放行的流量，仍可能不受它控制。“直连模式”也不等于停止插件：DNS 接管与防火墙可能仍在工作。[Mihomo 全局配置](https://wiki.metacubex.one/config/general/)

### 7.2 Fake-IP / Redir-Host：决定 DNS 处理方式

Fake-IP 给终端返回一个映射地址，再由核心把地址对应回域名进行处理。看到 `198.18.x.x` 可能完全正常，这类地址不是网站真实公网地址，不能写进 hosts。当设备得到 Fake-IP 后，它发往该映射地址的连接必须能回到处理该映射的核心。

Redir-Host 返回真实解析结果。它更接近普通 DNS 的表现，但仍可以借助 DNS 映射、嗅探及域名信息使用域名规则；“Redir-Host 只能按 IP 分流”是过度简化。

日常浏览可以先试 Fake-IP；遇到依赖真实地址的应用，再针对域名配置 Fake-IP 过滤，或对该设备使用兼容路线。BT/PT 是否直连，最终仍由流量路径和规则决定，不能只靠模式名称判断。[Mihomo DNS 配置](https://wiki.metacubex.one/config/dns/)

### 7.3 增强 / TUN / 混合：决定接管方式

| OpenClash 接管方式 | TCP | UDP | 典型考虑 |
|---|---|---|---|
| 非 TUN，旧界面常称增强 | REDIRECT | TPROXY（取决于模式/选项） | 常见的日常路线 |
| TUN | TUN | TUN | 需要虚拟网卡和相应内核支持 |
| 混合/Mix | REDIRECT | TUN | 在部分 UDP/NAT 场景中测试兼容性 |

这些方式都可与 Fake-IP 或 Redir-Host 组合。**OpenClash 的混合接管模式、`tun.stack: mixed`、`mixed-port` 是三个不同概念**：第二个表示 TUN 内部 TCP/UDP 的协议栈组合，第三个是同时接受 HTTP/SOCKS 代理的监听端口。[官方防火墙模式表](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/04-firewall-chains.md)、[Mihomo TUN 文档](https://wiki.metacubex.one/config/inbound/tun/)

不要因为设备装了 Docker 就认定必须换 TUN，也不要相信某个栈在所有硬件上必然最快。先用已支持的默认组合验证，再根据 UDP、吞吐或 NAT 故障进行对照测试。

## 8. DNS：配置中最需要理解的一部分

### 8.1 DNS 接管入口

在“插件设置 → DNS”中，近期版本通常提供 Dnsmasq 转发、防火墙重定向和禁用等选项。

| 方式 | 典型链路 | 需要核对 |
|---|---|---|
| Dnsmasq 转发 | 终端 → dnsmasq → Mihomo DNS | 是否仍能解析本地域名，停用后能否还原上游 |
| 防火墙重定向 | 终端的 53 端口请求 → Mihomo DNS | 访问控制、局域网 DNS 和其他 DNS 插件是否按设计参与 |
| 禁用 | 由其他安排把 DNS 送入正确入口 | 不能理解为“随便填 DNS 也会自动分流” |

`7874` 是 OpenClash 常见核心 DNS 端口，实际以你的运行状态和配置为准。普通 53 端口重定向并不能自动接管所有 DoH/DoT；浏览器、系统或应用自行使用加密 DNS 时，仍要核对路径。[官方 DNS 与访问控制](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/09-settings-dns-ac-ipv6.md)

### 8.2 各种 DNS 字段各做什么

| 字段 | 作用 | 常见误解 |
|---|---|---|
| `default-nameserver` | 为 DNS 服务器自身的域名提供引导解析 | 不等于所有查询都走它 |
| `nameserver` | 默认目标域名解析服务器 | 不自动意味着代理访问 |
| `nameserver-policy` | 指定域名/集合使用指定解析服务器 | 不是业务流量路由规则 |
| `proxy-server-nameserver` | 解析代理节点服务器的域名 | 不是“所有代理网站的 DNS” |
| `direct-nameserver` | 直连出口需要解析域名时使用 | 是否跟随 policy 还受对应选项影响 |
| `fallback` / `fallback-filter` | 按条件决定候选解析结果 | 不只是主 DNS 宕机后的备用 |
| `respect-rules` | DNS 连接遵循路由规则 | 需要准备节点域名解析，避免依赖闭环 |
| `fake-ip-filter` | 按所选过滤模式决定哪些域名返回真实地址 | 不等于把这些域名设置为 DIRECT |

`fake-ip-filter-mode` 现在存在 blacklist、whitelist、rule 等模式。老教程的域名列表通常以 blacklist 语义为前提；切换模式后，列表的含义或语法也会改变。官方 DNS 文档还将旧的 `fallback-filter.geosite` 标为废弃，建议使用 `nameserver-policy`。[字段定义及版本注意](https://wiki.metacubex.one/config/dns/)

### 8.3 避免 DNS 回环

以下链路会产生循环：

```text
Mihomo → AdGuard Home → Mihomo → ……
```

节点域名解析也可能产生类似依赖：为了连接代理节点，需要先解析节点域名；但解析又要求通过这个尚未建立的节点。解决方法是为节点域名准备可独立工作的解析路径，而不是不断增加 DNS 地址。[Mihomo DNS 解析流程](https://wiki.metacubex.one/config/dns/diagram/)

### 8.4 正确理解“DNS 泄露”

先定义你的目标：是否允许国内业务向国内 DNS 查询？代理网站是否也被本地上游查询？浏览器是否绕过路由器？网站检测到的递归解析器地址是否符合你的设计？

国内服务直连并使用国内解析器，可以是有意分流。DoH/DoT 加密了查询传输，但不自动保证出口、递归解析器或匿名性。应结合终端 DNS 配置、Mihomo DNS 设置和连接日志判断，不能只看一个检测页显示的国家。

## 9. 策略组和分流规则

### 9.1 策略组怎么选

| 类型 | 工作方式 | 适合场景 |
|---|---|---|
| `select` | 手动选节点/子组 | 固定地区、账号业务、排障 |
| `url-test` | 用测试 URL 比较延迟，按容差等参数选择 | 一般网页访问的自动选路 |
| `fallback` | 按列表顺序使用可用节点 | 希望有明确主备关系 |
| `load-balance` | 按策略把不同连接分给不同节点 | 能接受多出口的连接集合 |
| `smart` | 特定核心综合历史表现等数据选择 | 有明确需求的进阶尝试 |

负载均衡不能把多个节点带宽简单相加成一条单连接带宽；URL-Test 的低延迟也不代表视频吞吐、地区可用性或账号登录一定最好。对频繁验证码、地区变化敏感的业务，可先使用固定节点进行诊断。[URL-Test](https://wiki.metacubex.one/config/proxy-groups/url-test/)、[Fallback](https://wiki.metacubex.one/config/proxy-groups/fallback/)、[负载均衡](https://wiki.metacubex.one/config/proxy-groups/load-balance/)

### 9.2 规则顺序

普通规则按从上到下的顺序匹配。把明确的例外放在通用规则前，把兜底 `MATCH` 放到最后。域名和 IP 分类都可能需要维护；规则集越多不代表越准确。

```yaml
rules:
  - DOMAIN,portal.example.com,DIRECT
  - DOMAIN-SUFFIX,example.com,Proxy
  - SRC-IP-CIDR,192.168.10.50/32,DIRECT
  - IP-CIDR,192.168.10.0/24,DIRECT,no-resolve
  - MATCH,Proxy
```

此示例中，`portal.example.com` 优先直连；其他 `example.com` 子域名优先匹配代理规则。因此 `192.168.10.50` 访问它们也会先命中前面的域名规则。如果你的意图是这台设备所有流量都直连，应将 `SRC-IP-CIDR` 放到最前面。`Proxy` 是示例中的策略组名，必须在你的配置里存在。

`no-resolve` 表示该 IP 规则不为匹配而主动触发域名解析；它不会关闭该连接后续必要的 DNS。域名尚未得到真实 IP 时，相应 IP 规则可能不会命中。[Mihomo 路由规则](https://wiki.metacubex.one/config/rules/)

### 9.3 `rule-providers` 与 `RULE-SET`

规则集要完成两步：声明它从哪来，再在 `rules` 中引用它。只下载规则文件不会自动改变流量。

| 内容 | `behavior` | 常用 `format` |
|---|---|---|
| 域名集合 | `domain` | `yaml` / `text` / `mrs` |
| IP 网段集合 | `ipcidr` | `yaml` / `text` / `mrs` |
| 混合的完整规则条件 | `classical` | `yaml` / `text` |

MRS 不支持 `classical`。文件扩展名只是线索，实际内容必须符合声明格式。也不要给每个规则集都使用同一个缓存路径。[官方规则集合文档](https://wiki.metacubex.one/config/rule-providers/)

### 9.4 “绕过大陆 IP”为何会影响自定义规则

YAML 的 `DIRECT` 是“连接进核心后由核心直连”；防火墙绕过是“连接可能提前跳过核心”。如果流量在防火墙层已经被放行，核心中优先级再高的代理规则也无从生效。

所以“某条代理规则明明写对了却没有命中”，不能只调整 YAML 顺序。先确认连接是否出现在面板，检查绕过区域、设备访问控制和真实 IP；必要时针对测试对象暂时关闭提前绕过做对照，再根据需求设计例外。该原则比把“绕过大陆”永久全部开启或关闭更可靠。[官方流量与防火墙说明](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/06-firewall-options-dnsmasq.md)

## 10. 保存自定义规则：优先使用界面和覆写模块

### 10.1 添加一条规则

近期版本常见入口是“覆写设置 → 规则设置 → 自定义规则”，启用后填写需要优先匹配的规则，保存并应用。不同版本也可能通过配置编辑器提供入口。七尺宇 2026 教程的 [2:32](https://www.youtube.com/watch?v=hkqUx8FLhCw&t=152s) 对应单条规则操作。

例如让一个域名直连：

```yaml
- DOMAIN-SUFFIX,example.com,DIRECT
```

若输入区域是 YAML 列表，要保留 `-`；若界面是分列填写的规则表，则分别选择规则类型、填写域名和策略。保存后打开运行配置，确认这条规则位于兜底规则之前；再创建一次新连接确认命中。已有长连接不会因为修改规则自动变成一次新的路由选择。

### 10.2 最新覆写模块的入口

官方近期界面在“运行状态”页顶部提供独立的“覆写模块”按钮，它与左侧/顶部菜单中的“覆写设置”不是同一个入口。推荐流程：

1. 打开运行状态页的“覆写模块”。
2. 点击 `+` 新建文件模块，起一个能说明用途的名称。
3. 先限定应用于当前配置；确认多个订阅具有相同策略组名称后，再考虑匹配全部配置。
4. 输入下面带段头的内容，启用模块、保存并重启 OpenClash。
5. 在运行配置、规则集状态和连接面板中检查结果。

此入口和格式依据[官方覆写模块手册](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/16-overwrite-module-format.md)；模块处理流程另对照了 [v0.47.156 启动脚本](https://github.com/vernesong/OpenClash/blob/v0.47.156/luci-app-openclash/root/etc/init.d/openclash)。老版本没有此入口时，使用该版本已有的自定义规则功能，或按正常升级流程更新插件。

### 10.3 完整的 YouTube 规则集模块

以下示例假设现有策略组确实叫 `Proxy`。如果叫“节点选择”，应把最后一行的 `Proxy` 改成准确组名。这个模块只补充规则集及路由规则，不包含节点。

```ini
[YAML]
rule-providers:
  guide-youtube:
    type: http
    behavior: domain
    format: mrs
    url: https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/youtube.mrs
    path: ./rule_provider/guide-youtube.mrs
    interval: 86400
+rules:
  - RULE-SET,guide-youtube,Proxy
```

保存文件见同目录 `YouTube规则覆写模块.conf`。本次确认该规则集 URL 可下载；未来的内容和分类由规则维护者更新。初次启动若路由器不能访问 GitHub，先解决下载路径或按官方文件规则集方式预置文件，不能把“文件没下载”误诊成“规则无效”。[规则数据仓库](https://github.com/MetaCubeX/meta-rules-dat)

四个格式细节需要牢记：

| 写法 | 效果 | 使用判断 |
|---|---|---|
| `[YAML]` | 声明后面是 YAML 覆写段 | 新模块不能只贴一段没有段头的 YAML |
| `+rules:` | 把规则插到现有规则前部 | 适合明确优先的例外，但会压过原有设备直连等规则 |
| `rules+:` | 把规则放到现有列表尾部 | 原列表已有 `MATCH` 时，新规则可能永远匹配不到 |
| `rules:` | 普通数组替换 | 可能覆盖整个原规则列表，不等同于追加 |

模块之间也有执行顺序。两个模块都写同一标量时可能后者覆盖前者；连续前插规则时，最终顺序也不能仅看模块名字猜。**以运行配置为准**。[官方操作符说明](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/16-overwrite-module-format.md)

### 10.4 什么时候需要脚本

静态增添规则集、调整 DNS 字段，优先使用 `[YAML]`。需要变更插件的接管模式等 UCI 设置，才考虑官方允许的 `[General]` 字段；只修改 YAML 的 `tun` 并不能代替插件防火墙配置。

旧教程中的自定义覆写脚本和新模块是不同机制。不要把 Shell/Ruby 命令贴进普通 YAML，也不要把需要插件提供 `$CONFIG_FILE` 等变量的片段直接当 SSH 命令执行。近期发布版对模块 `[Overwrite]` 命令还有过滤，不能把它理解为任意 Shell 脚本入口。[发布版实现](https://github.com/vernesong/OpenClash/blob/v0.47.156/luci-app-openclash/root/etc/init.d/openclash)

让 AI 帮写配置时，至少提供核心版本、原有策略组名称、目标配置和预期优先级，并要求输出修改范围。生成后检查它有没有重写全部 `rules`、删除原有 DNS、引用不存在的组、把敏感订阅交给陌生网站。七尺宇的 [2026 配套文章](https://www.qichiyu.com/920.html) 提供了类似自定义场景；本文使用可直接检查的声明式示例。

## 11. 一份容易维护的 provider 配置

同目录 `OpenClash-provider示例.yaml` 是本文编写的教学起点：一个订阅 provider、一个自动组、一个手动组，以及局域网直连、国内分类直连、其余代理的规则。它不是针对你家网络验证过的最终配置。

### 11.1 使用前必须完成的四件事

1. 把 `https://example.com/replace-with-your-mihomo-subscription` 替换成自己的 **Mihomo 可读取的节点订阅**。不要把登录页面、支付页面或只含分享链接的文本误填进去。
2. 确认订阅 URL、规则集 URL 和用于节点解析的 DNS，在启动阶段具有可达路径。初次没有缓存且下载必须依赖尚未获得的节点时，需要先用现有正常配置下载，或导入本地节点/规则文件。
3. 从“配置管理”上传并选择该 YAML，避免同时用“在线转换”重新生成另一份配置。
4. 在“覆写设置”检查 DNS、运行模式、端口、策略组转换是否覆盖 YAML。保留插件为透明接管所需的设置，核对生成的运行配置与设计一致。

### 11.2 核心结构

```yaml
proxy-providers:
  provider-main:
    type: http
    url: "https://example.com/replace-with-your-mihomo-subscription"
    path: ./proxy_provider/guide-main.yaml
    interval: 86400
    health-check:
      enable: true
      url: https://www.gstatic.com/generate_204
      interval: 600

proxy-groups:
  - name: Auto
    type: url-test
    use: [provider-main]
    url: https://www.gstatic.com/generate_204
    interval: 600
    tolerance: 50
  - name: Proxy
    type: select
    proxies: [Auto]
    use: [provider-main]
```

这是完整文件中的片段，不能单独代替全部配置。`use` 引用 provider，`proxies` 引用具体节点或组；二者不能混写为一个不存在的节点名。`tolerance` 是自动切换容差，不是带宽限速。健康检查的 URL 可用性会影响测得结果，别把探测站点异常直接当成所有节点失效。[代理集合](https://wiki.metacubex.one/config/proxy-providers/)、[自动选择组](https://wiki.metacubex.one/config/proxy-groups/url-test/)

### 11.3 此示例的取舍

示例采用 IPv4 起步和 Fake-IP，DNS 使用明确的节点解析入口，默认公网解析经 `Proxy`。国内分类使用 MetaCubeX 的 domain/IP 规则集。没有预置复杂广告、流媒体、游戏、AI 服务分类，也没有自动绕过大陆 IP 的防火墙配置。

这意味着：分类列表未包含的目标会进入代理兜底；某个国内域名如果规则未收录，仍可能走代理。应从连接记录补充明确例外，不能把国家分类当成保证准确的业务识别。

示例没有为你的局域网 DNS 域设置转发：`*.lan`、`home.arpa` 的 Fake-IP 过滤只保证不返回假地址，并不会自动知道 NAS 的真实地址。需要时添加指向实际局域网 DNS 的 `nameserver-policy`，并避免它又转发回 Mihomo。控制器和透明接管端口由 OpenClash 管理，本文没有硬写一个通用的公网监听方案。[DNS 解析流程](https://wiki.metacubex.one/config/dns/diagram/)、[全局配置](https://wiki.metacubex.one/config/general/)

## 12. 按设备和应用分流

### 12.1 指定一台设备直连或使用固定节点

先在 DHCP 中给设备固定地址，再添加源地址规则。假设设备是 `192.168.10.50`：

```yaml
- SRC-IP-CIDR,192.168.10.50/32,DIRECT
```

将它放在希望覆盖的其他规则前。固定出口则把 `DIRECT` 改成已存在的专用策略组，并在组内选择节点。组的用途应清楚，例如电视组、工作组；不要因为节点换了名称就让规则引用失效。

这种方式仍让流量进入核心；如果选择 OpenClash 的设备访问控制使它完全绕过核心，就要同步检查 DNS：**不能让一台绕过核心的设备继续获得只有该核心能解释的 Fake-IP。**新手可先采用源地址 `DIRECT`，确实需要完全绕过时，再一起调整网关、DNS 与访问控制。[访问控制与 DNS 设置](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/09-settings-dns-ac-ipv6.md)

源 IPv4 规则不涵盖该设备的所有 IPv6 地址。地址可能随隐私扩展变化，具体设备控制需结合 DHCP、MAC/接口、IPv6 前缀和实际插件能力设计。

### 12.2 NAS、BT/PT 与下载器

可以把专用于下载的设备设为直连，并让浏览器所在设备继续按规则代理。如果同一台 NAS 同时运行下载器和需要代理的服务，单纯按 NAS 的源 IP 直连会同时影响这些服务；这时考虑应用自己的代理设置、独立容器/网络出口或明确的目标规则。

OpenClash 运行在路由器上时，通常看不到另一台电脑/NAS 上的进程名称，因此不要照搬桌面客户端的 `PROCESS-NAME,qbittorrent,...` 来控制远端 NAS。路由器本机进程和容器又涉及网络命名空间，需实际验证。[规则类型说明](https://wiki.metacubex.one/config/rules/)

也不要按“高端口都是 BT”来大面积直连；网页、游戏和其他应用同样可能使用这些端口。BT 是否需要端口映射、运营商是否有公网地址，是代理分流之外的问题。七尺宇附加篇把这些问题纳入讨论，但不能把“BT 直连”理解为自动获得可入站连接能力。[附加篇](https://www.youtube.com/watch?v=5-eSqP-iNnc)

访问 NAS 出错时先分别测试：真实 LAN IP、局域网域名、远程域名。只有域名失败优先查 DNS；局域网地址也失败则继续查网段、路由、防火墙和服务端口。远程域名在家里解析到公网 IP 时，还要考虑内网 DNS 分流和 NAT 回环；mDNS/Bonjour 的设备发现也不能靠一条普通域名直连规则修复。

### 12.3 Google Play 下载卡住

按以下顺序做对照：

1. 用同一设备检查商店页面能否加载、下载是否开始，二者分开记录。
2. 在面板找到本次请求的域名、目标地址、匹配规则与节点，检查是否被国内规则提前直连。
3. 查看终端的安全 DNS/私人 DNS、IPv6 和实际出口，确认与预期一致。
4. 需要例外时分别处理路由规则与 Fake-IP 过滤，不把过滤列表当成代理列表。
5. 新连接复测后再决定保留哪个改动。

旧进阶教程提到的特定域名修复应当作为线索；服务端域名、分发策略和账号状态会变化，没有一个短列表可以保证解决所有商店下载问题。[2024 进阶篇](https://www.youtube.com/watch?v=NZdDmnwxcAo)

### 12.4 Steam、游戏和视频

商店登录、社区、游戏下载 CDN 和游戏对战是不同连接，需求未必一致。把所有 Steam 域名统一送往海外，可能连原本合适的下载 CDN 也改道。用面板区分下载流量和登录请求，只对需要的对象补规则。

视频缓冲应同时看丢包、节点负载、并发、实际吞吐和 UDP/QUIC；一次延迟最低不代表长时间播放最好。需要固定地区的应用使用地区明确、候选范围有限的组，减少跨地区切换。游戏还需确认透明接管和节点协议支持所需 UDP，不能只以网页测试成功验收。

“禁用 QUIC”是特定兼容场景的对照项。限制终端的 UDP/443 与封锁核心的所有 UDP/443 出站不是一回事；后者可能破坏 Hysteria2/TUIC 等节点连接。优先使用插件对应选项并检查作用范围，不照抄一条全局封锁规则。[官方流量选项](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/08-settings-mode-traffic.md)

## 13. IPv6：先决定谁接管，再决定开关

七尺宇分别发布了 [2024 年 7 月共存教程](https://www.youtube.com/watch?v=PvvJpcA_IXE) 和 [10 月完整教程](https://www.youtube.com/watch?v=PGiGd5eB1mY)。前者配套资料已提示不同固件、上级网络会影响结果；不能把某个主路由或旁路的截图用作所有网络的默认值。[配套文章](https://www.qichiyu.com/60.html)

### 13.1 四层状态分开看

| 层次 | 需要确认的事实 |
|---|---|
| 运营商/WAN | 是否获得 IPv6 地址和可下发的前缀 |
| LAN/终端 | 是否获得全局 IPv6，RA 给出的默认网关是谁 |
| DNS | 终端是否收到 AAAA 记录，来自哪个解析器 |
| 代理 | IPv6 连接是否进入核心、规则是否匹配、节点能否完成目标连接 |

`dns.ipv6: false` 的含义是核心不向相应 AAAA 查询提供正常 IPv6 结果；它不关闭系统 IPv6，不撤销终端已学到的默认路由，也不会阻止字面 IPv6 地址或缓存结果产生的连接。通过 IPv4 发起 DNS 查询同样可以收到 AAAA。[Mihomo DNS 配置](https://wiki.metacubex.one/config/dns/)

### 13.2 三种设计

| 设计 | 适用前提 | 验证重点 |
|---|---|---|
| 先只验证 IPv4 | 新安装或故障隔离阶段 | 测试终端临时不走 IPv6 后问题是否消失 |
| 原生 IPv6 保留，特定流量走 IPv4 代理 | 接受 IPv6 与 IPv4 使用不同路径 | 哪些目标会直连必须明确，不能声称全网已统一代理 |
| 双栈统一接管 | 固件、插件和内核的 IPv6 接管可用 | IPv6 规则、DNS、UDP、默认路由与回程都要验收 |

旁路网关尤其要注意：终端 IPv4 网关可以是旁路设备，但 IPv6 默认网关可能仍是主路由。不要只在 OpenClash 勾选 IPv6 就认为终端流量必然会经过它。先用一台测试设备验证设计，再调整全网 RA/DHCPv6。[官方 IPv6 选项](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/09-settings-dns-ac-ipv6.md)

### 13.3 只读检查

在 OpenWrt 上：

```sh
ip -6 addr show
ip -6 route show
ubus call network.interface.wan6 status
```

接口可能不叫 `wan6`，名称不符不表示 IPv6 一定故障。再在测试终端检查 IPv6 默认路由，并分别用 `curl -4`、`curl -6` 对同一允许测试的 HTTPS 站点发起请求。观察面板是否都出现对应连接、是否使用预期出口。只检查路由器自己的 IPv6 不能替代终端检查。

## 14. AdGuard Home、SmartDNS、MosDNS 如何配合

这些组件承担 DNS 解析、缓存、分流或过滤等不同任务。先写出每个监听地址与上游，确保查询链能走到公网解析器，并且不会形成环路。七尺宇 [2025 AdGuard Home 专题](https://www.youtube.com/watch?v=rHGAx7JekRg) 的说明明确包含 OpenClash 适用讨论；GUI 仍应按实际插件版本对应。

### 14.1 两类常见拓扑

```text
方案 A，先过滤再交给核心：
终端 → AdGuard Home → Mihomo DNS → 公网 DNS

方案 B，先交给核心再把部分真实查询送去过滤：
终端 → Mihomo DNS → AdGuard Home → 公网 DNS
```

| 问题 | 方案 A | 方案 B |
|---|---|---|
| 查询在 Fake-IP 返回前能否被 AGH 看见 | 入口确实经过 AGH 时可以 | 取决于核心是否向上游查询，不能假定每个请求都会经过 AGH |
| AGH 区分终端 | 终端直接查询时较容易；前面还有 dnsmasq 转发时常只见路由器来源 | 一般主要看到核心来源 |
| 与 OpenClash DNS 劫持关系 | 防止劫持把 AGH 直接旁路掉 | 劫持入口通常交给核心，再核对核心的上游 |
| 主要风险 | 缓存 Fake-IP、接管不一致、端口冲突 | 环路、遗漏过滤、客户端统计失真 |

### 14.2 实施顺序

1. 先把 OpenClash 单独用通，保存当时的配置。
2. 记录谁占用 TCP/UDP 53，谁监听 Mihomo DNS 端口，AGH 准备监听什么地址和端口。管理网页端口与 DNS 端口分开记录。
3. 在 AGH 界面设置上游；例如要把查询交给本机 Mihomo，就填写实际监听地址与端口，不能机械使用视频示例值。
4. 调整 dnsmasq 的 DNS 角色和 OpenClash 劫持方式，使它们对应选定拓扑。dnsmasq 仍可承担 DHCP，但其 DNS 端口与 AGH 不能占用同一监听地址和端口。
5. 单机查询后同时查看 AGH 查询日志与 OpenClash 连接/日志，再测试被拦截域名、正常国内域名、代理域名和本地域名。
6. 重启后重测，确认启动顺序或插件自动覆写没有把上游改回另一条链。

这些是设计和验收步骤，不是可以通用于所有固件的一组 UCI 修改命令。AGH 在 Docker 中时，`127.0.0.1` 指向哪个网络命名空间、映射了 TCP 还是 UDP、是否使用 host 网络，都应核实。复制视频中的磁盘挂载路径和容器端口前，先替换为自己实际的路径及空闲端口。[AGH 当前配置文档](https://adguard-dns.io/kb/adguard-home/configuration/)、[OpenClash DNS 接管说明](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/06-firewall-options-dnsmasq.md)

DNS 广告拦截只能处理经过该 DNS 链的域名请求，无法保证消除与内容共用域名的广告，也不能自动接管浏览器独立 DoH。一般无需为了“多一层更强”同时叠加多个解析器；每增加一层，都应能说清它解决的具体问题。

## 15. Smart 智能策略组

### 15.1 先确认使用的是支持 Smart 的核心

`type: smart` 来自 vernesong 维护的 Mihomo 分支。OpenClash 插件升级与切换 Smart 核心是两件事；如果日志出现不支持的策略组类型，先核对核心版本与分支，再检查配置。

Smart 根据连接情况持续调整选择；模型属于可选能力。不要把“必须先训练模型”作为启用门槛，也不要把自动选择理解为对所有应用都一定更快。[Smart 核心官方发布说明](https://github.com/vernesong/OpenClash/releases/tag/mihomo)

### 15.2 建议的试用步骤

1. 保存原核心、配置和重要手动选择，确认普通代理已能使用。
2. 按插件入口安装适配架构的 Smart 核心。
3. 先对一个测试策略组启用 Smart，保留手动组方便对照。
4. 查看实际运行配置的组类型、候选节点范围和转换结果；某些全局转换选项会把多个 `url-test`/`load-balance` 组一起改成 Smart。
5. 用自己的主要应用观察连接成功率、失败重试、吞吐和出口稳定性，再决定扩大使用范围。

对于要求稳定地区的账号，先限制候选地区或保留固定出口；Smart 的性能选择不能代替地区与账号需求。新版 GUI 操作可参考七尺宇 [2026 教程 11:25](https://www.youtube.com/watch?v=hkqUx8FLhCw&t=685s)。

### 15.3 对 2025 年教程的版本校正

七尺宇 [2025 Smart 教程](https://www.youtube.com/watch?v=ZPrIhaS8FX4) 及[配套文章](https://www.qichiyu.com/724.html) 包含当时的参数与模型训练流程。官方变更记录注明 **2025-11-12 已移除 Smart 的 `strategy` 参数**，因此不能再照搬旧 Smart 示例中的 `sticky-sessions` / `round-robin` 策略设置。这项变更针对 Smart，不能据此推断普通 `load-balance` 也不再支持自己的策略字段。[Smart 变更记录](https://github.com/vernesong/OpenClash/releases/tag/mihomo)

### 15.4 可选的模型训练

当前说明中的 `uselightgbm` 用于模型能力，`collectdata` 用于训练数据收集；不用模型仍可使用 Smart。需要训练时，按当前分支提供的训练工具和依赖版本，在独立环境中处理数据，再备份旧模型并上传新模型。官方常见路径为 `/etc/openclash/smart_weight_data.csv` 与 `/etc/openclash/Model.bin`，实际应以本机配置和日志为准。[模型与参数说明](https://github.com/vernesong/OpenClash/releases/tag/mihomo)

训练应放在电脑的独立虚拟环境，避免影响已有 Python 软件。例如：

```sh
python3 -m venv .venv-smart
. .venv-smart/bin/activate
```

之后才按当前训练工具说明安装匹配依赖和运行训练。不要为了清理环境，在正在使用的全局 Python 环境中执行“导出所有包再全部卸载”的命令。模型是否有效要通过加载日志与实际表现判断；失败时恢复原模型或先关闭模型能力，不必重装整个 OpenClash。

## 16. 自建节点、链式代理和订阅转换

### 16.1 添加自建节点

把节点参数放在主配置 `proxies` 中，或者使用自己的本地/远程 provider；再让某个策略组引用它。导入后先确认节点出现在面板，随后验证一次真实连接。只有节点存在但没有被组或规则选到时，业务不会自动使用它。

协议字段按当前 Mihomo 官方文档填写。服务器地址、端口、密码/UUID、TLS 的 SNI、Reality 公钥与 short-id 等不是可以从其他教程随意借用的值，必须与自己的服务端一致。不要用关闭证书校验来代替检查系统时间、证书、SNI 和服务端配置。[Mihomo 出站代理文档](https://wiki.metacubex.one/config/proxies/)、[七尺宇自建节点教程](https://www.youtube.com/watch?v=XsKxsvv_LtE)

### 16.2 链式代理：区分前置节点和最终出口

```text
家中核心 → 前置节点 → 落地节点 → 目标网站
```

`dialer-proxy` 写在**落地节点配置**上，值为用来连接它的前置节点/策略组名称；访问规则最终选择落地节点。不要把落地节点又放进其自身使用的前置组，形成循环。

下列片段演示连接关系，假设现有 `Proxy` 组已经包含可用前置节点。地址和密码都是占位内容，不能直接联网：

```yaml
proxies:
  - name: Landing-SS
    type: ss
    server: landing.example.com
    port: 8388
    cipher: chacha20-ietf-poly1305
    password: "REPLACE_WITH_YOUR_PASSWORD"
    dialer-proxy: Proxy
```

再让目标业务规则选择 `Landing-SS` 或包含它的专用组。目标网站看到的出口通常是落地节点，但前置质量、落地带宽和两段兼容性都会影响体验。UDP 需求必须逐段验证；不要认为所有节点协议都能任意嵌套。链式连接也不会自动改变订阅下载与 DNS 的路径。[官方 dialer-proxy 文档](https://wiki.metacubex.one/config/proxies/dialer-proxy/)

老示例使用的 `type: relay` 策略组已被当前官方文档标记为废弃，新配置优先按照 `dialer-proxy` 迁移说明编写。七尺宇的[链式代理专题](https://www.youtube.com/watch?v=3oiA2Ym1Wu4)适合理解用途，当前字段以官方文档为准。[relay 状态](https://wiki.metacubex.one/config/proxy-groups/relay/)

### 16.3 订阅失败：拆开六个环节

七尺宇 [2024 订阅排障文章](https://www.qichiyu.com/121.html) 从网络、订阅、转换后端、模板、依赖/设置与核心等角度分类，这个方法仍有价值。今天可按下表检查：

| 环节 | 典型表现 | 下一步 |
|---|---|---|
| 网络与 DNS | 域名无法解析、连接超时 | 在路由器上检查解析与 HTTPS，而不只在电脑浏览器测试 |
| 订阅服务 | 401/403、空内容、订阅过期 | 核对地址、有效期、UA 和服务端返回；遮盖 token |
| 在线转换后端 | 原链接可用、转换失败 | 确认后端能取源订阅、输出格式与协议支持 |
| 转换模板 | 节点存在但缺组、规则报错 | 检查模板引用、名称、规则集下载和 YAML 结构 |
| 本机依赖/存储 | 下载后生成失败或保存失败 | 查看 Ruby/YAML、空间、权限、证书与日志 |
| 核心协议支持 | unsupported、字段解析错误 | 对照实际核心版本；转换器能力与核心能力分开判断 |

“某个旧转换后端不能处理 Hysteria2/VLESS”不等于“OpenClash/Mihomo 不能使用这些节点”。直接提供受支持的 YAML/provider 可以避开转换限制；也可能需要更新相应转换工具。[代理集合文档](https://wiki.metacubex.one/config/proxy-providers/)

### 16.4 Sub-Store 与远程配置

需要跨设备管理多个订阅、清理节点名称或转换输出时，可使用可信的 Sub-Store 实例。七尺宇有[专门教程](https://www.youtube.com/watch?v=nEw1iadtPvs)。它是订阅管理环节，不取代路由器的 DNS、透明接管和运行配置验证。

远程 YAML、转换模板、覆写模块和订阅链接具有不同权限和敏感度。避免把带 token 的订阅、节点密码或可执行覆写内容放进公开仓库。公共模板只能作为结构参考；尤其不要用作者整份 `/etc/config/openclash` 覆盖自己的设置，它可能固定了核心架构、面板凭据、转换地址及网络选项。[作者简化配置文章](https://www.qichiyu.com/264.html)、[作者配置仓库](https://github.com/qichiyuhub/rule)

## 17. 控制面板、域名嗅探与远程管理

### 17.1 面板怎样用来验收

从运行状态进入控制面板，先确认它连接的是当前路由器的核心。重点看三处：策略组中的当前选择、连接列表中的规则/出口链、日志中的请求错误。

“面板消失”先检查新版入口和面板资源，不要立即重装核心；“面板能打开但显示未连接”再检查控制器地址、端口、密钥、浏览器访问方式和核心状态。浏览器里的 `127.0.0.1` 指向浏览器所在设备，不能用它代替远端路由器地址。七尺宇最新教程 [0:19](https://www.youtube.com/watch?v=hkqUx8FLhCw&t=19s) 对应面板切换。

### 17.2 域名嗅探怎么用

嗅探可从支持的 HTTP、TLS、QUIC 等连接信息补充域名线索，帮助分流；并不是解密所有 HTTPS 内容。启用后如果某个应用异常，结合域名映射和连接日志做单应用对照，必要时使用针对性的跳过范围。不能用嗅探代替正确的 DNS 链和设备路由。[Mihomo 嗅探文档](https://wiki.metacubex.one/config/sniff/)

### 17.3 从外网访问

远程管理优先通过已有的私有 VPN 或 SSH 隧道进入家庭网络，再访问局域网面板。使用独立的强控制器密钥，替换公共模板的默认凭据，并核对“仅允许内网访问”等设置与实际防火墙范围。

监听 `0.0.0.0` 表示监听所有 IPv4 接口，并不等于已经向公网开放；是否外部可达还由防火墙与映射决定。反过来，有密钥也不意味着可以随意暴露管理接口。开启 IPv6 后也需检查对应入站规则，不只看 IPv4 端口转发。[控制器设置](https://wiki.metacubex.one/config/general/)、[OpenClash 流量设置](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/08-settings-mode-traffic.md)

## 18. 故障排查：从现象到证据

### 18.1 先确定失败层次

```text
终端能否到达网关？
  ├─ 否：检查地址、Wi-Fi/网线、VLAN、网关与本地路由
  └─ 是：正常上游连接是否可达？
           ├─ 否：检查 WAN、默认路由、拨号与上级网络
           └─ 是：普通域名能否解析？
                    ├─ 否：检查 DNS 监听、上游与回环
                    └─ 是：核心是否运行，连接是否进入面板？
                             ├─ 核心未运行：查启动日志/配置/依赖
                             ├─ 面板无连接：查接管、网关、IPv6、访问控制
                             └─ 有连接：查规则、出口、节点和应用层错误
```

一个 `ping` 失败不足以证明断网，因为目标或路径可能限制 ICMP。DNS 成功、TCP 建连成功、HTTPS 返回响应、应用完成操作，是不同层次的证据。[官方诊断手册](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/14-diagnostics.md)

### 18.2 常见现象对照表

| 现象 | 优先检查 | 避免误判 |
|---|---|---|
| 插件运行但所有节点超时 | 核心日志、节点 DNS、时间、出站连通、协议参数 | 全红可能是统一测试 URL 或 DNS 失败 |
| 国内正常，代理目标失败 | 规则是否进组、组是否选到可用节点、节点实际可达 | 不必先重装整个固件 |
| 只有某台设备失败 | 默认网关、DNS、安全 DNS、IPv6、访问控制 | 路由器自己能访问不代表终端路径正确 |
| 改规则没有效果 | 运行配置、排序、组名、旧连接、提前绕过 | 原始 YAML 写对不代表最终生效 |
| 更新订阅后恢复原样 | 修改是否落在原始文件，是否有持久覆写 | 改运行文件不是长期维护方案 |
| 一开代理全家断网 | DNS 监听/回环、配置错误、接管冲突 | 不急于同时更换模式、DNS 与内核 |
| 停用 OpenClash 后域名全失败 | dnsmasq 上游是否残留未监听的核心端口 | 公网 IP 可达时先查本地 DNS 链 |
| 面板可打开，核心未连接 | API 地址、端口、密钥、核心状态 | 面板网页资源与核心服务分开验证 |
| DNS 返回 198.18.x.x | 是否正在使用 Fake-IP、连接是否回核心 | 不要写入 hosts 或直接判为污染 |
| TUN 创建失败 | `/dev/net/tun`、内核模块、固件依赖 | 不跨内核强装 kmod |
| Hysteria2/TUIC 失败 | UDP 路径、协议参数、TLS、日志 | 不用 TCP 端口通断代替 UDP 验证 |
| 代理速度低 | 实际下载、CPU、内存、丢包、MTU/路径、节点负载 | 延迟不是吞吐，硬件 NAT 不能代表代理性能 |
| 规则集下载失败 | URL、DNS、证书、启动依赖、缓存路径 | 不能只反复删除缓存和重启 |
| 内网域名失败而 IP 可用 | 本地 DNS 分流、Fake-IP 过滤、重绑定保护例外 | 不全局关闭 DNS 保护来迁就单个域名 |

表格是排查优先级，不是对尚未提供的日志作故障定论。[官方错误分类](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/03-errors.md)、[日志说明](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/13-logs.md)

### 18.3 一组只读命令

在路由器 SSH 中逐段运行，按结果决定是否继续：

```sh
# 系统、服务、时间和资源
date
ubus call system board
/etc/init.d/openclash status
pgrep -af clash
df -h /overlay /tmp
free -m

# DNS 与控制端口监听；没有 ss 时使用 netstat
ss -lntup
# netstat -lntup

# 本地 DNS 与指定公共 DNS 对照
nslookup www.baidu.com 127.0.0.1
nslookup www.baidu.com 223.5.5.5

# dnsmasq 实际配置，仅查看，暂不修改
uci -q show dhcp.@dnsmasq[0]

# 服务日志
logread -e openclash
tail -n 100 /tmp/openclash.log
```

`pgrep`、`ss` 等在某些固件未安装时，可用界面或已有 `ps`/`netstat` 代替。日志路径也可能因设置变化；优先看 OpenClash“运行日志”。向他人提供结果前，遮盖订阅、节点认证、控制器密钥和个人域名，保留版本、时间、错误行与测试顺序。

检查 nftables 接管时可在 firewall4 设备上只读执行：

```sh
nft list ruleset
ip rule show
ip route show table all
```

输出中查找 OpenClash 链和测试流量相关条件；不要为了“恢复默认”清空整个防火墙。旧 iptables 系统按对应工具检查，不同时套用两套规则命令。[官方防火墙链说明](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/04-firewall-chains.md)

### 18.4 停用后 DNS 不恢复的条件式处理

只有当证据同时满足以下条件，才优先怀疑残留转发：核心已停止；它原来的 DNS 端口无人监听；本机 DNS 查询失败；指定正常上游的查询成功；dnsmasq 仍把查询送往该未监听端口。

此时先备份当前 DHCP/DNS 设置，检查插件正常停止时的 DNS 还原选项，或在 LuCI“网络 → DHCP/DNS”的上游设置中**只处理已经确认失效的条目**，恢复此前可用的上游，再重载对应服务并复测。若原来有 AGH、本地域名或企业 DNS，应保留这些分流；不要盲删整个 `server` 列表，也不要把教程公共 DNS 直接当作所有网络的永久配置。[OpenClash dnsmasq 管理说明](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/06-firewall-options-dnsmasq.md)

### 18.5 配置检查的边界

先使用插件提供的配置检查。需要 SSH 时，以下是常见核心检查方式，必须把文件名替换成实际文件：

```sh
/etc/openclash/core/clash_meta -t -d /etc/openclash -f /etc/openclash/实际文件名.yaml
```

这不会按普通方式启动代理，但可能读取或初始化 provider/规则缓存，不能把它当成完全不触碰文件的纯文本检查。YAML 语法通过也不代表订阅有效、节点可连或终端已被接管；最后仍要做应用测试。

## 19. 升级、回退和日常维护

### 19.1 分开更新四类内容

| 对象 | 更新目的 | 更新后检查 |
|---|---|---|
| OpenClash 插件 | 界面、配置管理、防火墙适配等 | 启停、DNS 恢复、运行配置和面板 |
| Mihomo/Smart 核心 | 协议、路由和性能修复 | 类型支持、节点连接、UDP、配置兼容 |
| 订阅节点 | 服务商地址、认证及节点变化 | provider 数量、过滤后候选、组引用 |
| 规则/GEO/模型/面板资源 | 分类数据和附属功能 | 下载是否完成、路径/格式是否匹配 |

每次升级前看发布说明并保存备份，尽量分批更新，留出定位故障的空间。不要一边更新核心、一边替换 DNS 链和所有规则，最后无法知道是哪项变化引起问题。[OpenClash Releases](https://github.com/vernesong/OpenClash/releases)

### 19.2 可执行的回退计划

先记下最后一次可用的插件和核心版本，保存原配置、覆写模块、规则和必要模型。配置改坏时先禁用最近新增的模块或恢复上一份配置；核心升级引入兼容故障时再回退核心；只有证据指向插件层才考虑插件回退。

回退之后至少检查：配置能加载、国内访问、代理访问、LAN 访问、DNS 正常停止恢复。备份中的旧密钥和旧订阅是否仍有效，也需确认。不要把“重装成功”当成“故障已解决”。

### 19.3 性能和维护建议

节点和规则更新频率按服务需求设置，健康检查无需毫秒级或高频轰炸全部节点。规则/GEO/训练数据都会占用存储与内存，低闪存设备尤其要关注实际空间；移到 `/tmp` 可以减少持久写入，但会引入重启后重新下载的依赖。

TCP 并发、TUN 栈、嗅探和 Smart 应按症状逐项评估，不作为新手必须全开的清单。启用一项优化后用相同终端、站点和时段做对照，记录吞吐、CPU 与错误。无须定期清空所有缓存；发生明确映射或缓存异常时，再使用相应清理入口。[官方 GEO 与资源设置](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/10-settings-geo-misc-src.md)

## 20. 怎样理解这套视频的演进

以下是对可核实资料的综合判断，不是作者逐字观点：

| 阶段 | 资料重心 | 今天仍值得保留的思路 | 需要重新核验的部分 |
|---|---|---|---|
| 2024 基础/进阶系列 | 安装、模式、DNS、订阅转换、规则模板 | 先理解网络，再用模板保存需求 | 旧核心选择、菜单位置、转换器兼容范围 |
| 2024 附加与排障 | DNS、AGH、BT、IPv6、远程访问 | 按业务现象拆出独立链路 | 特定域名列表、Docker 路径、主/旁路网络值 |
| 2024 下半年至 2025 YAML 系列 | 自有配置、provider、规则集、跨客户端复用 | 节点更新与个人规则分开维护 | 不同客户端对同一 YAML 的覆写与接管方式 |
| 2025 Smart 与新版界面 | 自动选路、自建节点、插件升级 | 保留手动对照，检查运行配置 | Smart 分支字段、模型依赖与 GUI 名称 |
| 2026 最新教程 | 菜单调整、单条规则、覆写模块、Smart GUI | 用持久覆写表达个人例外 | 模块格式、应用范围和最终规则顺序 |

对新手，最值得学的是“配置为什么能生效、怎样验证”；对长期维护者，最值得学的是“订阅变化时个人需求怎样保留”。因此本文既保留旧教程的概念框架，也把新界面和已变更字段单独注明，而不提供一份来自多个时代的混合参数大全。[频道资料入口](https://www.youtube.com/@qichiyu/videos)

推荐观看顺序：

1. [基础篇](https://www.youtube.com/watch?v=7wiu1YA8Pbc)：先补齐组网、安装与核心知识。
2. [2026 新版](https://www.youtube.com/watch?v=hkqUx8FLhCw)：熟悉今天的入口和规则持久化方式。
3. [2025 自有 YAML](https://www.youtube.com/watch?v=eUqf3lOhFSw)：理解 provider 与主配置的分工。
4. [分流规则专题](https://www.youtube.com/watch?v=_iG8vl3pzaM)：解决规则格式、顺序和匹配问题。
5. 按需补 [IPv6](https://www.youtube.com/watch?v=PGiGd5eB1mY)、[AGH](https://www.youtube.com/watch?v=rHGAx7JekRg)、[Smart](https://www.youtube.com/watch?v=ZPrIhaS8FX4) 与[链式代理](https://www.youtube.com/watch?v=3oiA2Ym1Wu4)。

## 21. 完成标准：一次安装至少验收这些项目

- [ ] 核心能启动，运行日志没有持续报错。
- [ ] 订阅/provider 和规则集已实际加载，策略组存在可用候选。
- [ ] 一台测试终端的网关、DNS 和 IPv6 路径明确。
- [ ] 国内常用站点按预期直连，代理目标按预期走所选节点。
- [ ] 控制面板能看到新连接、命中规则与实际出口链。
- [ ] NAS/LAN 服务可通过应有的 IP 和域名访问。
- [ ] 使用的 UDP 应用、游戏下载或商店下载已分别测试。
- [ ] 更新订阅后，自定义规则仍存在并能命中。
- [ ] 重启路由器后仍能正常运行；停止 OpenClash 后普通上网和 DNS 可恢复。
- [ ] 配置、核心版本与回退文件已保存到路由器之外。

达到这些结果，才能把状态记为“当前网络与应用验证通过”。本文附带示例仅完成本地结构检查与公开规则资源校验，未使用你的订阅或路由器做端到端验证。

## 附：文件和资料使用说明

同目录另有《视频与来源索引》，列出本次公开可见的 45 个视频，区分核心、相关专题和范围筛查，并给出教程用途和部分原说明中可验证的时间定位。两个配置示例均不含真实订阅或节点密码，填写和启用前阅读第 10、11 节。

官方资料优先级：已安装版本的实际界面/代码与发布说明 → 对应核心官方文档 → OpenClash 当前开发分支手册 → 作者当时的教程。版本出现冲突时，保留教程的解释价值，用当前实现决定能否照着操作。本文标注的链接与版本是 2026-09-05 的核验快照，之后升级应重新核对变更记录。


# fq-book 实用整编

以 hoochanlon《这本书能让你连接互联网》为线索，按 OpenClash 使用场景重组。整理日期：2026-11-02；来源版本：345bc276f60a24a34c90042c19d28c0fc01e87e2。整编与补充内容采用 CC BY-NC 4.0；保留原作者及转载文章各自的权利，不构成官方推荐。

## 22. 从一次网页请求理解代理、VPN 与透明接管

### 22.1 先画出自己的流量路径

一个能复现问题的拓扑比“已经开了代理”更有用。记录四个位置：应用运行在哪台设备、DNS 发给谁、谁决定出口、最终由哪个节点连接网站。

```text
应用 → 本机/浏览器解析 → 网关接管 → Mihomo 规则与策略组 → 出口 → 网站
显式代理：应用 → HTTP / SOCKS 监听端口 → 规则与出口
```

这两条路径不一定同时经过。应用自带的安全 DNS、单独的代理设置、虚拟机网卡、IPv6 路由都可能改变实际路径。用第 17 章的连接面板观察目标域名、命中规则和出口，不能只看系统代理开关。

### 22.2 几个名词放在同一张表里

| 名词 | 解决的问题 | 在本手册中的位置 |
|---|---|---|
| HTTP CONNECT / SOCKS | 应用怎样把连接交给代理 | 第 24、26 章，注意监听端口和 DNS 所在端 |
| Shadowsocks / VMess / VLESS / Trojan 等 | 客户端与节点之间使用什么协议 | 第 25 章，参数必须匹配服务端 |
| VPN / TUN | 将哪些 IP 流量送入虚拟网络接口 | 第 7 章；进入接口后的规则仍决定出口 |
| 正向代理 | 代表客户端访问其他服务器 | 日常的代理上网 |
| 反向代理 | 代表网站接收访问并转给后端 | 网站部署，与选择客户端节点是不同配置 |
| 透明代理 | 应用无需逐个填写代理地址，由网关接管 | OpenClash 常见用途；接管范围由实际模式决定 |

“全局模式”通常指进入核心后的出口规则，并不能证明所有应用流量都进入核心。终端、游戏、容器与 IPv6 要分别验收。

### 22.3 先做最小验证

1. 保留一个普通直连站点和一个需要代理的测试目标。
2. 只启用一种接管方式，在面板中找到对应连接。
3. 对照请求时间、域名、规则和出口，记录结果。
4. 再逐一加入 DNS 组件、浏览器扩展或第二层代理；每次只改一处。

来源：[原书代理分类](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/abc/proxy-s-x.md)、[互联协议](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/abc/connection.md)。原书中转载文章的署名见各链接；本章为重新组织的实用说明。

## 23. DNS、Hosts 与加密解析的实际边界

### 23.1 把“解析失败”和“连接失败”分开

DNS 把域名解析成记录，Hosts 是本机或核心中的静态映射。正确解析不保证目标 IP、端口、TLS 或网站账号可用；修改 Hosts 也不能让任意地址提供目标网站的服务。

Fake-IP 返回的合成地址用于核心内部映射。在启用 Fake-IP 的客户端上看到这一地址，不等同于 DNS 污染。先确认查询是否进入了预期的核心，参照第 8 章分析解析链。

### 23.2 加密 DNS 保护哪一段

DoH、DoT、DNSCrypt 保护客户端到所选解析器的查询传输，不能替代 HTTPS 的证书验证，也不自动隐藏出口 IP。解析器本身仍需可信，连接它的路径也必须可用。

| 现象 | 先核对 | 处理方向 |
|---|---|---|
| 只有一台电脑解析异常 | 系统 Hosts、DNS 缓存、浏览器安全 DNS | 与另一台设备做同目标对照 |
| 全部设备同时异常 | 网关 DNS、上游连通性、回环 | 检查第 8、14 章的转发方向 |
| 修改 DNS 后仍连不上 | TCP、TLS、节点、目标服务 | 转到第 28 章 |
| 本地与代理解析结果不同 | 使用 `socks5` 还是 `socks5h` | 核对解析发生在本机还是代理侧 |

### 23.3 用可解释的查询取证

```sh
# 客户端查询自己的默认解析器
nslookup example.com
# 192.168.1.1 只是示例，替换成实际网关 DNS
nslookup example.com 192.168.1.1
```

保留查询服务器、返回记录、时间和所用设备。不同 CDN 或不同时间得到不同地址，并不能单独证明污染。修改 Hosts 前备份原文件；试验结束恢复本次新增项。更改 DNS 不会直接替换服务器证书，遇到证书异常应检查目标地址、时间与证书链。

来源：[DNS](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/dns%26hosts/dns.md)、[DNSCrypt](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/dns%26hosts/dnscrypt.md)、[Hosts](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/dns%26hosts/hosts.md)、[Mihomo DNS 官方说明](https://wiki.metacubex.one/config/dns/)。本章纠正了将 DNS 错误与根证书直接等同的表述。

## 24. 让终端、Git 和下载器使用正确的代理

### 24.1 先找到监听地址

查看 OpenClash 当前运行配置的 HTTP、SOCKS 或 mixed 端口。`127.0.0.1` 指运行命令的这台电脑；代理在路由器上时，应使用路由器的局域网地址，并确认允许 LAN 访问且防火墙只放行所需内网设备。

下面用 `127.0.0.1:7890` 表示本机 mixed 端口，只是示例，并非 OpenClash 的固定默认端口。请按实际地址替换。

### 24.2 先对单个请求设置代理

```sh
# 明确使用 HTTP 代理，清空本次请求的 no_proxy 排除规则
curl --noproxy '' --proxy http://127.0.0.1:7890 --connect-timeout 10 -I https://example.com
# SOCKS5 代理负责解析域名
curl --noproxy '' --proxy socks5h://127.0.0.1:7890 --connect-timeout 10 -I https://example.com
# 对照：不使用 curl 的显式代理（仍可能经过网关透明接管）
curl --noproxy '*' --connect-timeout 10 -I https://example.com
```

`curl` 的 `socks5h` 由代理端解析域名，`socks5` 通常在本机解析。HTTP 状态码只说明收到的响应；403、429 不代表代理端口失效。部分站点不支持 HEAD 请求，可去掉 `-I` 并使用 `-o /dev/null`。

### 24.3 Git 优先使用单次设置

```sh
# 仅对这一条 HTTPS Git 命令生效，不修改全局配置
git -c http.proxy=http://127.0.0.1:7890 ls-remote https://github.com/hoochanlon/fq-book.git HEAD
# 查看已有设置的来源；输出若含账号或密钥，不要直接分享
git config --show-origin --get-regexp '.*proxy.*'
```

HTTPS Git 与 SSH Git 是两条配置路径；`http.proxy` 不会自动配置 `git@github.com:...`。需要终端环境变量时，可用子 shell 限定作用域，关闭后不影响其他终端：

```sh
(
  export http_proxy=http://127.0.0.1:7890
  export https_proxy=http://127.0.0.1:7890
  export no_proxy=localhost,127.0.0.1,::1
  curl --connect-timeout 10 -I https://example.com
)
```

上述语法适用于 sh/bash/zsh；PowerShell 使用不同的环境变量语法，Windows 也可直接使用 `curl.exe --proxy ...` 测试。下载器需检查自己的代理类型、端口与证书库，浏览器正常不能证明下载器使用了同一路径。

来源：[原书终端与 Git 代理说明](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/README.md)、[curl 手册](https://curl.se/docs/manpage.html)、[Mihomo 代理端口](https://wiki.metacubex.one/config/inbound/port/)。本章改用可撤销的单次命令，并修正原书 `unset ALL_PROXY` 示例的多余引号。

## 25. 协议、节点链接和订阅兼容性

### 25.1 按层核对，而不是只看软件名称

原书介绍 SS/SSR、V2Ray、VPN 和若干独立工具。软件项目名、节点协议名、链接格式、传输层参数、TLS 参数和配置文件格式不是同一个概念。一个客户端支持某协议，也不代表支持所有插件、加密方式或新参数。

导入失败时依次检查：

1. 订阅是否成功返回，是否实际上返回了登录页或报错 HTML。
2. 返回的是完整配置、仅节点的 provider，还是 URI 列表。
3. 当前核心是否支持该节点的协议、加密方式与传输类型。
4. 服务端地址、端口、凭据、TLS/SNI、路径等参数是否完整且一致。
5. 引用节点的策略组是否存在，是否真的选中了它。

### 25.2 不要手工猜解链接

`ss://`、`ssr://`、`vmess://` 等链接具有不同的字段与编码约定，不宜拿同一份 Base64 规则解释所有格式。优先通过可信客户端导入后核对生成的配置。链接、二维码、provider 地址经常携带凭据，提交到 GitHub 时必须使用占位符。

### 25.3 转换后还要验证

订阅转换改变配置的表示，不会修复不可达的节点，也不能补出缺失的服务端参数。确认转换服务的可信度和更新策略。第一次导入先挑一个节点，测试 DNS、网页与实际应用，再合并多订阅。

| 原书主题 | 本手册的承接位置 |
|---|---|
| SS/SSR、V2Ray 使用 | 第 6、16、25 章 |
| 二级代理、前置代理 | 第 16 章的链路顺序与最终出口 |
| VPN 与 WireGuard | 理解网络隧道；按实际核心与服务端文档配置 |
| 订阅链接解析 | 本章检查输入格式，避免公开凭据 |

来源：[SS/SSR](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/proxy/ss-ssr.md)、[V2Ray](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/proxy/v2ray.md)、[链接解析](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/append/srvurl.md)、[Mihomo 出站配置](https://wiki.metacubex.one/config/proxies/)。旧客户端截图只作原书记录，具体兼容性以当前核心文档为准。

## 26. SSH 隧道与应用级代理的最小实践

### 26.1 在自己的 SSH 服务器上建立本机 SOCKS 入口

前提：你拥有可访问的 SSH 服务器和有效账号，并按自己的服务器记录核对主机指纹。下面的 `user@server.example` 是占位符。

```sh
ssh -N -D 127.0.0.1:1080 -o ExitOnForwardFailure=yes user@server.example
```

`-N` 不执行远程命令，`-D` 建立本地动态转发。让命令保持运行，另开终端验证：

```sh
curl --noproxy '' --proxy socks5h://127.0.0.1:1080 --connect-timeout 10 -I https://example.com
```

测试结束在 SSH 终端按 Ctrl+C，即关闭这个隧道。它适合对照 TCP 应用连接，并不是系统级 VPN，也不应假定它能接管 UDP 游戏流量。

### 26.2 原书的 Privoxy、Proxifier 如何对应现在的场景

应用支持 SOCKS 时可直接配置 SOCKS 入口。只支持 HTTP 代理时，需要 HTTP 入口或适当的转换工具；Mihomo 的 mixed 端口可以同时接收 HTTP 与 SOCKS 请求，先确认是否已满足需求。

Proxifier 一类工具作用于指定应用，OpenClash 常在网关接管。同时使用时需画清转发路径，避免把代理程序自身的连接再次送回自己。转换工具不自动提供远端加密，也不改变最终服务端的可信度。

### 26.3 失败时先检查三处

- `Address already in use`：本地端口已被占用，换一个未使用端口并同步调整应用。
- `Permission denied`：SSH 账号或认证未通过，尚未进入代理测试阶段。
- SSH 成功但网页失败：检查服务端转发权限、服务端 DNS 与目标站点连通性。

来源：[原书 SSH-Tunnel](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/proxy/SSH-Tunnel.md)、[Privoxy](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/proxy/privoxy.md)、[OpenSSH 手册](https://man.openbsd.org/ssh)。新版用自有服务器与回环监听替代原书的第三方免费账号流程。

## 27. NAT、游戏、虚拟机与局域网

### 27.1 NAT 问题不等于节点问题

网页主要是出站连接；联机、P2P 与远程访问可能还需要入站可达性。光猫、主路由、二级路由以及运营商网络都可能增加地址转换层。更换代理节点不一定能改变家庭公网入口条件。

不同游戏主机显示的 NAT Type 与网络工具使用的 NAT 分类不是统一编号，不能直接把 Type 1/2/3 与 Full Cone、Restricted、Symmetric 一一等同。

### 27.2 先把拓扑简化到可以验证

记录 WAN 地址、上级设备及游戏使用的 TCP/UDP。先对比直连与代理，再判断是否需要特定流量直连。若需要端口映射，仅开放目标应用需要的端口；确认上级 NAT 与运营商是否允许入站。UPnP、DMZ 或关闭防火墙不是通用修复步骤。

遇到语音可用而联机失败、网页正常但游戏不通，要检查节点是否支持所需 UDP，以及 OpenClash 的接管范围。延迟数字不能代表丢包、抖动与实际联机表现。

### 27.3 虚拟机的三种模式

| 模式 | 一般用途 | 代理排查重点 |
|---|---|---|
| 桥接 | 虚拟机作为局域网中的独立设备 | DHCP、网关、独立源地址规则、交换机限制 |
| NAT | 虚拟机通过宿主机的虚拟网络出站 | 虚拟网关、额外 NAT 层、宿主机代理是否真正接管 |
| Host-only | 宿主机与虚拟机的隔离测试网络 | 默认没有外网出口；另设路由后才可能出网 |

虚拟机中的 `127.0.0.1` 指虚拟机自身，不是宿主机。访问宿主机代理时，应使用可达的宿主机地址，并限制监听与放行范围。主机的物理出网链路断开时，NAT 虚拟机也不会凭空拥有互联网连接。

来源：[原书 NAT](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/abc/4nat.md)（原文署名 iSkyun）、[VMware 三种模式](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/abc/3vm.md)（原文署名孙鹏）、[宿主机与 VM 代理](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/append/vm.md)。本章重写了分类与排查方法，没有沿用原书关闭防火墙的建议。

## 28. TLS、RST、403：把失败定位到具体层

### 28.1 错误信息只是起点

| 现象 | 说明什么 | 下一步证据 |
|---|---|---|
| Could not resolve host | 解析尚未成功 | 检查 DNS 路径、Hosts 与代理侧解析 |
| Connection refused | 某个连接端点拒绝连接 | 地址、监听端口、服务状态 |
| Timeout | 在等待阶段超时 | 区分 DNS、连接、TLS、响应阶段 |
| TLS / SSL_ERROR_SYSCALL / RST | 握手或传输被中断 | 对比客户端、出口、TLS 库、目标与时间 |
| 403 / 429 | 某个 HTTP 服务返回拒绝或限流 | 响应来源、账号状态、服务端规则 |
| 证书不受信任 | 证书链或校验条件不满足 | 系统时间、域名、CA、HTTPS 检查软件 |

不要仅凭一个错误就认定 Hosts、网络封锁或节点是唯一原因。RST 也可能由服务端或中间设备产生。

### 28.2 使用同一目标做对照

```sh
# 将地址换成实际代理，保留 TLS 验证
curl --noproxy '' --proxy http://127.0.0.1:7890 --connect-timeout 10 --max-time 30 -v -o /dev/null https://example.com
```

依次更换一个变量：显式代理与不显式代理、节点 A 与节点 B、浏览器与 curl、设备 A 与设备 B。记录哪个阶段首次出现差异。`-v` 输出可能带认证头、Cookie 或完整查询参数，分享前删去这些信息。

### 28.3 证书错误的检查顺序

1. 检查设备时间与访问域名是否正确。
2. 检查证书颁发者、域名匹配和信任链，确认是否经过企业网关或 HTTPS 检查软件。
3. 核对 Hosts 与 DNS 是否把目标导向了错误服务器。
4. 对比同一节点上的不同客户端，排查过旧的 TLS 库或独立证书库。

不要以关闭证书校验、导入来历不明的根证书作为日常解决办法。DNS 提供的是解析记录，服务器证书由 TLS 对端出示。更换 DNS 有时能修复错误目标地址，但并不是通用的“更新根证书”操作。

来源：[原书 RST 与 SSL_ERR_SYSCALL](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/a123/rst-syscall.md)、[数字证书](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/abc/dc_zhenshu.md)、[curl TLS 校验说明](https://curl.se/docs/sslcerts.html)。本章保留原书“从 ping 转向应用层取证”的思路，并扩大了故障原因范围。

## 29. 浏览器、隐私与出口 IP 的使用习惯

### 29.1 无痕窗口、代理和账号各管一件事

无痕窗口主要改变本地会话记录的保存方式；代理改变网络连接路径；账号登录、Cookie、浏览器指纹与网站行为仍可能关联访问。更换出口 IP 不等于获得匿名身份，也不保证网站账号与地区规则允许访问。

### 29.2 浏览器正常而其他应用异常

浏览器可能使用安全 DNS、单独的扩展代理或不同 TLS 实现。检查扩展设置、应用自己的代理和系统设置，关闭本次添加的额外层做对照。网页代理只处理其页面内的访问，不能据此推断系统其他程序已被接管。

处理表单、账号与密码时优先使用目标网站的 HTTPS 连接；不要把订阅、Cookie 或账号会话贴进不可信的在线“检测”“转换”页面。旧文章中给出的服务商、扩展和免费服务器仅属于当时的示例，不能视为当前可用性保证。

### 29.3 “纯净 IP”不能替代排查

某些网站依据出口信誉、地区、账号与请求频率限制访问。先保留错误码，再查看服务的官方条件和账号状态。无需为了一个模糊的“纯净度”评分频繁更换整套网络配置。

来源：[原书隐私防护](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/look/nsfw.md)、[Chrome](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/browse/chrome.md)、[出口 IP](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/abc/pure.md)。本章为隐私概念与排错整理，不延续原书的身份材料操作或匿名保证。

## 30. 自建节点与服务维护：从能连到可恢复

### 30.1 选购之前列清维护责任

自建服务意味着自行管理系统更新、服务进程、认证、证书、带宽、账单与备份。先在一台设备上验证供应的线路和协议需求，再决定是否长期运行。原书列举的优惠、免费套餐、地区与供应商可用性均需在使用时重新核对。

### 30.2 一份最小的交接记录

| 项目 | 保存什么 | 放在哪里 |
|---|---|---|
| 服务器 | 地址、系统、管理方式、服务端版本 | 私有记录 |
| 协议配置 | 端口、传输参数、证书域名、客户端要求 | 私有配置；公开文档仅用占位符 |
| 凭据 | 密钥与密码、轮换步骤 | 密码管理器或受限存储 |
| 恢复 | 配置备份、旧版本、验证命令 | 受控备份 |
| 验收 | DNS、网页、实际应用、断线重连 | 脱敏后的测试记录 |

### 30.3 接入 OpenClash 的顺序

1. 先确认服务端正在监听，客户端所需参数齐全。
2. 在单个客户端验证连接，再按第 16 章加入节点或 provider。
3. 用独立测试策略组选择节点，确认连接面板中的真实出口。
4. 完成证书续期、配置备份与故障回退记录。
5. 升级时先保存可恢复版本，避免客户端与服务端同时大改后无法定位原因。

第三方安装脚本可能修改防火墙、安装服务和计划任务。阅读脚本并确认其来源、目标系统和卸载方法，再在自己负责的服务器上使用。本文不附未经本次验证的一键安装命令。

来源：[原书自建服务器](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/fkca/ss-server.md)、[获取连接方式](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/method/get-method.md)。本章整编为维护流程，不对服务商作购买推荐。

## 31. Tor、IPFS、网页存档：按用途扩展阅读

### 31.1 三类工具解决不同问题

| 主题 | 适合了解的用途 | 不能默认得到的能力 |
|---|---|---|
| Tor Browser | 有特定威胁模型的浏览与匿名网络研究 | 安装后所有应用自动匿名；任意插件都不会影响隔离 |
| IPFS | 内容寻址、分发与校验 | 上传后自动永久在线；所有内容天然私密 |
| 网页时光机 | 查找旧版本与失效网页的历史快照 | 快照完整、链接仍有效、旧操作步骤仍适用 |
| 搜索与个人博客 | 寻找线索、比对问题和版本 | 搜到的第一条结果就是官方结论 |

### 31.2 IPFS 的实际使用边界

内容标识便于定位与校验数据，但能否取回取决于仍有节点提供数据。需要持续保存的内容，应安排 pinning 与独立备份。公共网关可用性和隐私边界各不相同；它并不等于加密存储服务。

### 31.3 阅读历史资料的方法

先查发布时间，再识别操作所针对的系统、客户端与协议版本。截图可能指向已改名或停止维护的软件；操作前回到官方项目核对。引用时保留原作者、原文链接和查阅版本，避免把转载文章当成维护者的原创结论。

来源：[原书 IPFS 专题](https://github.com/hoochanlon/fq-book/tree/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/ipfs)、[Tor](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/browse/tor-firefox.md)、[网页时光机](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/web/web-archive.md)、[IPFS 持久保存说明](https://docs.ipfs.tech/how-to/pin-files/)、[Tor Browser 手册](https://tb-manual.torproject.org/)。这些内容属于扩展阅读，无需为使用 OpenClash 而全部安装。

## 32. 阅读旧教程时的迁移与纠错清单

### 32.1 将原书经验转换成当前可验证的步骤

| 原书中需要校正的说法或做法 | 本手册采用的处理 |
|---|---|
| DNS 直接发送错误根证书 | 区分 DNS 记录与 TLS 对端证书，见第 23、28 章 |
| 全局代理后终端一定不走代理 | 取决于应用、显式代理、TUN 与网关接管，见第 22、24 章 |
| RST 或 SSL_ERROR_SYSCALL 一定由 Hosts 引起 | 按失败层逐项对照，见第 28 章 |
| NAT Type 编号能直接对应所有 NAT 分类 | 保留设备与测试工具各自的定义，见第 27 章 |
| 关闭防火墙或直接开 DMZ 改善游戏 | 确认协议、拓扑与所需入站端口，再最小化放行 |
| IPFS 存储天然永久可用 | 记录提供节点、pinning 与独立备份，见第 31 章 |
| 强制 reset / push 用于日常更新 | 保留本地改动，审查差异后提交；见第 33 章 |
| 免费套餐、旧插件、旧客户端教程仍适用 | 作为历史线索，使用前查官方维护与收费状态 |

### 32.2 如何使用原书导读

“原书导读”收录该版本 `docs/` 下的全部 Markdown 页面，支持按原分类、处置方式和关键词筛选。每条都给出固定版本原文链接及适合承接的手册章节。

- **实用整编**：主题已被重组进手册，具体操作以新版章节为入口。
- **历史参考**：保留阅读线索，旧界面、平台套餐和软件可用性未逐项复测。
- **扩展阅读**：与 OpenClash 配置没有直接依赖的社会议题、账号服务或一般资料，保留原文入口。

整编不是整仓逐字复制。尤其是原书已有原作者标注的转载文章，本站以自己的实用说明与原文链接承接，不统一重新授权那些文章，也不镜像它们的图片。

### 32.3 在自己的设备上完成验收

本次网站构建检查只能证明页面、链接与交互工作正常，不能证明某个节点、付费服务或路由器配置可用。按第 21 章在真实网络中验收，记录失败条件，并保留回退方式。

来源：[fq-book 固定版本](https://github.com/hoochanlon/fq-book/tree/345bc276f60a24a34c90042c19d28c0fc01e87e2)、[原书目录](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/docs/_sidebar.md)。

## 33. 手册来源、授权与 GitHub 网站维护

### 33.1 内容分成三个来源层

| 层次 | 内容 | 日期和范围 |
|---|---|---|
| 原有实用手册 | 第 1—21 章、45 个视频索引与配置工具 | 保留 2026-09-05 的研究记录；视频未取得完整字幕 |
| fq-book 整编 | 第 22—33 章、原书导读与映射 | 2026-11-02 整理，锁定上游提交 `345bc276f60a24a34c90042c19d28c0fc01e87e2` |
| 官方核对 | Mihomo DNS/端口、curl、OpenSSH、GitHub Pages、IPFS、Tor 等 | 为操作与概念校正提供依据；链接见对应章节 |

上游作者为 **hoochanlon 及相关贡献者**，作品为《这本书能让你连接互联网》。原书 README 标注 [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)。本站整编保留署名、原始链接、版本与修改说明，整编内容按同一许可提供；商业使用应另行取得授权。原书转载、图片和第三方资料仍受其各自权利约束。

### 33.2 更新内容，不覆盖自己的改动

仓库中的 `content/openclash-guide.md` 保存原有 21 章；`content/fq-book-guide.md` 保存新增整编；`content/fq-book-index.json` 保存全部原书页面的来源映射；`content/integration-notes.md` 记录核对边界和变更。

```sh
npm ci
npm run check
npm run build
```

`dist/` 是可部署的静态网站。`npm run prepare:pages` 会将本次构建同步到 `docs/`；审查差异后提交并推送。GitHub Pages 选择 `main` 分支的 `/docs`，即可从已构建的文件发布，无需服务器密钥。README 中保留完整维护步骤。

更新原书资料时记录新的上游提交，对比改动并更新导读映射，然后重新执行检查和构建。不要用上游仓库的 `reset --hard` 或强制推送覆盖这份整编站点。

### 33.3 发布前检查什么

- 下载链接使用相对路径，兼容 GitHub Pages 的仓库子路径。
- 章节、导读与搜索支持刷新和深链接。
- 发布文件不包含真实订阅、账号、令牌、路由器备份或本机路径。
- 真实网络参数用占位符，源码与站点可以公开阅读。

来源：[fq-book 授权与说明](https://github.com/hoochanlon/fq-book/blob/345bc276f60a24a34c90042c19d28c0fc01e87e2/README.md)、[GitHub Pages 发布源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。
