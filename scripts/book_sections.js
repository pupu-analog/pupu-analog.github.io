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

// 渲染书籍页：每个子分类 = 一整行横向网格模块，条目在网格里横向排列。
// 数据源：source/_data/book_sections.yml
hexo.extend.tag.register("book_sections", function () {
  var data = (hexo.locals.get("data") || {}).book_sections || {};
  var sections = data.sections || [];

  if (!sections.length) {
    return '<p class="bk-empty">尚未配置子分类，请在 source/_data/book_sections.yml 中添加。</p>';
  }

  return sections.map(function (section) {
    var title = escapeHtml(section.title || "未命名分类");
    var desc = escapeHtml(section.description || "");
    var items = section.items || [];

    var cards = items.map(function (item) {
      var href = normalizeUrl(item.url);
      var name = escapeHtml(item.title || "未命名条目");
      var note = escapeHtml(item.note || "");
      var titleHtml = href
        ? '<a class="bk-card-title" href="' + escapeHtml(href) + '">' + name + "</a>"
        : '<span class="bk-card-title">' + name + "</span>";
      return '<div class="bk-card">' +
        titleHtml +
        (note ? '<p class="bk-card-note">' + note + "</p>" : "") +
        "</div>";
    });

    // 空分类保留一个占位卡，提示这里后续可以添加内容
    if (!cards.length) {
      cards = ['<div class="bk-card bk-card--empty"><span class="bk-card-title">待添加内容</span><p class="bk-card-note">在配置文件的 items 下追加条目即可出现在这里</p></div>'];
    }

    return '<section class="bk-section">' +
      '<div class="bk-section-head">' +
        '<h2 class="bk-section-title">' + title + "</h2>" +
        (desc ? '<p class="bk-section-desc">' + desc + "</p>" : "") +
      "</div>" +
      '<div class="bk-grid">' + cards.join("") + "</div>" +
      "</section>";
  }).join("");
}, { ends: false });
