import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { createMpaPlugin } from "vite-plugin-virtual-mpa";
import { resolve } from "path";
import { readFileSync } from "fs";
import {
  getContentFromDirectory,
  formatDate,
} from "./lib/content.js";
import {
  generateBlogCard,
  generatePortfolioCard,
  generateTagsHtml,
} from "./lib/templates.js";

// Custom plugin to watch content files and trigger full reload
function contentWatcherPlugin() {
  return {
    name: "content-watcher",
    configureServer(server) {
      const __dirname = resolve();

      // Watch content directories and templates
      const watchPaths = [
        resolve(__dirname, "content/blog"),
        resolve(__dirname, "content/portfolio"),
        resolve(__dirname, "templates"),
        resolve(__dirname, "index.html"),
        resolve(__dirname, "about.html"),
        resolve(__dirname, "contact.html"),
      ];

      watchPaths.forEach(path => {
        server.watcher.add(path);
      });

      // Trigger full reload when content changes
      server.watcher.on("change", (file) => {
        if (
          file.includes("/content/blog/") ||
          file.includes("/content/portfolio/") ||
          file.includes("/templates/") ||
          file.endsWith("index.html") ||
          file.endsWith("about.html") ||
          file.endsWith("contact.html")
        ) {
          console.log(`Content changed: ${file}`);
          server.restart();
        }
      });

      server.watcher.on("add", (file) => {
        if (
          file.includes("/content/blog/") ||
          file.includes("/content/portfolio/")
        ) {
          console.log(`Content added: ${file}`);
          server.restart();
        }
      });

      server.watcher.on("unlink", (file) => {
        if (
          file.includes("/content/blog/") ||
          file.includes("/content/portfolio/")
        ) {
          console.log(`Content removed: ${file}`);
          server.restart();
        }
      });
    },
  };
}

const __dirname = resolve();
// Use root for custom domain builds so asset URLs resolve correctly.
const BASE_PATH = "";

// === CONTENT DIRECTORIES ===
const blogDir = resolve(__dirname, "content/blog");
const portfolioDir = resolve(__dirname, "content/portfolio");

// === LOAD CONTENT ===
const blogPosts = getContentFromDirectory(blogDir, {
  sortBy: "date",
  order: "desc",
});
const portfolioItems = getContentFromDirectory(portfolioDir, {
  sortBy: "order",
  order: "asc",
});

// === RECENT ITEMS FOR HOMEPAGE ===
const recentBlogPosts = blogPosts.slice(0, 3);
const recentPortfolioItems = portfolioItems.slice(0, 6);

// === TEMPLATE FILES ===
const blogListTemplate = readFileSync(
  resolve(__dirname, "templates/blog-list.html"),
  "utf-8"
);
const blogPostTemplate = readFileSync(
  resolve(__dirname, "templates/blog-post.html"),
  "utf-8"
);
const portfolioListTemplate = readFileSync(
  resolve(__dirname, "templates/portfolio-list.html"),
  "utf-8"
);
const portfolioItemTemplate = readFileSync(
  resolve(__dirname, "templates/portfolio-item.html"),
  "utf-8"
);

// === STATIC PAGE CONTENT ===
const indexContent = readFileSync(resolve(__dirname, "index.html"), "utf-8");
const aboutContent = readFileSync(resolve(__dirname, "about.html"), "utf-8");
const contactContent = readFileSync(
  resolve(__dirname, "contact.html"),
  "utf-8"
);

// === GENERATE BLOG LISTING CONTENT ===
function generateBlogListContent() {
  const cardsHtml = blogPosts
    .map((post) => generateBlogCard(post, BASE_PATH))
    .join("\n");
  return blogListTemplate.replace("<%- blogCards %>", cardsHtml);
}

// === GENERATE PORTFOLIO LISTING CONTENT ===
function generatePortfolioListContent() {
  const cardsHtml = portfolioItems
    .map((item) => generatePortfolioCard(item, BASE_PATH))
    .join("\n");
  return portfolioListTemplate.replace("<%- portfolioCards %>", cardsHtml);
}

