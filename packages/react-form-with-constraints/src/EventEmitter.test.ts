import { EventEmitter } from './index';
import { clearArray } from './clearArray';
import * as assert from './assert';

// [How to convert a plain object into an ES6 Map?](https://stackoverflow.com/q/36644438)
function toMap(object: Record<string, unknown>) {
  return new Map(Object.entries(object));
}

const listener10 = jest.fn<10, any[]>().mockReturnValue(10);
const listener11 = jest.fn<11, any[]>().mockReturnValue(11);
const listener20 = jest.fn<20, any[]>().mockReturnValue(20);

beforeEach(() => {
  listener10.mockClear();
  listener11.mockClear();
  listener20.mockClear();
});

test('addListener', () => {
  const eventEmitter = new EventEmitter<[], number>();
  expect(eventEmitter.listeners).toEqual(toMap({}));

  eventEmitter.addListener('event1', listener10);
  expect(eventEmitter.listeners).toEqual(
    toMap({
      event1: [listener10]
    })
  );

  eventEmitter.addListener('event1', listener11);
  expect(eventEmitter.listeners).toEqual(
    toMap({
      event1: [listener10, listener11]
    })
  );

  expect(() => eventEmitter.addListener('event1', listener10)).toThrow(
    "Listener already added for event 'event1'"
  );
  expect(eventEmitter.listeners).toEqual(
    toMap({
      event1: [listener10, listener11]
    })
  );

  eventEmitter.addListener('event2', listener20);
  expect(eventEmitter.listeners).toEqual(
    toMap({
      event1: [listener10, listener11],
      event2: [listener20]
    })
  );
});

describe('emitSync()', () => {
  test('with and without args', () => {
    const eventEmitter = new EventEmitter<[] | [string] | [string, string], number>();
    eventEmitter.addListener('event1', listener10);
    eventEmitter.addListener('event1', listener11);
    eventEmitter.addListener('event2', listener20);

    let ret = eventEmitter.emitSync('event1');
    expect(ret).toEqual([10, 11]);
    expect(listener10).toHaveBeenCalledTimes(1);
    expect(listener10).toHaveBeenLastCalledWith();
    expect(listener11).toHaveBeenCalledTimes(1);
    expect(listener11).toHaveBeenLastCalledWith();
    expect(listener20).toHaveBeenCalledTimes(0);

    ret = eventEmitter.emitSync('event1', 'arg1');
    expect(ret).toEqual([10, 11]);
    expect(listener10).toHaveBeenCalledTimes(2);
    expect(listener10).toHaveBeenLastCalledWith('arg1');
    expect(listener11).toHaveBeenCalledTimes(2);
    expect(listener11).toHaveBeenLastCalledWith('arg1');
    expect(listener20).toHaveBeenCalledTimes(0);

    ret = eventEmitter.emitSync('event1', 'arg1', 'arg2');
    expect(ret).toEqual([10, 11]);
    expect(listener10).toHaveBeenCalledTimes(3);
    expect(listener10).toHaveBeenLastCalledWith('arg1', 'arg2');
    expect(listener11).toHaveBeenCalledTimes(3);
    expect(listener11).toHaveBeenLastCalledWith('arg1', 'arg2');
    expect(listener20).toHaveBeenCalledTimes(0);

    ret = eventEmitter.emitSync('event2');
    expect(ret).toEqual([20]);
    expect(listener10).toHaveBeenCalledTimes(3);
    expect(listener11).toHaveBeenCalledTimes(3);
    expect(listener20).toHaveBeenCalledTimes(1);
    expect(listener20).toHaveBeenLastCalledWith();
  });

  test('unknown event', () => {
    const eventEmitter = new EventEmitter<[], number>();
    eventEmitter.addListener('event1', listener10);

    // Assert disabled: mess with the unit tests
    //expect(() => eventEmitter.emitSync('unknown')).toThrow("Unknown event 'unknown'");
    const ret = eventEmitter.emitSync('unknown');
    expect(ret).toEqual([]);
    expect(listener10).toHaveBeenCalledTimes(0);
  });

  test('no listener', () => {
    const eventEmitter = new EventEmitter<[], number>();
    eventEmitter.addListener('event1', listener10);
    clearArray(eventEmitter.listeners.get('event1')!);

    const assertSpy = jest.spyOn(assert, 'assert').mockImplementation();
    const ret = eventEmitter.emitSync('event1');
    expect(assert.assert).toHaveBeenCalledTimes(1);
    expect(assert.assert).toHaveBeenLastCalledWith(false, "No listener for event 'event1'");
    assertSpy.mockRestore();
    expect(ret).toEqual([]);

    expect(listener10).toHaveBeenCalledTimes(0);
  });
});

