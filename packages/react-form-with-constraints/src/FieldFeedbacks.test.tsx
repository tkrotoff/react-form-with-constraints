import React from 'react';
import { mount as _mount, shallow as _shallow } from 'enzyme';

import { FormWithConstraints, FormWithConstraintsChildContext, fieldWithoutFeedback, FieldFeedback, FieldFeedbacksProps, FieldFeedbacks, ValidateEvent } from './index';
import InputMock from './InputMock';

function shallow(node: React.ReactElement<FieldFeedbacksProps>, options: {context: FormWithConstraintsChildContext}) {
  return _shallow<FieldFeedbacksProps>(node, options);
}
function mount(node: React.ReactElement<FieldFeedbacksProps>, options: {context: FormWithConstraintsChildContext}) {
  return _mount<FieldFeedbacksProps>(node, options);
}

test('constructor()', () => {
  const wrapper = shallow(
    <FieldFeedbacks for="username" />,
    {context: {form: new FormWithConstraints({})}}
  );
  const fieldFeedbacks = wrapper.instance() as FieldFeedbacks;
  expect(fieldFeedbacks.key).toEqual(0.0);
});

test('computeFieldFeedbackKey()', () => {
  const wrapper = shallow(
    <FieldFeedbacks for="username" />,
    {context: {form: new FormWithConstraints({})}}
  );
  const fieldFeedbacks = wrapper.instance() as FieldFeedbacks;
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual(0.0);
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual(0.1);
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual(0.2);
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual(0.3);
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual(0.4);
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual(0.5);
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual(0.6);
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual(0.7);
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual(0.8);
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual(0.9);
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual(0.10);
  expect(fieldFeedbacks.computeFieldFeedbackKey()).toEqual(0.11);
});

