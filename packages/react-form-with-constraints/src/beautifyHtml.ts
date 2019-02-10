import { html_beautify } from 'js-beautify';

// TODO Replace by Prettier when HTML is supported
export default function beautifyHtml(html: string, indentation: string) {
  return html_beautify(html, {
    indent_size: 2,
    inline: [] // FIXME See Add function default_options() to beautifier.js https://github.com/beautify-web/js-beautify/issues/1364
  }).replace(/^/gm, indentation); // See Add a char to the start of each line in JavaScript using regular expression https://stackoverflow.com/q/11939575
}
