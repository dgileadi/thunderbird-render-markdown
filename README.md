# Render Markdown messages in the reading pane

This extension renders markdown-formatted messages as rich text. It preserves the formatting of plain text messages but adds support for markdown features like lists, code blocks, etc.

Markdown messages are those having a content-type of `text/markdown`, `text/x-markdown` or `text/plain` plus `markup=markdown` [a la MailMate](https://blog.freron.com/2011/thoughts-on-writing-emails-using-markdown/).

This extension uses [marked.js](https://marked.js.org/) to render the markdown and [DOMPurify](https://github.com/cure53/DOMPurify) to sanitize the resulting HTML.
