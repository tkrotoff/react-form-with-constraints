import React from 'react';
import { mount as _mount, shallow as _shallow } from 'enzyme';

import { FormWithConstraints, FormWithConstraintsChildContext, FieldFeedback, FieldFeedbacksProps, ValidateFieldEvent } from './index';
import { input_username_valueMissing, input_unknown_valueMissing, input_username_valid } from './InputElementMock';
import FieldFeedbacks from './FieldFeedbacksEnzymeFix';
import beautifyHtml from './beautifyHtml';

const shallow = (node: React.ReactElement<FieldFeedbacksProps>, options: {context: FormWithConstraintsChildContext}) =>
  _shallow<FieldFeedbacksProps>(node, options);

const mount = (node: React.ReactElement<FieldFeedbacksProps>, options: {context: FormWithConstraintsChildContext}) =>
  _mount<FieldFeedbacksProps>(node, options);

describe('constructor()', () => {
  test('no error', () => {
    const wrapper = shallow(
      <FieldFeedbacks for="username" />,
      {context: {form: new FormWithConstraints({})}}
    );
    const fieldFeedbacks = wrapper.instance() as FieldFeedbacks;
    expect(fieldFeedbacks.key).toEqual('0');
  });

  test("FieldFeedbacks cannot have a parent and a 'for' prop", () => {
    // Works but pollutes the console with:
    // console.error ../../node_modules/jsdom/lib/jsdom/virtual-console.js:29
    // Error: Uncaught [Error: FieldFeedbacks cannot have a parent and a 'for' prop]
    /*
    expect(() =>
      mount(
        <FieldFeedbacks for="username">
          <FieldFeedbacks for="username" />
        </FieldFeedbacks>,
        {context: {form: new FormWithConstraints({})}}
      )
    ).toThrow("FieldFeedbacks cannot have a parent and a 'for' prop");
    */
  });

  test("FieldFeedbacks cannot be without parent and without 'for' prop", () => {
    expect(() =>
      shallow(
        <FieldFeedbacks />,
        {context: {form: new FormWithConstraints({})}}
      )
    ).toThrow("FieldFeedbacks cannot be without parent and without 'for' prop");
  });
});

test('computeFieldFeedbackKey()', () => {
  const wrapper = shallow(
    <FieldFeedbacks for="username" />,
    {context: {form: new FormWithConstraints({})}}
  );
  const fieldFeedbacks = wrapper.instance() as FieldFeedbacks;
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual('0.0');
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual('0.1');
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual('0.2');
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual('0.3');
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual('0.4');
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual('0.5');
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual('0.6');
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual('0.7');
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual('0.8');
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual('0.9');
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual('0.10');
});

