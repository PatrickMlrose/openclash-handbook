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
