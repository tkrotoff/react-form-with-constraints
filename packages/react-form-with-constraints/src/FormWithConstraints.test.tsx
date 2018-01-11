import * as React from 'react';
import { mount } from 'enzyme';

import { fieldWithoutFeedback, FormWithConstraints, FieldFeedbacks, FieldFeedback, Async } from './index';
import checkUsernameAvailability from './checkUsernameAvailability';

// See Event: 'unhandledRejection' https://nodejs.org/api/process.html#process_event_unhandledrejection
// See Bluebird Error management configuration http://bluebirdjs.com/docs/api/error-management-configuration.html
process.on('unhandledRejection', (reason: Error | any, _promise: Promise<any>) => {
  console.error('Unhandled promise rejection:', reason);
});

// FYI "Suffering from being missing" string and friends come from the HTML specification https://www.w3.org/TR/html52/sec-forms.html#suffer-from-being-missing

test('constructor()', () => {
  const form = new FormWithConstraints({});
  expect(form.fieldsStore.fields).toEqual({});
});

test('computeFieldFeedbacksKey()', () => {
  const form = new FormWithConstraints({});
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
        <FormWithConstraints ref={formWithConstraints => this.formWithConstraints = formWithConstraints!}>
          <div>
            <input type="email" name="username" ref={username => this.username = username!} />
            <FieldFeedbacks for="username" stop="no">
              <FieldFeedback when={value => value.length === 0}>Cannot be empty</FieldFeedback>
              <FieldFeedback when={value => value.length < 3}>Should be at least 3 characters long</FieldFeedback>
              <Async
                promise={checkUsernameAvailability}
                then={availability => availability.available ?
                  <FieldFeedback info>Username '{availability.value}' available</FieldFeedback> :
                  <FieldFeedback>Username '{availability.value}' already taken, choose another</FieldFeedback>
                }
                catch={e => <FieldFeedback>{e.message}</FieldFeedback>}
              />
            </FieldFeedbacks>

            <input type="password" name="password" ref={password => this.password = password!} />
            <FieldFeedbacks for="password" stop="no">
              <FieldFeedback when={value => value.length === 0}>Cannot be empty</FieldFeedback>
              <FieldFeedback when={value => value.length < 5}>Should be at least 5 characters long</FieldFeedback>
            </FieldFeedbacks>
          </div>
        </FormWithConstraints>
      );
    }
  }

  test('inputs', async () => {
    const wrapper = mount(<Form />);
    const form = wrapper.instance() as Form;
    const emitValidateEventSpy = jest.spyOn(form.formWithConstraints, 'emitValidateEvent');
    const fieldFeedbackValidations = await form.formWithConstraints.validateFields(form.username, form.password);
    expect(fieldFeedbackValidations).toEqual([
      {key: 0.0, isValid: false},
      {key: 0.1, isValid: false},
      {key: 0.2, isValid: true},
      {key: 1.0, isValid: false},
      {key: 1.1, isValid: false}
    ]);
    expect(emitValidateEventSpy).toHaveBeenCalledTimes(2);
    expect(emitValidateEventSpy.mock.calls).toEqual([
      [form.username],
      [form.password]
    ]);
    expect(wrapper.html()).toEqual(`\
<form>\
<div>\
<input type="email" name="username">\
<div>\
<div class="error">Cannot be empty</div>\
<div class="error">Should be at least 3 characters long</div>\
<div class="info">Username '' available</div>\
</div>\
<input type="password" name="password">\
<div>\
<div class="error">Cannot be empty</div>\
<div class="error">Should be at least 5 characters long</div>\
</div>\
</div>\
</form>`
    );
  });

  test('field names', async () => {
    const form = mount(<Form />).instance() as Form;
    const emitValidateEventSpy = jest.spyOn(form.formWithConstraints, 'emitValidateEvent');
    const fieldFeedbackValidations = await form.formWithConstraints.validateFields('username', 'password');
    expect(fieldFeedbackValidations).toEqual([
      {key: 0.0, isValid: false},
      {key: 0.1, isValid: false},
      {key: 0.2, isValid: true},
      {key: 1.0, isValid: false},
      {key: 1.1, isValid: false}
    ]);
    expect(emitValidateEventSpy).toHaveBeenCalledTimes(2);
    expect(emitValidateEventSpy.mock.calls).toEqual([
      [form.username],
      [form.password]
    ]);
  });

  test('inputs + field names', async () => {
    const form = mount(<Form />).instance() as Form;
    const emitValidateEventSpy = jest.spyOn(form.formWithConstraints, 'emitValidateEvent');
    const fieldFeedbackValidations = await form.formWithConstraints.validateFields(form.username, 'password');
    expect(fieldFeedbackValidations).toEqual([
      {key: 0.0, isValid: false},
      {key: 0.1, isValid: false},
      {key: 0.2, isValid: true},
      {key: 1.0, isValid: false},
      {key: 1.1, isValid: false}
    ]);
    expect(emitValidateEventSpy).toHaveBeenCalledTimes(2);
    expect(emitValidateEventSpy.mock.calls).toEqual([
      [form.username],
      [form.password]
    ]);
  });

  test('without arguments', async () => {
    const form = mount(<Form />).instance() as Form;
    const emitValidateEventSpy = jest.spyOn(form.formWithConstraints, 'emitValidateEvent');
    const fieldFeedbackValidations = await form.formWithConstraints.validateFields();
    expect(fieldFeedbackValidations).toEqual([
      {key: 0.0, isValid: false},
      {key: 0.1, isValid: false},
      {key: 0.2, isValid: true},
      {key: 1.0, isValid: false},
      {key: 1.1, isValid: false}
    ]);
    expect(emitValidateEventSpy).toHaveBeenCalledTimes(2);
    expect(emitValidateEventSpy.mock.calls).toEqual([
      [form.username],
      [form.password]
    ]);
  });

  test('change inputs', async () => {
    const wrapper = mount(<Form />);
    const form = wrapper.instance() as Form;

    form.username.value = 'jimmy';
    form.password.value = '1234';
    const fieldFeedbackValidations = await form.formWithConstraints.validateFields();
    expect(fieldFeedbackValidations).toEqual([
      {key: 0.0, isValid: true},
      {key: 0.1, isValid: true},
      {key: 0.2, isValid: true},
      {key: 1.0, isValid: true},
      {key: 1.1, isValid: false}
    ]);

    expect(wrapper.html()).toEqual(`\
<form>\
<div>\
<input type="email" name="username">\
<div>\
<div class="info">Username 'jimmy' available</div>\
</div>\
<input type="password" name="password">\
<div>\
<div class="error">Should be at least 5 characters long</div>\
</div>\
</div>\
</form>`
    );
  });

  test('change inputs - Async catch()', async () => {
    const wrapper = mount(<Form />);
    const form = wrapper.instance() as Form;

    form.username.value = 'error';
    form.password.value = '1234';
    const fieldFeedbackValidations = await form.formWithConstraints.validateFields();
    expect(fieldFeedbackValidations).toEqual([
      {key: 0.0, isValid: true},
      {key: 0.1, isValid: true},
      {key: 0.2, isValid: false},
      {key: 1.0, isValid: true},
      {key: 1.1, isValid: false}
    ]);

    expect(wrapper.html()).toEqual(`\
<form>\
<div>\
<input type="email" name="username">\
<div>\
<div class="error">Something wrong with username 'error'</div>\
</div>\
<input type="password" name="password">\
<div>\
<div class="error">Should be at least 5 characters long</div>\
</div>\
</div>\
</form>`
    );
  });
});

test('isValid()', () => {
  const form = new FormWithConstraints({});

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
