const markdownPatterns = [
  /^text\/markdown\b/i,
  /^text\/x-markdown\b/i,
  /\bmarkup=markdown\b/i
];
const textPlainPattern = /^text\/plain\b/i;

function isMarkdownContentType(contentType) {
  return markdownPatterns.some(pattern => pattern.test(contentType));
}

function getPlainText(messagePart) {
  if (messagePart.body && textPlainPattern.test(messagePart.contentType) || isMarkdownContentType(messagePart.contentType)) {
    return messagePart.body;
  }
  if (messagePart.parts) {
    for (let i = 0; i < messagePart.parts.length; i++) {
      let body = getPlainText(messagePart.parts[i]);
      if (body) {
        return body;
      }
    }
  }
}

async function detectMarkdownMessage(tabId) {
  let message = await messenger.messageDisplay.getDisplayedMessage(tabId);
  let full = await messenger.messages.getFull(message.id);

  if (isMarkdownContentType(full.headers['content-type'])) {
    const text = getPlainText(full);
    if (text) {
      messenger.tabs.sendMessage(tabId, { command: 'renderMarkdown', text: text });
    }
  }
}

browser.runtime.onMessage.addListener((data, sender) => {
  if (data.command === 'detectMarkdownMessage') {
    detectMarkdownMessage(sender.tab.id);
  }
});


browser.messageDisplayScripts.register({
  js: [
    { file: 'marked.min.js' },
    { file: 'purify.min.js' },
    { file: 'initial.js' }
  ],
  css: [
    { file: 'css/markdown.css' }
  ]
});
