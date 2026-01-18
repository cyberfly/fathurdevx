import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getMarkdownFiles(dir) {
  const files = fs.readdirSync(dir);
  return files
    .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
    .map(file => path.join(dir, file));
}

async function updateHeroImages() {
  // Find all markdown files in portfolio and blog folders
  const portfolioDir = path.join(__dirname, 'content/portfolio');
  const blogDir = path.join(__dirname, 'content/blog');

  const markdownFiles = [
    ...getMarkdownFiles(portfolioDir),
    ...getMarkdownFiles(blogDir)
  ];

  console.log(`Found ${markdownFiles.length} files to process\n`);

  markdownFiles.forEach(filePath => {
    console.log(`Processing: ${filePath}`);

    // Read the file
    const content = fs.readFileSync(filePath, 'utf-8');

    // Split into frontmatter and body
    const parts = content.split('---');
    if (parts.length < 3) {
      console.log(`  ⚠️  Skipping - invalid frontmatter format\n`);
      return;
    }

    const frontmatter = parts[1];
    const body = parts.slice(2).join('---');

    // Find the first image in the markdown body
    const imageRegex = /!\[.*?\]\((.*?)\)/;
    const match = body.match(imageRegex);

    if (!match) {
      console.log(`  ℹ️  No images found in content - keeping existing heroImage\n`);
      return;
    }

    const firstImage = match[1];
    console.log(`  ✓ Found first image: ${firstImage}`);

    // Check if heroImage field exists in frontmatter
    if (!/heroImage:.*$/m.test(frontmatter)) {
      console.log(`  ⚠️  No heroImage field found in frontmatter - skipping\n`);
      return;
    }

    // Update the heroImage in frontmatter
    const updatedFrontmatter = frontmatter.replace(
      /heroImage:.*$/m,
      `heroImage: ${firstImage}`
    );

    // Reconstruct the file
    const updatedContent = `---${updatedFrontmatter}---${body}`;

    // Write back to file
    fs.writeFileSync(filePath, updatedContent, 'utf-8');
    console.log(`  ✓ Updated heroImage to: ${firstImage}\n`);
  });

  console.log('✓ All files processed!');
}

updateHeroImages();
