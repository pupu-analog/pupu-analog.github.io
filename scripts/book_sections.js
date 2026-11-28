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
// 条目：名字链接到 url；若配置 reading_url，则在名字后用分号接「阅读整理」链接。
// 子分类：若配置 reading_url，则在该分类条目下方显示一个统一的「阅读整理」链接。
// 数据源：source/_data/book_sections.yml
hexo.extend.tag.register("book_sections", function () {
  var data = (hexo.locals.get("data") || {}).book_sections || {};
  var sections = data.sections || [];

  if (!sections.length) {
    return '<p class="bk-empty">尚未配置子分类，请在 source/_data/book_sections.yml 中添加。</p>';
  }

  var html = sections.map(function (section) {
    var title = escapeHtml(section.title || "未命名分类");
    var items = section.items || [];

    var cards = items.map(function (item) {
      var href = normalizeUrl(item.url);
      var name = escapeHtml(item.name || "未命名");
      var nameHtml = href
        ? '<a class="bk-name" href="' + escapeHtml(href) + '">' + name + "</a>"
        : '<span class="bk-name">' + name + "</span>";

      var readingHref = normalizeUrl(item.reading_url);
      if (!readingHref) return '<div class="bk-item">' + nameHtml + "</div>";

      var reading = escapeHtml(item.reading == null ? "阅读整理" : item.reading);
      return '<div class="bk-item">' + nameHtml +
        '<span class="bk-sep">; </span>' +
        '<a class="bk-reading" href="' + escapeHtml(readingHref) + '">' + reading + "</a>" +
        "</div>";
    });

    var sectionHref = normalizeUrl(section.reading_url);
    var sectionReading = "";
    if (sectionHref) {
      var sectionLabel = escapeHtml(section.reading == null ? "阅读整理" : section.reading);
      sectionReading = '<div class="bk-section-reading"><a class="bk-reading" href="' +
        escapeHtml(sectionHref) + '">' + sectionLabel + "</a></div>";
    }

    return '<section class="bk-section">' +
      '<h2 class="bk-section-title">' + title + "</h2>" +
      (cards.length ? '<div class="bk-grid">' + cards.join("") + "</div>" : "") +
      sectionReading +
      "</section>";
  }).join("");

  return html;
}, { ends: false });
