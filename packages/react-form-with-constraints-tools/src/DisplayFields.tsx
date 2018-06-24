import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import {
  FormWithConstraints,
  FormWithConstraintsChildContext,
  FieldFeedback as _FieldFeedback, FieldFeedbackType,
  FieldFeedbacks as _FieldFeedbacks,
  Async as _Async,
  FieldEvent
} from 'react-form-with-constraints';

export interface DisplayFieldsProps {}

export class DisplayFields extends React.Component<DisplayFieldsProps> {
  static contextTypes: React.ValidationMap<FormWithConstraintsChildContext> = {
    form: PropTypes.object.isRequired
  };
  context!: FormWithConstraintsChildContext;

  componentWillMount() {
    const { form } = this.context;
    form.fieldsStore.addListener(FieldEvent.Added, this.reRender);
    form.fieldsStore.addListener(FieldEvent.Removed, this.reRender);
    form.addFieldDidValidateEventListener(this.reRender);
    form.addResetEventListener(this.reRender);
  }

  componentWillUnmount() {
    const { form } = this.context;
    form.fieldsStore.removeListener(FieldEvent.Added, this.reRender);
    form.fieldsStore.removeListener(FieldEvent.Removed, this.reRender);
    form.removeFieldDidValidateEventListener(this.reRender);
    form.removeResetEventListener(this.reRender);
  }

  reRender = () => {
    this.forceUpdate();
  }

  render() {
    let str = stringifyWithUndefinedAndWithoutPropertyQuotes(this.context.form.fieldsStore.fields, 2);

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
    str = str.replace(/{\s+key: (.*),\s+type: (.*),\s+show: (.*)\s+}/g, '{ key: $1, type: $2, show: $3 }');

    return <pre style={{fontSize: 'small'}}>Fields = {str}</pre>;
  }
}

// See Preserving undefined that JSON.stringify otherwise removes https://stackoverflow.com/q/26540706
// See JSON.stringify without quotes on properties? https://stackoverflow.com/q/11233498
const stringifyWithUndefinedAndWithoutPropertyQuotes = (obj: object, space?: string | number) => {
  let str = JSON.stringify(obj, (_key, value) => value === undefined ? '__undefined__' : value, space);
  str = str.replace(/"__undefined__"/g, 'undefined');
  str = str.replace(/"([^"]+)":/g, '$1:');
  return str;
};

export { FormWithConstraints };

export class FieldFeedbacks extends _FieldFeedbacks {
  render() {
    const { for: fieldName, stop } = this.props;

    let attr = '';
    if (fieldName) attr += `for="${fieldName}" `;
    attr += `stop="${stop}"`;

    return (
      <>
        <li>key="{this.key}" {attr}</li>
        <ul>
          {super.render()}
        </ul>
      </>
    );
  }
}

export class FieldFeedback extends _FieldFeedback {
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
    }

    return textDecoration;
  }

  render() {
    const { key, type } = this.state.validation;

    return (
      <li>
        <span style={{textDecoration: this.getTextDecoration()}}>key="{key}" type="{type}"</span>{' '}
        {super.render()}
      </li>
    );
  }

  componentDidUpdate() {
    const el = ReactDOM.findDOMNode(this) as HTMLLIElement;

    // Hack: make FieldFeedback <span style="display: inline">
    // Also make Bootstrap 4 happy because it sets 'display: none', see https://github.com/twbs/bootstrap/blob/v4.0.0/scss/mixins/_forms.scss#L31
    const fieldFeedbackSpans = el.querySelectorAll<HTMLSpanElement>('[data-feedback]');
    for (const fieldFeedbackSpan of fieldFeedbackSpans) {
      fieldFeedbackSpan.style.display = 'inline';
    }

    // Change Async parent style
    const li = el.closest('li.async');
    if (li !== null) {
      const async = li.querySelector<HTMLSpanElement>('span[style]');
      async!.style.textDecoration = this.getTextDecoration();
    }

    // Change whenValid style
    const { type } = this.state.validation;
    if (type === FieldFeedbackType.WhenValid) {
      const span = el.querySelector<HTMLSpanElement>('span[style]');
      const whenValid = el.querySelector<HTMLSpanElement>(`span.${this.props.classes!.valid}`);
      span!.style.textDecoration = whenValid !== null ? '' : 'line-through';
    }
  }
}

export class Async<T> extends _Async<T> {
  private getTextDecoration() {
    return 'line-through dotted';
  }

  componentWillUpdate() {
    const el = ReactDOM.findDOMNode(this) as HTMLLIElement;

    // Reset style
    const async = el.querySelector<HTMLSpanElement>('span[style]');
    async!.style.textDecoration = this.getTextDecoration();
  }

  render() {
    return (
      <li className="async">
        <span style={{textDecoration: this.getTextDecoration()}}>Async</span>
        <ul>
          {super.render()}
        </ul>
      </li>
    );
  }
}
