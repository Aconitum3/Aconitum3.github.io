import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: "https://aconitum3.github.io",
  markdown: {
    rehypePlugins: [
      ['rehype-katex',{}]
    ],
    remarkPlugins: [
      'remark-math'
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
