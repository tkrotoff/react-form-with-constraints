import React from 'react';

import {
  FormWithConstraints,
  FieldFeedbacks,
  Async,
  FieldFeedback as _FieldFeedback, FieldFeedbackProps,
  Input as _Input, InputProps
} from 'react-form-with-constraints';

// ## Error
//
// - Bootstrap 4 "input.form-control.is-invalid":
// see https://getbootstrap.com/docs/4.1/components/forms/#server-side
// see https://github.com/twbs/bootstrap/blob/v4.1.1/scss/_forms.scss#L245
//
// ## Warning
//
// - Bootstrap >= 4: not available
//
// - Bootstrap v4.0.0-alpha.6 "input.form-control.form-control-warning":
// see https://v4-alpha.getbootstrap.com/components/forms/#validation
// see https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.6/scss/_forms.scss#L254
//
// - Bootstrap 3 "div.form-group.has-warning":
// see https://getbootstrap.com/docs/3.3/css/#forms-control-validation
// see https://github.com/twbs/bootstrap/blob/v3.3.7/less/forms.less#L431
//
// - Bootstrap 2 "div.control-group.warning":
// see http://getbootstrap.com/2.3.2/base-css.html#forms
// see https://github.com/twbs/bootstrap/blob/v2.3.2/less/forms.less#L347
//
// ## Info
//
// - Bootstrap >= 3: not available
//
// - Bootstrap 2 "div.control-group.info":
// see http://getbootstrap.com/2.3.2/base-css.html#forms
// see https://github.com/twbs/bootstrap/blob/v2.3.2/less/forms.less#L347
//
// ## WhenValid
//
// - Bootstrap 4 "input.form-control.is-valid":
// see https://getbootstrap.com/docs/4.1/components/forms/#server-side
// see https://github.com/twbs/bootstrap/blob/v4.1.1/scss/_forms.scss#L245

const FieldFeedback: React.SFC<FieldFeedbackProps> = props => <_FieldFeedback {...props} />;
FieldFeedback.defaultProps = {
  // See https://github.com/facebook/react/issues/3725#issuecomment-169163998
  // See React.Component.defaultProps objects are overridden, not merged? https://stackoverflow.com/q/40428847
  ..._FieldFeedback.defaultProps,
  classes: {
    error: 'invalid-feedback',
    warning: 'warning-feedback',
    info: 'info-feedback',
    whenValid: 'valid-feedback'
  }
};

const FieldFeedbackTooltip: React.SFC<FieldFeedbackProps> = props => <_FieldFeedback {...props} />;
FieldFeedbackTooltip.defaultProps = {
  // See https://github.com/facebook/react/issues/3725#issuecomment-169163998
  // See React.Component.defaultProps objects are overridden, not merged? https://stackoverflow.com/q/40428847
  ..._FieldFeedback.defaultProps,
  classes: {
    error: 'invalid-tooltip',
    warning: 'warning-tooltip',
    info: 'info-tooltip',
    whenValid: 'valid-tooltip'
  }
};


const Input: React.SFC<InputProps> = props => <_Input {...props} />;
Input.defaultProps = {
  // See https://github.com/facebook/react/issues/3725#issuecomment-169163998
  // See React.Component.defaultProps objects are overridden, not merged? https://stackoverflow.com/q/40428847
  ..._Input.defaultProps,
  classes: {
    hasErrors: 'is-invalid',
    //hasWarnings: 'is-warning',
    //hasInfos: 'is-info',
    isValid: 'is-valid'
  }
};

export {
  FormWithConstraints,
  FieldFeedbacks,
  Async,
  FieldFeedback,
  FieldFeedbackTooltip,
  Input
};
