browser.runtime.onMessage.addListener((data) => {
  if (data.command === 'renderMarkdown') {
    renderMarkdown(data.text);
  }
});

function renderMarkdown(text) {
  var parent = document.querySelector('body > div');
  parent.innerHTML = DOMPurify.sanitize(marked.parse(text));
  parent.classList.add('markdown');
}

browser.runtime.sendMessage({ command: 'detectMarkdownMessage' });
