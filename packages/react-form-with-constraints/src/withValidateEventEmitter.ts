import { EventEmitter, Listener } from './EventEmitter';
import Input from './Input';
import Constructor from './Constructor';

export const ValidateEvent = 'VALIDATE_EVENT';

// See TypeScript 2.2 Support for Mix-in classes https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
export function withValidateEventEmitter<ListenerReturnType, TBase extends Constructor<{}>>(Base: TBase) {
  return class ValidateEventEmitter extends Base {
    validateEventEmitter = new EventEmitter<ListenerReturnType>();

    emitValidateEvent(input: Input) {
      return this.validateEventEmitter.emit(ValidateEvent, input);
    }

    addValidateEventListener(listener: Listener<ListenerReturnType>) {
      this.validateEventEmitter.addListener(ValidateEvent, listener);
    }

    removeValidateEventListener(listener: Listener<ListenerReturnType>) {
      this.validateEventEmitter.removeListener(ValidateEvent, listener);
    }
  };
}
