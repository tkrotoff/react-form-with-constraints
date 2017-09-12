import {
  IFormWithConstraints,
  Fields, FieldsStore,
  Input, EventEmitter, withValidateEventEmitter // FIXME See https://github.com/Microsoft/TypeScript/issues/9944#issuecomment-309903027
} from './index';

export class FormWithConstraintsMockComponent {}
class FormWithConstraintsMock extends withValidateEventEmitter(FormWithConstraintsMockComponent) implements IFormWithConstraints {
  fieldsStore = new FieldsStore();

  constructor(fields?: Fields) {
    super();
    if (fields) this.fieldsStore.fields = fields;
  }

  private fieldFeedbacksKey = 0;
  computeFieldFeedbacksKey() {
    return this.fieldFeedbacksKey++;
  }
}

export default FormWithConstraintsMock;