describe('componentWillMount()', () => {
  test('initialize FieldsStore', () => {
    const form = new FormWithConstraints({});
    expect(form.fieldsStore.fields).toEqual({});

    const wrapper = shallow(
      <FieldFeedbacks for="username" />,
      {context: {form}}
    );
    expect(form.fieldsStore.fields).toEqual({
      username: fieldWithoutFeedback
    });

    wrapper.unmount();
    expect(form.fieldsStore.fields).toEqual({});
  });

  test('componentWillUnmount()', () => {
    const form = new FormWithConstraints({});
    const addValidateEventListenerSpy = jest.spyOn(form, 'addValidateEventListener');
    const removeValidateEventListenerSpy = jest.spyOn(form, 'removeValidateEventListener');

    const wrapper = shallow(
      <FieldFeedbacks for="username" />,
      {context: {form}}
    );
    expect(addValidateEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeValidateEventListenerSpy).toHaveBeenCalledTimes(0);
    expect(form.validateEventEmitter.listeners.get(ValidateEvent)).toHaveLength(1);

    wrapper.unmount();
    expect(addValidateEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeValidateEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(form.validateEventEmitter.listeners.get(ValidateEvent)).toEqual(undefined);
  });
});

describe('validate()', () => {
  test('known input name - emitValidateEvent', async () => {
    const form = new FormWithConstraints({});
    const fieldFeedbacks = shallow(
      <FieldFeedbacks for="username" />,
      {context: {form}}
    ).instance() as FieldFeedbacks;
    const emitValidateEventSpy = jest.spyOn(fieldFeedbacks, 'emitValidateEvent');

    expect(emitValidateEventSpy).toHaveBeenCalledTimes(0);
    const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    const fieldFeedbackValidations = await form.validateFields(input);
    expect(fieldFeedbackValidations).toEqual([{
      fieldName: 'username',
      isValid: expect.any(Function),
      fieldFeedbackValidations: []
    }]);
    expect(emitValidateEventSpy).toHaveBeenCalledTimes(1);
    expect(emitValidateEventSpy).toHaveBeenLastCalledWith(input);
  });

  test('known input name', async () => {
    const form = new FormWithConstraints({});
    mount(
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
      </FieldFeedbacks>,
      {context: {form}}
    );
    const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    const fieldFeedbackValidations = await form.validateFields(input);
    expect(fieldFeedbackValidations).toEqual([{
      fieldName: 'username',
      isValid: expect.any(Function),
      fieldFeedbackValidations: [{key: 0.0, isValid: false}]
    }]);

    expect(form.fieldsStore.fields).toEqual({
      username: {
        dirty: true,
        errors: new Set([0]),
        warnings: new Set(),
        infos: new Set(),
        validationMessage: 'Suffering from being missing'
      }
    });
  });

  test('unknown input name - emitValidateEvent', async () => {
    const form = new FormWithConstraints({});
    const fieldFeedbacks = shallow(
      <FieldFeedbacks for="username" />,
      {context: {form}}
    ).instance() as FieldFeedbacks;
    const emitValidateEventSpy = jest.spyOn(fieldFeedbacks, 'emitValidateEvent');

    expect(emitValidateEventSpy).toHaveBeenCalledTimes(0);
    const input = new InputMock('unknown', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    const fieldFeedbackValidations = await form.validateFields(input);
    expect(fieldFeedbackValidations).toEqual([{
      fieldName: 'unknown',
      isValid: expect.any(Function),
      fieldFeedbackValidations: []
    }]);
    expect(emitValidateEventSpy).toHaveBeenCalledTimes(0);
  });

  test('unknown input name', async () => {
    const form = new FormWithConstraints({});
    mount(
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
      </FieldFeedbacks>,
      {context: {form}}
    );
    const input = new InputMock('unknown', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    const fieldFeedbackValidations = await form.validateFields(input);
    expect(fieldFeedbackValidations).toEqual([{
      fieldName: 'unknown',
      isValid: expect.any(Function),
      fieldFeedbackValidations: []
    }]);

    expect(form.fieldsStore.fields).toEqual({
      username: fieldWithoutFeedback
    });
  });

  test('remove', async () => {
    const form = new FormWithConstraints({});
    form.fieldsStore.fields = {
      username: {
        dirty: true,
        errors: new Set([1.1, 0.0, 0.1]),
        warnings: new Set([1.1, 0.0, 0.1]),
        infos: new Set([1.1, 0.0, 0.1]),
        validationMessage: 'Suffering from being missing'
      }
    };

    shallow(
      <FieldFeedbacks for="username" />,
      {context: {form}}
    );
    const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    const fieldFeedbackValidations = await form.validateFields(input);
    expect(fieldFeedbackValidations).toEqual([{
      fieldName: 'username',
      isValid: expect.any(Function),
      fieldFeedbackValidations: []
    }]);

    expect(form.fieldsStore.fields).toEqual({
      username: {
        dirty: true,
        errors: new Set([1.1]),
        warnings: new Set([1.1]),
        infos: new Set([1.1]),
        validationMessage: 'Suffering from being missing'
      }
    });
  });
});

describe('render()', () => {
  test('children', async () => {
    const form = new FormWithConstraints({});
    const wrapper = mount(
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
      </FieldFeedbacks>,
      {context: {form}}
    );
    const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    const fieldFeedbackValidations = await form.validateFields(input);
    expect(fieldFeedbackValidations).toEqual([{
      fieldName: 'username',
      isValid: expect.any(Function),
      fieldFeedbackValidations: [{key: 0.0, isValid: false}]
    }]);

    expect(form.fieldsStore.fields).toEqual({
      username: {
        dirty: true,
        errors: new Set([0.0]),
        warnings: new Set(),
        infos: new Set(),
        validationMessage: 'Suffering from being missing'
      }
    });
    expect(wrapper.html()).toEqual(
      '<div><div class="error">Suffering from being missing</div></div>'
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
    const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    const fieldFeedbackValidations = await form.validateFields(input);
    expect(fieldFeedbackValidations).toEqual([{
      fieldName: 'username',
      isValid: expect.any(Function),
      fieldFeedbackValidations: [{key: 0.0, isValid: false}]
    }]);

    expect(form.fieldsStore.fields).toEqual({
      username: {
        dirty: true,
        errors: new Set([0.0]),
        warnings: new Set(),
        infos: new Set(),
        validationMessage: 'Suffering from being missing'
      }
    });
    expect(wrapper.html()).toEqual(
      '<div><div><div class="error">Suffering from being missing</div></div></div>'
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
    const input = new InputMock('unknown', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    const fieldFeedbackValidations = await form.validateFields(input);
    expect(fieldFeedbackValidations).toEqual([{
      fieldName: 'unknown',
      isValid: expect.any(Function),
      fieldFeedbackValidations: []
    }]);

    expect(form.fieldsStore.fields).toEqual({
      username: fieldWithoutFeedback
    });
    expect(wrapper.html()).toEqual(
      '<div></div>'
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
      const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
      const fieldFeedbackValidations = await form.validateFields(input);
      expect(fieldFeedbackValidations).toEqual([{
        fieldName: 'username',
        isValid: expect.any(Function),
        fieldFeedbackValidations: [
          {key: 0.0, isValid: false},
          {key: 0.1, isValid: false},
          {key: 0.2, isValid: false}
        ]
      }]);

      expect(form.fieldsStore.fields).toEqual({
        username: {
          dirty: true,
          errors: new Set([0.0, 0.1, 0.2]),
          warnings: new Set(),
          infos: new Set(),
          validationMessage: 'Suffering from being missing'
        }
      });

      expect(wrapper.html()).toEqual(
        '<div><div class="error">Suffering from being missing</div><div class="error">Suffering from being missing</div><div class="error">Suffering from being missing</div></div>'
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
      const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
      const fieldFeedbackValidations = await form.validateFields(input);
      expect(fieldFeedbackValidations).toEqual([{
        fieldName: 'username',
        isValid: expect.any(Function),
        fieldFeedbackValidations: [
          {key: 0.0, isValid: false},
          {key: 0.1, isValid: undefined},
          {key: 0.2, isValid: undefined}
        ]
      }]);

      expect(form.fieldsStore.fields).toEqual({
        username: {
          dirty: true,
          errors: new Set([0.0]),
          warnings: new Set(),
          infos: new Set(),
          validationMessage: 'Suffering from being missing'
        }
      });

      expect(wrapper.html()).toEqual(
        '<div><div class="error">Suffering from being missing</div></div>'
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
      const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
      const fieldFeedbackValidations = await form.validateFields(input);
      expect(fieldFeedbackValidations).toEqual([{
        fieldName: 'username',
        isValid: expect.any(Function),
        fieldFeedbackValidations: [
          {key: 0.0, isValid: true},
          {key: 0.1, isValid: false},
          {key: 0.2, isValid: undefined}
        ]
      }]);

      expect(form.fieldsStore.fields).toEqual({
        username: {
          dirty: true,
          errors: new Set([0.1]),
          warnings: new Set([0.0]),
          infos: new Set(),
          validationMessage: 'Suffering from being missing'
        }
      });

      expect(wrapper.html()).toEqual(
        '<div><div class="warning">Suffering from being missing</div><div class="error">Suffering from being missing</div></div>'
      );
    });
  });
});
