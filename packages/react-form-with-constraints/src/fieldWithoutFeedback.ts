import { Field } from './index';

const fieldWithoutFeedback: Readonly<Field> = {
  dirty: false,
  errors: new Set(),
  warnings: new Set(),
  infos: new Set(),
  validationMessage: ''
};

export default fieldWithoutFeedback;
