import { readFileSync, readdirSync, existsSync } from "fs";
import { join, basename } from "path";
import matter from "gray-matter";
import { marked } from "marked";

// Configure marked for GitHub-flavored markdown
marked.setOptions({
  gfm: true,
  breaks: true,
});

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseTagAttributes(rawAttributes = "") {
  const attributes = {};
  const pattern = /([a-zA-Z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  let match;

  while ((match = pattern.exec(rawAttributes)) !== null) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? "";
  }

  return attributes;
}

function thumbnailTagToHtml(rawAttributes = "") {
  const attrs = parseTagAttributes(rawAttributes);
  const src = attrs.src;

  if (!src) {
    return "";
  }

  const alt = attrs.alt || "Image preview";
  const fullSrc = attrs.full || attrs.href || src;
  const caption = attrs.caption;
  const customClass = attrs.class ? ` ${escapeHtml(attrs.class)}` : "";

  let maxWidthStyle = "";
  if (attrs.width && /^\d+$/.test(attrs.width.trim())) {
    maxWidthStyle = ` style="max-width: ${attrs.width.trim()}px;"`;
  }

  return `
<figure class="md-thumbnail${customClass}">
  <button
    type="button"
    class="md-thumbnail-trigger js-image-modal-trigger"
    data-modal-src="${escapeHtml(fullSrc)}"
    data-modal-alt="${escapeHtml(alt)}"
    aria-label="Open image preview: ${escapeHtml(alt)}"
  >
    <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy"${maxWidthStyle} />
  </button>
  ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}
</figure>`;
}

function preprocessMarkdownContent(markdown = "") {
  return markdown
    .replace(/<thumbnail\s+([^>]*?)\/?>/gi, (_, attrs) =>
      thumbnailTagToHtml(attrs)
    )
    .replace(/\[thumbnail\s+([^\]]+)\]/gi, (_, attrs) =>
      thumbnailTagToHtml(attrs)
    );
}

/**
 * Parse a single markdown file and return frontmatter + HTML content
 */
export function parseMarkdownFile(filePath) {
  const fileContent = readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = matter(fileContent);
  const html = marked(preprocessMarkdownContent(content));

  return {
    frontmatter,
    content: html,
    slug: frontmatter.slug || basename(filePath, ".md"),
  };
}

/**
 * Get all content from a directory, parsed and sorted
 */
export function getContentFromDirectory(contentDir, options = {}) {
  const { sortBy = "date", order = "desc", filterDraft = true } = options;

  if (!existsSync(contentDir)) {
    return [];
  }

  const files = readdirSync(contentDir).filter((f) => f.endsWith(".md"));

  const items = files.map((file) => {
    const filePath = join(contentDir, file);
    return parseMarkdownFile(filePath);
  });

  // Filter drafts in production
  const filtered = filterDraft
    ? items.filter((item) => !item.frontmatter.draft)
    : items;

  // Sort items
  return filtered.sort((a, b) => {
    const aVal = a.frontmatter[sortBy];
    const bVal = b.frontmatter[sortBy];

    if (sortBy === "date") {
      return order === "desc"
        ? new Date(bVal) - new Date(aVal)
        : new Date(aVal) - new Date(bVal);
    }
    return order === "desc" ? bVal - aVal : aVal - bVal;
  });
}

/**
 * Get recent items (for homepage)
 */
export function getRecentItems(contentDir, count = 3) {
  const items = getContentFromDirectory(contentDir);
  return items.slice(0, count);
}

/**
 * Format date for display
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
