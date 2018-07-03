import React from 'react';
import { shallow, mount } from 'enzyme';

import { FormWithConstraints, FormControl } from './index';

import { SignUp } from './SignUp';
import beautifyHtml from '../../react-form-with-constraints/src/beautifyHtml';
import sleep from '../../react-form-with-constraints/src/sleep';
import { validValidityState } from '../../react-form-with-constraints/src/InputElementMock';

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
        validations: [
          {key: '0.0', type: 'error', show: true},
          {key: '0.1', type: 'error', show: undefined},
          {key: '0.2', type: 'whenValid', show: undefined}
        ]
      },
      {
        name: 'password',
        validations: [
          {key: '1.0', type: 'error', show: true},
          {key: '1.1', type: 'error', show: undefined},
          {key: '1.2', type: 'warning', show: undefined},
          {key: '1.3', type: 'warning', show: undefined},
          {key: '1.4', type: 'warning', show: undefined},
          {key: '1.5', type: 'warning', show: undefined},
          {key: '1.6', type: 'whenValid', show: undefined}
        ]
      },
      {
        name: 'passwordConfirm',
        validations: [
          {key: '2.0', type: 'error', show: false},
          {key: '2.1', type: 'whenValid', show: undefined}
        ]
      }
    ]);
    expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
    expect(emitValidateFieldEventSpy.mock.calls).toEqual([
      [{name: 'username', type: 'text', value: '', validity: validValidityState, validationMessage: ''}],
      [{name: 'password', type: 'password', value: '', validity: validValidityState, validationMessage: ''}],
      [{name: 'passwordConfirm', type: 'password', value: '', validity: validValidityState, validationMessage: ''}]
    ]);

    emitValidateFieldEventSpy.mockClear();

    signUp.username!.value = 'john';
    signUp.password!.value = '123456';
    signUp.passwordConfirm!.value = '12345';

    fields = await signUp.form!.validateFields();
    expect(fields).toEqual([
      {
        name: 'username',
        validations: [
          {key: '0.0', type: 'error', show: false},
          {key: '0.1', type: 'error', show: false},
          {key: '0.3', type: 'error', show: true},
          {key: '0.2', type: 'whenValid', show: undefined}
        ]
      },
      {
        name: 'password',
        validations: [
          {key: '1.0', type: 'error', show: false},
          {key: '1.1', type: 'error', show: false},
          {key: '1.2', type: 'warning', show: false},
          {key: '1.3', type: 'warning', show: true},
          {key: '1.4', type: 'warning', show: true},
          {key: '1.5', type: 'warning', show: true},
          {key: '1.6', type: 'whenValid', show: undefined}
        ]
      },
      {
        name: 'passwordConfirm',
        validations: [
          {key: '2.0', type: 'error', show: true},
          {key: '2.1', type: 'whenValid', show: undefined}
        ]
      }
    ]);
    expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
    expect(emitValidateFieldEventSpy.mock.calls).toEqual([
      [{name: 'username', type: 'text', value: 'john', validity: validValidityState, validationMessage: ''}],
      [{name: 'password', type: 'password', value: '123456', validity: validValidityState, validationMessage: ''}],
      [{name: 'passwordConfirm', type: 'password', value: '12345', validity: validValidityState, validationMessage: ''}]
    ]);

    expect(beautifyHtml(wrapper.html(), '      ')).toMatch(new RegExp(`\
      <form>
        <div class="MuiFormControl-root-\\d+">
          <div class="MuiInput-root-\\d+ MuiInput-error-\\d+ MuiInput-formControl-\\d+ MuiInput-underline-\\d+">
            <input aria-invalid="true" class="MuiInput-input-\\d+" name="username" type="text" value="">
          </div>
          <p class="MuiFormHelperText-root-\\d+ MuiFormHelperText-error-\\d+">
            <span data-feedbacks="0">
              <span data-feedback="0.3" class="FieldFeedback-root-\\d+ error" style="display: block;">Username 'john' already taken, choose another</span>
            </span>
          </p>
        </div>
        <div class="MuiFormControl-root-\\d+">
          <label class="MuiFormLabel-root-\\d+ MuiInputLabel-root-\\d+ MuiInputLabel-formControl-\\d+ MuiInputLabel-animated-\\d+" data-shrink="false" for="password">Password</label>
          <div class="MuiInput-root-\\d+ MuiInput-formControl-\\d+ MuiInput-underline-\\d+">
            <input aria-invalid="false" class="MuiInput-input-\\d+ MuiInput-inputType-\\d+" id="password" name="password" type="password" value="">
          </div>
          <p class="MuiFormHelperText-root-\\d+">
            <span data-feedbacks="1">
              <span data-feedback="1.3" class="FieldFeedback-root-\\d+ warning" style="display: block;">Should contain small letters</span>
              <span data-feedback="1.4" class="FieldFeedback-root-\\d+ warning" style="display: block;">Should contain capital letters</span>
              <span data-feedback="1.5" class="FieldFeedback-root-\\d+ warning" style="display: block;">Should contain special characters</span>
              <span data-feedback="1.6" class="FieldFeedback-root-\\d+ when-valid" style="display: block;">Looks good!</span>
            </span>
          </p>
        </div>
        <div class="MuiFormControl-root-\\d+">
          <div class="MuiInput-root-\\d+ MuiInput-error-\\d+ MuiInput-formControl-\\d+ MuiInput-underline-\\d+">
            <input aria-invalid="true" class="MuiInput-input-\\d+ MuiInput-inputType-\\d+" name="passwordConfirm" type="password" value="">
          </div>
          <p class="MuiFormHelperText-root-\\d+ MuiFormHelperText-error-\\d+">
            <span data-feedbacks="2">
              <span data-feedback="2.0" class="FieldFeedback-root-\\d+ error" style="display: block;">Not the same password</span>
            </span>
          </p>
        </div>
      </form>`
    ));

    wrapper.unmount();
  });

  test('reset()', async () => {
    const wrapper = mount(<SignUp />);
    const signUp = wrapper.instance() as SignUp;

    signUp.username!.value = 'john';
    signUp.password!.value = '123456';
    signUp.passwordConfirm!.value = '12345';

    await signUp.form!.validateFields();

    expect(beautifyHtml(wrapper.html(), '      ')).toMatch(new RegExp(`\
      <form>
        <div class="MuiFormControl-root-\\d+">
          <div class="MuiInput-root-\\d+ MuiInput-error-\\d+ MuiInput-formControl-\\d+ MuiInput-underline-\\d+">
            <input aria-invalid="true" class="MuiInput-input-\\d+" name="username" type="text" value="">
          </div>
          <p class="MuiFormHelperText-root-\\d+ MuiFormHelperText-error-\\d+">
            <span data-feedbacks="0">
              <span data-feedback="0.3" class="FieldFeedback-root-\\d+ error" style="display: block;">Username 'john' already taken, choose another</span>
            </span>
          </p>
        </div>
        <div class="MuiFormControl-root-\\d+">
          <label class="MuiFormLabel-root-\\d+ MuiInputLabel-root-\\d+ MuiInputLabel-formControl-\\d+ MuiInputLabel-animated-\\d+" data-shrink="false" for="password">Password</label>
          <div class="MuiInput-root-\\d+ MuiInput-formControl-\\d+ MuiInput-underline-\\d+">
            <input aria-invalid="false" class="MuiInput-input-\\d+ MuiInput-inputType-\\d+" id="password" name="password" type="password" value="">
          </div>
          <p class="MuiFormHelperText-root-\\d+">
            <span data-feedbacks="1">
              <span data-feedback="1.3" class="FieldFeedback-root-\\d+ warning" style="display: block;">Should contain small letters</span>
              <span data-feedback="1.4" class="FieldFeedback-root-\\d+ warning" style="display: block;">Should contain capital letters</span>
              <span data-feedback="1.5" class="FieldFeedback-root-\\d+ warning" style="display: block;">Should contain special characters</span>
              <span data-feedback="1.6" class="FieldFeedback-root-\\d+ when-valid" style="display: block;">Looks good!</span>
            </span>
          </p>
        </div>
        <div class="MuiFormControl-root-\\d+">
          <div class="MuiInput-root-\\d+ MuiInput-error-\\d+ MuiInput-formControl-\\d+ MuiInput-underline-\\d+">
            <input aria-invalid="true" class="MuiInput-input-\\d+ MuiInput-inputType-\\d+" name="passwordConfirm" type="password" value="">
          </div>
          <p class="MuiFormHelperText-root-\\d+ MuiFormHelperText-error-\\d+">
            <span data-feedbacks="2">
              <span data-feedback="2.0" class="FieldFeedback-root-\\d+ error" style="display: block;">Not the same password</span>
            </span>
          </p>
        </div>
      </form>`
    ));

    await signUp.form!.reset();

    expect(beautifyHtml(wrapper.html(), '      ')).toMatch(new RegExp(`\
      <form>
        <div class="MuiFormControl-root-\\d+">
          <div class="MuiInput-root-\\d+ MuiInput-formControl-\\d+ MuiInput-underline-\\d+">
            <input aria-invalid="false" class="MuiInput-input-\\d+" name="username" type="text" value="">
          </div>
          <p class="MuiFormHelperText-root-\\d+">
            <span data-feedbacks="0"></span>
          </p>
        </div>
        <div class="MuiFormControl-root-\\d+">
          <label class="MuiFormLabel-root-\\d+ MuiInputLabel-root-\\d+ MuiInputLabel-formControl-\\d+ MuiInputLabel-animated-\\d+" data-shrink="false" for="password">Password</label>
          <div class="MuiInput-root-\\d+ MuiInput-formControl-\\d+ MuiInput-underline-\\d+">
            <input aria-invalid="false" class="MuiInput-input-\\d+ MuiInput-inputType-\\d+" id="password" name="password" type="password" value="">
          </div>
          <p class="MuiFormHelperText-root-\\d+">
            <span data-feedbacks="1"></span>
          </p>
        </div>
        <div class="MuiFormControl-root-\\d+">
          <div class="MuiInput-root-\\d+ MuiInput-formControl-\\d+ MuiInput-underline-\\d+">
            <input aria-invalid="false" class="MuiInput-input-\\d+ MuiInput-inputType-\\d+" name="passwordConfirm" type="password" value="">
          </div>
          <p class="MuiFormHelperText-root-\\d+">
            <span data-feedbacks="2"></span>
          </p>
        </div>
      </form>`
    ));

    signUp.username!.value = 'jimmy';
    signUp.password!.value = '12345';
    signUp.passwordConfirm!.value = '12345';

    await signUp.form!.validateFields();

    // FIXME
    // Strange bug that does not happen with core/FormWithConstraints.test.tsx
    // FieldFeedbackWhenValid render() is being called after wrapper.html() and thus the test fails
    // with `<span data-feedback="2.1" class="valid-feedback">Looks good!</span>` not being there
    // Don't fully understand why
    // Happens with React v16.3.1, Jest v22.4.3 and Enzyme v3.3.0, maybe later versions will have a different behavior
    await sleep(0);

    expect(beautifyHtml(wrapper.html(), '      ')).toMatch(new RegExp(`\
      <form>
        <div class="MuiFormControl-root-\\d+">
          <div class="MuiInput-root-\\d+ MuiInput-formControl-\\d+ MuiInput-underline-\\d+">
            <input aria-invalid="false" class="MuiInput-input-\\d+" name="username" type="text" value="">
          </div>
          <p class="MuiFormHelperText-root-\\d+">
            <span data-feedbacks="0">
              <span data-feedback="0.4" class="FieldFeedback-root-\\d+ info" style="display: block;">Username 'jimmy' available</span>
              <span data-feedback="0.2" class="FieldFeedback-root-\\d+ when-valid" style="display: block;">Looks good!</span>
            </span>
          </p>
        </div>
        <div class="MuiFormControl-root-\\d+">
          <label class="MuiFormLabel-root-\\d+ MuiInputLabel-root-\\d+ MuiInputLabel-formControl-\\d+ MuiInputLabel-animated-\\d+" data-shrink="false" for="password">Password</label>
          <div class="MuiInput-root-\\d+ MuiInput-formControl-\\d+ MuiInput-underline-\\d+">
            <input aria-invalid="false" class="MuiInput-input-\\d+ MuiInput-inputType-\\d+" id="password" name="password" type="password" value="">
          </div>
          <p class="MuiFormHelperText-root-\\d+">
            <span data-feedbacks="1">
              <span data-feedback="1.3" class="FieldFeedback-root-\\d+ warning" style="display: block;">Should contain small letters</span>
              <span data-feedback="1.4" class="FieldFeedback-root-\\d+ warning" style="display: block;">Should contain capital letters</span>
              <span data-feedback="1.5" class="FieldFeedback-root-\\d+ warning" style="display: block;">Should contain special characters</span>
              <span data-feedback="1.6" class="FieldFeedback-root-\\d+ when-valid" style="display: block;">Looks good!</span>
            </span>
          </p>
        </div>
        <div class="MuiFormControl-root-\\d+">
          <div class="MuiInput-root-\\d+ MuiInput-formControl-\\d+ MuiInput-underline-\\d+">
            <input aria-invalid="false" class="MuiInput-input-\\d+ MuiInput-inputType-\\d+" name="passwordConfirm" type="password" value="">
          </div>
          <p class="MuiFormHelperText-root-\\d+">
            <span data-feedbacks="2">
              <span data-feedback="2.1" class="FieldFeedback-root-\\d+ when-valid" style="display: block;">Looks good!</span>
            </span>
          </p>
        </div>
      </form>`
    ));

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

    // FIXME
    // Strange bug that does not happen with core/FormWithConstraints.test.tsx
    // FieldFeedbackWhenValid render() is being called after wrapper.html() and thus the test fails
    // with `<span data-feedback="2.1" class="valid-feedback">Looks good!</span>` not being there
    // Don't fully understand why
    // Happens with React v16.3.1, Jest v22.4.3 and Enzyme v3.3.0, maybe later versions will have a different behavior
    await sleep(0);

    expect(fields).toEqual([
      {
        name: 'username',
        validations: [
          {key: '0.0', type: 'error', show: false},
          {key: '0.1', type: 'error', show: false},
          {key: '0.3', type: 'info', show: true},
          {key: '0.2', type: 'whenValid', show: undefined}
        ]
      },
      {
        name: 'password',
        validations: [
          {key: '1.0', type: 'error', show: false},
          {key: '1.1', type: 'error', show: false},
          {key: '1.2', type: 'warning', show: false},
          {key: '1.3', type: 'warning', show: true},
          {key: '1.4', type: 'warning', show: true},
          {key: '1.5', type: 'warning', show: true},
          {key: '1.6', type: 'whenValid', show: undefined}
        ]
      },
      {
        name: 'passwordConfirm',
        validations: [
          {key: '2.0', type: 'error', show: false},
          {key: '2.1', type: 'whenValid', show: undefined}
        ]
      }
    ]);
    expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
    expect(emitValidateFieldEventSpy.mock.calls).toEqual([
      [{name: 'username', type: 'text', value: 'jimmy', validity: validValidityState, validationMessage: ''}],
      [{name: 'password', type: 'password', value: '12345', validity: validValidityState, validationMessage: ''}],
      [{name: 'passwordConfirm', type: 'password', value: '12345', validity: validValidityState, validationMessage: ''}]
    ]);

    expect(beautifyHtml(wrapper.html(), '      ')).toMatch(new RegExp(`\
      <form>
        <div class="MuiFormControl-root-\\d+">
          <div class="MuiInput-root-\\d+ MuiInput-formControl-\\d+ MuiInput-underline-\\d+">
            <input aria-invalid="false" class="MuiInput-input-\\d+" name="username" type="text" value="">
          </div>
          <p class="MuiFormHelperText-root-\\d+">
            <span data-feedbacks="0">
              <span data-feedback="0.3" class="FieldFeedback-root-\\d+ info" style="display: block;">Username 'jimmy' available</span>
              <span data-feedback="0.2" class="FieldFeedback-root-\\d+ when-valid" style="display: block;">Looks good!</span>
            </span>
          </p>
        </div>
        <div class="MuiFormControl-root-\\d+">
          <label class="MuiFormLabel-root-\\d+ MuiInputLabel-root-\\d+ MuiInputLabel-formControl-\\d+ MuiInputLabel-animated-\\d+" data-shrink="false" for="password">Password</label>
          <div class="MuiInput-root-\\d+ MuiInput-formControl-\\d+ MuiInput-underline-\\d+">
            <input aria-invalid="false" class="MuiInput-input-\\d+ MuiInput-inputType-\\d+" id="password" name="password" type="password" value="">
          </div>
          <p class="MuiFormHelperText-root-\\d+">
            <span data-feedbacks="1">
              <span data-feedback="1.3" class="FieldFeedback-root-\\d+ warning" style="display: block;">Should contain small letters</span>
              <span data-feedback="1.4" class="FieldFeedback-root-\\d+ warning" style="display: block;">Should contain capital letters</span>
              <span data-feedback="1.5" class="FieldFeedback-root-\\d+ warning" style="display: block;">Should contain special characters</span>
              <span data-feedback="1.6" class="FieldFeedback-root-\\d+ when-valid" style="display: block;">Looks good!</span>
            </span>
          </p>
        </div>
        <div class="MuiFormControl-root-\\d+">
          <div class="MuiInput-root-\\d+ MuiInput-formControl-\\d+ MuiInput-underline-\\d+">
            <input aria-invalid="false" class="MuiInput-input-\\d+ MuiInput-inputType-\\d+" name="passwordConfirm" type="password" value="">
          </div>
          <p class="MuiFormHelperText-root-\\d+">
            <span data-feedbacks="2">
              <span data-feedback="2.1" class="FieldFeedback-root-\\d+ when-valid" style="display: block;">Looks good!</span>
            </span>
          </p>
        </div>
      </form>`
    ));

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
        validations: [
          {key: '0.0', type: 'error', show: false},
          {key: '0.1', type: 'error', show: false},
          {key: '0.3', type: 'error', show: true},
          {key: '0.2', type: 'whenValid', show: undefined}
        ]
      },
      {
        name: 'password',
        validations: [
          {key: '1.0', type: 'error', show: false},
          {key: '1.1', type: 'error', show: false},
          {key: '1.2', type: 'warning', show: false},
          {key: '1.3', type: 'warning', show: true},
          {key: '1.4', type: 'warning', show: true},
          {key: '1.5', type: 'warning', show: true},
          {key: '1.6', type: 'whenValid', show: undefined}
        ]
      },
      {
        name: 'passwordConfirm',
        validations: [
          {key: '2.0', type: 'error', show: true},
          {key: '2.1', type: 'whenValid', show: undefined}
        ]
      }
    ]);
    expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
    expect(emitValidateFieldEventSpy.mock.calls).toEqual([
      [{name: 'username', type: 'text', value: 'error', validity: validValidityState, validationMessage: ''}],
      [{name: 'password', type: 'password', value: '123456', validity: validValidityState, validationMessage: ''}],
      [{name: 'passwordConfirm', type: 'password', value: '12345', validity: validValidityState, validationMessage: ''}]
    ]);

    expect(beautifyHtml(wrapper.html(), '      ')).toMatch(new RegExp(`\
      <form>
        <div class="MuiFormControl-root-\\d+">
          <div class="MuiInput-root-\\d+ MuiInput-error-\\d+ MuiInput-formControl-\\d+ MuiInput-underline-\\d+">
            <input aria-invalid="true" class="MuiInput-input-\\d+" name="username" type="text" value="">
          </div>
          <p class="MuiFormHelperText-root-\\d+ MuiFormHelperText-error-\\d+">
            <span data-feedbacks="0">
              <span data-feedback="0.3" class="FieldFeedback-root-\\d+ error" style="display: block;">Something wrong with username 'error'</span>
            </span>
          </p>
        </div>
        <div class="MuiFormControl-root-\\d+">
          <label class="MuiFormLabel-root-\\d+ MuiInputLabel-root-\\d+ MuiInputLabel-formControl-\\d+ MuiInputLabel-animated-\\d+" data-shrink="false" for="password">Password</label>
          <div class="MuiInput-root-\\d+ MuiInput-formControl-\\d+ MuiInput-underline-\\d+">
            <input aria-invalid="false" class="MuiInput-input-\\d+ MuiInput-inputType-\\d+" id="password" name="password" type="password" value="">
          </div>
          <p class="MuiFormHelperText-root-\\d+">
            <span data-feedbacks="1">
              <span data-feedback="1.3" class="FieldFeedback-root-\\d+ warning" style="display: block;">Should contain small letters</span>
              <span data-feedback="1.4" class="FieldFeedback-root-\\d+ warning" style="display: block;">Should contain capital letters</span>
              <span data-feedback="1.5" class="FieldFeedback-root-\\d+ warning" style="display: block;">Should contain special characters</span>
              <span data-feedback="1.6" class="FieldFeedback-root-\\d+ when-valid" style="display: block;">Looks good!</span>
            </span>
          </p>
        </div>
        <div class="MuiFormControl-root-\\d+">
          <div class="MuiInput-root-\\d+ MuiInput-error-\\d+ MuiInput-formControl-\\d+ MuiInput-underline-\\d+">
            <input aria-invalid="true" class="MuiInput-input-\\d+ MuiInput-inputType-\\d+" name="passwordConfirm" type="password" value="">
          </div>
          <p class="MuiFormHelperText-root-\\d+ MuiFormHelperText-error-\\d+">
            <span data-feedbacks="2">
              <span data-feedback="2.0" class="FieldFeedback-root-\\d+ error" style="display: block;">Not the same password</span>
            </span>
          </p>
        </div>
      </form>`
    ));

    wrapper.unmount();
  });
});

describe('FormControl', () => {
  test('getAssociatedFieldName() - 1 [name="*"]', () => {
    const wrapper = shallow(
      <FormControl>
        <input name="username" />
      </FormControl>,
      {context: {form: new FormWithConstraints({})}}
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
      {context: {form: new FormWithConstraints({})}}
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
      {context: {form: new FormWithConstraints({})}}
    );
    const formControl = wrapper.instance() as FormControl;

    expect(() => formControl.getAssociatedFieldName()).toThrow(`0 or multiple [name="*"] instead of 1: 'username,password'`);

    wrapper.unmount();
  });

  test('getAssociatedFieldName() - child with props undefined', () => {
    const wrapper = shallow(
      <FormControl>
        ChildWithPropsUndefined
      </FormControl>,
      {context: {form: new FormWithConstraints({})}}
    );
    const formControl = wrapper.instance() as FormControl;

    expect(() => formControl.getAssociatedFieldName()).toThrow(`0 or multiple [name="*"] instead of 1: ''`);

    wrapper.unmount();
  });
});
