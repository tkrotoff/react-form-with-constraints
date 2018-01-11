import { FormWithConstraints, FormWithConstraintsProps, Fields } from './index';

export default function createFormWithConstraints(props: FormWithConstraintsProps, fields?: Fields) {
  const form = new FormWithConstraints(props);
  if (fields) form.fieldsStore.fields = fields;
  return form;
}
