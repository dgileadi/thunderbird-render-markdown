const markdownPatterns = [
  /^text\/markdown\b/i,
  /^text\/x-markdown\b/i,
  /\bmarkup=markdown\b/i,
];
const textPlainPattern = /^text\/plain\b/i;
const rfc822Pattern = /^message\/rfc822\b/i;
const defaultDetectScope = 'all-plain-text';
let detectScope = defaultDetectScope;
let isMarkdownMessage = false;
let showingMarkdown = false;

function shouldDisplayMarkdown(contentType) {
  let patterns =
    detectScope === defaultDetectScope
      ? [textPlainPattern, rfc822Pattern]
      : markdownPatterns;
  return patterns.some((pattern) => pattern.test(contentType));
}

function getPlainText(messagePart) {
  if (
    messagePart.body &&
    (textPlainPattern.test(messagePart.contentType) ||
      markdownPatterns.some((pattern) => pattern.test(contentType)))
  ) {
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
  isMarkdownMessage = false;
  showingMarkdown = false;

  let message = await messenger.messageDisplay.getDisplayedMessage(tabId);
  let full = await messenger.messages.getFull(message.id);

  if (shouldDisplayMarkdown(full.headers['content-type'])) {
    const text = getPlainText(full);
    if (text) {
      sendRenderMarkdownCommand(tabId, text);

      isMarkdownMessage = true;
      showingMarkdown = true;
    }
  }

  updateContextMenuItem();
}

function sendRenderMarkdownCommand(tabId, text) {
  messenger.tabs.sendMessage(tabId, {
    command: 'renderMarkdown',
    text: text,
    as: showingMarkdown ? 'plain' : 'markdown'
  });
}

async function updateContextMenuItem() {
  if (contextMenuId) {
    messenger.menus.update(contextMenuId, {
      title: showingMarkdown ? 'Show as Plain Text' : 'Show as Markdown',
      visible: isMarkdownMessage,
    });
  }
}

// When the page sends us a command (when it loaded), detect markdown
browser.runtime.onMessage.addListener((data, sender) => {
  if (data.command === 'detectMarkdownMessage') {
    detectMarkdownMessage(sender.tab.id);
  }
});

// Listen to option changes for our detectScope option
browser.storage.onChanged.addListener((changes) => {
  if (!!changes.scope) {
    detectScope = changes.scope.newValue || defaultDetectScope;
  }
});
browser.storage.sync.get('scope').then((res) => {
  detectScope = res.scope || defaultDetectScope;
});

// Inject markdown rendering scripts and CSS
browser.messageDisplayScripts.register({
  js: [
    { file: 'marked.min.js' },
    { file: 'purify.min.js' },
    { file: 'initial.js' },
  ],
  css: [{ file: 'css/markdown.css' }],
});

// Add context menu item
const contextMenuId = messenger.menus.create({
  title: 'Show as Plain Text',
  contexts: ['page', 'frame'],
  visible: false,
});

// Register a listener for the context menu click
messenger.menus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId == contextMenuId) {
    sendRenderMarkdownCommand(tab.id, null);
    showingMarkdown = !showingMarkdown;
    updateContextMenuItem();
  }
});
