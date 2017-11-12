import * as React from 'react';
import { shallow as _shallow } from 'enzyme';

import { fieldWithoutFeedback, FieldFeedback, FieldFeedbackProps, FieldFeedbackContext, ValidateEvent } from './index';
import FormWithConstraintsMock from './FormWithConstraintsMock';
import FieldFeedbacksMock from './FieldFeedbacksMock';
import InputMock from './InputMock';

function shallow(node: React.ReactElement<FieldFeedbackProps>, options: {context: FieldFeedbackContext}) {
  return _shallow<FieldFeedbackProps>(node, options);
}

const fieldFeedbacksKey1 = 1;
const fieldFeedbackKey11 = 1.1;

let form_username_empty: FormWithConstraintsMock;
let fieldFeedbacks_username: FieldFeedbacksMock;

beforeEach(() => {
  form_username_empty = new FormWithConstraintsMock({
    username: fieldWithoutFeedback
  });
  fieldFeedbacks_username = new FieldFeedbacksMock({for: 'username', show: 'all'}, fieldFeedbacksKey1, fieldFeedbackKey11);
});

test('constructor() - computeFieldFeedbackKey()', () => {
  const component = shallow(
    <FieldFeedback when="*">message</FieldFeedback>,
    {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
  );
  const fieldFeedback = component.instance() as FieldFeedback;
  expect(fieldFeedback.key).toEqual(fieldFeedbackKey11);
});

test('componentWillMount() componentWillUnmount()', () => {
  const addValidateEventListenerSpy = jest.spyOn(fieldFeedbacks_username, 'addValidateEventListener');
  const removeValidateEventListenerSpy = jest.spyOn(fieldFeedbacks_username, 'removeValidateEventListener');

  const component = shallow(
    <FieldFeedback when="*">message</FieldFeedback>,
    {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
  );
  expect(addValidateEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(removeValidateEventListenerSpy).toHaveBeenCalledTimes(0);
  expect(fieldFeedbacks_username.validateEventEmitter.listeners.get(ValidateEvent)).toHaveLength(1);

  component.unmount();
  expect(addValidateEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(removeValidateEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(fieldFeedbacks_username.validateEventEmitter.listeners.get(ValidateEvent)).toEqual(undefined);
});

describe('validate()', () => {
  describe('when prop', () => {
    describe('string', () => {
      test('valid', () => {
        shallow(
          <FieldFeedback when="*" />,
          {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputMock('username', '', {valid: true}, '');
        fieldFeedbacks_username.emitValidateEvent(input);

        expect(form_username_empty.fieldsStore.fields.username!.errors).toEqual(new Set());
      });

      test('unknown', () => {
        shallow(
          <FieldFeedback when={'unknown' as any} />,
          {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
        fieldFeedbacks_username.emitValidateEvent(input);

        expect(form_username_empty.fieldsStore.fields.username!.errors).toEqual(new Set());
      });

      test('not matching', () => {
        shallow(
          <FieldFeedback when="badInput" />,
          {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
        fieldFeedbacks_username.emitValidateEvent(input);

        expect(form_username_empty.fieldsStore.fields.username!.errors).toEqual(new Set());
      });

      test('*', () => {
        shallow(
          <FieldFeedback when="*" />,
          {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
        fieldFeedbacks_username.emitValidateEvent(input);

        expect(form_username_empty.fieldsStore.fields.username!.errors).toEqual(new Set([fieldFeedbackKey11]));
      });

      test('badInput', () => {
        shallow(
          <FieldFeedback when="badInput" />,
          {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputMock('username', '', {valid: false, badInput: true}, 'Suffering from bad input');
        fieldFeedbacks_username.emitValidateEvent(input);

        expect(form_username_empty.fieldsStore.fields.username!.errors).toEqual(new Set([fieldFeedbackKey11]));
      });

      test('patternMismatch', () => {
        shallow(
          <FieldFeedback when="patternMismatch" />,
          {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputMock('username', '', {valid: false, patternMismatch: true}, 'Suffering from a pattern mismatch');
        fieldFeedbacks_username.emitValidateEvent(input);

        expect(form_username_empty.fieldsStore.fields.username!.errors).toEqual(new Set([fieldFeedbackKey11]));
      });

      test('rangeOverflow', () => {
        shallow(
          <FieldFeedback when="rangeOverflow" />,
          {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputMock('username', '', {valid: false, rangeOverflow: true}, 'Suffering from an overflow');
        fieldFeedbacks_username.emitValidateEvent(input);

        expect(form_username_empty.fieldsStore.fields.username!.errors).toEqual(new Set([fieldFeedbackKey11]));
      });

      test('rangeUnderflow', () => {
        shallow(
          <FieldFeedback when="rangeUnderflow" />,
          {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputMock('username', '', {valid: false, rangeUnderflow: true}, 'Suffering from an underflow');
        fieldFeedbacks_username.emitValidateEvent(input);

        expect(form_username_empty.fieldsStore.fields.username!.errors).toEqual(new Set([fieldFeedbackKey11]));
      });

      test('stepMismatch', () => {
        shallow(
          <FieldFeedback when="stepMismatch" />,
          {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputMock('username', '', {valid: false, stepMismatch: true}, 'Suffering from a step mismatch');
        fieldFeedbacks_username.emitValidateEvent(input);

        expect(form_username_empty.fieldsStore.fields.username!.errors).toEqual(new Set([fieldFeedbackKey11]));
      });

      test('tooLong', () => {
        shallow(
          <FieldFeedback when="tooLong" />,
          {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputMock('username', '', {valid: false, tooLong: true}, 'Suffering from being too long');
        fieldFeedbacks_username.emitValidateEvent(input);

        expect(form_username_empty.fieldsStore.fields.username!.errors).toEqual(new Set([fieldFeedbackKey11]));
      });

      test('tooShort', () => {
        shallow(
          <FieldFeedback when="tooShort" />,
          {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputMock('username', '', {valid: false, tooShort: true}, 'Suffering from being too short');
        fieldFeedbacks_username.emitValidateEvent(input);

        expect(form_username_empty.fieldsStore.fields.username!.errors).toEqual(new Set([fieldFeedbackKey11]));
      });

      test('typeMismatch', () => {
        shallow(
          <FieldFeedback when="typeMismatch" />,
          {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputMock('username', '', {valid: false, typeMismatch: true}, 'Suffering from bad input');
        fieldFeedbacks_username.emitValidateEvent(input);

        expect(form_username_empty.fieldsStore.fields.username!.errors).toEqual(new Set([fieldFeedbackKey11]));
      });

      test('valueMissing', () => {
        shallow(
          <FieldFeedback when="valueMissing" />,
          {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
        fieldFeedbacks_username.emitValidateEvent(input);

        expect(form_username_empty.fieldsStore.fields.username!.errors).toEqual(new Set([fieldFeedbackKey11]));
      });
    });

    describe('function', () => {
      test('no error', () => {
        shallow(
          <FieldFeedback when={value => value.length === 0} />,
          {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputMock('username', 'length > 0', {}, '');
        fieldFeedbacks_username.emitValidateEvent(input);

        expect(form_username_empty.fieldsStore.fields.username!.errors).toEqual(new Set());
      });

      test('error', () => {
        shallow(
          <FieldFeedback when={value => value.length === 0} />,
          {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
        );
        const input = new InputMock('username', '', {}, '');
        fieldFeedbacks_username.emitValidateEvent(input);

        expect(form_username_empty.fieldsStore.fields.username!.errors).toEqual(new Set([fieldFeedbackKey11]));
      });
    });

    test('invalid typeof', () => {
      shallow(
        <FieldFeedback when={2 as any} />,
        {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
      );
      const input = new InputMock('username', '', {}, '');
      expect(() => fieldFeedbacks_username.emitValidateEvent(input)).toThrow(TypeError);
      expect(() => fieldFeedbacks_username.emitValidateEvent(input)).toThrow("Invalid FieldFeedback 'when' type: number");

      expect(form_username_empty.fieldsStore.fields.username!.errors).toEqual(new Set());
    });
  });

  test('error prop - implicit default value', () => {
    const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    shallow(
      <FieldFeedback when="*" />,
      {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
    );
    fieldFeedbacks_username.emitValidateEvent(input);

    expect(form_username_empty.fieldsStore.fields).toEqual({
      username: {
        dirty: true,
        errors: new Set([fieldFeedbackKey11]),
        warnings: new Set(),
        infos: new Set(),
        validationMessage: 'Suffering from being missing'
      }
    });
  });

  test('error prop', () => {
    const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    shallow(
      <FieldFeedback when="*" error />,
      {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
    );
    fieldFeedbacks_username.emitValidateEvent(input);

    expect(form_username_empty.fieldsStore.fields).toEqual({
      username: {
        dirty: true,
        errors: new Set([fieldFeedbackKey11]),
        warnings: new Set(),
        infos: new Set(),
        validationMessage: 'Suffering from being missing'
      }
    });
  });

  test('warning prop', () => {
    shallow(
      <FieldFeedback when="*" warning />,
      {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
    );
    const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    fieldFeedbacks_username.emitValidateEvent(input);

    expect(form_username_empty.fieldsStore.fields).toEqual({
      username: {
        dirty: true,
        errors: new Set(),
        warnings: new Set([fieldFeedbackKey11]),
        infos: new Set(),
        validationMessage: 'Suffering from being missing'
      }
    });
  });

  test('info prop', () => {
    shallow(
      <FieldFeedback when="*" info />,
      {context: {form: form_username_empty, fieldFeedbacks: fieldFeedbacks_username}}
    );
    const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    fieldFeedbacks_username.emitValidateEvent(input);

    expect(form_username_empty.fieldsStore.fields).toEqual({
      username: {
        dirty: true,
        errors: new Set(),
        warnings: new Set(),
        infos: new Set([fieldFeedbackKey11]),
        validationMessage: 'Suffering from being missing'
      }
    });
  });
});

describe('className()', () => {
  test('error matching', () => {
    const form = new FormWithConstraintsMock({
      username: {
        dirty: true,
        errors: new Set([fieldFeedbackKey11]),
        warnings: new Set(),
        infos: new Set(),
        validationMessage: ''
      }
    });
    const fieldFeedbacks = new FieldFeedbacksMock({for: 'username', show: 'all'}, fieldFeedbacksKey1, fieldFeedbackKey11);

    const component = shallow(
      <FieldFeedback when="*" />,
      {context: {form, fieldFeedbacks}}
    );
    const fieldFeedback = component.instance() as FieldFeedback;

    expect(fieldFeedback.className()).toEqual('error');
  });

  test('warning matching', () => {
    const form = new FormWithConstraintsMock({
      username: {
        dirty: true,
        errors: new Set(),
        warnings: new Set([fieldFeedbackKey11]),
        infos: new Set(),
        validationMessage: ''
      }
    });
    const fieldFeedbacks = new FieldFeedbacksMock({for: 'username', show: 'all'}, fieldFeedbacksKey1, fieldFeedbackKey11);

    const component = shallow(
      <FieldFeedback when="*" />,
      {context: {form, fieldFeedbacks}}
    );
    const fieldFeedback = component.instance() as FieldFeedback;

    expect(fieldFeedback.className()).toEqual('warning');
  });

  test('info matching', () => {
    const form = new FormWithConstraintsMock({
      username: {
        dirty: true,
        errors: new Set(),
        warnings: new Set(),
        infos: new Set([fieldFeedbackKey11]),
        validationMessage: ''
      }
    });
    const fieldFeedbacks = new FieldFeedbacksMock({for: 'username', show: 'all'}, fieldFeedbacksKey1, fieldFeedbackKey11);

    const component = shallow(
      <FieldFeedback when="*" />,
      {context: {form, fieldFeedbacks}}
    );
    const fieldFeedback = component.instance() as FieldFeedback;

    expect(fieldFeedback.className()).toEqual('info');
  });

  test('not matching', () => {
    const form = new FormWithConstraintsMock({
      username: {
        dirty: false,
        errors: new Set(),
        warnings: new Set(),
        infos: new Set(),
        validationMessage: ''
      }
    });
    const fieldFeedbacks = new FieldFeedbacksMock({for: 'username', show: 'all'}, fieldFeedbacksKey1, fieldFeedbackKey11);

    const component = shallow(
      <FieldFeedback when="*" />,
      {context: {form, fieldFeedbacks}}
    );
    const fieldFeedback = component.instance() as FieldFeedback;

    expect(fieldFeedback.className()).toEqual(undefined);
  });

  describe('show="first"', () => {
    test('first error', () => {
      const form = new FormWithConstraintsMock({
        username: {
          dirty: true,
          errors: new Set([fieldFeedbackKey11, 1.2, 1.3]),
          warnings: new Set([fieldFeedbackKey11, 1.2, 1.3]),
          infos: new Set([fieldFeedbackKey11, 1.2, 1.3]),
          validationMessage: ''
        }
      });
      const fieldFeedbacks = new FieldFeedbacksMock({for: 'username', show: 'first'}, fieldFeedbacksKey1, fieldFeedbackKey11);
      const component = shallow(
        <FieldFeedback when="*" />,
        {context: {form, fieldFeedbacks}}
      );
      const fieldFeedback = component.instance() as FieldFeedback;

      expect(fieldFeedback.className()).toEqual('error');
    });

    test('no error + first warning', () => {
      const form = new FormWithConstraintsMock({
        username: {
          dirty: true,
          errors: new Set(),
          warnings: new Set([fieldFeedbackKey11, 1.2, 1.3]),
          infos: new Set([fieldFeedbackKey11, 1.2, 1.3]),
          validationMessage: 'Suffering from being missing'
        }
      });
      const fieldFeedbacks = new FieldFeedbacksMock({for: 'username', show: 'first'}, fieldFeedbacksKey1, fieldFeedbackKey11);
      const component = shallow(
        <FieldFeedback when="*" />,
        {context: {form, fieldFeedbacks}}
      );
      const fieldFeedback = component.instance() as FieldFeedback;

      expect(fieldFeedback.className()).toEqual('warning');
    });

    test('not first', () => {
      const form = new FormWithConstraintsMock({
        username: {
          dirty: true,
          errors: new Set([1.0, fieldFeedbackKey11, 1.2]),
          warnings: new Set([1.0, fieldFeedbackKey11, 1.2]),
          infos: new Set([1.0, fieldFeedbackKey11, 1.2]),
          validationMessage: 'Suffering from being missing'
        }
      });
      const fieldFeedbacks = new FieldFeedbacksMock({for: 'username', show: 'first'}, fieldFeedbacksKey1, fieldFeedbackKey11);
      const component = shallow(
        <FieldFeedback when="*" />,
        {context: {form, fieldFeedbacks}}
      );
      const fieldFeedback = component.instance() as FieldFeedback;

      expect(fieldFeedback.className()).toEqual('info');
    });
  });

  describe('show="all"', () => {
    test('not matching', () => {
      const form = new FormWithConstraintsMock({
        username: {
          dirty: true,
          errors: new Set([1.0, 1.2]),
          warnings: new Set([1.0, 1.2]),
          infos: new Set([1.0, 1.2]),
          validationMessage: ''
        }
      });
      const fieldFeedbacks = new FieldFeedbacksMock({for: 'username', show: 'first'}, fieldFeedbacksKey1, fieldFeedbackKey11);
      const component = shallow(
        <FieldFeedback when="*" />,
        {context: {form, fieldFeedbacks}}
      );
      const fieldFeedback = component.instance() as FieldFeedback;

      expect(fieldFeedback.className()).toEqual(undefined);
    });

    test('errors + first warning', () => {
      const form = new FormWithConstraintsMock({
        username: {
          dirty: true,
          errors: new Set([1.2, 1.3]),
          warnings: new Set([fieldFeedbackKey11, 1.2, 1.3]),
          infos: new Set([fieldFeedbackKey11, 1.2, 1.3]),
          validationMessage: ''
        }
      });
      const fieldFeedbacks = new FieldFeedbacksMock({for: 'username', show: 'all'}, fieldFeedbacksKey1, fieldFeedbackKey11);
      const component = shallow(
        <FieldFeedback when="*" />,
        {context: {form, fieldFeedbacks}}
      );
      const fieldFeedback = component.instance() as FieldFeedback;

      expect(fieldFeedback.className()).toEqual('info');
    });

    test('no error + warning', () => {
      const form = new FormWithConstraintsMock({
        username: {
          dirty: true,
          errors: new Set(),
          warnings: new Set([1.0, fieldFeedbackKey11, 1.2]),
          infos: new Set([1.0, fieldFeedbackKey11, 1.2]),
          validationMessage: 'Suffering from being missing'
        }
      });
      const fieldFeedbacks = new FieldFeedbacksMock({for: 'username', show: 'all'}, fieldFeedbacksKey1, fieldFeedbackKey11);
      const component = shallow(
        <FieldFeedback when="*" />,
        {context: {form, fieldFeedbacks}}
      );
      const fieldFeedback = component.instance() as FieldFeedback;

      expect(fieldFeedback.className()).toEqual('warning');
    });
  });
});

describe('render()', () => {
  test('with children', () => {
    const form = new FormWithConstraintsMock({
      username: {
        dirty: true,
        errors: new Set([fieldFeedbackKey11]),
        warnings: new Set(),
        infos: new Set(),
        validationMessage: 'Suffering from being missing'
      }
    });
    const fieldFeedbacks = new FieldFeedbacksMock({for: 'username', show: 'all'}, fieldFeedbacksKey1, fieldFeedbackKey11);

    const fieldFeedback = shallow(
      <FieldFeedback when="*">message</FieldFeedback>,
      {context: {form, fieldFeedbacks}}
    );

    expect(fieldFeedback.html()).toEqual('<div class="error">message</div>');
  });

  test('without children', () => {
    const form = new FormWithConstraintsMock({
      username: {
        dirty: true,
        errors: new Set([fieldFeedbackKey11]),
        warnings: new Set(),
        infos: new Set(),
        validationMessage: 'Suffering from being missing'
      }
    });
    const fieldFeedbacks = new FieldFeedbacksMock({for: 'username', show: 'all'}, fieldFeedbacksKey1, fieldFeedbackKey11);

    const fieldFeedback = shallow(
      <FieldFeedback when="*" />,
      {context: {form, fieldFeedbacks}}
    );

    expect(fieldFeedback.html()).toEqual('<div class="error">Suffering from being missing</div>');
  });

  test('with already existing class', () => {
    const form = new FormWithConstraintsMock({
      username: {
        dirty: true,
        errors: new Set([fieldFeedbackKey11]),
        warnings: new Set(),
        infos: new Set(),
        validationMessage: ''
      }
    });
    const fieldFeedbacks = new FieldFeedbacksMock({for: 'username', show: 'all'}, fieldFeedbacksKey1, fieldFeedbackKey11);

    const fieldFeedback = shallow(
      <FieldFeedback when="*" className="alreadyExistingClassName" />,
      {context: {form, fieldFeedbacks}}
    );

    expect(fieldFeedback.html()).toEqual('<div class="alreadyExistingClassName error"></div>');
  });

  test('with already existing class - no error', () => {
    const form = new FormWithConstraintsMock({
      username: {
        dirty: true,
        errors: new Set(),
        warnings: new Set(),
        infos: new Set(),
        validationMessage: ''
      }
    });
    const fieldFeedbacks = new FieldFeedbacksMock({for: 'username', show: 'all'}, fieldFeedbacksKey1, fieldFeedbackKey11);

    const fieldFeedback = shallow(
      <FieldFeedback when="*" className="alreadyExistingClassName" />,
      {context: {form, fieldFeedbacks}}
    );

    expect(fieldFeedback.html()).toEqual(null);
  });

  test('with divProps', () => {
    const form = new FormWithConstraintsMock({
      username: {
        dirty: true,
        errors: new Set([fieldFeedbackKey11]),
        warnings: new Set(),
        infos: new Set(),
        validationMessage: ''
      }
    });
    const fieldFeedbacks = new FieldFeedbacksMock({for: 'username', show: 'all'}, fieldFeedbacksKey1, fieldFeedbackKey11);

    const fieldFeedback = shallow(
      <FieldFeedback when="*" style={{color: 'yellow'}} />,
      {context: {form, fieldFeedbacks}}
    );

    expect(fieldFeedback.html()).toEqual('<div style="color:yellow" class="error"></div>');
  });
});
