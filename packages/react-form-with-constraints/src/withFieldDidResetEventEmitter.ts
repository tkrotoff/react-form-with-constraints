import EventEmitter from './EventEmitter';
import Constructor from './Constructor';
import Field from './Field';

export const FieldDidResetEvent = 'FIELD_DID_RESET_EVENT';

// See TypeScript 2.2 Support for Mix-in classes https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
const withFieldDidResetEventEmitter = <TBase extends Constructor<{}>>(Base: TBase) => {
  type Listener = (field: Field) => void;

  return class ResetFieldEvenEmitter extends Base {
    fieldDidResetEventEmitter = new EventEmitter();

    emitFieldDidResetEvent(field: Field) {
      return this.fieldDidResetEventEmitter.emit(FieldDidResetEvent, field);
    }

    addFieldDidResetEventListener(listener: Listener) {
      this.fieldDidResetEventEmitter.addListener(FieldDidResetEvent, listener);
    }

    removeFieldDidResetEventListener(listener: Listener) {
      this.fieldDidResetEventEmitter.removeListener(FieldDidResetEvent, listener);
    }
  };
};

export { withFieldDidResetEventEmitter };
