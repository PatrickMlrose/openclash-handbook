import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'OpenClash 使用手册 · 从入门到维护',description:'结合七尺宇公开视频资料与 OpenClash、Mihomo 官方文档的完整使用手册。33 章指南、86 篇 fq-book 导读、45 个视频索引，以及可复制的配置与排查步骤。'};
export default function RootLayout({children}: Readonly<{children:React.ReactNode}>){return <html lang="zh-CN"><body>{children}</body></html>;}
