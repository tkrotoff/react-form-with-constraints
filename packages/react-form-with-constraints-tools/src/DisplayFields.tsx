import * as React from 'react';
import { instanceOf } from 'prop-types';
import {
  Async as _Async,
  Field,
  FieldEvent,
  FieldFeedback as _FieldFeedback,
  FieldFeedbacks as _FieldFeedbacks,
  FieldFeedbackType,
  FormWithConstraints,
  FormWithConstraintsChildContext,
  isHTMLInput
} from 'react-form-with-constraints';

// Before:
// [
//   {
//     "element": "<input id=\"username\" name=\"username\" required=\"\" minlength=\"3\" class=\"form-control is-pending-sm is-invalid\" value=\"\">",
//     "name": "username",
//     "validations": [
//       { "key": "0.0", "type": "error", "show": false },
//       { "key": "0.1", "type": "error", "show": true },
//       { "key": "0.2", "type": "whenValid" }
//     ]
//   }
// ]
//
// After:
// [
//   {
//     element: <input id="username" name="username" required="" minlength="3" class="form-control is-pending-sm is-invalid" value="">,
//     name: "username",
//     validations: [
//       { key: "0.0", type: "error", show: false },
//       { key: "0.1", type: "error", show: true },
//       { key: "0.2", type: "whenValid", show: undefined }
//     ]
//   }
// ]
// eslint-disable-next-line @typescript-eslint/ban-types
function beautifulStringify(obj: {}, space?: string | number) {
  // Keep undefined
  // [Preserving undefined that JSON.stringify otherwise removes](https://stackoverflow.com/q/26540706)
  let str = JSON.stringify(
    obj,
    (_key, value) => (value === undefined ? '__undefined__' : value),
    space
  );
  str = str.replace(/"__undefined__"/g, 'undefined');

  // Remove quotes from properties
  // Before: "name":
  // After: name:
  // [JSON.stringify without quotes on properties?](https://stackoverflow.com/q/11233498)
  str = str.replace(/"([^"]+)":/g, '$1:');

  // Before: element: "<input id=\"username\" name=\"username\" required=\"\">",
  // After: element: <input id=\"username\" name=\"username\" required=\"\">,
  // eslint-disable-next-line unicorn/better-regex
  str = str.replace(/: "(.*[\\"].*)",/g, ': $1,');

  // Before: <input id=\"username\" name=\"username\" required=\"\">
  // After: <input id="username" name="username" required="">
  str = str.replace(/\\"/g, '"');

  return str;
}

// Cannot display field.element directly, will throw "Converting circular structure to JSON" when calling JSON.stringify()
function normalizeFieldElementProperty(fields: Field[]) {
  return fields.map(field => {
    const { element, ...otherProps } = field;
    return element
      ? {
          element: isHTMLInput(element) ? element.outerHTML : element.props,
          ...otherProps
        }
      : field;
  });
}

export class DisplayFields extends React.Component {
  static contextTypes: React.ValidationMap<FormWithConstraintsChildContext> = {
    form: instanceOf(FormWithConstraints).isRequired
  };
  context!: FormWithConstraintsChildContext;

  /* eslint-disable react/destructuring-assignment */

  componentDidMount() {
    this.context.form.fieldsStore.addListener(FieldEvent.Added, this.reRender);
    this.context.form.fieldsStore.addListener(FieldEvent.Removed, this.reRender);
    this.context.form.addFieldDidValidateEventListener(this.reRender);
    this.context.form.addFieldDidResetEventListener(this.reRender);
  }

  componentWillUnmount() {
    this.context.form.fieldsStore.removeListener(FieldEvent.Added, this.reRender);
    this.context.form.fieldsStore.removeListener(FieldEvent.Removed, this.reRender);
    this.context.form.removeFieldDidValidateEventListener(this.reRender);
    this.context.form.removeFieldDidResetEventListener(this.reRender);
  }

  reRender = () => {
    this.forceUpdate();
  };

  render() {
    let str = beautifulStringify(
      normalizeFieldElementProperty(this.context.form.fieldsStore.fields),
      2
    );

    // Cosmetic: improve formatting
    //
    // Replace this string:
    // {
    //   key: "1.0",
    //   type: "error",
    //   show: true
    // }
    // with this:
    // { key: "1.0", type: "error", show: true }
    str = str.replace(
      /{\s+key: (.*),\s+type: (.*),\s+show: (.*)\s+}/g,
      '{ key: $1, type: $2, show: $3 }'
    );

    return str;
  }

  /* eslint-enable react/destructuring-assignment */
}

export class FieldFeedbacks extends _FieldFeedbacks {
  render() {
    const { for: fieldName, stop } = this.props;

    let attr = '';
    if (fieldName) attr += `for="${fieldName}" `;
    attr += `stop="${stop}"`;

    return (
      <>
        <li>
          key="{this.key}" {attr}
        </li>
        <ul>{super.render()}</ul>
      </>
    );
  }
}

export class FieldFeedback extends _FieldFeedback {
  private rootEl: HTMLLIElement | null = null;

  private getTextDecoration() {
    const { show } = this.state.validation;

    let textDecoration = '';
    switch (show) {
      case false:
        textDecoration = 'line-through';
        break;
      case undefined:
        textDecoration = 'line-through dotted';
        break;
      default:
        textDecoration = '';
    }

    return textDecoration;
  }

  render() {
    const { key, type } = this.state.validation;

    return (
      <li ref={rootEl => (this.rootEl = rootEl)}>
        <span style={{ textDecoration: this.getTextDecoration() }}>
          key="{key}" type="{type}"
        </span>{' '}
        {super.render()}
      </li>
    );
  }

  componentDidUpdate() {
    // Hack: make FieldFeedback <span style="display: inline">
    // Also make Bootstrap 4 happy because it sets 'display: none', https://github.com/twbs/bootstrap/blob/v4.1.2/scss/mixins/_forms.scss#L31
    const fieldFeedbackSpans = this.rootEl!.querySelectorAll<HTMLSpanElement>('[data-feedback]');
    fieldFeedbackSpans.forEach(fieldFeedbackSpan => {
      // eslint-disable-next-line no-param-reassign
      fieldFeedbackSpan.style.display = 'inline';
    });

    // Change Async parent style
    const li = this.rootEl!.closest('li.async');
    if (li !== null) {
      const async = li.querySelector<HTMLSpanElement>('span[style]');
      async!.style.textDecoration = this.getTextDecoration();
    }

    // Change whenValid style
    const { type } = this.state.validation;
    if (type === FieldFeedbackType.WhenValid) {
      const span = this.rootEl!.querySelector<HTMLSpanElement>('span[style]');
      const whenValid = this.rootEl!.querySelector<HTMLSpanElement>(
        `span.${this.props.classes!.valid}`
      );
      span!.style.textDecoration = whenValid !== null ? '' : 'line-through';
    }
  }
}

export class Async<T> extends _Async<T> {
  private rootEl: HTMLLIElement | null = null;

  private static getTextDecoration() {
    return 'line-through dotted';
  }

  componentDidUpdate() {
    // Reset style
    const async = this.rootEl!.querySelector<HTMLSpanElement>('span[style]');
    async!.style.textDecoration = Async.getTextDecoration();
  }

  render() {
    return (
      <li className="async" ref={rootEl => (this.rootEl = rootEl)}>
        <span style={{ textDecoration: Async.getTextDecoration() }}>Async</span>
        <ul>{super.render()}</ul>
      </li>
    );
  }
}
