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

// 渲染 topic 页：每个子分类 = 左列 items（外部资料链接）+ 右列 topics（topic 落地页）。
// 左列 items  : 每行一个条目，名字链接到 url
// 右列 topics : 每行一个 topic，名字链接到 /topic/<id>/ 落地页
// 数据源：source/_data/topic_sections.yml
hexo.extend.tag.register("topic_sections", function () {
  var data = (hexo.locals.get("data") || {}).topic_sections || {};
  var sections = data.sections || [];

  if (!sections.length) {
    return '<p class="bk-empty">尚未配置子分类，请在 source/_data/topic_sections.yml 中添加。</p>';
  }

  var html = sections.map(function (section) {
    var title = escapeHtml(section.title || "未命名分类");
    var items = (section.items || []).map(function (item) {
      var href = normalizeUrl(item.url);
      var name = escapeHtml(item.name || "未命名");
      return '<div class="bk-item">' +
        (href
          ? '<a class="bk-name" href="' + escapeHtml(href) + '">' + name + "</a>"
          : '<span class="bk-name">' + name + "</span>") +
        "</div>";
    }).join("");

    var topics = (section.topics || []).map(function (topic) {
      var id = String(topic.id || "").trim();
      var name = escapeHtml(topic.name || id || "未命名 topic");
      var href = id ? "/topic/" + encodeURIComponent(id) + "/" : "";
      return '<div class="bk-item">' +
        (href
          ? '<a class="bk-name" href="' + escapeHtml(href) + '">' + name + "</a>"
          : '<span class="bk-name">' + name + "</span>") +
        "</div>";
    }).join("");

    return '<section class="bk-section">' +
      '<h2 class="bk-section-title">' + title + "</h2>" +
      '<div class="bk-two-col">' +
        '<div class="bk-col">' + (items || '<span class="bk-empty">暂无条目</span>') + "</div>" +
        '<div class="bk-col">' + (topics || '<span class="bk-empty">暂无 topic</span>') + "</div>" +
      "</div>" +
      "</section>";
  }).join("");

  return html;
}, { ends: false });
