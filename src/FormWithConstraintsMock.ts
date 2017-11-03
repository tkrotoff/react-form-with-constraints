import {
  IFormWithConstraints,
  Fields, FieldsStore,
  // @ts-ignore
  // TS6133: 'EventEmitter' is declared but its value is never read.
  // FIXME See https://github.com/Microsoft/TypeScript/issues/9944#issuecomment-309903027
  Input, EventEmitter, withValidateEventEmitter
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
