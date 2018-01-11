import {
  FormWithConstraints,
  FieldFeedbacks,
  FieldFeedbacksProps
} from './index';

export default function createFieldFeedbacks(props: FieldFeedbacksProps, form: FormWithConstraints, key: number, fieldFeedbackKey: number) {
  const fieldFeedbacks = new FieldFeedbacks(props, {form});
  fieldFeedbacks.key = key;
  fieldFeedbacks.fieldFeedbackKey = fieldFeedbackKey;
  return fieldFeedbacks;
}
