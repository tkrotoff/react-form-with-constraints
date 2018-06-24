import { EventEmitter } from './EventEmitter';
import Constructor from './Constructor';

export const FieldWillValidateEvent = 'FIELD_WILL_VALIDATE_EVENT';

// See TypeScript 2.2 Support for Mix-in classes https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
const withFieldWillValidateEventEmitter = <TBase extends Constructor<{}>>(Base: TBase) => {
  type Listener = (fieldName: string) => void;

  return class FieldWillValidateEventEmitter extends Base {
    fieldWillValidateEventEmitter = new EventEmitter();

    emitFieldWillValidateEvent(fieldName: string) {
      return this.fieldWillValidateEventEmitter.emit(FieldWillValidateEvent, fieldName);
    }

    addFieldWillValidateEventListener(listener: Listener) {
      this.fieldWillValidateEventEmitter.addListener(FieldWillValidateEvent, listener);
    }

    removeFieldWillValidateEventListener(listener: Listener) {
      this.fieldWillValidateEventEmitter.removeListener(FieldWillValidateEvent, listener);
    }
  };
};

export { withFieldWillValidateEventEmitter };
