import * as React from 'react';
import { shallow, mount } from 'enzyme';

import { FormWithConstraints, FormControl } from './index';

import SignUp from './SignUp';
import beautifyHtml from '../../react-form-with-constraints/src/beautifyHtml';
import { validValidityState } from '../../react-form-with-constraints/src/InputElementMock';

const flushPromises = () => new Promise(resolve => setImmediate(resolve));

const MuiFormControl = 'MuiFormControl-root-\\d+';
const MuiFormControl_MuiTextField = 'MuiFormControl-root-\\d+ MuiTextField-root-\\d+';
const MuiInputBase = 'MuiInputBase-root-\\d+ .*';
const MuiInputBase_error = 'MuiInputBase-root-\\d+ .* Mui-error .*';
const MuiInput = '.* MuiInput-input-\\d+';
const MuiFormHelperText = 'MuiFormHelperText-root-\\d+';
const MuiFormHelperText_error = 'MuiFormHelperText-root-\\d+ Mui-error';

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
    expect(beautifyHtml(wrapper.html(), '      ')).toMatch(
      new RegExp(`\
      <form>
        <div class="${MuiFormControl_MuiTextField}">
          <div class="${MuiInputBase_error}">
            <input aria-invalid="true" class="${MuiInput}" name="username" type="text" value="">
          </div>
          <p class="${MuiFormHelperText_error}">
            <span data-feedbacks="0">
              <span data-feedback="0.3" class="FieldFeedbackWS-root-\\d+ error" style="display: block;">Username 'john' already taken, choose another</span>
            </span>
          </p>
        </div>
        <div class="${MuiFormControl}">
          <div class="${MuiInputBase}">
            <input aria-invalid="false" class="${MuiInput}" id="password" name="password" type="password" value="">
          </div>
          <p class="${MuiFormHelperText}">
            <span data-feedbacks="1">
              <span data-feedback="1.3" class="FieldFeedbackWS-root-\\d+ warning" style="display: block;">Should contain small letters</span>
              <span data-feedback="1.4" class="FieldFeedbackWS-root-\\d+ warning" style="display: block;">Should contain capital letters</span>
              <span data-feedback="1.5" class="FieldFeedbackWS-root-\\d+ warning" style="display: block;">Should contain special characters</span>
              <span data-feedback="1.6" class="FieldFeedbackWS-root-\\d+ when-valid" style="display: block;">Looks good!</span>
            </span>
          </p>
        </div>
        <div class="${MuiFormControl_MuiTextField}">
          <div class="${MuiInputBase_error}">
            <input aria-invalid="true" class="${MuiInput}" name="passwordConfirm" type="password" value="">
          </div>
          <p class="${MuiFormHelperText_error}">
            <span data-feedbacks="2">
              <span data-feedback="2.0" class="FieldFeedbackWS-root-\\d+ error" style="display: block;">Not the same password</span>
            </span>
          </p>
        </div>
      </form>`)
    );

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
    expect(beautifyHtml(wrapper.html(), '      ')).toMatch(
      new RegExp(`\
      <form>
        <div class="${MuiFormControl_MuiTextField}">
          <div class="${MuiInputBase_error}">
            <input aria-invalid="true" class="${MuiInput}" name="username" type="text" value="">
          </div>
          <p class="${MuiFormHelperText_error}">
            <span data-feedbacks="0">
              <span data-feedback="0.3" class="FieldFeedbackWS-root-\\d+ error" style="display: block;">Username 'john' already taken, choose another</span>
            </span>
          </p>
        </div>
        <div class="${MuiFormControl}">
          <div class="${MuiInputBase}">
            <input aria-invalid="false" class="${MuiInput}" id="password" name="password" type="password" value="">
          </div>
          <p class="${MuiFormHelperText}">
            <span data-feedbacks="1">
              <span data-feedback="1.3" class="FieldFeedbackWS-root-\\d+ warning" style="display: block;">Should contain small letters</span>
              <span data-feedback="1.4" class="FieldFeedbackWS-root-\\d+ warning" style="display: block;">Should contain capital letters</span>
              <span data-feedback="1.5" class="FieldFeedbackWS-root-\\d+ warning" style="display: block;">Should contain special characters</span>
              <span data-feedback="1.6" class="FieldFeedbackWS-root-\\d+ when-valid" style="display: block;">Looks good!</span>
            </span>
          </p>
        </div>
        <div class="${MuiFormControl_MuiTextField}">
          <div class="${MuiInputBase_error}">
            <input aria-invalid="true" class="${MuiInput}" name="passwordConfirm" type="password" value="">
          </div>
          <p class="${MuiFormHelperText_error}">
            <span data-feedbacks="2">
              <span data-feedback="2.0" class="FieldFeedbackWS-root-\\d+ error" style="display: block;">Not the same password</span>
            </span>
          </p>
        </div>
      </form>`)
    );

    await signUp.form!.resetFields();

    await flushPromises();
    expect(beautifyHtml(wrapper.html(), '      ')).toMatch(
      new RegExp(`\
      <form>
        <div class="${MuiFormControl_MuiTextField}">
          <div class="${MuiInputBase}">
            <input aria-invalid="false" class="${MuiInput}" name="username" type="text" value="">
          </div>
          <p class="${MuiFormHelperText}">
            <span data-feedbacks="0"></span>
          </p>
        </div>
        <div class="${MuiFormControl}">
          <div class="${MuiInputBase}">
            <input aria-invalid="false" class="${MuiInput}" id="password" name="password" type="password" value="">
          </div>
          <p class="${MuiFormHelperText}">
            <span data-feedbacks="1"></span>
          </p>
        </div>
        <div class="${MuiFormControl_MuiTextField}">
          <div class="${MuiInputBase}">
            <input aria-invalid="false" class="${MuiInput}" name="passwordConfirm" type="password" value="">
          </div>
          <p class="${MuiFormHelperText}">
            <span data-feedbacks="2"></span>
          </p>
        </div>
      </form>`)
    );

    signUp.username!.value = 'jimmy';
    signUp.password!.value = '12345';
    signUp.passwordConfirm!.value = '12345';

    await signUp.form!.validateFields();

    await flushPromises();
    expect(beautifyHtml(wrapper.html(), '      ')).toMatch(
      new RegExp(`\
      <form>
        <div class="${MuiFormControl_MuiTextField}">
          <div class="${MuiInputBase}">
            <input aria-invalid="false" class="${MuiInput}" name="username" type="text" value="">
          </div>
          <p class="${MuiFormHelperText}">
            <span data-feedbacks="0">
              <span data-feedback="0.4" class="FieldFeedbackWS-root-\\d+ info" style="display: block;">Username 'jimmy' available</span>
              <span data-feedback="0.2" class="FieldFeedbackWS-root-\\d+ when-valid" style="display: block;">Looks good!</span>
            </span>
          </p>
        </div>
        <div class="${MuiFormControl}">
          <div class="${MuiInputBase}">
            <input aria-invalid="false" class="${MuiInput}" id="password" name="password" type="password" value="">
          </div>
          <p class="${MuiFormHelperText}">
            <span data-feedbacks="1">
              <span data-feedback="1.3" class="FieldFeedbackWS-root-\\d+ warning" style="display: block;">Should contain small letters</span>
              <span data-feedback="1.4" class="FieldFeedbackWS-root-\\d+ warning" style="display: block;">Should contain capital letters</span>
              <span data-feedback="1.5" class="FieldFeedbackWS-root-\\d+ warning" style="display: block;">Should contain special characters</span>
              <span data-feedback="1.6" class="FieldFeedbackWS-root-\\d+ when-valid" style="display: block;">Looks good!</span>
            </span>
          </p>
        </div>
        <div class="${MuiFormControl_MuiTextField}">
          <div class="${MuiInputBase}">
            <input aria-invalid="false" class="${MuiInput}" name="passwordConfirm" type="password" value="">
          </div>
          <p class="${MuiFormHelperText}">
            <span data-feedbacks="2">
              <span data-feedback="2.1" class="FieldFeedbackWS-root-\\d+ when-valid" style="display: block;">Looks good!</span>
            </span>
          </p>
        </div>
      </form>`)
    );

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

    expect(beautifyHtml(wrapper.html(), '      ')).toMatch(
      new RegExp(`\
      <form>
        <div class="${MuiFormControl_MuiTextField}">
          <div class="${MuiInputBase}">
            <input aria-invalid="false" class="${MuiInput}" name="username" type="text" value="">
          </div>
          <p class="${MuiFormHelperText}">
            <span data-feedbacks="0">
              <span data-feedback="0.3" class="FieldFeedbackWS-root-\\d+ info" style="display: block;">Username 'jimmy' available</span>
              <span data-feedback="0.2" class="FieldFeedbackWS-root-\\d+ when-valid" style="display: block;">Looks good!</span>
            </span>
          </p>
        </div>
        <div class="${MuiFormControl}">
          <div class="${MuiInputBase}">
            <input aria-invalid="false" class="${MuiInput}" id="password" name="password" type="password" value="">
          </div>
          <p class="${MuiFormHelperText}">
            <span data-feedbacks="1">
              <span data-feedback="1.3" class="FieldFeedbackWS-root-\\d+ warning" style="display: block;">Should contain small letters</span>
              <span data-feedback="1.4" class="FieldFeedbackWS-root-\\d+ warning" style="display: block;">Should contain capital letters</span>
              <span data-feedback="1.5" class="FieldFeedbackWS-root-\\d+ warning" style="display: block;">Should contain special characters</span>
              <span data-feedback="1.6" class="FieldFeedbackWS-root-\\d+ when-valid" style="display: block;">Looks good!</span>
            </span>
          </p>
        </div>
        <div class="${MuiFormControl_MuiTextField}">
          <div class="${MuiInputBase}">
            <input aria-invalid="false" class="${MuiInput}" name="passwordConfirm" type="password" value="">
          </div>
          <p class="${MuiFormHelperText}">
            <span data-feedbacks="2">
              <span data-feedback="2.1" class="FieldFeedbackWS-root-\\d+ when-valid" style="display: block;">Looks good!</span>
            </span>
          </p>
        </div>
      </form>`)
    );

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
    expect(beautifyHtml(wrapper.html(), '      ')).toMatch(
      new RegExp(`\
      <form>
        <div class="${MuiFormControl_MuiTextField}">
          <div class="${MuiInputBase_error}">
            <input aria-invalid="true" class="${MuiInput}" name="username" type="text" value="">
          </div>
          <p class="${MuiFormHelperText_error}">
            <span data-feedbacks="0">
              <span data-feedback="0.3" class="FieldFeedbackWS-root-\\d+ error" style="display: block;">Something wrong with username 'error'</span>
            </span>
          </p>
        </div>
        <div class="${MuiFormControl}">
          <div class="${MuiInputBase}">
            <input aria-invalid="false" class="${MuiInput}" id="password" name="password" type="password" value="">
          </div>
          <p class="${MuiFormHelperText}">
            <span data-feedbacks="1">
              <span data-feedback="1.3" class="FieldFeedbackWS-root-\\d+ warning" style="display: block;">Should contain small letters</span>
              <span data-feedback="1.4" class="FieldFeedbackWS-root-\\d+ warning" style="display: block;">Should contain capital letters</span>
              <span data-feedback="1.5" class="FieldFeedbackWS-root-\\d+ warning" style="display: block;">Should contain special characters</span>
              <span data-feedback="1.6" class="FieldFeedbackWS-root-\\d+ when-valid" style="display: block;">Looks good!</span>
            </span>
          </p>
        </div>
        <div class="${MuiFormControl_MuiTextField}">
          <div class="${MuiInputBase_error}">
            <input aria-invalid="true" class="${MuiInput}" name="passwordConfirm" type="password" value="">
          </div>
          <p class="${MuiFormHelperText_error}">
            <span data-feedbacks="2">
              <span data-feedback="2.0" class="FieldFeedbackWS-root-\\d+ error" style="display: block;">Not the same password</span>
            </span>
          </p>
        </div>
      </form>`)
    );

    wrapper.unmount();
  });
});

