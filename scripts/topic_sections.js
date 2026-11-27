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

// 渲染 topic 页：与书籍页布局一致，多个子分类，每条只显示带链接的名字。
// 页面末尾统一显示一个「阅读整理」入口，指向 reading_url。
// 数据源：source/_data/topic_sections.yml
hexo.extend.tag.register("topic_sections", function () {
  var data = (hexo.locals.get("data") || {}).topic_sections || {};
  var sections = data.sections || [];

  if (!sections.length) {
    return '<p class="bk-empty">尚未配置子分类，请在 source/_data/topic_sections.yml 中添加。</p>';
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
