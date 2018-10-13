import React from 'react';
import { mount } from 'enzyme';

import SignUp from './SignUp';
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

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username" class="form-control is-invalid">
        <span data-feedbacks="0">
          <span data-feedback="0.3" class="invalid-feedback" style="display: block;">Username 'john' already taken, choose another</span>
        </span>
        <input type="password" name="password" class="form-control is-warning is-valid">
        <span data-feedbacks="1">
          <span data-feedback="1.3" class="warning-feedback" style="display: block;">Should contain small letters</span>
          <span data-feedback="1.4" class="warning-feedback" style="display: block;">Should contain capital letters</span>
          <span data-feedback="1.5" class="warning-feedback" style="display: block;">Should contain special characters</span>
          <span data-feedback="1.6" class="valid-feedback" style="display: block;">Looks good!</span>
        </span>
        <input type="password" name="passwordConfirm" class="is-invalid">
        <span data-feedbacks="2">
          <span data-feedback="2.0" class="invalid-feedback" style="display: block;">Not the same password</span>
        </span>
      </form>`
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

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username" class="form-control is-invalid">
        <span data-feedbacks="0">
          <span data-feedback="0.3" class="invalid-feedback" style="display: block;">Username 'john' already taken, choose another</span>
        </span>
        <input type="password" name="password" class="form-control is-warning is-valid">
        <span data-feedbacks="1">
          <span data-feedback="1.3" class="warning-feedback" style="display: block;">Should contain small letters</span>
          <span data-feedback="1.4" class="warning-feedback" style="display: block;">Should contain capital letters</span>
          <span data-feedback="1.5" class="warning-feedback" style="display: block;">Should contain special characters</span>
          <span data-feedback="1.6" class="valid-feedback" style="display: block;">Looks good!</span>
        </span>
        <input type="password" name="passwordConfirm" class="is-invalid">
        <span data-feedbacks="2">
          <span data-feedback="2.0" class="invalid-feedback" style="display: block;">Not the same password</span>
        </span>
      </form>`
    );

    await signUp.form!.resetFields();

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username" class="form-control">
        <span data-feedbacks="0"></span>
        <input type="password" name="password" class="form-control">
        <span data-feedbacks="1"></span>
        <input type="password" name="passwordConfirm">
        <span data-feedbacks="2"></span>
      </form>`
    );

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

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username" class="form-control is-info is-valid">
        <span data-feedbacks="0">
          <span data-feedback="0.4" class="info-feedback" style="display: block;">Username 'jimmy' available</span>
          <span data-feedback="0.2" class="valid-feedback" style="display: block;">Looks good!</span>
        </span>
        <input type="password" name="password" class="form-control is-warning is-valid">
        <span data-feedbacks="1">
          <span data-feedback="1.3" class="warning-feedback" style="display: block;">Should contain small letters</span>
          <span data-feedback="1.4" class="warning-feedback" style="display: block;">Should contain capital letters</span>
          <span data-feedback="1.5" class="warning-feedback" style="display: block;">Should contain special characters</span>
          <span data-feedback="1.6" class="valid-feedback" style="display: block;">Looks good!</span>
        </span>
        <input type="password" name="passwordConfirm" class="is-valid">
        <span data-feedbacks="2">
          <span data-feedback="2.1" class="valid-feedback" style="display: block;">Looks good!</span>
        </span>
      </form>`
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

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username" class="form-control is-info is-valid">
        <span data-feedbacks="0">
          <span data-feedback="0.3" class="info-feedback" style="display: block;">Username 'jimmy' available</span>
          <span data-feedback="0.2" class="valid-feedback" style="display: block;">Looks good!</span>
        </span>
        <input type="password" name="password" class="form-control is-warning is-valid">
        <span data-feedbacks="1">
          <span data-feedback="1.3" class="warning-feedback" style="display: block;">Should contain small letters</span>
          <span data-feedback="1.4" class="warning-feedback" style="display: block;">Should contain capital letters</span>
          <span data-feedback="1.5" class="warning-feedback" style="display: block;">Should contain special characters</span>
          <span data-feedback="1.6" class="valid-feedback" style="display: block;">Looks good!</span>
        </span>
        <input type="password" name="passwordConfirm" class="is-valid">
        <span data-feedbacks="2">
          <span data-feedback="2.1" class="valid-feedback" style="display: block;">Looks good!</span>
        </span>
      </form>`
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

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username" class="form-control is-invalid">
        <span data-feedbacks="0">
          <span data-feedback="0.3" class="invalid-feedback" style="display: block;">Something wrong with username 'error'</span>
        </span>
        <input type="password" name="password" class="form-control is-warning is-valid">
        <span data-feedbacks="1">
          <span data-feedback="1.3" class="warning-feedback" style="display: block;">Should contain small letters</span>
          <span data-feedback="1.4" class="warning-feedback" style="display: block;">Should contain capital letters</span>
          <span data-feedback="1.5" class="warning-feedback" style="display: block;">Should contain special characters</span>
          <span data-feedback="1.6" class="valid-feedback" style="display: block;">Looks good!</span>
        </span>
        <input type="password" name="passwordConfirm" class="is-invalid">
        <span data-feedbacks="2">
          <span data-feedback="2.0" class="invalid-feedback" style="display: block;">Not the same password</span>
        </span>
      </form>`
    );

    wrapper.unmount();
  });
});
