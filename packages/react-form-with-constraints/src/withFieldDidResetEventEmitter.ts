import { EventEmitter } from './EventEmitter';
import { Constructor } from './Constructor';
import { Field } from './Field';

export const FieldDidResetEvent = 'FIELD_DID_RESET_EVENT';

// See [TypeScript 2.2 Support for Mix-in classes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html)
export function withFieldDidResetEventEmitter<TBase extends Constructor<{}>>(Base: TBase) {
  type ListenerArg = Field;
  type ListenerReturnType = void;
  type Listener = (field: ListenerArg) => ListenerReturnType;

  return class ResetFieldEvenEmitter extends Base {
    fieldDidResetEventEmitter = new EventEmitter<[ListenerArg], ListenerReturnType>();

    emitFieldDidResetEvent(field: Field) {
      return this.fieldDidResetEventEmitter.emitSync(FieldDidResetEvent, field);
    }

    addFieldDidResetEventListener(listener: Listener) {
      this.fieldDidResetEventEmitter.addListener(FieldDidResetEvent, listener);
    }

    removeFieldDidResetEventListener(listener: Listener) {
      this.fieldDidResetEventEmitter.removeListener(FieldDidResetEvent, listener);
    }
  };
}