describe('componentWillMount()', () => {
  test('initialize FieldsStore', () => {
    const form = new FormWithConstraints({});
    expect(form.fieldsStore.fields).toEqual([]);

    const wrapper = shallow(
      <FieldFeedbacks for="username" />,
      {context: {form}}
    );
    expect(form.fieldsStore.fields).toEqual([
      {name: 'username', validations: []}
    ]);

    wrapper.unmount();
    expect(form.fieldsStore.fields).toEqual([]);
  });

  test('componentWillUnmount()', () => {
    const form = new FormWithConstraints({});
    const addValidateFieldEventListenerSpy = jest.spyOn(form, 'addValidateFieldEventListener');
    const removeValidateFieldEventListenerSpy = jest.spyOn(form, 'removeValidateFieldEventListener');

    const wrapper = shallow(
      <FieldFeedbacks for="username" />,
      {context: {form}}
    );
    expect(addValidateFieldEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeValidateFieldEventListenerSpy).toHaveBeenCalledTimes(0);
    expect(form.validateFieldEventEmitter.listeners.get(ValidateFieldEvent)).toHaveLength(1);

    wrapper.unmount();
    expect(addValidateFieldEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeValidateFieldEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(form.validateFieldEventEmitter.listeners.get(ValidateFieldEvent)).toEqual(undefined);
  });
});

describe('validate()', () => {
  test('known input name', async () => {
    const form = new FormWithConstraints({});
    const wrapper = shallow(
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
      </FieldFeedbacks>,
      {context: {form}}
    );
    const fieldFeedbacks = wrapper.instance() as FieldFeedbacks;
    const emitValidateFieldEventSpy = jest.spyOn(fieldFeedbacks, 'emitValidateFieldEvent');

    expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(0);
    const fields = await form.validateFields(input_username_valid);
    expect(fields).toEqual([
      {name: 'username', validations: []}
    ]);
    expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(1);
    expect(emitValidateFieldEventSpy).toHaveBeenLastCalledWith(input_username_valid);

    expect(form.fieldsStore.fields).toEqual(fields);
  });

  test('known input name - mount', async () => {
    const form = new FormWithConstraints({});
    mount(
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
      </FieldFeedbacks>,
      {context: {form}}
    );
    const fields = await form.validateFields(input_username_valid);
    expect(fields).toEqual([
      {
        name: 'username',
        validations: [
          {key: '0.0', type: 'error', show: false}
        ]
      }
    ]);

    expect(form.fieldsStore.fields).toEqual(fields);
  });

  test('unknown input name - emitValidateFieldEvent', async () => {
    const form = new FormWithConstraints({});
    const wrapper = shallow(
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
      </FieldFeedbacks>,
      {context: {form}}
    );
    const fieldFeedbacks = wrapper.instance() as FieldFeedbacks;
    const emitValidateFieldEventSpy = jest.spyOn(fieldFeedbacks, 'emitValidateFieldEvent');

    expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(0);
    const fields = await form.validateFields(input_unknown_valueMissing);
    expect(fields).toEqual([]);
    expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(0);

    expect(form.fieldsStore.fields).toEqual([
      {name: 'username', validations: []}
    ]);
  });

  test('unknown input name - mount', async () => {
    const form = new FormWithConstraints({});
    mount(
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
      </FieldFeedbacks>,
      {context: {form}}
    );
    const fields = await form.validateFields(input_unknown_valueMissing);
    expect(fields).toEqual([]);

    expect(form.fieldsStore.fields).toEqual([
      {name: 'username', validations: []}
    ]);
  });
});

describe('render()', () => {
  test('without children', () => {
    const form = new FormWithConstraints({});
    const wrapper = mount(
      <FieldFeedbacks for="username" />,
      {context: {form}}
    );

    expect(wrapper.html()).toEqual(
      '<span data-feedbacks="0"></span>'
    );
  });

  test('children', async () => {
    const form = new FormWithConstraints({});
    const wrapper = mount(
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
      </FieldFeedbacks>,
      {context: {form}}
    );
    const fields = await form.validateFields(input_username_valueMissing);
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
        <span data-feedback="0.0" class="error" style="display: block;">Suffering from being missing</span>
      </span>`
    );
  });

  test('children with <div> inside hierarchy', async () => {
    const form = new FormWithConstraints({});
    const wrapper = mount(
      <FieldFeedbacks for="username">
        <div>
          <FieldFeedback when="*" />
        </div>
      </FieldFeedbacks>,
      {context: {form}}
    );
    const fields = await form.validateFields(input_username_valueMissing);
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
        <div>
          <span data-feedback="0.0" class="error" style="display: block;">Suffering from being missing</span>
        </div>
      </span>`
    );
  });

  test('unknown input name', async () => {
    const form = new FormWithConstraints({});
    const wrapper = mount(
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
      </FieldFeedbacks>,
      {context: {form}}
    );
    const fields = await form.validateFields(input_unknown_valueMissing);
    expect(fields).toEqual([]);

    expect(wrapper.html()).toEqual(
      '<span data-feedbacks="0"></span>'
    );
  });

  describe('stop prop', () => {
    test('stop="no" multiple FieldFeedback', async () => {
      const form = new FormWithConstraints({});
      const wrapper = mount(
        <FieldFeedbacks for="username" stop="no">
          <FieldFeedback when="*" />
          <FieldFeedback when="*" />
          <FieldFeedback when="*" />
        </FieldFeedbacks>,
        {context: {form}}
      );
      const fields = await form.validateFields(input_username_valueMissing);
      expect(fields).toEqual([
        {
          name: 'username',
          validations: [
            {key: '0.0', type: 'error', show: true},
            {key: '0.1', type: 'error', show: true},
            {key: '0.2', type: 'error', show: true}
          ]
        }
      ]);

      expect(beautifyHtml(wrapper.html(), '        ')).toEqual(`\
        <span data-feedbacks="0">
          <span data-feedback="0.0" class="error" style="display: block;">Suffering from being missing</span>
          <span data-feedback="0.1" class="error" style="display: block;">Suffering from being missing</span>
          <span data-feedback="0.2" class="error" style="display: block;">Suffering from being missing</span>
        </span>`
      );
    });

    test('stop="first-error" multiple FieldFeedback', async () => {
      const form = new FormWithConstraints({});
      const wrapper = mount(
        <FieldFeedbacks for="username" stop="first-error">
          <FieldFeedback when="*" />
          <FieldFeedback when="*" />
          <FieldFeedback when="*" />
        </FieldFeedbacks>,
        {context: {form}}
      );
      const fields = await form.validateFields(input_username_valueMissing);
      expect(fields).toEqual([
        {
          name: 'username',
          validations: [
            {key: '0.0', type: 'error', show: true},
            {key: '0.1', type: 'error', show: undefined},
            {key: '0.2', type: 'error', show: undefined}
          ]
        }
      ]);

      expect(beautifyHtml(wrapper.html(), '        ')).toEqual(`\
        <span data-feedbacks="0">
          <span data-feedback="0.0" class="error" style="display: block;">Suffering from being missing</span>
        </span>`
      );
    });

    test('stop="first-error" multiple FieldFeedback with error, warning, info', async () => {
      const form = new FormWithConstraints({});
      const wrapper = mount(
        <FieldFeedbacks for="username" stop="first-error">
          <FieldFeedback when="*" warning />
          <FieldFeedback when="*" error />
          <FieldFeedback when="*" info />
        </FieldFeedbacks>,
        {context: {form}}
      );
      const fieldFeedbackValidations = await form.validateFields(input_username_valueMissing);
      expect(fieldFeedbackValidations).toEqual([
        {
          name: 'username',
          validations: [
            {key: '0.0', type: 'warning', show: true},
            {key: '0.1', type: 'error', show: true},
            {key: '0.2', type: 'info', show: undefined}
          ]
        }
      ]);

      expect(beautifyHtml(wrapper.html(), '        ')).toEqual(`\
        <span data-feedbacks="0">
          <span data-feedback="0.0" class="warning" style="display: block;">Suffering from being missing</span>
          <span data-feedback="0.1" class="error" style="display: block;">Suffering from being missing</span>
        </span>`
      );
    });
  });
});
