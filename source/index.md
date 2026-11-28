---
title: pupu analog
layout: page
permalink: /
comments:
  enabled: false
---

# 站点维护速查

## 结构

Hexo 8 + Stellar 2 静态站，GitHub Pages 自动发布。11 个集合栏目 + 博客时间线（`/blog/`）。栏目页是数据驱动的清单，笔记正文在独立 md 页。

## 常改文件

| 文件 | 用途 |
| --- | --- |
| `_config.stellar.yml` | 顶栏、页脚、样式 |
| `source/_data/*_sections.yml` | 各栏目条目（日常只改这里） |
| `source/_data/wiki/*.yml` | 栏目名、导航树 |
| `source/<栏目>/*.md` | 阅读笔记 |
| `scripts/*.js` | 渲染脚本（布局定好后不用动） |

## 更新操作

- 加条目：在对应 `*_sections.yml` 的 `items` 下追加 `name` + `url`
- 写笔记：新建 `source/<栏目>/xxx.md`，并在 `wiki/<栏目>.yml` 的 tree 登记
- 写博客：`hexo new post "标题"`，编辑 `source/_posts/`
- 改栏目名/顺序：`_config.stellar.yml` + `wiki.yml` + `wiki/*.yml`

## 容量

仓库约 0.34 MB / 1 GB（约 0.03%）；`public/`、`node_modules/` 不计入。图片放 `source/images/`，控制大小。

## 注意

1. 不改 `public/`、`db.json`、`node_modules/`、`caches/`——会被覆盖或忽略。
2. YAML 的 `name` 含冒号要加英文双引号；缩进用空格。
3. 新增笔记页要在 `wiki/<栏目>.yml` 登记，否则不进导航树。
4. 推送失败先试无代理 `git push`，再走 API；以 tree 一致为准。
5. push 后 1–5 分钟生效，看不到改动先 `Ctrl+F5`。
6. 外链用搜索页/稳定来源，避免网盘直链。
