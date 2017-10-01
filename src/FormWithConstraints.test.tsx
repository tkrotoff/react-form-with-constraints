import * as React from 'react';
import { mount } from 'enzyme';

import { fieldWithoutFeedback, FormWithConstraints, FieldFeedbacks, FieldFeedback } from './index';

// FYI "Suffering from being missing" string and friends come from the HTML specification https://www.w3.org/TR/html52/sec-forms.html#suffer-from-being-missing

test('constructor()', () => {
  const form = new FormWithConstraints();
  expect(form.fieldsStore.fields).toEqual({});
});

test('computeFieldFeedbacksKey()', () => {
  const form = new FormWithConstraints();
  expect(form.computeFieldFeedbacksKey()).toEqual(0);
  expect(form.computeFieldFeedbacksKey()).toEqual(1);
  expect(form.computeFieldFeedbacksKey()).toEqual(2);
});

describe('validateFields()', () => {
  class Form extends React.Component {
    formWithConstraints: FormWithConstraints;
    username: HTMLInputElement;
    password: HTMLInputElement;

    render() {
      return (
        <FormWithConstraints ref={(formWithConstraints: any) => this.formWithConstraints = formWithConstraints}>
          <input type="email" name="username" ref={username => this.username = username as any} />
          <input type="password" name="password" ref={password => this.password = password as any} />
        </FormWithConstraints>
      );
    }
  }

  test('inputs', () => {
    const form = mount(<Form />).instance() as Form;
    const emitValidateEventSpy = jest.spyOn(form.formWithConstraints, 'emitValidateEvent');
    form.formWithConstraints.validateFields(form.username, form.password);
    expect(emitValidateEventSpy).toHaveBeenCalledTimes(2);
    expect(emitValidateEventSpy.mock.calls).toEqual([
      [form.username],
      [form.password]
    ]);
  });

  test('field names', () => {
    const form = mount(<Form />).instance() as Form;
    const emitValidateEventSpy = jest.spyOn(form.formWithConstraints, 'emitValidateEvent');
    form.formWithConstraints.validateFields('username', 'password');
    expect(emitValidateEventSpy).toHaveBeenCalledTimes(2);
    expect(emitValidateEventSpy.mock.calls).toEqual([
      [form.username],
      [form.password]
    ]);
  });

  test('inputs + field names', () => {
    const form = mount(<Form />).instance() as Form;
    const emitValidateEventSpy = jest.spyOn(form.formWithConstraints, 'emitValidateEvent');
    form.formWithConstraints.validateFields(form.username, 'password');
    expect(emitValidateEventSpy).toHaveBeenCalledTimes(2);
    expect(emitValidateEventSpy.mock.calls).toEqual([
      [form.username],
      [form.password]
    ]);
  });

  test('without arguments', () => {
    const form = mount(<Form />).instance() as Form;
    const emitValidateEventSpy = jest.spyOn(form.formWithConstraints, 'emitValidateEvent');
    form.formWithConstraints.validateFields();
    expect(emitValidateEventSpy).toHaveBeenCalledTimes(2);
    expect(emitValidateEventSpy.mock.calls).toEqual([
      [form.username],
      [form.password]
    ]);
  });
});

test('isValid()', () => {
  const form = new FormWithConstraints();

  form.fieldsStore.fields = {
    username: {
      dirty: false,
      errors: new Set(),
      warnings: new Set(),
      infos: new Set(),
      validationMessage: ''
    },
    password: {
      dirty: false,
      errors: new Set(),
      warnings: new Set(),
      infos: new Set(),
      validationMessage: ''
    }
  };
  expect(form.isValid()).toEqual(true);

  form.fieldsStore.fields = {
    username: {
      dirty: true,
      errors: new Set([0]),
      warnings: new Set(),
      infos: new Set(),
      validationMessage: 'Suffering from being missing'
    },
    password: {
      dirty: true,
      errors: new Set([0]),
      warnings: new Set(),
      infos: new Set(),
      validationMessage: 'Suffering from being missing'
    }
  };
  expect(form.isValid()).toEqual(false);

  form.fieldsStore.fields = {
    username: {
      dirty: true,
      errors: new Set(),
      warnings: new Set([0]),
      infos: new Set(),
      validationMessage: ''
    },
    password: {
      dirty: true,
      errors: new Set(),
      warnings: new Set([0]),
      infos: new Set(),
      validationMessage: ''
    }
  };
  expect(form.isValid()).toEqual(true);

  form.fieldsStore.fields = {
    username: {
      dirty: true,
      errors: new Set(),
      warnings: new Set(),
      infos: new Set([0]),
      validationMessage: ''
    },
    password: {
      dirty: true,
      errors: new Set(),
      warnings: new Set(),
      infos: new Set([0]),
      validationMessage: ''
    }
  };
  expect(form.isValid()).toEqual(true);
});

describe('render()', () => {
  test('children', () => {
    const formWithConstraints = mount(
      <FormWithConstraints>
        <input type="email" name="username" required minLength={3} />
        <FieldFeedbacks for="username">
          <FieldFeedback when="*" />
        </FieldFeedbacks>

        <input type="password" name="password" required pattern=".{5,}" />
        <FieldFeedbacks for="password">
          <FieldFeedback when="*" />
        </FieldFeedbacks>
      </FormWithConstraints>
    ).instance() as FormWithConstraints;

    expect(formWithConstraints.fieldsStore.fields).toEqual({
      username: fieldWithoutFeedback,
      password: fieldWithoutFeedback
    });
  });

  test('children with <div> inside hierarchy', () => {
    const formWithConstraints = mount(
      <FormWithConstraints>
        <input type="email" name="username" required minLength={3} />
        <div>
          <FieldFeedbacks for="username">
            <div>
              <FieldFeedback when="*" />
            </div>
          </FieldFeedbacks>
        </div>

        <input type="password" name="password" required pattern=".{5,}" />
        <div>
          <FieldFeedbacks for="password">
            <div>
              <FieldFeedback when="*" />
            </div>
          </FieldFeedbacks>
        </div>
      </FormWithConstraints>
    ).instance() as FormWithConstraints;

    expect(formWithConstraints.fieldsStore.fields).toEqual({
      username: fieldWithoutFeedback,
      password: fieldWithoutFeedback
    });
  });

  test('children with <div> inside hierarchy + multiple FieldFeedbacks', () => {
    const formWithConstraints = mount(
      <FormWithConstraints>
        <input type="email" name="username" required minLength={3} />
        <div>
          <FieldFeedbacks for="username">
            <div>
              <FieldFeedback when="*" />
            </div>
          </FieldFeedbacks>
        </div>
        <div>
          <FieldFeedbacks for="username">
            <div>
              <FieldFeedback when="*" />
            </div>
          </FieldFeedbacks>
        </div>

        <input type="password" name="password" required pattern=".{5,}" />
        <div>
          <FieldFeedbacks for="password">
            <div>
              <FieldFeedback when="*" />
            </div>
          </FieldFeedbacks>
        </div>
        <div>
          <FieldFeedbacks for="password">
            <div>
              <FieldFeedback when="*" />
            </div>
          </FieldFeedbacks>
        </div>
      </FormWithConstraints>
    ).instance() as FormWithConstraints;

    expect(formWithConstraints.fieldsStore.fields).toEqual({
      username: fieldWithoutFeedback,
      password: fieldWithoutFeedback
    });
  });
});
