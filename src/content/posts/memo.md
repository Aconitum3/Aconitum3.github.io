---
title: 'Astro備忘録'
pubDate: 2023-08-25
description: ""
tags: ['Astro','Markdown']
prev: ""
next: ""
---

# Astro備忘録

## `npm run dev`のホットリロード有効化
`astro.config.mjs`に`usePolling: true`を追加する。

```mjs
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
});
```

## DockerからサーバーをListen
`astro.config.js`に`host: true`を追加する。

```mjs
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
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
```

## コンポーネントを絶対パスでインポート
`tsconfig.json`に以下を追加する。
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

# escape text
&'""\\/

```javescript
var unescapeHtml = function(str) {
	if (typeof str !== 'string') return str;

	var patterns = {
		'&lt;'   : '<',
		'&gt;'   : '>',
		'&amp;'  : '&',
		'&quot;' : '"',
		'&#x27;' : '\'',
		'&#x60;' : '`'
	};

	return str.replace(/&(lt|gt|amp|quot|#x27|#x60);/g, function(match) {
		return patterns[match];
	});
};
```
# Copy Button

ref: [Adding a Copy Code Button in Astro Markdown Code Blocks](https://timneubauer.dev/blog/copy-code-button-in-astro/)

```js
let copyButtonLabel = "Copy Code";
let codeBlocks = Array.from(document.querySelectorAll("pre"));

for (let codeBlock of codeBlocks) {
  let wrapper = document.createElement("div");
  wrapper.className = "code-block";
  let copyButton = document.createElement("button");
  copyButton.className = "copy-code";
  copyButton.innerHTML = copyButtonLabel;  

  codeBlock.setAttribute("tabindex", "0");
  codeBlock.appendChild(copyButton);
  
  // wrap codebock with relative parent element
  codeBlock.parentNode.insertBefore(wrapper, codeBlock);
  wrapper.appendChild(codeBlock);

  copyButton.addEventListener("click", async () => {
    await copyCode(codeBlock, copyButton);
  });  
}

async function copyCode(block, button) {
  let code = block.querySelector("code");
  let text = code.innerText;

  await navigator.clipboard.writeText(text);

  // visual feedback that task is completed  
  button.innerText = "Code Copied";

  setTimeout(() => {
    button.innerText = copyButtonLabel;
  }, 700);  
}
```
