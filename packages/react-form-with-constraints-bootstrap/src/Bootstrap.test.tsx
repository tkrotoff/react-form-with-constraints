import * as React from 'react';
import { mount } from 'enzyme';

import { dBlock, formatHTML, key, keys } from '../../react-form-with-constraints/src/formatHTML';
import { validValidityState } from '../../react-form-with-constraints/src/InputElementMock';
import { SignUp } from './SignUp';

const flushPromises = () =>
  new Promise<void>(resolve => {
    setTimeout(resolve);
  });

const error = 'class="invalid-feedback"';
const warning = 'class="warning-feedback"';
const info = 'class="info-feedback"';
const whenValid = 'class="valid-feedback"';

describe('FormWithConstraints', () => {
  test('change inputs', async () => {
    const wrapper = mount(<SignUp />);
    const signUp = wrapper.instance() as SignUp;
    const emitValidateFieldEventSpy = jest.spyOn(signUp.form!, 'emitValidateFieldEvent');

    signUp.username!.value = '';
    signUp.password!.value = '';
    signUp.passwordConfirm!.value = '';

    let fields = await signUp.form!.validateFields();
    expect(fields).toEqual([
      {
        name: 'username',
        element: signUp.username,
        validations: [
          { key: '0.0', type: 'error', show: true },
          { key: '0.1', type: 'error', show: undefined },
          { key: '0.2', type: 'whenValid', show: undefined }
        ]
      },
      {
        name: 'password',
        element: signUp.password,
        validations: [
          { key: '1.0', type: 'error', show: true },
          { key: '1.1', type: 'error', show: undefined },
          { key: '1.2', type: 'warning', show: undefined },
          { key: '1.3', type: 'warning', show: undefined },
          { key: '1.4', type: 'warning', show: undefined },
          { key: '1.5', type: 'warning', show: undefined },
          { key: '1.6', type: 'whenValid', show: undefined }
        ]
      },
      {
        name: 'passwordConfirm',
        element: signUp.passwordConfirm,
        validations: [
          { key: '2.0', type: 'error', show: false },
          { key: '2.1', type: 'whenValid', show: undefined }
        ]
      }
    ]);
    expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
    expect(emitValidateFieldEventSpy.mock.calls).toEqual([
      [
        {
          name: 'username',
          type: 'text',
          value: '',
          validity: validValidityState,
          validationMessage: ''
        }
      ],
      [
        {
          name: 'password',
          type: 'password',
          value: '',
          validity: validValidityState,
          validationMessage: ''
        }
      ],
      [
        {
          name: 'passwordConfirm',
          type: 'password',
          value: '',
          validity: validValidityState,
          validationMessage: ''
        }
      ]
    ]);

    emitValidateFieldEventSpy.mockClear();

    signUp.username!.value = 'john';
    signUp.password!.value = '123456';
    signUp.passwordConfirm!.value = '12345';

    fields = await signUp.form!.validateFields();
    expect(fields).toEqual([
      {
        name: 'username',
        element: signUp.username,
        validations: [
          { key: '0.0', type: 'error', show: false },
          { key: '0.1', type: 'error', show: false },
          { key: '0.3', type: 'error', show: true },
          { key: '0.2', type: 'whenValid', show: undefined }
        ]
      },
      {
        name: 'password',
        element: signUp.password,
        validations: [
          { key: '1.0', type: 'error', show: false },
          { key: '1.1', type: 'error', show: false },
          { key: '1.2', type: 'warning', show: false },
          { key: '1.3', type: 'warning', show: true },
          { key: '1.4', type: 'warning', show: true },
          { key: '1.5', type: 'warning', show: true },
          { key: '1.6', type: 'whenValid', show: undefined }
        ]
      },
      {
        name: 'passwordConfirm',
        element: signUp.passwordConfirm,
        validations: [
          { key: '2.0', type: 'error', show: true },
          { key: '2.1', type: 'whenValid', show: undefined }
        ]
      }
    ]);
    expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
    expect(emitValidateFieldEventSpy.mock.calls).toEqual([
      [
        {
          name: 'username',
          type: 'text',
          value: 'john',
          validity: validValidityState,
          validationMessage: ''
        }
      ],
      [
        {
          name: 'password',
          type: 'password',
          value: '123456',
          validity: validValidityState,
          validationMessage: ''
        }
      ],
      [
        {
          name: 'passwordConfirm',
          type: 'password',
          value: '12345',
          validity: validValidityState,
          validationMessage: ''
        }
      ]
    ]);

    await flushPromises();
    expect(formatHTML(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username" class="form-control is-invalid">
        <span ${keys}="0">
          <span ${key}="0.3" ${error} ${dBlock}>Username 'john' already taken, choose another</span>
        </span>
        <input type="password" name="password" class="form-control is-warning is-valid">
        <span ${keys}="1">
          <span ${key}="1.3" ${warning} ${dBlock}>Should contain small letters</span>
          <span ${key}="1.4" ${warning} ${dBlock}>Should contain capital letters</span>
          <span ${key}="1.5" ${warning} ${dBlock}>Should contain special characters</span>
          <span ${key}="1.6" ${whenValid} ${dBlock}>Looks good!</span>
        </span>
        <input type="password" name="passwordConfirm" class="is-invalid">
        <span ${keys}="2">
          <span ${key}="2.0" ${error} ${dBlock}>Not the same password</span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('resetFields()', async () => {
    const wrapper = mount(<SignUp />);
    const signUp = wrapper.instance() as SignUp;

    signUp.username!.value = 'john';
    signUp.password!.value = '123456';
    signUp.passwordConfirm!.value = '12345';

    await signUp.form!.validateFields();

    await flushPromises();
    expect(formatHTML(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username" class="form-control is-invalid">
        <span ${keys}="0">
          <span ${key}="0.3" ${error} ${dBlock}>Username 'john' already taken, choose another</span>
        </span>
        <input type="password" name="password" class="form-control is-warning is-valid">
        <span ${keys}="1">
          <span ${key}="1.3" ${warning} ${dBlock}>Should contain small letters</span>
          <span ${key}="1.4" ${warning} ${dBlock}>Should contain capital letters</span>
          <span ${key}="1.5" ${warning} ${dBlock}>Should contain special characters</span>
          <span ${key}="1.6" ${whenValid} ${dBlock}>Looks good!</span>
        </span>
        <input type="password" name="passwordConfirm" class="is-invalid">
        <span ${keys}="2">
          <span ${key}="2.0" ${error} ${dBlock}>Not the same password</span>
        </span>
      </form>`);

    signUp.form!.resetFields();

    expect(formatHTML(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username" class="form-control">
        <span ${keys}="0"></span>
        <input type="password" name="password" class="form-control">
        <span ${keys}="1"></span>
        <input type="password" name="passwordConfirm">
        <span ${keys}="2"></span>
      </form>`);

    signUp.username!.value = 'jimmy';
    signUp.password!.value = '12345';
    signUp.passwordConfirm!.value = '12345';

    await signUp.form!.validateFields();

    await flushPromises();
    expect(formatHTML(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username" class="form-control is-info is-valid">
        <span ${keys}="0">
          <span ${key}="0.4" ${info} ${dBlock}>Username 'jimmy' available</span>
          <span ${key}="0.2" ${whenValid} ${dBlock}>Looks good!</span>
        </span>
        <input type="password" name="password" class="form-control is-warning is-valid">
        <span ${keys}="1">
          <span ${key}="1.3" ${warning} ${dBlock}>Should contain small letters</span>
          <span ${key}="1.4" ${warning} ${dBlock}>Should contain capital letters</span>
          <span ${key}="1.5" ${warning} ${dBlock}>Should contain special characters</span>
          <span ${key}="1.6" ${whenValid} ${dBlock}>Looks good!</span>
        </span>
        <input type="password" name="passwordConfirm" class="is-valid">
        <span ${keys}="2">
          <span ${key}="2.1" ${whenValid} ${dBlock}>Looks good!</span>
        </span>
      </form>`);

    wrapper.unmount();
  });
});

describe('Async', () => {
  test('then', async () => {
    const wrapper = mount(<SignUp />);
    const signUp = wrapper.instance() as SignUp;
    const emitValidateFieldEventSpy = jest.spyOn(signUp.form!, 'emitValidateFieldEvent');

    signUp.username!.value = 'jimmy';
    signUp.password!.value = '12345';
    signUp.passwordConfirm!.value = '12345';

    const fields = await signUp.form!.validateFields();

    await flushPromises();
    expect(fields).toEqual([
      {
        name: 'username',
        element: signUp.username,
        validations: [
          { key: '0.0', type: 'error', show: false },
          { key: '0.1', type: 'error', show: false },
          { key: '0.3', type: 'info', show: true },
          { key: '0.2', type: 'whenValid', show: undefined }
        ]
      },
      {
        name: 'password',
        element: signUp.password,
        validations: [
          { key: '1.0', type: 'error', show: false },
          { key: '1.1', type: 'error', show: false },
          { key: '1.2', type: 'warning', show: false },
          { key: '1.3', type: 'warning', show: true },
          { key: '1.4', type: 'warning', show: true },
          { key: '1.5', type: 'warning', show: true },
          { key: '1.6', type: 'whenValid', show: undefined }
        ]
      },
      {
        name: 'passwordConfirm',
        element: signUp.passwordConfirm,
        validations: [
          { key: '2.0', type: 'error', show: false },
          { key: '2.1', type: 'whenValid', show: undefined }
        ]
      }
    ]);
    expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
    expect(emitValidateFieldEventSpy.mock.calls).toEqual([
      [
        {
          name: 'username',
          type: 'text',
          value: 'jimmy',
          validity: validValidityState,
          validationMessage: ''
        }
      ],
      [
        {
          name: 'password',
          type: 'password',
          value: '12345',
          validity: validValidityState,
          validationMessage: ''
        }
      ],
      [
        {
          name: 'passwordConfirm',
          type: 'password',
          value: '12345',
          validity: validValidityState,
          validationMessage: ''
        }
      ]
    ]);

    await flushPromises();
    expect(formatHTML(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username" class="form-control is-info is-valid">
        <span ${keys}="0">
          <span ${key}="0.3" ${info} ${dBlock}>Username 'jimmy' available</span>
          <span ${key}="0.2" ${whenValid} ${dBlock}>Looks good!</span>
        </span>
        <input type="password" name="password" class="form-control is-warning is-valid">
        <span ${keys}="1">
          <span ${key}="1.3" ${warning} ${dBlock}>Should contain small letters</span>
          <span ${key}="1.4" ${warning} ${dBlock}>Should contain capital letters</span>
          <span ${key}="1.5" ${warning} ${dBlock}>Should contain special characters</span>
          <span ${key}="1.6" ${whenValid} ${dBlock}>Looks good!</span>
        </span>
        <input type="password" name="passwordConfirm" class="is-valid">
        <span ${keys}="2">
          <span ${key}="2.1" ${whenValid} ${dBlock}>Looks good!</span>
        </span>
      </form>`);

    wrapper.unmount();
  });

  test('catch', async () => {
    const wrapper = mount(<SignUp />);
    const signUp = wrapper.instance() as SignUp;
    const emitValidateFieldEventSpy = jest.spyOn(signUp.form!, 'emitValidateFieldEvent');

    signUp.username!.value = 'error';
    signUp.password!.value = '123456';
    signUp.passwordConfirm!.value = '12345';

    const fields = await signUp.form!.validateFields();
    expect(fields).toEqual([
      {
        name: 'username',
        element: signUp.username,
        validations: [
          { key: '0.0', type: 'error', show: false },
          { key: '0.1', type: 'error', show: false },
          { key: '0.3', type: 'error', show: true },
          { key: '0.2', type: 'whenValid', show: undefined }
        ]
      },
      {
        name: 'password',
        element: signUp.password,
        validations: [
          { key: '1.0', type: 'error', show: false },
          { key: '1.1', type: 'error', show: false },
          { key: '1.2', type: 'warning', show: false },
          { key: '1.3', type: 'warning', show: true },
          { key: '1.4', type: 'warning', show: true },
          { key: '1.5', type: 'warning', show: true },
          { key: '1.6', type: 'whenValid', show: undefined }
        ]
      },
      {
        name: 'passwordConfirm',
        element: signUp.passwordConfirm,
        validations: [
          { key: '2.0', type: 'error', show: true },
          { key: '2.1', type: 'whenValid', show: undefined }
        ]
      }
    ]);
    expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
    expect(emitValidateFieldEventSpy.mock.calls).toEqual([
      [
        {
          name: 'username',
          type: 'text',
          value: 'error',
          validity: validValidityState,
          validationMessage: ''
        }
      ],
      [
        {
          name: 'password',
          type: 'password',
          value: '123456',
          validity: validValidityState,
          validationMessage: ''
        }
      ],
      [
        {
          name: 'passwordConfirm',
          type: 'password',
          value: '12345',
          validity: validValidityState,
          validationMessage: ''
        }
      ]
    ]);

    await flushPromises();
    expect(formatHTML(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username" class="form-control is-invalid">
        <span ${keys}="0">
          <span ${key}="0.3" ${error} ${dBlock}>Something wrong with username 'error'</span>
        </span>
        <input type="password" name="password" class="form-control is-warning is-valid">
        <span ${keys}="1">
          <span ${key}="1.3" ${warning} ${dBlock}>Should contain small letters</span>
          <span ${key}="1.4" ${warning} ${dBlock}>Should contain capital letters</span>
          <span ${key}="1.5" ${warning} ${dBlock}>Should contain special characters</span>
          <span ${key}="1.6" ${whenValid} ${dBlock}>Looks good!</span>
        </span>
        <input type="password" name="passwordConfirm" class="is-invalid">
        <span ${keys}="2">
          <span ${key}="2.0" ${error} ${dBlock}>Not the same password</span>
        </span>
      </form>`);

    wrapper.unmount();
  });
});
