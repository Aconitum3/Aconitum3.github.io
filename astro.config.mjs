import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: "https://aconitum3.github.io",
  markdown: {
    processor: unified(),
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
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
