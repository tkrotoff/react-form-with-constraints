import { EventEmitter } from './EventEmitter';
import Input from './Input';
import Constructor from './Constructor';

export const ValidateFieldEvent = 'VALIDATE_FIELD_EVENT';

// See TypeScript 2.2 Support for Mix-in classes https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
export function withValidateFieldEventEmitter<ListenerReturnType, TBase extends Constructor<{}>>(Base: TBase) {
  type Listener = (input: Input) => ListenerReturnType | Promise<ListenerReturnType>;

  return class ValidateFieldEventEmitter extends Base {
    validateFieldEventEmitter = new EventEmitter<ListenerReturnType>();

    emitValidateFieldEvent(input: Input) {
      return this.validateFieldEventEmitter.emit(ValidateFieldEvent, input);
    }

    addValidateFieldEventListener(listener: Listener) {
      this.validateFieldEventEmitter.addListener(ValidateFieldEvent, listener);
    }

    removeValidateFieldEventListener(listener: Listener) {
      this.validateFieldEventEmitter.removeListener(ValidateFieldEvent, listener);
    }
  };
}
