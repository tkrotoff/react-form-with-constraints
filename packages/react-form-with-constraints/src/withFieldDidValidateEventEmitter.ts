import { EventEmitter } from './EventEmitter';
import { Constructor } from './Constructor';
import { Field } from './Field';

export const FieldDidValidateEvent = 'FIELD_DID_VALIDATE_EVENT';

// [TypeScript 2.2 Support for Mix-in classes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html)
export function withFieldDidValidateEventEmitter<TBase extends Constructor<{}>>(Base: TBase) {
  type ListenerArg = Field;
  type ListenerReturnType = void;
  type Listener = (field: ListenerArg) => ListenerReturnType;

  return class FieldDidValidateEventEmitter extends Base {
    fieldDidValidateEventEmitter = new EventEmitter<[ListenerArg], ListenerReturnType>();

    emitFieldDidValidateEvent(field: Field) {
      return this.fieldDidValidateEventEmitter.emitSync(FieldDidValidateEvent, field);
    }

    addFieldDidValidateEventListener(listener: Listener) {
      this.fieldDidValidateEventEmitter.addListener(FieldDidValidateEvent, listener);
    }

    removeFieldDidValidateEventListener(listener: Listener) {
      this.fieldDidValidateEventEmitter.removeListener(FieldDidValidateEvent, listener);
    }
  };
}