// === GENERATE INDIVIDUAL BLOG POST CONTENT ===
function generateBlogPostContent(post, allPosts) {
  const { frontmatter, content } = post;
  const dateFormatted = formatDate(frontmatter.date);

  // Find next and previous posts (by date order)
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // Generate thumbnail HTML if exists
  const thumbnailHtml = frontmatter.thumbnail
    ? `
    <div class="mb-16 relative">
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-tertiary rounded-full border-2 border-border-dark shadow-hard z-0"></div>
      <div class="relative z-10 w-full h-64 md:h-96 bg-white border-2 border-border-dark rounded-xl overflow-hidden shadow-hard">
        <img src="${frontmatter.thumbnail}" alt="${frontmatter.title}" class="w-full h-full object-cover" />
      </div>
    </div>
  `
    : "";

  let result = blogPostTemplate
    .replace(/<%=\s*title\s*%>/g, frontmatter.title)
    .replace(/<%=\s*date\s*%>/g, dateFormatted)
    .replace(/<%=\s*category\s*%>/g, frontmatter.category || "BLOG")
    .replace(
      /<%=\s*authorName\s*%>/g,
      frontmatter.author?.name || "Fathur"
    )
    .replace(
      /<%=\s*authorAvatar\s*%>/g,
      frontmatter.author?.avatar ||
        "/images/profile-alt.jpg"
    )
    .replace(
      /<%=\s*authorBio\s*%>/g,
      frontmatter.author?.bio ||
        "Building products at the intersection of strategy and code. Product Manager who codes, Developer who understands users."
    )
    .replace(/<%-\s*thumbnailHtml\s*%>/g, thumbnailHtml)
    .replace(/<%-\s*content\s*%>/g, content);

  // Generate previous post HTML
  const prevPostHtml = prevPost
    ? `
    <a
      href="/blog/${prevPost.slug}.html"
      class="group flex items-center gap-4 text-left"
    >
      <div
        class="w-12 h-12 rounded-full border-2 border-border-dark flex items-center justify-center bg-white group-hover:bg-accent group-hover:text-white transition-all shadow-hard group-hover:shadow-hard-hover flex-shrink-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      </div>
      <div>
        <div
          class="text-mutedForeground font-bold uppercase tracking-widest text-xs mb-1"
        >
          Previous Post
        </div>
        <div
          class="font-heading font-black text-xl group-hover:text-accent transition-colors"
        >
          ${prevPost.frontmatter.title}
        </div>
        <div class="text-mutedForeground text-sm">${prevPost.frontmatter.category || "BLOG"}</div>
      </div>
    </a>
  `
    : '<div></div>';

  // Generate next post HTML
  const nextPostHtml = nextPost
    ? `
    <a
      href="/blog/${nextPost.slug}.html"
      class="group flex items-center gap-4 text-right justify-end"
    >
      <div>
        <div
          class="text-mutedForeground font-bold uppercase tracking-widest text-xs mb-1"
        >
          Next Post
        </div>
        <div
          class="font-heading font-black text-xl group-hover:text-accent transition-colors"
        >
          ${nextPost.frontmatter.title}
        </div>
        <div class="text-mutedForeground text-sm">${nextPost.frontmatter.category || "BLOG"}</div>
      </div>
      <div
        class="w-12 h-12 rounded-full border-2 border-border-dark flex items-center justify-center bg-white group-hover:bg-accent group-hover:text-white transition-all shadow-hard group-hover:shadow-hard-hover flex-shrink-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>
    </a>
  `
    : '<div></div>';

  return result
    .replace(/<%-\s*prevPostHtml\s*%>/g, prevPostHtml)
    .replace(/<%-\s*nextPostHtml\s*%>/g, nextPostHtml);
}

