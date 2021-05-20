import {
  Async,
  FieldFeedback as _FieldFeedback,
  FieldFeedbackProps,
  FieldFeedbacks,
  FormWithConstraints,
  Input as _Input,
  InputProps
} from 'react-form-with-constraints';

// ## Error
//
// - Bootstrap 5 "input.form-control.is-invalid":
// https://getbootstrap.com/docs/5.0/forms/validation/#server-side
//
// ## Warning
//
// - Bootstrap >= 4: not available
//
// - Bootstrap v4.0.0-alpha.6 "input.form-control.form-control-warning":
// https://v4-alpha.getbootstrap.com/components/forms/#validation
// https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.6/scss/_forms.scss#L254
//
// - Bootstrap 3 "div.form-group.has-warning":
// https://getbootstrap.com/docs/3.3/css/#forms-control-validation
// https://github.com/twbs/bootstrap/blob/v3.3.7/less/forms.less#L431
//
// - Bootstrap 2 "div.control-group.warning":
// https://getbootstrap.com/2.3.2/base-css.html#forms
// https://github.com/twbs/bootstrap/blob/v2.3.2/less/forms.less#L347
//
// ## Info
//
// - Bootstrap >= 3: not available
//
// - Bootstrap 2 "div.control-group.info":
// https://getbootstrap.com/2.3.2/base-css.html#forms
// https://github.com/twbs/bootstrap/blob/v2.3.2/less/forms.less#L347
//
// ## WhenValid
//
// - Bootstrap 5 "input.form-control.is-valid":
// https://getbootstrap.com/docs/5.0/forms/validation/#server-side

export class FieldFeedback extends _FieldFeedback {
  static defaultProps: FieldFeedbackProps = {
    // https://github.com/facebook/react/issues/3725#issuecomment-169163998
    // [React.Component.defaultProps objects are overridden, not merged?](https://stackoverflow.com/q/40428847)
    ..._FieldFeedback.defaultProps,
    classes: {
      error: 'invalid-feedback',
      warning: 'warning-feedback',
      info: 'info-feedback',
      whenValid: 'valid-feedback'
    }
  };
}

export class FieldFeedbackTooltip extends _FieldFeedback {
  static defaultProps: FieldFeedbackProps = {
    // https://github.com/facebook/react/issues/3725#issuecomment-169163998
    // [React.Component.defaultProps objects are overridden, not merged?](https://stackoverflow.com/q/40428847)
    ..._FieldFeedback.defaultProps,
    classes: {
      error: 'invalid-tooltip',
      warning: 'warning-tooltip',
      info: 'info-tooltip',
      whenValid: 'valid-tooltip'
    }
  };
}

export class Input extends _Input {
  static defaultProps: InputProps = {
    classes: {
      isPending: 'is-pending',
      hasErrors: 'is-invalid',
      hasWarnings: 'is-warning',
      hasInfos: 'is-info',
      isValid: 'is-valid'
    }
  };
}

export { FormWithConstraints, FieldFeedbacks, Async };
