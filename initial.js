browser.runtime.onMessage.addListener((data) => {
  if (data.command === 'renderMarkdown') {
    if (data.text) {
      renderMarkdown(data.text);
      // displayDebugHTML();
    }
    displayMarkdown(data.as === 'markdown');
  }
});

function renderMarkdown(text) {
  const plaintextParent = document.querySelector('body > div');
  const style = plaintextParent.getAttribute('style');
  const markdownHTML = DOMPurify.sanitize(marked.parse(text));

  plaintextParent.insertAdjacentHTML('afterend',
    `<div class="markdown tb-message-markdown" style="${style}">${markdownHTML}</div>`);
  const markdownParent = document.querySelector('.tb-message-markdown');

  plaintextParent.classList.forEach(cls => markdownParent.classList.add(cls));
  plaintextParent.classList.add('tb-message-plaintext');

  plaintextParent.hidden = true;
}

function displayMarkdown(on) {
  const plaintextParent = document.querySelector('.tb-message-plaintext');
  const markdownParent = document.querySelector('.tb-message-markdown');
  plaintextParent.hidden = on;
  markdownParent.hidden = !on;
}

function displayDebugHTML() {
  const body = document.querySelector('body');
  body.append(body.innerHTML);
}

browser.runtime.sendMessage({ command: 'detectMarkdownMessage' });
