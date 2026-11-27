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

// 通用栏目页渲染：与书籍页布局一致，多个子分类，每条只显示带链接的名字。
// 用法：{% wiki_sections devices_sections %}
// 数据源：source/_data/<参数>.yml
hexo.extend.tag.register("wiki_sections", function (args) {
  var key = String(args[0] || "").trim();
  var data = (hexo.locals.get("data") || {})[key] || {};
  var sections = data.sections || [];

  if (!sections.length) {
    return '<p class="bk-empty">尚未配置子分类，请在 source/_data/' +
      escapeHtml(key || "<栏目>") + '.yml 中添加。</p>';
  }

  var html = sections.map(function (section) {
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

  var readingHref = normalizeUrl(data.reading_url);
  if (readingHref) {
    html += '<div class="bk-reading-row"><a class="bk-reading" href="' +
      escapeHtml(readingHref) + '">阅读整理</a></div>';
  }

  return html;
}, { ends: false });
