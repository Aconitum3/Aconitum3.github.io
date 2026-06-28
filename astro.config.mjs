import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeExternalLinks from 'rehype-external-links';
import remarkMath from 'remark-math';
import rehypeMathJax from 'rehype-mathjax';

export default defineConfig({
  site: "https://aconitum3.github.io",
  markdown: {
    processor: unified(),
    remarkPlugins: [remarkMath],
    rehypePlugins: [
        rehypeMathJax,
        [rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['noopener', 'noreferrer'] 
        }]
    ],
    shikiConfig: {
      theme: 'dracula',
      langs: [],
      wrap: true
    }
  },
  server: {
    host: true
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
});