describe('FormControl', () => {
  test('getAssociatedFieldName() - 1 [name="*"]', () => {
    const wrapper = shallow(
      <FormControl>
        <input name="username" />
      </FormControl>,
      { context: { form: new FormWithConstraints({}) } }
    );
    const formControl = wrapper.instance() as FormControl;

    expect(formControl.getAssociatedFieldName()).toEqual('username');

    wrapper.unmount();
  });

  test('getAssociatedFieldName() - multiple same [name="*"]', () => {
    const wrapper = shallow(
      <FormControl>
        <input name="username" />
        <input name="username" />
      </FormControl>,
      { context: { form: new FormWithConstraints({}) } }
    );
    const formControl = wrapper.instance() as FormControl;

    expect(formControl.getAssociatedFieldName()).toEqual('username');

    wrapper.unmount();
  });

  test('getAssociatedFieldName() - multiple different [name="*"]', () => {
    const wrapper = shallow(
      <FormControl>
        <input name="username" />
        <input name="password" />
      </FormControl>,
      { context: { form: new FormWithConstraints({}) } }
    );
    const formControl = wrapper.instance() as FormControl;

    expect(() => formControl.getAssociatedFieldName()).toThrow(
      `0 or multiple [name="*"] instead of 1: 'username,password'`
    );

    wrapper.unmount();
  });

  test('getAssociatedFieldName() - child with props undefined', () => {
    const wrapper = shallow(<FormControl>ChildWithPropsUndefined</FormControl>, {
      context: { form: new FormWithConstraints({}) }
    });
    const formControl = wrapper.instance() as FormControl;

    expect(() => formControl.getAssociatedFieldName()).toThrow(
      `0 or multiple [name="*"] instead of 1: ''`
    );

    wrapper.unmount();
  });
});
