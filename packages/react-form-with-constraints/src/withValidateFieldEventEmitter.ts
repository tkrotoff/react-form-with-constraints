import { Constructor } from './Constructor';
import { EventEmitter } from './EventEmitter';
import { InputElement } from './InputElement';

export const ValidateFieldEvent = 'VALIDATE_FIELD_EVENT';

// [TypeScript 2.2 Support for Mix-in classes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html)
// eslint-disable-next-line @typescript-eslint/ban-types
export function withValidateFieldEventEmitter<ListenerReturnType, TBase extends Constructor<{}>>(
  Base: TBase
) {
  type ListenerArg = InputElement;
  type Listener = (input: ListenerArg) => ListenerReturnType | Promise<ListenerReturnType>;

  return class ValidateFieldEventEmitter extends Base {
    validateFieldEventEmitter = new EventEmitter<[ListenerArg], ListenerReturnType>();

    emitValidateFieldEvent(input: InputElement) {
      return this.validateFieldEventEmitter.emitAsync(ValidateFieldEvent, input);
    }

    addValidateFieldEventListener(listener: Listener) {
      this.validateFieldEventEmitter.addListener(ValidateFieldEvent, listener);
    }

    removeValidateFieldEventListener(listener: Listener) {
      this.validateFieldEventEmitter.removeListener(ValidateFieldEvent, listener);
    }
  };
}
