import * as React from 'react';

import { FormWithConstraintsContext } from './FormWithConstraints';
import { FieldFeedbacksContext } from './FieldFeedbacks';
import { FieldFeedbackClasses } from './FieldFeedback';
import Field from './Field';

export type FieldFeedbackWhenValidProps = FieldFeedbackClasses & React.HTMLAttributes<HTMLSpanElement>;

export function FieldFeedbackWhenValid(props: FieldFeedbackWhenValidProps) {
  const form = React.useContext(FormWithConstraintsContext)!;
  const fieldFeedbacks = React.useContext(FieldFeedbacksContext)!;

  const [fieldIsValid, setFieldIsValid] = React.useState<boolean | undefined>(undefined);

  function fieldWillValidate(fieldName: string) {
    if (fieldName === fieldFeedbacks.fieldName) { // Ignore the event if it's not for us
      setFieldIsValid(undefined);
    }
  }

  function fieldDidValidate(field: Field) {
    if (field.name === fieldFeedbacks.fieldName) { // Ignore the event if it's not for us
      setFieldIsValid(field.isValid());
    }
  }

  function fieldDidReset(field: Field) {
    if (field.name === fieldFeedbacks.fieldName) { // Ignore the event if it's not for us
      setFieldIsValid(undefined);
    }
  }

  React.useEffect(() => {
    form.addFieldWillValidateEventListener(fieldWillValidate);
    form.addFieldDidValidateEventListener(fieldDidValidate);
    form.addFieldDidResetEventListener(fieldDidReset);

    return function cleanup() {
      form.removeFieldWillValidateEventListener(fieldWillValidate);
      form.removeFieldDidValidateEventListener(fieldDidValidate);
      form.removeFieldDidResetEventListener(fieldDidReset);
    };
  }, []);

  // Don't forget to update native/FieldFeedbackWhenValid.render()
  function render() {
    const { style, ...otherProps } = props;

    // <span style="display: block"> instead of <div> so FieldFeedbackWhenValid can be wrapped inside a <p>
    // otherProps before className because otherProps contains data-feedback
    return <span {...otherProps} style={{display: fieldIsValid ? 'block' : 'none', ...style}} />;
  }

  return render();
}
