import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { createMpaPlugin } from 'vite-plugin-virtual-mpa'
import { resolve } from 'path'
import { readFileSync } from 'fs'

// Read content files
const indexContent = readFileSync(resolve(__dirname, 'index.html'), 'utf-8')
const aboutContent = readFileSync(resolve(__dirname, 'about.html'), 'utf-8')
const contactContent = readFileSync(resolve(__dirname, 'contact.html'), 'utf-8')

export default defineConfig({
  plugins: [
    tailwindcss(),
    createMpaPlugin({
      template: 'base.html',
      pages: [
        {
          name: 'index',
          entry: '/src/main.js',
          data: {
            title: 'Home - FathurDevX',
            description: 'Built with Vite + Tailwind CSS + Alpine.js',
            activePage: 'home',
            content: indexContent
          }
        },
        {
          name: 'about',
          entry: '/src/main.js',
          data: {
            title: 'About - FathurDevX',
            description: 'Learn more about FathurDevX',
            activePage: 'about',
            content: aboutContent
          }
        },
        {
          name: 'contact',
          entry: '/src/main.js',
          data: {
            title: 'Contact - FathurDevX',
            description: 'Get in touch with us',
            activePage: 'contact',
            content: contactContent
          }
        }
      ]
    })
  ],
  // GitHub Pages deploys to https://<username>.github.io/<repo-name>/
  // Change 'fathurdevx' to your repository name
  base: '/fathurdevx/',
})
