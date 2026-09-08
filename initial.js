const tokenizer = new marked.Tokenizer();
const defaultTable = tokenizer.table;
tokenizer.table = function (src) {
  // if this could be a table (i.e. the first line contains a pipe), fix line breaks
  if (src.match(/^[^\r\n]*\|/)) {
    // get the whole block's content (everything up to the next empty line)
    const blockMatch = src.match(/^([^\r\n]+\r?\n)+/);
    // flowed lines are those that end with a space before the newline;
    // remove newlines from flowed lines
    const unwrapped = blockMatch[0].replace(/([^\r\n]+ )\r?\n/g, '$1');

    // let the default implementation do the real work
    const token = defaultTable.call(this, unwrapped);
    if (!!token) {
      // put back the pre-wrapped content to avoid later parsing issues
      token.raw = blockMatch[0].replace(/\n*$/, '');
    }
    return token;
  } else {
    return;
  }
}

marked.use({ tokenizer });

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
try
{
  const markdownHTML = DOMPurify.sanitize(marked.parse(text));

  const markdownDiv = document.createElement('div');
  markdownDiv.classList.add('markdown');
  markdownDiv.classList.add('tb-message-markdown');
  markdownDiv.style = style;
  if ('Sanitizer' in window) {
    markdownDiv.setHTML(markdownHTML);
  } else {
    markdownDiv.innerHTML = markdownHTML;
  }
  plaintextParent.insertAdjacentElement('afterend', markdownDiv);
  const markdownParent = document.querySelector('.tb-message-markdown');

  plaintextParent.classList.forEach(cls => markdownParent.classList.add(cls));
  plaintextParent.classList.add('tb-message-plaintext');

  plaintextParent.hidden = true;
} catch (e) {
  console.error(e);
}
}

function displayMarkdown(on) {
  const plaintextParent = document.querySelector('.tb-message-plaintext');
  const markdownParent = document.querySelector('.tb-message-markdown');
  if (plaintextParent) {
    plaintextParent.hidden = on;
  }
  if (markdownParent) {
    markdownParent.hidden = !on;
  }
}

function displayDebugHTML() {
  const body = document.querySelector('body');
  body.append(body.innerHTML);
}

browser.runtime.sendMessage({ command: 'detectMarkdownMessage' });
