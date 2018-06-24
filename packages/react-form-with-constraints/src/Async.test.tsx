import React from 'react';
import { shallow as _shallow, mount as _mount } from 'enzyme';

import {
  FormWithConstraints, FieldFeedbacksProps, Async, AsyncProps, AsyncContext, Status,
  FieldFeedback, FieldFeedbacksContext, ValidateFieldEvent
} from './index';
import checkUsernameAvailability from './checkUsernameAvailability';
import { input_unknown_valueMissing, input_username_valid, input_username_error_valid } from './InputElementMock';
import FieldFeedbacks from './FieldFeedbacksEnzymeFix';
import beautifyHtml from './beautifyHtml';

const shallow = (node: React.ReactElement<AsyncProps<any>>, options: {context: AsyncContext}) =>
  _shallow<AsyncProps<any>>(node, options);

const mount = (node: React.ReactElement<FieldFeedbacksProps>, options: {context: FieldFeedbacksContext}) =>
  _mount<FieldFeedbacksProps>(node, options);

let form_username: FormWithConstraints;
let fieldFeedbacks_username: FieldFeedbacks;

beforeEach(() => {
  form_username = new FormWithConstraints({});

  fieldFeedbacks_username = new FieldFeedbacks({for: 'username', stop: 'no'}, {form: form_username});
  fieldFeedbacks_username.componentWillMount(); // Needed because of fieldsStore.addField() inside componentWillMount()
});

test('constructor()', () => {
  const wrapper = shallow(
    <Async promise={checkUsernameAvailability} />,
    {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
  );
  const async = wrapper.instance() as Async<boolean>;
  expect(async.state).toEqual({status: Status.None});
});

test('componentWillMount() componentWillUnmount()', () => {
  const addValidateFieldEventListenerSpy = jest.spyOn(fieldFeedbacks_username, 'addValidateFieldEventListener');
  const removeValidateFieldEventListenerSpy = jest.spyOn(fieldFeedbacks_username, 'removeValidateFieldEventListener');

  const wrapper = shallow(
    <Async promise={checkUsernameAvailability} />,
    {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
  );
  expect(addValidateFieldEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(removeValidateFieldEventListenerSpy).toHaveBeenCalledTimes(0);
  expect(fieldFeedbacks_username.validateFieldEventEmitter.listeners.get(ValidateFieldEvent)).toHaveLength(1);

  wrapper.unmount();
  expect(addValidateFieldEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(removeValidateFieldEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(fieldFeedbacks_username.validateFieldEventEmitter.listeners.get(ValidateFieldEvent)).toEqual(undefined);
});

describe('validate()', () => {
  test('known input name - emitValidateFieldEvent', async () => {
    const wrapper = shallow(
      <Async promise={checkUsernameAvailability} />,
      {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
    );
    const async = wrapper.instance() as Async<boolean>;

    const emitValidateFieldEventSpy = jest.spyOn(async, 'emitValidateFieldEvent');

    expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(0);
    const fields = await form_username.validateFields(input_username_valid);

    expect(fields).toEqual([
      {name: 'username', validations: []}
    ]);
    expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(1);
    expect(emitValidateFieldEventSpy).toHaveBeenLastCalledWith(input_username_valid);
  });

  test('unknown input name - emitValidateFieldEvent', async () => {
    const wrapper = shallow(
      <Async promise={checkUsernameAvailability} />,
      {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
    );
    const async = wrapper.instance() as Async<boolean>;

    const emitValidateFieldEventSpy = jest.spyOn(async, 'emitValidateFieldEvent');

    expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(0);
    const fields = await form_username.validateFields(input_unknown_valueMissing);
    expect(fields).toEqual([]);
    expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(0);
  });
});

describe('render()', () => {
  test('then()', async () => {
    const form = new FormWithConstraints({});
    const wrapper = mount(
      <FieldFeedbacks for="username">
        <Async
          promise={checkUsernameAvailability}
          pending={'Pending...'}
          then={availability => availability.available ?
            <FieldFeedback key="1" info>Username '{availability.value}' available</FieldFeedback> :
            <FieldFeedback key="2">Username '{availability.value}' already taken, choose another</FieldFeedback>
          }
          catch={e => <FieldFeedback>{e.message}</FieldFeedback>}
        />
      </FieldFeedbacks>,
      {context: {form}}
    );
    expect(wrapper.html()).toEqual('<span data-feedbacks="0"></span>');

    const input = {...input_username_valid};
    let fieldsPromise = form.validateFields(input);
    expect(wrapper.html()).toEqual('<span data-feedbacks="0">Pending...</span>');

    let fields = await fieldsPromise;
    expect(fields).toEqual([
      {
        name: 'username',
        validations: [
          {key: '0.0', type: 'info', show: true}
        ]
      }
    ]);
    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <span data-feedbacks="0">
        <span data-feedback="0.0" class="info" style="display: block;">Username 'jimmy' available</span>
      </span>`
    );

    input.value = 'john';
    fieldsPromise = form.validateFields(input);
    expect(wrapper.html()).toEqual('<span data-feedbacks="0">Pending...</span>');

    fields = await fieldsPromise;
    expect(fields).toEqual([
      {
        name: 'username',
        validations: [
          {key: '0.1', type: 'error', show: true}
        ]
      }
    ]);
    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <span data-feedbacks="0">
        <span data-feedback="0.1" class="error" style="display: block;">Username 'john' already taken, choose another</span>
      </span>`
    );
  });

  test('catch()', async () => {
    const form = new FormWithConstraints({});
    const wrapper = mount(
      <FieldFeedbacks for="username">
        <Async
          promise={checkUsernameAvailability}
          pending={'Pending...'}
          then={availability => availability.available ?
            `Username '${availability.value}' available` :
            `Username '${availability.value}' already taken, choose another`
          }
          catch={e => <FieldFeedback>{e.message}</FieldFeedback>}
        />
      </FieldFeedbacks>,
      {context: {form}}
    );
    expect(wrapper.html()).toEqual('<span data-feedbacks="0"></span>');

    const fieldsPromise = form.validateFields(input_username_error_valid);
    expect(wrapper.html()).toEqual('<span data-feedbacks="0">Pending...</span>');

    const fields = await fieldsPromise;
    expect(fields).toEqual([
      {
        name: 'username',
        validations: [
          {key: '0.0', type: 'error', show: true}
        ]
      }
    ]);
    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <span data-feedbacks="0">
        <span data-feedback="0.0" class="error" style="display: block;">Something wrong with username 'error'</span>
      </span>`
    );
  });

  test('no catch()', async () => {
    const form = new FormWithConstraints({});
    const wrapper = mount(
      <FieldFeedbacks for="username">
        <Async
          promise={checkUsernameAvailability}
          pending={'Pending...'}
          then={availability => availability.available ?
            `Username '${availability.value}' available` :
            `Username '${availability.value}' already taken, choose another`
          }
        />
      </FieldFeedbacks>,
      {context: {form}}
    );
    expect(wrapper.html()).toEqual('<span data-feedbacks="0"></span>');

    const fieldsPromise = form.validateFields(input_username_error_valid);
    expect(wrapper.html()).toEqual('<span data-feedbacks="0">Pending...</span>');

    const fields = await fieldsPromise;
    expect(fields).toEqual([
      {name: 'username', validations: []}
    ]);
    expect(wrapper.html()).toEqual('<span data-feedbacks="0"></span>');
  });
});
