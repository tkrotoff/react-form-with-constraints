import React from 'react';
import { shallow as _shallow, mount as _mount } from 'enzyme';

import { FormWithConstraints, Field, FieldFeedback, FieldFeedbackContext, FieldFeedbackProps, ValidateFieldEvent } from './index';
import { InputElementMock, input_username_valueMissing, input_username_valid } from './InputElementMock';
import FieldFeedbacks from './FieldFeedbacksEnzymeFix';

const shallow = (node: React.ReactElement<FieldFeedbackProps>, options: {context: FieldFeedbackContext}) =>
  _shallow<FieldFeedbackProps>(node, options);

const mount = (node: React.ReactElement<FieldFeedbackProps>, options: {context: FieldFeedbackContext}) =>
  _mount<FieldFeedbackProps>(node, options);

let form_username: FormWithConstraints;
let fieldFeedbacks_username: FieldFeedbacks;

beforeEach(() => {
  form_username = new FormWithConstraints({});

  fieldFeedbacks_username = new FieldFeedbacks({for: 'username', stop: 'no'}, {form: form_username});
  fieldFeedbacks_username.componentWillMount(); // Needed because of fieldsStore.addField() inside componentWillMount()
});

describe('constructor()', () => {
  test('key', () => {
    expect(fieldFeedbacks_username.key).toEqual('0');

    const wrapper1 = shallow(
      <FieldFeedback when="*">message</FieldFeedback>,
      {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
    );
    const fieldFeedback1 = wrapper1.instance() as FieldFeedback;
    expect(fieldFeedback1.key).toEqual('0.0');

    const wrapper2 = shallow(
      <FieldFeedback when="*">message</FieldFeedback>,
      {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
    );
    const fieldFeedback2 = wrapper2.instance() as FieldFeedback;
    expect(fieldFeedback2.key).toEqual('0.1');
  });

  test('when="valid"', () => {
    expect(() =>
      shallow(
        <FieldFeedback when="valid" error />,
        {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
      )
    ).toThrow('Cannot have an attribute (error, warning...) with FieldFeedback when="valid"');

    expect(() =>
      shallow(
        <FieldFeedback when="valid" warning />,
        {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
      )
    ).toThrow('Cannot have an attribute (error, warning...) with FieldFeedback when="valid"');

    expect(() =>
      shallow(
        <FieldFeedback when="valid" info />,
        {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
      )
    ).toThrow('Cannot have an attribute (error, warning...) with FieldFeedback when="valid"');
  });
});

test('componentWillMount() componentWillUnmount()', () => {
  const addValidateFieldEventListenerSpy = jest.spyOn(fieldFeedbacks_username, 'addValidateFieldEventListener');
  const removeValidateFieldEventListenerSpy = jest.spyOn(fieldFeedbacks_username, 'removeValidateFieldEventListener');

  const wrapper = shallow(
    <FieldFeedback when="*" />,
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
  describe('when prop', () => {
    describe('string', () => {
      test('unknown', async () => {
        shallow(
          <FieldFeedback when={'unknown' as any} />,
          {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valueMissing);

        expect(validations).toEqual([
          {key: '0.0', type: 'error', show: false}
        ]);
      });

      test('not matching', async () => {
        shallow(
          <FieldFeedback when="badInput" />,
          {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valueMissing);

        expect(validations).toEqual([
          {key: '0.0', type: 'error', show: false}
        ]);
      });

      test('*', async () => {
        shallow(
          <FieldFeedback when="*" />,
          {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valueMissing);

        expect(validations).toEqual([
          {key: '0.0', type: 'error', show: true}
        ]);
      });

      test('badInput', async () => {
        shallow(
          <FieldFeedback when="badInput" />,
          {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputElementMock('username', '', {valid: false, badInput: true}, 'Suffering from bad input');
        const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input);

        expect(validations).toEqual([
          {key: '0.0', type: 'error', show: true}
        ]);
      });

      test('patternMismatch', async () => {
        shallow(
          <FieldFeedback when="patternMismatch" />,
          {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputElementMock('username', '', {valid: false, patternMismatch: true}, 'Suffering from a pattern mismatch');
        const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input);

        expect(validations).toEqual([
          {key: '0.0', type: 'error', show: true}
        ]);
      });

      test('rangeOverflow', async () => {
        shallow(
          <FieldFeedback when="rangeOverflow" />,
          {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputElementMock('username', '', {valid: false, rangeOverflow: true}, 'Suffering from an overflow');
        const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input);

        expect(validations).toEqual([
          {key: '0.0', type: 'error', show: true}
        ]);
      });

      test('rangeUnderflow', async () => {
        shallow(
          <FieldFeedback when="rangeUnderflow" />,
          {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputElementMock('username', '', {valid: false, rangeUnderflow: true}, 'Suffering from an underflow');
        const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input);

        expect(validations).toEqual([
          {key: '0.0', type: 'error', show: true}
        ]);
      });

      test('stepMismatch', async () => {
        shallow(
          <FieldFeedback when="stepMismatch" />,
          {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputElementMock('username', '', {valid: false, stepMismatch: true}, 'Suffering from a step mismatch');
        const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input);

        expect(validations).toEqual([
          {key: '0.0', type: 'error', show: true}
        ]);
      });

      test('tooLong', async () => {
        shallow(
          <FieldFeedback when="tooLong" />,
          {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputElementMock('username', '', {valid: false, tooLong: true}, 'Suffering from being too long');
        const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input);

        expect(validations).toEqual([
          {key: '0.0', type: 'error', show: true}
        ]);
      });

      test('tooShort', async () => {
        shallow(
          <FieldFeedback when="tooShort" />,
          {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputElementMock('username', '', {valid: false, tooShort: true}, 'Suffering from being too short');
        const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input);

        expect(validations).toEqual([
          {key: '0.0', type: 'error', show: true}
        ]);
      });

      test('typeMismatch', async () => {
        shallow(
          <FieldFeedback when="typeMismatch" />,
          {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputElementMock('username', '', {valid: false, typeMismatch: true}, 'Suffering from bad input');
        const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input);

        expect(validations).toEqual([
          {key: '0.0', type: 'error', show: true}
        ]);
      });

      test('valueMissing', async () => {
        shallow(
          <FieldFeedback when="valueMissing" />,
          {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valueMissing);

        expect(validations).toEqual([
          {key: '0.0', type: 'error', show: true}
        ]);
      });

      test('valid', async () => {
        shallow(
          <FieldFeedback when="valid">Looks good!</FieldFeedback>,
          {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valueMissing);

        expect(validations).toEqual([
          {key: '0.0', type: 'whenValid', show: undefined}
        ]);
      });
    });

    describe('function', () => {
      test('no error', async () => {
        shallow(
          <FieldFeedback when={value => value.length === 0} />,
          {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valid);

        expect(validations).toEqual([
          {key: '0.0', type: 'error', show: false}
        ]);
      });

      test('error', async () => {
        shallow(
          <FieldFeedback when={value => value.length === 0} />,
          {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valueMissing);

        expect(validations).toEqual([
          {key: '0.0', type: 'error', show: true}
        ]);
      });
    });

    test('invalid typeof', async () => {
      shallow(
        <FieldFeedback when={2 as any} />,
        {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
      );
      await expect(fieldFeedbacks_username.emitValidateFieldEvent(input_username_valid)).rejects.toEqual(new TypeError("Invalid FieldFeedback 'when' type: number"));
    });
  });

  test('no prop - default value is error', async () => {
    shallow(
      <FieldFeedback when="*" />,
      {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
    );
    const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valueMissing);

    expect(validations).toEqual([
      {key: '0.0', type: 'error', show: true}
    ]);
  });

  test('error prop', async () => {
    const wrapper = mount(
      <FieldFeedback when="*" error />,
      {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
    );
    const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valueMissing);

    expect(validations).toEqual([
      {key: '0.0', type: 'error', show: true}
    ]);

    expect(wrapper.html()).toEqual(
      '<span data-feedback="0.0" class="error" style="display: block;">Suffering from being missing</span>'
    );
  });

  test('warning prop', async () => {
    shallow(
      <FieldFeedback when="*" warning />,
      {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
    );
    const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valueMissing);

    expect(validations).toEqual([
      {key: '0.0', type: 'warning', show: true}
    ]);
  });

  test('info prop', async () => {
    shallow(
      <FieldFeedback when="*" info />,
      {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
    );
    const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valueMissing);

    expect(validations).toEqual([
      {key: '0.0', type: 'info', show: true}
    ]);
  });
});

describe('render()', () => {
  test('error', async () => {
    const wrapper = mount(
      <FieldFeedback when={value => value.length === 0} error>Cannot be empty</FieldFeedback>,
      {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
    );
    const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valueMissing);

    expect(validations).toEqual([
      {key: '0.0', type: 'error', show: true}
    ]);
    expect(wrapper.html()).toEqual(
      '<span data-feedback="0.0" class="error" style="display: block;">Cannot be empty</span>'
    );
  });

  test('warning', async () => {
    const wrapper = mount(
      <FieldFeedback when={value => value.length === 0} warning>Cannot be empty</FieldFeedback>,
      {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
    );
    const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valueMissing);

    expect(validations).toEqual([
      {key: '0.0', type: 'warning', show: true}
    ]);
    expect(wrapper.html()).toEqual(
      '<span data-feedback="0.0" class="warning" style="display: block;">Cannot be empty</span>'
    );
  });

  test('info', async () => {
    const wrapper = mount(
      <FieldFeedback when={value => value.length === 0} info>Cannot be empty</FieldFeedback>,
      {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
    );
    const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valueMissing);

    expect(validations).toEqual([
      {key: '0.0', type: 'info', show: true}
    ]);
    expect(wrapper.html()).toEqual(
      '<span data-feedback="0.0" class="info" style="display: block;">Cannot be empty</span>'
    );
  });

  test('no error', async () => {
    const wrapper = mount(
      <FieldFeedback when={value => value.length === 0}>Cannot be empty</FieldFeedback>,
      {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
    );
    const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valid);

    expect(validations).toEqual([
      {key: '0.0', type: 'error', show: false}
    ]);
    expect(wrapper.html()).toEqual(null);
  });

  test('without children', async () => {
    const wrapper = mount(
      <FieldFeedback when={value => value.length === 0} />,
      {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
    );
    const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valueMissing);

    expect(validations).toEqual([
      {key: '0.0', type: 'error', show: true}
    ]);
    expect(wrapper.html()).toEqual(
      '<span data-feedback="0.0" class="error" style="display: block;">Suffering from being missing</span>'
    );
  });

  test('with already existing class', async () => {
    const wrapper = mount(
      <FieldFeedback when={value => value.length === 0} className="alreadyExistingClassName">Cannot be empty</FieldFeedback>,
      {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
    );
    const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valueMissing);

    expect(validations).toEqual([
      {key: '0.0', type: 'error', show: true}
    ]);
    expect(wrapper.html()).toEqual(
      '<span data-feedback="0.0" class="alreadyExistingClassName error" style="display: block;">Cannot be empty</span>'
    );
  });

  test('with div props', async () => {
    const wrapper = mount(
      <FieldFeedback when={value => value.length === 0} style={{color: 'yellow'}}>Cannot be empty</FieldFeedback>,
      {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
    );
    const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valueMissing);

    expect(validations).toEqual([
      {key: '0.0', type: 'error', show: true}
    ]);
    expect(wrapper.html()).toEqual(
      '<span data-feedback="0.0" class="error" style="display: block; color: yellow;">Cannot be empty</span>'
    );
    expect(wrapper.props().style).toEqual({color: 'yellow'});
  });

  test('when="valid"', async () => {
    const wrapper = mount(
      <FieldFeedback when="valid">Looks good!</FieldFeedback>,
      {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
    );

    const noReturn = await form_username.emitFieldDidValidateEvent(new Field(fieldFeedbacks_username.fieldName));
    expect(noReturn).toEqual([undefined]);
    expect(wrapper.html()).toEqual(
      '<span data-feedback="0.0" class="when-valid" style="display: block;">Looks good!</span>'
    );
  });
});
