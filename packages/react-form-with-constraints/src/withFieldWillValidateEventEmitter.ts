import { Constructor } from './Constructor';
import { EventEmitter } from './EventEmitter';

export const FieldWillValidateEvent = 'FIELD_WILL_VALIDATE_EVENT';

// [TypeScript 2.2 Support for Mix-in classes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html)
// eslint-disable-next-line @typescript-eslint/ban-types
export function withFieldWillValidateEventEmitter<TBase extends Constructor<{}>>(Base: TBase) {
  type ListenerArg = string;
  type ListenerReturnType = void;
  type Listener = (fieldName: ListenerArg) => ListenerReturnType;

  return class FieldWillValidateEventEmitter extends Base {
    fieldWillValidateEventEmitter = new EventEmitter<[ListenerArg], ListenerReturnType>();

    emitFieldWillValidateEvent(fieldName: string) {
      return this.fieldWillValidateEventEmitter.emitSync(FieldWillValidateEvent, fieldName);
    }

    addFieldWillValidateEventListener(listener: Listener) {
      this.fieldWillValidateEventEmitter.addListener(FieldWillValidateEvent, listener);
    }

    removeFieldWillValidateEventListener(listener: Listener) {
      this.fieldWillValidateEventEmitter.removeListener(FieldWillValidateEvent, listener);
    }
  };
}
