// FIXME
// See Thoughts about variadic generics? https://github.com/Microsoft/TypeScript/issues/1773
// See Proposal: Variadic Kinds -- Give specific types to variadic functions https://github.com/Microsoft/TypeScript/issues/5453
export type Args = any[];

export type Listener = (...args: Args) => void;

export class EventEmitter {
  listeners = new Map<string, Listener[]>();

  emit(eventName: string, ...args: Args) {
    const listeners = this.listeners.get(eventName)!;

    // Assert disabled: mess with the unit tests
    //console.assert(listeners !== undefined, `Unknown event '${eventName}'`);

    if (listeners !== undefined) {
      console.assert(listeners.length > 0, `No listener for event '${eventName}'`);
      listeners.forEach(listener => listener(...args));
    }
  }

  addListener(eventName: string, listener: Listener) {
    if (!this.listeners.has(eventName)) this.listeners.set(eventName, []);
    const listeners = this.listeners.get(eventName)!;
    console.assert(listeners.indexOf(listener) === -1, `Listener already added for event '${eventName}'`);
    listeners.push(listener);
  }

  // See https://nodejs.org/api/events.html#events_emitter_removelistener_eventname_listener
  // "removeListener will remove, at most, one instance of a listener from the listener array.
  // If any single listener has been added multiple times to the listener array for the specified eventName,
  // then removeListener must be called multiple times to remove each instance."
  removeListener(eventName: string, listener: Listener) {
    const listeners = this.listeners.get(eventName)!;
    console.assert(listeners !== undefined, `Unknown event '${eventName}'`);

    const index = listeners.lastIndexOf(listener);
    console.assert(index > -1, `Listener not found for event '${eventName}'`);
    listeners.splice(index, 1);

    if (listeners.length === 0) this.listeners.delete(eventName);
  }
}
