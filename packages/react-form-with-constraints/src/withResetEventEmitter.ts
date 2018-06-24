import { EventEmitter } from './EventEmitter';
import Constructor from './Constructor';

export const ResetEvent = 'RESET_EVENT';

// See TypeScript 2.2 Support for Mix-in classes https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
const withResetEventEmitter = <TBase extends Constructor<{}>>(Base: TBase) => {
  type Listener = () => void;

  return class ResetEvenEmitter extends Base {
    resetEventEmitter = new EventEmitter();

    emitResetEvent() {
      return this.resetEventEmitter.emit(ResetEvent);
    }

    addResetEventListener(listener: Listener) {
      this.resetEventEmitter.addListener(ResetEvent, listener);
    }

    removeResetEventListener(listener: Listener) {
      this.resetEventEmitter.removeListener(ResetEvent, listener);
    }
  };
};

export { withResetEventEmitter };
