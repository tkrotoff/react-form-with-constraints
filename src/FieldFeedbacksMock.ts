import {
  IFieldFeedbacks, FieldFeedbacksProps,
  // @ts-ignore
  // TS6133: 'EventEmitter' is declared but its value is never read.
  // FIXME See https://github.com/Microsoft/TypeScript/issues/9944#issuecomment-309903027
  Input, EventEmitter,
  withValidateEventEmitter
} from './index';

export class FieldFeedbacksMockComponent {}
class FieldFeedbacksMock extends withValidateEventEmitter(FieldFeedbacksMockComponent) implements IFieldFeedbacks {
  props: FieldFeedbacksProps;
  key: number;

  constructor(props: FieldFeedbacksProps, key: number, fieldFeedbackKey: number) {
    super();
    this.props = props;
    this.key = key;
    this.fieldFeedbackKey = fieldFeedbackKey;
  }

  private fieldFeedbackKey = 0;
  computeFieldFeedbackKey() {
    return this.fieldFeedbackKey++;
  }
}

export default FieldFeedbacksMock;
