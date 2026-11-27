/* global hexo */
"use strict";

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeUrl(value) {
  var raw = String(value == null ? "" : value).trim();
  if (!raw) return "";
  if (/^(https?:\/\/|\/\/)/i.test(raw)) return raw;
  return "/" + raw.replace(/^\/+/, "");
}

// 渲染 topic 落地页：与书籍页布局一致，多个子分类，每个分类多个条目（名字链接到 url）。
// 用法：{% block_topic opamp %}
// 数据源：source/_data/block_topics.yml
hexo.extend.tag.register("block_topic", function (args) {
  var id = String(args[0] || "").trim();
  var data = (hexo.locals.get("data") || {}).block_topics || {};
  var topics = data.topics || {};
  var topic = topics[id];

  if (!topic) {
    return '<p class="bk-empty">未找到 topic：' + escapeHtml(id || "未指定") +
      '，请在 source/_data/block_topics.yml 中配置。</p>';
  }

  var sections = topic.sections || [];
  return sections.map(function (section) {
    var title = escapeHtml(section.title || "未命名分类");
    var cards = (section.items || []).map(function (item) {
      var href = normalizeUrl(item.url);
      var name = escapeHtml(item.name || "未命名");
      return '<div class="bk-item">' +
        (href
          ? '<a class="bk-name" href="' + escapeHtml(href) + '">' + name + "</a>"
          : '<span class="bk-name">' + name + "</span>") +
        "</div>";
    }).join("");

    return '<section class="bk-section">' +
      '<h2 class="bk-section-title">' + title + "</h2>" +
      (cards ? '<div class="bk-grid">' + cards + "</div>" : "") +
      "</section>";
  }).join("");
}, { ends: false });
