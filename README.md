# Render Markdown messages in the reading pane

This extension renders markdown-formatted messages as rich text. It preserves the formatting of plain text messages but adds support for markdown features like lists, code blocks, etc.

By default this extension renders markdown in all plain text messages. You can use this extension's options to change this to only render markdown in messages with a markdown content type. Specifically, these are messages having a content type of `text/markdown`, `text/x-markdown` or `text/plain` plus `markup=markdown` [a la MailMate](https://blog.freron.com/2011/thoughts-on-writing-emails-using-markdown/).

You may turn markdown rendering on or off by right-clicking on the message text and choosing Show as Plain Text or Show as Markdown.

This extension uses [marked.js](https://marked.js.org/) to render the markdown and [DOMPurify](https://github.com/cure53/DOMPurify) to sanitize the resulting HTML.

## FAQ

**Q: Can this extension compose messages using markdown?**

**A:** No, you're probably looking for [Markdown Here Revival](https://addons.thunderbird.net/en-US/thunderbird/addon/markdown-here-revival/?src=search).

**Q: Can this extension or Markdown Here Revival send messages with a markdown content type?**

**A:** No, Thunderbird doesn't currently support changing the content type of sent messages. See [this bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1717221).
