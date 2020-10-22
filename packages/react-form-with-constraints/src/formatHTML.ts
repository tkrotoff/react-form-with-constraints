import { html_beautify } from 'js-beautify';

export const keys = 'data-feedbacks';
export const key = 'data-feedback';

export const error = 'class="error"';
export const warning = 'class="warning"';
export const info = 'class="info"';
export const whenValid = 'class="when-valid"';

// [d-block](https://getbootstrap.com/docs/4.5/utilities/display/)
export const dBlock = 'style="display: block;"';

// I've tried Prettier and the result is not as good
export function formatHTML(html: string, indentation: string) {
  return (
    html_beautify(html, { indent_size: 2, inline: [] })
      // [Add a char to the start of each line in JavaScript using regular expression](https://stackoverflow.com/q/11939575)
      .replace(/^/gm, indentation)
  );
}
