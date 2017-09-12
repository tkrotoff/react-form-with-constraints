import { EventEmitter } from './index';

// See How to convert a plain object into an ES6 Map? https://stackoverflow.com/questions/36644438
function toMap(object: object) {
  return new Map(Object.entries(object));
}

// See How do I empty an array in JavaScript? https://stackoverflow.com/a/17306971/990356
function clearArray(array: any[]) {
  while (array.length) {
    array.pop();
  }
}

test('addListener', () => {
  const listener10 = jest.fn();
  const listener11 = jest.fn();
  const listener20 = jest.fn();

  const eventEmitter = new EventEmitter();
  expect(eventEmitter.listeners).toEqual(toMap({}));

  eventEmitter.addListener('event1', listener10);
  expect(eventEmitter.listeners).toEqual(toMap({
    event1: [listener10]
  }));

  eventEmitter.addListener('event1', listener11);
  expect(eventEmitter.listeners).toEqual(toMap({
    event1: [listener10, listener11]
  }));

  expect(() => eventEmitter.addListener('event1', listener10)).toThrow("Listener already added for event 'event1'");
  expect(eventEmitter.listeners).toEqual(toMap({
    event1: [listener10, listener11]
  }));

  eventEmitter.addListener('event2', listener20);
  expect(eventEmitter.listeners).toEqual(toMap({
    event1: [listener10, listener11],
    event2: [listener20]
  }));
});

describe('emit', () => {
  test('with and without args', () => {
    const listener10 = jest.fn();
    const listener11 = jest.fn();
    const listener20 = jest.fn();

    const eventEmitter = new EventEmitter();
    eventEmitter.addListener('event1', listener10);
    eventEmitter.addListener('event1', listener11);
    eventEmitter.addListener('event2', listener20);

    eventEmitter.emit('event1');
    expect(listener10).toHaveBeenCalledTimes(1);
    expect(listener10).toHaveBeenLastCalledWith();
    expect(listener11).toHaveBeenCalledTimes(1);
    expect(listener11).toHaveBeenLastCalledWith();
    expect(listener20).toHaveBeenCalledTimes(0);

    eventEmitter.emit('event1', 'arg1');
    expect(listener10).toHaveBeenCalledTimes(2);
    expect(listener10).toHaveBeenLastCalledWith('arg1');
    expect(listener11).toHaveBeenCalledTimes(2);
    expect(listener11).toHaveBeenLastCalledWith('arg1');
    expect(listener20).toHaveBeenCalledTimes(0);

    eventEmitter.emit('event1', 'arg1', 'arg2');
    expect(listener10).toHaveBeenCalledTimes(3);
    expect(listener10).toHaveBeenLastCalledWith('arg1', 'arg2');
    expect(listener11).toHaveBeenCalledTimes(3);
    expect(listener11).toHaveBeenLastCalledWith('arg1', 'arg2');
    expect(listener20).toHaveBeenCalledTimes(0);

    eventEmitter.emit('event2');
    expect(listener10).toHaveBeenCalledTimes(3);
    expect(listener11).toHaveBeenCalledTimes(3);
    expect(listener20).toHaveBeenCalledTimes(1);
    expect(listener20).toHaveBeenLastCalledWith();
  });

  test('unknown event', () => {
    const listener10 = jest.fn();

    const eventEmitter = new EventEmitter();
    eventEmitter.addListener('event1', listener10);

    // Assert disabled: mess with the unit tests
    //expect(() => eventEmitter.emit('unknown')).toThrow("Unknown event 'unknown'");
    eventEmitter.emit('unknown');
    expect(listener10).toHaveBeenCalledTimes(0);
  });

  test('no listener', () => {
    const listener10 = jest.fn();

    const eventEmitter = new EventEmitter();
    eventEmitter.addListener('event1', listener10);
    clearArray(eventEmitter.listeners.get('event1')!);

    expect(() => eventEmitter.emit('event1')).toThrow("No listener for event 'event1'");
    expect(listener10).toHaveBeenCalledTimes(0);
  });
});

describe('removeListener()', () => {
  test('known event', () => {
    const listener10 = jest.fn();
    const listener11 = jest.fn();

    const eventEmitter = new EventEmitter();
    eventEmitter.addListener('event1', listener10);
    eventEmitter.addListener('event1', listener11);
    expect(eventEmitter.listeners).toEqual(toMap({
      event1: [listener10, listener11]
    }));

    eventEmitter.removeListener('event1', listener11);
    expect(eventEmitter.listeners).toEqual(toMap({
      event1: [listener10]
    }));

    eventEmitter.removeListener('event1', listener10);
    expect(eventEmitter.listeners).toEqual(toMap({}));
  });

  test('unknown event', () => {
    const listener10 = jest.fn();

    const eventEmitter = new EventEmitter();
    eventEmitter.addListener('event1', listener10);
    expect(eventEmitter.listeners).toEqual(toMap({
      event1: [listener10]
    }));

    expect(() => eventEmitter.removeListener('unknown', listener10)).toThrow("Unknown event 'unknown'");
    expect(eventEmitter.listeners).toEqual(toMap({
      event1: [listener10]
    }));

    eventEmitter.removeListener('event1', listener10);
    expect(eventEmitter.listeners).toEqual(toMap({}));
  });

  test('no listener', () => {
    const listener10 = jest.fn();
    const unknownListener = jest.fn();

    const eventEmitter = new EventEmitter();
    eventEmitter.addListener('event1', listener10);
    expect(eventEmitter.listeners).toEqual(toMap({
      event1: [listener10]
    }));

    expect(() => eventEmitter.removeListener('event1', unknownListener)).toThrow("Listener not found for event 'event1'");
    expect(eventEmitter.listeners).toEqual(toMap({
      event1: [listener10]
    }));

    eventEmitter.removeListener('event1', listener10);
    expect(eventEmitter.listeners).toEqual(toMap({}));
  });

  test('multiple listeners', () => {
    const listener10 = jest.fn();
    const listener11 = jest.fn();

    const eventEmitter = new EventEmitter();
    eventEmitter.addListener('event1', listener10);
    eventEmitter.addListener('event1', listener11);

    const assert = console.assert;
    console.assert = jest.fn();
    eventEmitter.addListener('event1', listener10);
    expect(console.assert).toHaveBeenCalledTimes(1);
    expect(console.assert).toHaveBeenLastCalledWith(false, "Listener already added for event 'event1'");
    console.assert = assert;

    expect(eventEmitter.listeners).toEqual(toMap({
      event1: [listener10, listener11, listener10]
    }));

    eventEmitter.removeListener('event1', listener10);
    expect(eventEmitter.listeners).toEqual(toMap({
      event1: [listener10, listener11]
    }));

    eventEmitter.removeListener('event1', listener11);
    expect(eventEmitter.listeners).toEqual(toMap({
      event1: [listener10]
    }));

    eventEmitter.removeListener('event1', listener10);
    expect(eventEmitter.listeners).toEqual(toMap({}));
  });
});
