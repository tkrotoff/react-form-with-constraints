import { EventEmitter } from './EventEmitter';
import Input from './Input';
import Constructor from './Constructor';

export const ValidateEvent = 'VALIDATE_EVENT';

export type ValidateEventListener = (input: Input) => void;

export interface IValidateEventEmitter {
  emitValidateEvent(input: Input): void;
  addValidateEventListener(listener: ValidateEventListener): void;
  removeValidateEventListener(listener: ValidateEventListener): void;
}

// See TypeScript 2.2 Support for Mix-in classes https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
export function withValidateEventEmitter<TBase extends Constructor<{}>>(Base: TBase) {
  return class ValidateEventEmitter extends Base implements IValidateEventEmitter {
    validateEventEmitter = new EventEmitter();

    emitValidateEvent(input: Input) {
      this.validateEventEmitter.emit(ValidateEvent, input);
    }

    addValidateEventListener(listener: ValidateEventListener) {
      this.validateEventEmitter.addListener(ValidateEvent, listener);
    }

    removeValidateEventListener(listener: ValidateEventListener) {
      this.validateEventEmitter.removeListener(ValidateEvent, listener);
    }
  };
}
