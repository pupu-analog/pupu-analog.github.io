/* global hexo */
"use strict";

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

hexo.extend.tag.register("whats_new", function (args) {
  const limit = Math.max(1, Math.min(30, parseInt(args[0], 10) || 8));
  const posts = hexo.locals.get("posts").sort("-date").limit(limit).toArray();
  if (!posts.length) return '<p class="guide-update-excerpt">暂无文章。</p>';

  return posts.map(function (post) {
    const date = post.date ? post.date.format("YYYY-MM-DD") : "";
    const path = String(post.path || "").replace(/^\/+/, "");
    const href = "/" + path;
    const excerpt = String(post.excerpt || post.description || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const summary = excerpt.length > 160 ? excerpt.slice(0, 160) + "…" : excerpt;
    return '<section class="guide-update">' +
      '<h3><a href="' + escapeHtml(href) + '">' + escapeHtml(post.title) + "</a></h3>" +
      '<p class="guide-update-date">' + escapeHtml(date) + "</p>" +
      (summary ? '<p class="guide-update-excerpt">' + escapeHtml(summary) + "</p>" : "") +
      "</section>";
  }).join("");
}, { ends: false });
