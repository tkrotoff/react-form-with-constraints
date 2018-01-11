import * as React from 'react';
import { shallow as _shallow, mount as _mount } from 'enzyme';

import { FormWithConstraints, Async, AsyncProps, AsyncContext, Status, FieldFeedback, FieldFeedbacks, FieldFeedbacksContext, ValidateEvent } from './index';
import createFieldFeedbacks from './createFieldFeedbacks';
import checkUsernameAvailability from './checkUsernameAvailability';
import InputMock from './InputMock';

function shallow(node: React.ReactElement<AsyncProps<any>>, options: {context: AsyncContext}) {
  return _shallow<AsyncProps<any>>(node, options);
}

function mount(node: React.ReactElement<FieldFeedbacks>, options: {context: FieldFeedbacksContext}) {
  return _mount<FieldFeedbacks>(node, options);
}

let form: FormWithConstraints;

function createFieldFeedbacks_username() {
  const fieldFeedbacksKey1 = 1;
  const fieldFeedbackKey11 = 1.1;
  return createFieldFeedbacks({for: 'username'}, form, fieldFeedbacksKey1, fieldFeedbackKey11);
}

beforeEach(() => {
  form = new FormWithConstraints({});
});

test('constructor()', () => {
  const wrapper = shallow(
    <Async promise={checkUsernameAvailability} />,
    {context: {form, fieldFeedbacks: createFieldFeedbacks_username()}}
  );
  const async = wrapper.instance() as Async<boolean>;
  expect(async.state).toEqual({status: Status.None});
});

test('componentWillMount() componentWillUnmount()', () => {
  const addValidateEventListenerSpy = jest.spyOn(form, 'addValidateEventListener');
  const removeValidateEventListenerSpy = jest.spyOn(form, 'removeValidateEventListener');

  const wrapper = shallow(
    <Async promise={checkUsernameAvailability} />,
    {context: {form, fieldFeedbacks: createFieldFeedbacks_username()}}
  );
  expect(addValidateEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(removeValidateEventListenerSpy).toHaveBeenCalledTimes(0);
  expect(form.validateEventEmitter.listeners.get(ValidateEvent)).toHaveLength(1);

  wrapper.unmount();
  expect(addValidateEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(removeValidateEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(form.validateEventEmitter.listeners.get(ValidateEvent)).toEqual(undefined);
});

describe('validate()', () => {
  test('known input name - emitValidateEvent', async () => {
    const async = shallow(
      <Async promise={checkUsernameAvailability} />,
      {context: {form, fieldFeedbacks: createFieldFeedbacks_username()}}
    ).instance() as Async<boolean>;

    const emitValidateEventSpy = jest.spyOn(async, 'emitValidateEvent');

    expect(emitValidateEventSpy).toHaveBeenCalledTimes(0);
    const input = new InputMock('username', 'jimmy', {valid: true}, '');
    const fieldFeedbackValidations = await form.validateFields(input);
    expect(fieldFeedbackValidations).toEqual([]);
    expect(emitValidateEventSpy).toHaveBeenCalledTimes(1);
    expect(emitValidateEventSpy).toHaveBeenLastCalledWith(input);
  });

  test('unknown input name - emitValidateEvent', async () => {
    const async = shallow(
      <Async promise={checkUsernameAvailability} />,
      {context: {form, fieldFeedbacks: createFieldFeedbacks_username()}}
    ).instance() as Async<boolean>;

    const emitValidateEventSpy = jest.spyOn(async, 'emitValidateEvent');

    expect(emitValidateEventSpy).toHaveBeenCalledTimes(0);
    const input = new InputMock('unknown', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    const fieldFeedbackValidations = await form.validateFields(input);
    expect(fieldFeedbackValidations).toEqual([]);
    expect(emitValidateEventSpy).toHaveBeenCalledTimes(0);
  });
});

describe('render()', () => {
  test('then()', async () => {
    const wrapper = mount(
      <FieldFeedbacks for="username">
        <Async
          promise={checkUsernameAvailability}
          pending={'Pending...'}
          then={availability => availability.available ?
            <FieldFeedback info>Username '{availability.value}' available</FieldFeedback> :
            <FieldFeedback>Username '{availability.value}' already taken, choose another</FieldFeedback>
          }
          catch={e => <FieldFeedback>{e.message}</FieldFeedback>}
        />
      </FieldFeedbacks>,
      {context: {form}}
    );
    wrapper.update();
    expect(wrapper.html()).toEqual('<div></div>');

    const input = new InputMock('username', 'jimmy', {valid: true}, '');
    let fieldFeedbackValidationsPromise = form.validateFields(input);
    wrapper.update();
    expect(wrapper.html()).toEqual('<div>Pending...</div>');

    let fieldFeedbackValidations = await fieldFeedbackValidationsPromise;
    expect(fieldFeedbackValidations).toEqual([{key: 0.0, isValid: true}]);
    wrapper.update();
    expect(wrapper.html()).toEqual(`<div><div class="info">Username 'jimmy' available</div></div>`);

    input.value = 'john';
    fieldFeedbackValidationsPromise = form.validateFields(input);
    wrapper.update();
    expect(wrapper.html()).toEqual('<div>Pending...</div>');

    fieldFeedbackValidations = await fieldFeedbackValidationsPromise;
    expect(fieldFeedbackValidations).toEqual([{key: 0.1, isValid: false}]);
    wrapper.update();
    expect(wrapper.html()).toEqual(`<div><div class="error">Username 'john' already taken, choose another</div></div>`);
  });

  test('catch()', async () => {
    const wrapper = mount(
      <FieldFeedbacks for="username">
        <Async
          promise={checkUsernameAvailability}
          pending={'Pending...'}
          then={availability => availability.available ? `Username '${availability.value}' available` : `Username '${availability.value}' already taken, choose another`}
          catch={e => <FieldFeedback>{e.message}</FieldFeedback>}
        />
      </FieldFeedbacks>,
      {context: {form}}
    );
    wrapper.update();
    expect(wrapper.html()).toEqual('<div></div>');

    const input = new InputMock('username', 'error', {valid: true}, '');
    const fieldFeedbackValidationsPromise = form.validateFields(input);
    wrapper.update();
    expect(wrapper.html()).toEqual('<div>Pending...</div>');

    const fieldFeedbackValidations = await fieldFeedbackValidationsPromise;
    expect(fieldFeedbackValidations).toEqual([{key: 0, isValid: false}]);
    wrapper.update();
    expect(wrapper.html()).toEqual(`<div><div class="error">Something wrong with username 'error'</div></div>`);
  });

  test('no catch()', async () => {
    const wrapper = shallow(
      <Async
        promise={checkUsernameAvailability}
        pending={'Pending...'}
        then={availability => availability.available ? `Username '${availability.value}' available` : `Username '${availability.value}' already taken, choose another`}
      />,
      {context: {form, fieldFeedbacks: createFieldFeedbacks_username()}}
    );
    wrapper.update();
    expect(wrapper.html()).toEqual(null);

    const input = new InputMock('username', 'error', {valid: true}, '');
    const fieldFeedbackValidationsPromise = form.validateFields(input);
    wrapper.update();
    expect(wrapper.text()).toEqual('Pending...');

    const fieldFeedbackValidations = await fieldFeedbackValidationsPromise;
    expect(fieldFeedbackValidations).toEqual([]);
    wrapper.update();
    expect(wrapper.html()).toEqual(null);
  });
});
