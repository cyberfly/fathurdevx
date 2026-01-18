import { readFileSync, readdirSync, existsSync } from "fs";
import { join, basename } from "path";
import matter from "gray-matter";
import { marked } from "marked";

// Configure marked for GitHub-flavored markdown
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Parse a single markdown file and return frontmatter + HTML content
 */
export function parseMarkdownFile(filePath) {
  const fileContent = readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = matter(fileContent);
  const html = marked(content);

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
