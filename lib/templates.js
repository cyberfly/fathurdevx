import { formatDate } from "./content.js";

/**
 * Generate blog card HTML from item data
 */
export function generateBlogCard(item, basePath = "") {
  const { frontmatter, slug } = item;
  const dateFormatted = formatDate(frontmatter.date);

  return `
    <a href="${basePath}/blog/${slug}.html" class="block group">
      <article class="h-full bg-white border-2 border-border-dark rounded-xl shadow-hard group-hover:shadow-hard-hover group-hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
        <div class="h-48 bg-muted relative overflow-hidden border-b-2 border-border-dark">
          <div class="absolute inset-0 bg-accent/10"></div>
          ${
            frontmatter.thumbnail
              ? `<img src="${frontmatter.thumbnail}" alt="${frontmatter.title}" class="w-full h-full object-cover" />`
              : `<div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cross-stripes.png')] opacity-20"></div>`
          }
          <div class="absolute top-4 right-4 bg-white px-3 py-1 rounded-full border-2 border-border-dark text-xs font-bold shadow-sm">
            ${frontmatter.category || "BLOG"}
          </div>
        </div>
        <div class="p-6 flex-1 flex flex-col">
          <div class="flex items-center gap-2 text-sm text-mutedForeground mb-3 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span>${dateFormatted}</span>
          </div>
          <h2 class="font-heading font-bold text-xl text-foreground mb-3 group-hover:text-accent transition-colors">
            ${frontmatter.title}
          </h2>
          <p class="text-mutedForeground text-sm line-clamp-3 mb-6 flex-1">
            ${frontmatter.description}
          </p>
          <div class="flex items-center text-accent font-bold text-sm">
            Read Article
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ml-2 group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </div>
      </article>
    </a>
  `;
}

/**
 * Generate portfolio card HTML from item data
 */
export function generatePortfolioCard(item, basePath = "") {
  const { frontmatter, slug } = item;

  const tagsHtml = (frontmatter.tags || [])
    .map(
      (tag) =>
        `<span class="text-xs font-bold px-2 py-1 bg-muted rounded-md border border-border-dark">${tag}</span>`
    )
    .join("");

  return `
    <a href="${basePath}/portfolio/${slug}.html" class="group block relative">
      <div class="bg-white border-2 border-border-dark rounded-xl shadow-hard group-hover:shadow-hard-hover group-hover:-translate-y-2 transition-all duration-300 overflow-hidden h-full flex flex-col">
        <div class="h-48 bg-muted relative border-b-2 border-border-dark overflow-hidden">
          <div class="absolute inset-0 bg-accent/10 group-hover:bg-accent/20 transition-colors z-10"></div>
          <img src="${frontmatter.thumbnail}" alt="${frontmatter.title}" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
          <div class="absolute top-4 right-4 bg-white border-2 border-border-dark px-3 py-1 rounded-full text-xs font-bold shadow-sm z-20">
            ${frontmatter.category}
          </div>
        </div>
        <div class="p-6 flex-1 flex flex-col">
          <h3 class="font-heading font-bold text-2xl mb-2 group-hover:text-accent transition-colors">
            ${frontmatter.title}
          </h3>
          <p class="text-mutedForeground mb-4 line-clamp-3">
            ${frontmatter.description}
          </p>
          <div class="mt-auto flex flex-wrap gap-2">
            ${tagsHtml}
          </div>
        </div>
      </div>
    </a>
  `;
}

/**
 * Generate tags HTML for portfolio detail page
 */
export function generateTagsHtml(tags) {
  return (tags || [])
    .map(
      (tag) =>
        `<span class="px-3 py-1 bg-white border border-border-dark rounded-md font-bold text-sm">${tag}</span>`
    )
    .join("");
}
