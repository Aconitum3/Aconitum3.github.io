let copyButtonLabel = "Copy LaTeX";
let mathBlocks = Array.from(document.querySelectorAll(".math-display"));

for (let mathBlock of mathBlocks) {
  let wrapper = document.createElement("div");
  wrapper.className = "math-block";
  
  let copyButton = document.createElement("button");
  copyButton.className = "copy-button";

  let clipboardIcon = document.createElementNS("http://www.w3.org/2000/svg","svg");
  clipboardIcon.setAttribute("width", "20");
  clipboardIcon.setAttribute("height", "20");
  clipboardIcon.setAttribute("xlmns", "http://www.w3.org/2000/svg");
  clipboardIcon.setAttribute("viewBox","0 0 384 512");

  let svgPath = document.createElementNS("http://www.w3.org/2000/svg","path");
  svgPath.setAttribute("d", "M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z");
  clipboardIcon.appendChild(svgPath);
  copyButton.appendChild(clipboardIcon);

  let copyMessage = document.createElement("div");
  copyMessage.className = "copy-message";
  copyMessage.innerHTML = "Copied!";
  copyMessage.style.display = "none";

  let copyBlock = document.createElement("div");
  copyBlock.className = "copy-block";

  copyBlock.appendChild(copyMessage);
  copyBlock.appendChild(copyButton);
  
  mathBlock.setAttribute("tabindex", "0");
  mathBlock.appendChild(copyBlock);
  
  // wrap codebock with relative parent element
  mathBlock.parentNode.insertBefore(wrapper, mathBlock);
  wrapper.appendChild(mathBlock);

  copyBlock.addEventListener("click", async () => {
    await copyLatex(mathBlock, copyBlock);
  });  
}

async function copyLatex(mathBlock, copyBlock) {
  let latex = mathBlock.querySelector("annotation");
  let text = latex.textContent;
  await navigator.clipboard.writeText(text);

  // visual feedback that task is completed  
  let message = copyBlock.querySelector(".copy-message");
  message.style.display = "inline";

  setTimeout(() => {
    message.style.display = "none";
  }, 900);  
}
