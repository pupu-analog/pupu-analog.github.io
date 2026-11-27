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

// 渲染书籍页：每个子分类 = 一整行横向网格。
// 卡片格式：名字:读书整理（名字链接到 url，读书整理可选链接到 reading_url）。
// 卡片自身保持单行、高度最窄，横向排不下时自动换行。
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
      var reading = escapeHtml(item.reading == null ? "读书整理" : item.reading);
      var readingHref = normalizeUrl(item.reading_url);

      var nameHtml = href
        ? '<a class="bk-name" href="' + escapeHtml(href) + '">' + name + "</a>"
        : '<span class="bk-name">' + name + "</span>";
      var readingHtml = readingHref
        ? '<a class="bk-reading" href="' + escapeHtml(readingHref) + '">' + reading + "</a>"
        : '<span class="bk-reading">' + reading + "</span>";

      return '<span class="bk-item">' + nameHtml +
        '<span class="bk-colon">: </span>' + readingHtml + "</span>";
    });

    return '<section class="bk-section">' +
      '<h2 class="bk-section-title">' + title + "</h2>" +
      (cards.length ? '<div class="bk-grid">' + cards.join("") + "</div>" : "") +
      "</section>";
  }).join("");
}, { ends: false });
