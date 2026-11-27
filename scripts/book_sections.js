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

// 渲染书籍页：每个子分类 = 一组条目，每条独占一行。
// 条目格式：名字; 阅读整理（仅名字链接到 url；阅读整理是内容文字，不是链接）。
// 数据源：source/_data/book_sections.yml
hexo.extend.tag.register("book_sections", function () {
  var data = (hexo.locals.get("data") || {}).book_sections || {};
  var sections = data.sections || [];

  if (!sections.length) {
    return '<p class="bk-empty">尚未配置子分类，请在 source/_data/book_sections.yml 中添加。</p>';
  }

  return sections.map(function (section) {
    var title = escapeHtml(section.title || "未命名分类");
    var items = section.items || [];

    var cards = items.map(function (item) {
      var href = normalizeUrl(item.url);
      var name = escapeHtml(item.name || "未命名");
      var reading = escapeHtml(item.reading == null ? "" : item.reading);

      var nameHtml = href
        ? '<a class="bk-name" href="' + escapeHtml(href) + '">' + name + "</a>"
        : '<span class="bk-name">' + name + "</span>";
      var readingHtml = reading ? '<span class="bk-reading">' + reading + "</span>" : "";

      return '<div class="bk-item">' + nameHtml +
        '<span class="bk-sep">; </span>' + readingHtml + "</div>";
    });

    return '<section class="bk-section">' +
      '<h2 class="bk-section-title">' + title + "</h2>" +
      (cards.length ? '<div class="bk-grid">' + cards.join("") + "</div>" : "") +
      "</section>";
  }).join("");
}, { ends: false });
