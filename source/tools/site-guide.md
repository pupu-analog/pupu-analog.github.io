---
title: 站点维护指南
date: 2026-11-28
collection:
  profile: wiki
  id: tools
---

# 站点维护指南

本文记录博客的整体结构、各文件用途、日常更新的操作方法、空间占用与注意事项。

站点地址：<https://pupu-analog.github.io/>
本地目录：`C:\Users\zza\myblog`

## 一、博客现在是什么

`C:\Users\zza\myblog` 是一个 Hexo 8.1.2 + Stellar 2.0.0 的静态站点，托管在 GitHub Pages。结构上是「Wiki 集合为主体 + 博客时间线为辅」：

- **集合栏目**：书籍、电路、器件工艺、topic、项目、仿真、质量 —— 每个栏目是一个 Wiki collection，页面本身是数据驱动的清单（只列条目链接），具体笔记放在独立 md 页。
- **博客时间线**：`_posts/` 里的文章自动生成到 `/blog/`，单行紧凑、按日期倒序。
- **主页**：正文已全部隐藏，只保留右侧目录栏；目录由正文标题自动生成，所以标题结构不能删。

## 二、各类文件的用途

| 文件/目录 | 用途 |
| --- | --- |
| `_config.yml` | Hexo 核心配置：站点名、描述、URL、permalink；`index_generator.path: /blog/` 把文章时间线挪到 /blog/ |
| `_config.stellar.yml` | 主题配置：顶栏 9 个栏目、页脚、SEO，以及所有注入 CSS（`inject.head_end`） |
| `.github/workflows/pages.yml` | push 到 main 后自动 `npm install → hexo build → 发布 public/`，无需手动上传 |
| `package.json` / `package-lock.json` | 依赖版本（Hexo、Stellar、渲染器） |
| `.gitignore` | 排除 `node_modules/`、`public/`、`db.json`、`source/_data/caches/` |
| `source/index.md` | 主页（当前正文隐藏，只留标题供生成目录） |
| `source/_posts/*.md` | 博客文章（现 2 篇） |
| `source/<栏目>/*.md` | 各栏目的笔记页、汇总页（书籍 39 页含 31 个 AACD 系列） |
| `source/images/`、`favicon.svg` | 头像、横幅等静态资源 |

### 数据文件（`source/_data/`，平时最常改）

| 文件 | 控制哪个页面 |
| --- | --- |
| `book_sections.yml` | 书籍页 `/books/`（39 条） |
| `topic_sections.yml` | topic 页 `/others/` |
| `block_sections.yml` / `block_topics.yml` | 电路页两列 + 各 topic 落地页 |
| `devices_ / projects_ / tools_ / tbd_sections.yml` | 器件工艺 / 项目 / 仿真 / 质量 |
| `wiki.yml` + `wiki/*.yml` | 集合顺序、栏目显示名、左侧导航树 |
| `topic.yml` + `topic/analog-book.yml` | Stellar 内置 topic 系统（目前基本闲置） |

### 渲染脚本（`scripts/`，布局定好后不用动）

`whats_new.js`（首页动态）、`book_sections.js`、`block_sections.js`、`block_topic.js`、`topic_sections.js`、`wiki_sections.js`（后四个栏目共用）。

## 三、以后更新内容改哪些文件

| 你想做的事 | 要改的文件 |
| --- | --- |
| 书籍页加/改条目 | `book_sections.yml`，在对应 `items` 下追加 `name` + `url` |
| 写一篇读书笔记 | 新建 `source/books/xxx.md`，再在 `wiki/books.yml` 的 tree 里登记 |
| 电路页加条目或 topic | `block_sections.yml`；新 topic 还要 `block_topics.yml` + 新建 `source/blocks/xxx.md` + `wiki/blocks.yml` |
| topic / 器件工艺 / 项目 / 仿真 / 质量 加条目 | 对应的 `*_sections.yml`（一个文件搞定） |
| 写博客文章 | `hexo new post "标题"`，编辑 `source/_posts/` 下的 md |
| 改栏目名或顺序 | `_config.stellar.yml`（顶栏+页脚）、`wiki.yml`、`wiki/*.yml`、`source/index.md` |
| 改颜色/间距/布局 | `_config.stellar.yml` 的 `inject.head_end` |

## 四、空间占用与 1 GB 差距

GitHub Pages 官方限制：源仓库建议 1 GB、发布站点不超过 1 GB（[官方文档](https://docs.github.com/zh/enterprise-server@3.12/pages/getting-started-with-github-pages/github-pages-limits)）。

| 项目 | 大小 | 是否计入仓库 |
| --- | --- | --- |
| **GitHub 远端仓库**（API 实测） | **122 KB（约 0.12 MB）** | 是 |
| 本地 git 跟踪文件（98 个） | 351 KB | 是 |
| `public/` 构建产物 | 3.3 MB | 否（Actions 现编） |
| `node_modules/` | 91 MB | 否（gitignore） |
| `.git/` 历史 | 725 KB | 否 |

**距 1 GB 限制还差约 1023.9 MB，当前只用了约 0.01%**。按纯文字笔记算，再写几万篇也用不完；真正的风险只有往 `source/images/` 里塞大图或视频。

## 五、以后更新的注意事项

1. **别手动改 `public/`、`db.json`、`node_modules/`、`source/_data/caches/`** —— 都是生成物/依赖，改了会被覆盖或被忽略。
2. **YAML 缩进用空格**；`name` 里含冒号要加英文双引号，否则构建报错。
3. **新增笔记页必须去 `wiki/<栏目>.yml` 的 `tree` 登记**，否则页面能访问但不进导航树。
4. **主页的 h3 标题别删** —— 右侧目录栏靠它生成，删了目录就空了。
5. **推送失败是常态**：本机直连 GitHub 经常被重置。先试 `env -u https_proxy -u HTTPS_PROXY -u http_proxy -u HTTP_PROXY git push`；仍失败就走 GitHub API 兜底。注意 API 提交后本地与远端 SHA 会不一致，以 **tree 内容一致**为准。
6. **部署有延迟**：push 后 Actions 约 1–5 分钟生效；看不到改动先 `Ctrl+F5` 强刷，别急着重做。
7. **图片控制单文件大小**，优先 SVG 或压缩后的 JPG/PNG，避免触碰 1 GB 上限。
8. **外链尽量用搜索页/稳定来源**（如现在的 Google PDF 搜索链接），直链 PDF / 网盘容易失效。