// === GENERATE INDIVIDUAL PORTFOLIO ITEM CONTENT ===
function generatePortfolioItemContent(item, allItems) {
  const { frontmatter, content } = item;

  // Find next item (circular)
  const currentIndex = allItems.findIndex((i) => i.slug === item.slug);
  const nextItem = allItems[(currentIndex + 1) % allItems.length];

  const tagsHtml = generateTagsHtml(frontmatter.tags);

  // Generate hero image HTML
  const heroImageUrl = frontmatter.heroImage || frontmatter.thumbnail;
  let heroImageHtml;

  if (heroImageUrl) {
    heroImageHtml = `<img src="${heroImageUrl}" alt="${frontmatter.title}" class="w-full h-full object-cover" />`;
  } else {
    // Generate colored background with title overlay (matching card thumbnail style)
    const colors = ['#8B5CF6', '#F472B6', '#FBBF24', '#34D399'];
    let hash = 0;
    for (let i = 0; i < item.slug.length; i++) {
      hash = item.slug.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = colors[Math.abs(hash) % colors.length];

    heroImageHtml = `
      <div class="absolute inset-0" style="background-color: ${color};">
        <!-- Diagonal stripe pattern overlay -->
        <div class="absolute inset-0 opacity-15" style="background-image: repeating-linear-gradient(45deg, #1E293B 0px, #1E293B 2px, transparent 2px, transparent 10px);"></div>
        <!-- Title overlay -->
        <div class="absolute inset-0 flex items-center justify-center p-12">
          <h2 class="font-heading font-bold text-5xl md:text-6xl text-white text-center" style="text-shadow: 4px 4px 0px rgba(30, 41, 59, 0.3);">
            ${frontmatter.title}
          </h2>
        </div>
      </div>
    `;
  }

  return portfolioItemTemplate
    .replace(/<%=\s*title\s*%>/g, frontmatter.title)
    .replace(/<%=\s*description\s*%>/g, frontmatter.description || "")
    .replace(/<%=\s*category\s*%>/g, frontmatter.category || "")
    .replace(/<%=\s*liveUrl\s*%>/g, frontmatter.liveUrl || "#")
    .replace(/<%=\s*sourceUrl\s*%>/g, frontmatter.sourceUrl || "#")
    .replace(/<%=\s*challenge\s*%>/g, frontmatter.challenge || "")
    .replace(/<%=\s*solution\s*%>/g, frontmatter.solution || "")
    .replace(/<%=\s*nextTitle\s*%>/g, nextItem.frontmatter.title)
    .replace(/<%=\s*nextSlug\s*%>/g, nextItem.slug)
    .replace(/<%=\s*nextCategory\s*%>/g, nextItem.frontmatter.category || "")
    .replace(/<%-\s*heroImageHtml\s*%>/g, heroImageHtml)
    .replace(/<%-\s*tagsHtml\s*%>/g, tagsHtml)
    .replace(/<%-\s*content\s*%>/g, content);
}

// === INJECT RECENT ITEMS INTO HOMEPAGE ===
function generateHomepageContent() {
  const recentBlogHtml = recentBlogPosts
    .map((post) => generateBlogCard(post, BASE_PATH))
    .join("\n");
  const recentPortfolioHtml = recentPortfolioItems
    .map((item) => generatePortfolioCard(item, BASE_PATH))
    .join("\n");

  return indexContent
    .replace("<%- recentBlogPosts %>", recentBlogHtml)
    .replace("<%- recentPortfolioItems %>", recentPortfolioHtml);
}

// === BUILD PAGES ARRAY ===
const pages = [
  // Static pages
  {
    name: "index",
    entry: "/src/main.js",
    data: {
      title: "Home - FathurDevX",
      description: "Built with Vite + Tailwind CSS + Alpine.js",
      activePage: "home",
      content: generateHomepageContent(),
    },
  },
  {
    name: "about",
    entry: "/src/main.js",
    data: {
      title: "About - FathurDevX",
      description: "Learn more about FathurDevX",
      activePage: "about",
      content: aboutContent,
    },
  },
  {
    name: "contact",
    entry: "/src/main.js",
    data: {
      title: "Contact - FathurDevX",
      description: "Get in touch with us",
      activePage: "contact",
      content: contactContent,
    },
  },

  // Blog listing page
  {
    name: "blog",
    entry: "/src/main.js",
    data: {
      title: "Blog - FathurDevX",
      description: "Thoughts & Tinkering",
      activePage: "blog",
      content: generateBlogListContent(),
    },
  },

  // Portfolio listing page
  {
    name: "portfolio",
    entry: "/src/main.js",
    data: {
      title: "Portfolio - FathurDevX",
      description: "My Works",
      activePage: "portfolio",
      content: generatePortfolioListContent(),
    },
  },

  // Dynamic blog post pages
  ...blogPosts.map((post) => ({
    name: `blog-${post.slug}`,
    filename: `blog/${post.slug}.html`,
    entry: "/src/main.js",
    data: {
      title: `${post.frontmatter.title} - FathurDevX`,
      description: post.frontmatter.description,
      activePage: "blog",
      content: generateBlogPostContent(post, blogPosts),
    },
  })),

  // Dynamic portfolio item pages
  ...portfolioItems.map((item) => ({
    name: `portfolio-${item.slug}`,
    filename: `portfolio/${item.slug}.html`,
    entry: "/src/main.js",
    data: {
      title: `${item.frontmatter.title} - FathurDevX`,
      description: item.frontmatter.description,
      activePage: "portfolio",
      content: generatePortfolioItemContent(item, portfolioItems),
    },
  })),
];

// Generate rewrites for nested pages
const rewrites = [
  // Blog post rewrites
  ...blogPosts.map((post) => ({
    from: new RegExp(`^${BASE_PATH}/blog/${post.slug}(\\.html)?$`),
    to: `${BASE_PATH}/blog/${post.slug}.html`,
  })),
  // Portfolio item rewrites
  ...portfolioItems.map((item) => ({
    from: new RegExp(`^${BASE_PATH}/portfolio/${item.slug}(\\.html)?$`),
    to: `${BASE_PATH}/portfolio/${item.slug}.html`,
  })),
];

export default defineConfig({
  plugins: [
    contentWatcherPlugin(),
    tailwindcss(),
    createMpaPlugin({
      template: "base.html",
      pages,
      rewrites,
    }),
  ],
  base: BASE_PATH + "/",
});
