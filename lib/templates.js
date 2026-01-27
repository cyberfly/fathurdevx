import { formatDate } from "./content.js";

/**
 * Generate thumbnail design based on the Playful Geometric design system
 * Returns a color from the design system palette (accent, secondary, tertiary, quaternary)
 */
function generateThumbnailColor(slug) {
  // Design system colors: Violet, Hot Pink, Amber, Emerald
  const colors = [
    { bg: "#8B5CF6", name: "accent" },     // Vivid Violet
    { bg: "#F472B6", name: "secondary" },  // Hot Pink
    { bg: "#FBBF24", name: "tertiary" },   // Amber/Yellow
    { bg: "#34D399", name: "quaternary" }, // Emerald/Mint
  ];

  // Simple hash function to pick a consistent color
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Generate blog card HTML from item data
 */
export function generateBlogCard(item, basePath = "") {
  const { frontmatter, slug } = item;
  const dateFormatted = formatDate(frontmatter.date);
  const color = generateThumbnailColor(slug);

  return `
    <a href="${basePath}/blog/${slug}.html" class="block group">
      <article class="h-full bg-white border-2 border-border-dark rounded-xl shadow-hard group-hover:shadow-hard-hover group-hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex flex-col overflow-hidden">
        <div class="h-48 relative overflow-hidden border-b-2 border-border-dark">
          ${
            frontmatter.thumbnail
              ? `<img src="${frontmatter.thumbnail}" alt="${frontmatter.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />`
              : `<div class="absolute inset-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105" style="background-color: ${color.bg};">
                  <!-- Polka dot pattern overlay -->
                  <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle, #1E293B 1px, transparent 1px); background-size: 20px 20px;"></div>
                  <!-- Title overlay -->
                  <div class="absolute inset-0 flex items-center justify-center p-6">
                    <h3 class="font-heading font-bold text-2xl text-white text-center" style="text-shadow: 4px 4px 0px rgba(30, 41, 59, 0.3);">
                      ${frontmatter.title}
                    </h3>
                  </div>
                </div>`
          }
          <div class="absolute top-4 right-4 bg-white px-3 py-1 rounded-full border-2 border-border-dark text-xs font-bold shadow-sm z-10 uppercase tracking-wide">
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
  const color = generateThumbnailColor(slug);

  const tagsHtml = (frontmatter.tags || [])
    .map(
      (tag) =>
        `<span class="text-xs font-bold px-2 py-1 bg-muted rounded-md border border-border-dark">${tag}</span>`
    )
    .join("");

  return `
    <a href="${basePath}/portfolio/${slug}.html" class="group block relative">
      <div class="bg-white border-2 border-border-dark rounded-xl shadow-hard group-hover:shadow-hard-hover group-hover:-translate-y-2 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden h-full flex flex-col">
        <div class="h-48 relative border-b-2 border-border-dark overflow-hidden">
          ${
            frontmatter.thumbnail
              ? `<div class="absolute inset-0 bg-accent/10 group-hover:bg-accent/20 transition-colors z-10"></div>
                 <img src="${frontmatter.thumbnail}" alt="${frontmatter.title}" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />`
              : `<div class="absolute inset-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105" style="background-color: ${color.bg};">
                  <!-- Diagonal stripe pattern overlay -->
                  <div class="absolute inset-0 opacity-15" style="background-image: repeating-linear-gradient(45deg, #1E293B 0px, #1E293B 2px, transparent 2px, transparent 10px);"></div>
                  <!-- Title overlay -->
                  <div class="absolute inset-0 flex items-center justify-center p-6">
                    <h3 class="font-heading font-bold text-3xl text-white text-center" style="text-shadow: 4px 4px 0px rgba(30, 41, 59, 0.3);">
                      ${frontmatter.title}
                    </h3>
                  </div>
                </div>`
          }
          <div class="absolute top-4 right-4 bg-white border-2 border-border-dark px-3 py-1 rounded-full text-xs font-bold shadow-sm z-20 uppercase tracking-wide">
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
 * Get primary tech icon for training cards
 */
function getPrimaryTechIcon(tags) {
  // Map of technology names to their SVG logos
  const techIcons = {
    'TailwindCSS': {
      color: '#06B6D4',
      gradient: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
      svg: '<svg viewBox="0 0 54 33" fill="currentColor"><path d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"/></svg>'
    },
    'Laravel': {
      color: '#FF2D20',
      gradient: 'linear-gradient(135deg, #FF2D20 0%, #FF5C4D 100%)',
      svg: '<svg viewBox="0 0 50 52" fill="currentColor"><path d="M49.626 11.564a.809.809 0 0 1 .028.209v10.972a.8.8 0 0 1-.402.694l-9.209 5.302V39.25c0 .286-.152.55-.4.694L20.42 51.01c-.044.025-.092.041-.14.058-.018.006-.035.017-.054.022a.805.805 0 0 1-.41 0c-.022-.006-.042-.018-.063-.026-.044-.016-.09-.03-.132-.054L.402 39.944A.801.801 0 0 1 0 39.25V6.334c0-.072.01-.142.028-.21.006-.023.02-.044.028-.067.015-.042.029-.085.051-.124.015-.026.037-.047.055-.071.023-.032.044-.065.071-.093.023-.023.053-.04.079-.06.029-.024.055-.05.088-.069h.001l9.61-5.533a.802.802 0 0 1 .8 0l9.61 5.533h.002c.032.02.059.045.088.068.026.02.055.038.078.06.028.029.048.062.072.094.017.024.04.045.054.071.023.04.036.082.052.124.008.023.022.044.028.068a.809.809 0 0 1 .028.209v20.559l8.008-4.611v-10.51c0-.07.01-.141.028-.208.007-.024.02-.045.028-.068.016-.042.03-.085.052-.124.015-.026.037-.047.054-.071.024-.032.044-.065.072-.093.023-.023.052-.04.078-.06.03-.024.056-.05.088-.069h.001l9.611-5.533a.801.801 0 0 1 .8 0l9.61 5.533c.034.02.06.045.09.068.025.02.054.038.077.06.028.029.048.062.072.094.018.024.04.045.054.071.023.039.036.082.052.124.009.023.022.044.028.068zm-1.574 10.718v-9.124l-3.363 1.936-4.646 2.675v9.124l8.01-4.611zm-9.61 16.505v-9.13l-4.57 2.61-13.05 7.448v9.216l17.62-10.144zM1.602 7.719v31.068L19.22 48.93v-9.214l-9.204-5.209-.003-.002-.004-.002c-.031-.018-.057-.044-.086-.066-.025-.02-.054-.036-.076-.058l-.002-.003c-.026-.025-.044-.056-.066-.084-.02-.027-.044-.05-.06-.078l-.001-.003c-.018-.03-.029-.066-.042-.1-.013-.03-.03-.058-.038-.09v-.001c-.01-.038-.012-.078-.016-.117-.004-.03-.012-.06-.012-.09v-.002-21.481L4.965 9.654 1.602 7.72zm8.81-5.994L2.405 6.334l8.005 4.609 8.006-4.61-8.006-4.608zm4.164 28.764l4.645-2.674V7.719l-3.363 1.936-4.646 2.675v20.096l3.364-1.937zM39.243 7.164l-8.006 4.609 8.006 4.609 8.005-4.61-8.005-4.608zm-.801 10.605l-4.646-2.675-3.363-1.936v9.124l4.645 2.674 3.364 1.937v-9.124zM20.02 38.33l11.743-6.704 5.87-3.35-8-4.606-9.211 5.303-8.395 4.833 7.993 4.524z"/></svg>'
    },
    'CodeIgniter': {
      color: '#EE4623',
      gradient: 'linear-gradient(135deg, #EE4623 0%, #FF6B4D 100%)',
      svg: '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M128 0C57.308 0 0 57.308 0 128s57.308 128 128 128 128-57.308 128-128S198.692 0 128 0zm0 243.2C64.844 243.2 12.8 191.156 12.8 128S64.844 12.8 128 12.8 243.2 64.844 243.2 128 191.156 243.2 128 243.2zm47.232-144.64c-2.176 0-4.096.512-5.632 1.536-1.536 1.024-2.816 2.56-3.84 4.608l-28.16 59.904-28.16-59.904c-1.024-2.048-2.304-3.584-3.84-4.608-1.536-1.024-3.456-1.536-5.632-1.536-3.584 0-6.4 1.024-8.448 3.072-2.048 2.048-3.072 4.864-3.072 8.448 0 1.536.256 3.072.768 4.608l33.024 68.608c1.024 2.048 2.56 3.584 4.608 4.608 2.048 1.024 4.352 1.536 6.912 1.536s4.864-.512 6.912-1.536c2.048-1.024 3.584-2.56 4.608-4.608l33.024-68.608c.512-1.536.768-3.072.768-4.608 0-3.584-1.024-6.4-3.072-8.448-2.048-2.048-4.864-3.072-8.448-3.072z"/></svg>'
    },
    'JavaScript': {
      color: '#F7DF1E',
      gradient: 'linear-gradient(135deg, #F7DF1E 0%, #FFED4E 100%)',
      svg: '<svg viewBox="0 0 256 256"><rect width="256" height="256" fill="currentColor"/><path fill="#000" d="M67.312 213.932l19.59-11.856c3.78 6.701 7.218 12.371 15.465 12.371 7.905 0 12.89-3.092 12.89-15.12v-81.798h24.057v82.138c0 24.917-14.606 36.259-35.916 36.259-19.245 0-30.416-9.967-36.087-21.996m85.07-2.576l19.588-11.341c5.157 8.421 11.859 14.607 23.715 14.607 9.969 0 16.325-4.984 16.325-11.858 0-8.248-6.53-11.17-17.528-15.98l-6.013-2.58c-17.357-7.387-28.87-16.667-28.87-36.257 0-18.044 13.747-31.792 35.228-31.792 15.294 0 26.292 5.328 34.196 19.247l-18.732 12.03c-4.125-7.389-8.591-10.31-15.465-10.31-7.046 0-11.514 4.468-11.514 10.31 0 7.217 4.468 10.14 14.778 14.608l6.014 2.577c20.45 8.765 31.963 17.7 31.963 37.804 0 21.654-17.012 33.51-39.867 33.51-22.339 0-36.774-10.654-43.819-24.574"/></svg>'
    },
    'PHP': {
      color: '#777BB4',
      gradient: 'linear-gradient(135deg, #777BB4 0%, #8892BF 100%)',
      svg: '<svg viewBox="0 0 256 134" fill="currentColor"><path d="M128 0C57.221 0 0 29.525 0 67s57.221 67 128 67 128-29.525 128-67S198.779 0 128 0zm0 126.5c-65.945 0-119.5-26.641-119.5-59.5S62.055 7.5 128 7.5 247.5 34.141 247.5 67 193.945 126.5 128 126.5z"/></svg>'
    },
    'MySQL': {
      color: '#4479A1',
      gradient: 'linear-gradient(135deg, #00758F 0%, #4479A1 100%)',
      svg: '<svg viewBox="0 0 256 252" fill="currentColor"><path d="M235.648 194.212c-13.918-.347-24.705 1.045-33.752 4.872-2.61 1.043-6.786 1.044-7.134 4.35 1.392 1.392 1.566 3.654 2.784 5.567 2.09 3.479 5.741 8.177 9.047 10.614 3.653 2.783 7.308 5.566 11.134 8.002 6.786 4.176 14.442 6.611 21.053 10.787 3.829 2.434 7.654 5.568 11.482 8.177 1.914 1.39 3.131 3.654 5.568 4.523v-.521c-1.219-1.567-1.567-3.828-2.784-5.568-1.738-1.74-3.48-3.306-5.22-5.046-5.045-6.784-11.308-12.7-18.093-17.571-5.393-3.832-17.747-9.047-20.008-15.485 0 0-.175-.173-.348-.347 3.827-.348 8.35-1.74 12.005-2.784 5.915-1.567 11.308-1.218 17.398-2.784 2.783-.696 5.567-1.566 8.35-2.436v-1.565c-3.13-3.132-5.392-7.307-8.698-10.265-8.873-7.657-18.617-15.137-28.838-21.049-5.567-3.306-12.528-5.046-18.617-7.832-2.262-1.045-6.09-1.566-7.654-3.48-3.827-4.177-5.915-9.397-8.7-14.093-5.913-9.747-11.657-20.356-16.875-30.625-3.655-7.133-6.09-14.092-10.614-20.529-21.4-30.799-44.464-49.412-80.144-67.68-7.654-3.91-16.702-6.09-25.923-8.699-5.046-.17-10.093-.51-15.137-.697-3.132-1.391-6.437-5.393-9.222-7.133C18.618 4.523 1.392-7.307.566 4.87c-.522 7.656 7.308 15.138 11.483 19.143 4.348 4.175 10.084 8.524 13.564 13.39 2.262 3.306 2.784 6.612 4.698 10.265 4.523 8.524 8.524 17.75 13.919 25.579 2.784 3.654 5.568 7.83 8.699 11.135 1.74 1.914 4.348 2.784 5.392 5.566-3.132 4.35-3.306 9.918-5.044 14.967-7.657 22.66-4.698 50.845 5.915 67.547 3.308 5.046 11.135 15.835 21.748 11.656 9.223-3.48 7.137-14.269 9.748-23.837 .524-1.914.176-3.305 1.044-4.698v.349c2.09 4.176 4.176 8.35 6.09 12.528 4.698 7.656 12.877 15.66 19.837 21.05 3.654 2.783 6.609 7.656 11.308 9.396v-.349h-.349c-.873-1.393-2.437-1.914-3.654-3.131-2.783-2.783-5.916-6.09-8.174-9.047-6.786-8.522-12.702-17.747-18.093-27.319-2.61-4.872-4.871-10.265-7.133-15.312-1.045-2.088-1.045-5.22-2.784-6.263-2.61 3.827-6.437 7.133-8.351 11.83-3.304 7.481-3.653 16.702-4.871 26.27-.696.176-.349 0-.697.349-6.959-1.741-9.395-8.874-11.983-14.942-6.438-15.316-7.656-40.043-1.913-57.79 1.392-4.346 7.657-18.089 5.220-22.261-1.218-3.654-5.046-5.745-7.133-8.699-2.434-3.653-5.045-8.176-6.78-12.18-4.176-10.065-6.09-21.222-10.787-31.113-2.262-4.698-6.09-9.574-9.395-13.748-3.653-4.698-7.83-8.001-10.613-13.572-1.045-2.088-2.089-5.046-1.044-7.482.173-1.741 1.047-2.436 2.61-3.132 2.263-1.566 8.7.783 10.962 1.565 6.438 2.261 11.831 4.523 17.225 7.832 2.61 1.565 5.393 4.698 8.524 5.568h3.83c5.915 1.394 12.528.7 18.093 2.264 9.92 3.132 18.791 7.833 26.97 13.046 24.88 15.835 45.237 38.324 59.157 66.117 2.262 4.52 3.132 8.871 5.045 13.572 3.827 9.395 8.524 19.143 13.217 28.015 4.524 8.524 9.052 17.226 14.617 24.534 3.13 4.176 15.31 6.438 20.88 8.7 4.176 1.565 11.137 3.13 14.965 5.045 7.482 3.48 14.792 7.656 21.747 11.83 3.48 2.264 14.268 7.31 15.137 11.66z"/></svg>'
    }
  };

  if (!tags || tags.length === 0) return null;

  // Get the first tag that has an icon
  for (const tag of tags) {
    if (techIcons[tag]) {
      return techIcons[tag];
    }
  }

  return null;
}

/**
 * Generate training card HTML from item data
 */
export function generateTrainingCard(item, basePath = "") {
  const { frontmatter, slug } = item;
  const color = generateThumbnailColor(slug);
  const primaryIcon = getPrimaryTechIcon(frontmatter.tags);

  const tagsHtml = (frontmatter.tags || [])
    .slice(0, 2)
    .map(
      (tag) =>
        `<span class="text-xs font-bold px-3 py-1 bg-accent/10 border-2 border-accent rounded-full text-accent">${tag}</span>`
    )
    .join("");

  return `
    <a href="${basePath}/training/${slug}.html" class="group block relative">
      <div class="bg-white border-2 border-border-dark rounded-xl shadow-hard group-hover:shadow-hard-hover group-hover:-translate-y-2 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden h-full flex flex-col">
        <div class="h-48 relative border-b-2 border-border-dark overflow-hidden">
          ${
            primaryIcon
              ? `<div class="absolute inset-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105" style="background: ${primaryIcon.gradient};">
                  <!-- Icon in center -->
                  <div class="absolute inset-0 flex items-center justify-center p-12">
                    <div class="w-24 h-24 text-white drop-shadow-[4px_4px_8px_rgba(0,0,0,0.3)]">
                      ${primaryIcon.svg}
                    </div>
                  </div>
                </div>`
              : `<div class="absolute inset-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105" style="background-color: ${color.bg};">
                  <!-- Grid pattern overlay -->
                  <div class="absolute inset-0 opacity-15" style="background-image: linear-gradient(#1E293B 1px, transparent 1px), linear-gradient(90deg, #1E293B 1px, transparent 1px); background-size: 20px 20px;"></div>
                  <!-- Title overlay -->
                  <div class="absolute inset-0 flex items-center justify-center p-6">
                    <h3 class="font-heading font-bold text-3xl text-white text-center" style="text-shadow: 4px 4px 0px rgba(30, 41, 59, 0.3);">
                      ${frontmatter.title}
                    </h3>
                  </div>
                </div>`
          }
        </div>
        <div class="p-6 flex-1 flex flex-col">
          <div class="flex flex-wrap gap-2 mb-3">
            ${tagsHtml}
          </div>
          <h3 class="font-heading font-bold text-2xl mb-2 group-hover:text-accent transition-colors">
            ${frontmatter.title}
          </h3>
          <p class="text-mutedForeground mb-4 line-clamp-3 flex-1">
            ${frontmatter.description}
          </p>
          <div class="flex items-center text-accent font-bold text-sm mt-auto">
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ml-2 group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
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
