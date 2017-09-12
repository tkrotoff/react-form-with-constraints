import {
  IFieldFeedbacks, FieldFeedbacksProps,
  Input, EventEmitter, // FIXME See https://github.com/Microsoft/TypeScript/issues/9944#issuecomment-309903027
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
