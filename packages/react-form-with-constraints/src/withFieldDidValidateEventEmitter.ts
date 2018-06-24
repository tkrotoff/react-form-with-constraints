import { EventEmitter } from './EventEmitter';
import Constructor from './Constructor';
import Field from './Field';

export const FieldDidValidateEvent = 'FIELD_DID_VALIDATE_EVENT';

// See TypeScript 2.2 Support for Mix-in classes https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
const withFieldDidValidateEventEmitter = <TBase extends Constructor<{}>>(Base: TBase) => {
  type Listener = (field: Field) => void;

  return class FieldDidValidateEventEmitter extends Base {
    fieldDidValidateEventEmitter = new EventEmitter();

    emitFieldDidValidateEvent(field: Field) {
      return this.fieldDidValidateEventEmitter.emit(FieldDidValidateEvent, field);
    }

    addFieldDidValidateEventListener(listener: Listener) {
      this.fieldDidValidateEventEmitter.addListener(FieldDidValidateEvent, listener);
    }

    removeFieldDidValidateEventListener(listener: Listener) {
      this.fieldDidValidateEventEmitter.removeListener(FieldDidValidateEvent, listener);
    }
  };
};

export { withFieldDidValidateEventEmitter };