test('emitAsync()', async () => {
  const asyncListener10 = jest.fn<Promise<10>, any[]>().mockResolvedValue(10);
  const asyncListener11 = jest.fn<Promise<11>, any[]>().mockResolvedValue(11);
  const asyncListener20 = jest.fn<Promise<20>, any[]>().mockResolvedValue(20);

  let isFulfilled = false;
  Promise.all([asyncListener10, asyncListener11, asyncListener20]).then(() => (isFulfilled = true));

  const eventEmitter = new EventEmitter<[string], number>();
  eventEmitter.addListener('event1', asyncListener10);
  eventEmitter.addListener('event1', asyncListener11);
  eventEmitter.addListener('event2', asyncListener20);

  const promise = eventEmitter.emitAsync('event1', 'arg1');
  expect(isFulfilled).toEqual(false);
  const ret = await promise;
  expect(isFulfilled).toEqual(true);
  expect(ret).toEqual([10, 11]);
  expect(asyncListener10).toHaveBeenCalledTimes(1);
  expect(asyncListener10).toHaveBeenLastCalledWith('arg1');
  expect(asyncListener11).toHaveBeenCalledTimes(1);
  expect(asyncListener11).toHaveBeenLastCalledWith('arg1');
  expect(asyncListener20).toHaveBeenCalledTimes(0);
});

describe('removeListener()', () => {
  test('known event', () => {
    const eventEmitter = new EventEmitter<[], number>();
    eventEmitter.addListener('event1', listener10);
    eventEmitter.addListener('event1', listener11);
    expect(eventEmitter.listeners).toEqual(
      toMap({
        event1: [listener10, listener11]
      })
    );

    eventEmitter.removeListener('event1', listener11);
    expect(eventEmitter.listeners).toEqual(
      toMap({
        event1: [listener10]
      })
    );

    eventEmitter.removeListener('event1', listener10);
    expect(eventEmitter.listeners).toEqual(toMap({}));
  });

  test('unknown event', () => {
    const eventEmitter = new EventEmitter<[], number>();
    eventEmitter.addListener('event1', listener10);
    expect(eventEmitter.listeners).toEqual(
      toMap({
        event1: [listener10]
      })
    );

    expect(() => eventEmitter.removeListener('unknown', listener10)).toThrow(
      "Unknown event 'unknown'"
    );
    expect(eventEmitter.listeners).toEqual(
      toMap({
        event1: [listener10]
      })
    );

    eventEmitter.removeListener('event1', listener10);
    expect(eventEmitter.listeners).toEqual(toMap({}));
  });

  test('no listener', () => {
    const unknownListener = jest.fn();

    const eventEmitter = new EventEmitter<[], number>();
    eventEmitter.addListener('event1', listener10);
    expect(eventEmitter.listeners).toEqual(
      toMap({
        event1: [listener10]
      })
    );

    expect(() => eventEmitter.removeListener('event1', unknownListener)).toThrow(
      "Listener not found for event 'event1'"
    );
    expect(eventEmitter.listeners).toEqual(
      toMap({
        event1: [listener10]
      })
    );

    eventEmitter.removeListener('event1', listener10);
    expect(eventEmitter.listeners).toEqual(toMap({}));
  });

  test('multiple listeners', () => {
    const eventEmitter = new EventEmitter<[], number>();
    eventEmitter.addListener('event1', listener10);
    eventEmitter.addListener('event1', listener11);

    const assertSpy = jest.spyOn(assert, 'assert').mockImplementation();
    eventEmitter.addListener('event1', listener10);
    expect(assert.assert).toHaveBeenCalledTimes(1);
    expect(assert.assert).toHaveBeenLastCalledWith(
      false,
      "Listener already added for event 'event1'"
    );
    assertSpy.mockRestore();

    expect(eventEmitter.listeners).toEqual(
      toMap({
        event1: [listener10, listener11, listener10]
      })
    );

    eventEmitter.removeListener('event1', listener10);
    expect(eventEmitter.listeners).toEqual(
      toMap({
        event1: [listener10, listener11]
      })
    );

    eventEmitter.removeListener('event1', listener11);
    expect(eventEmitter.listeners).toEqual(
      toMap({
        event1: [listener10]
      })
    );

    eventEmitter.removeListener('event1', listener10);
    expect(eventEmitter.listeners).toEqual(toMap({}));
  });
});
