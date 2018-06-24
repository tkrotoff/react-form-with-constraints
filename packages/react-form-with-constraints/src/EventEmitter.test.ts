import { EventEmitter } from './index';
import clearArray from './clearArray';

// See How to convert a plain object into an ES6 Map? https://stackoverflow.com/questions/36644438
const toMap = (object: object) => new Map(Object.entries(object));

const listener10 = jest.fn().mockReturnValue(10);
const listener11 = jest.fn().mockReturnValue(11);
const listener20 = jest.fn().mockReturnValue(20);

beforeEach(() => {
  listener10.mockClear();
  listener11.mockClear();
  listener20.mockClear();
});

test('addListener', () => {
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
  test('with and without args', async () => {
    const eventEmitter = new EventEmitter();
    eventEmitter.addListener('event1', listener10);
    eventEmitter.addListener('event1', listener11);
    eventEmitter.addListener('event2', listener20);

    let ret = await eventEmitter.emit('event1');
    expect(ret).toEqual([10, 11]);
    expect(listener10).toHaveBeenCalledTimes(1);
    expect(listener10).toHaveBeenLastCalledWith();
    expect(listener11).toHaveBeenCalledTimes(1);
    expect(listener11).toHaveBeenLastCalledWith();
    expect(listener20).toHaveBeenCalledTimes(0);

    ret = await eventEmitter.emit('event1', 'arg1');
    expect(ret).toEqual([10, 11]);
    expect(listener10).toHaveBeenCalledTimes(2);
    expect(listener10).toHaveBeenLastCalledWith('arg1');
    expect(listener11).toHaveBeenCalledTimes(2);
    expect(listener11).toHaveBeenLastCalledWith('arg1');
    expect(listener20).toHaveBeenCalledTimes(0);

    ret = await eventEmitter.emit('event1', 'arg1', 'arg2');
    expect(ret).toEqual([10, 11]);
    expect(listener10).toHaveBeenCalledTimes(3);
    expect(listener10).toHaveBeenLastCalledWith('arg1', 'arg2');
    expect(listener11).toHaveBeenCalledTimes(3);
    expect(listener11).toHaveBeenLastCalledWith('arg1', 'arg2');
    expect(listener20).toHaveBeenCalledTimes(0);

    ret = await eventEmitter.emit('event2');
    expect(ret).toEqual([20]);
    expect(listener10).toHaveBeenCalledTimes(3);
    expect(listener11).toHaveBeenCalledTimes(3);
    expect(listener20).toHaveBeenCalledTimes(1);
    expect(listener20).toHaveBeenLastCalledWith();
  });

  test('unknown event', async () => {
    const eventEmitter = new EventEmitter();
    eventEmitter.addListener('event1', listener10);

    // Assert disabled: mess with the unit tests
    //expect(() => eventEmitter.emit('unknown')).toThrow("Unknown event 'unknown'");
    const ret = await eventEmitter.emit('unknown');
    expect(ret).toEqual([]);
    expect(listener10).toHaveBeenCalledTimes(0);
  });

  test('no listener', async () => {
    const eventEmitter = new EventEmitter();
    eventEmitter.addListener('event1', listener10);
    clearArray(eventEmitter.listeners.get('event1')!);

    const assert = console.assert;
    console.assert = jest.fn();
    const ret = await eventEmitter.emit('event1');
    expect(console.assert).toHaveBeenCalledTimes(1);
    expect(console.assert).toHaveBeenLastCalledWith(false, "No listener for event 'event1'");
    console.assert = assert;
    expect(ret).toEqual([]);

    expect(listener10).toHaveBeenCalledTimes(0);
  });
});

describe('removeListener()', () => {
  test('known event', () => {
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
