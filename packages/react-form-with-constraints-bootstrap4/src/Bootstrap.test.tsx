import React from 'react';
import { mount } from 'enzyme';

import { FormWithConstraintsTooltip } from './index';
import { SignUp } from './SignUp';
import beautifyHtml from '../../react-form-with-constraints/src/beautifyHtml';
import sleep from '../../react-form-with-constraints/src/sleep';

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
      [{name: 'username', type: 'text', value: ''}],
      [{name: 'password', type: 'password', value: ''}],
      [{name: 'passwordConfirm', type: 'password', value: ''}]
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
      [{name: 'username', type: 'text', value: 'john'}],
      [{name: 'password', type: 'password', value: '123456'}],
      [{name: 'passwordConfirm', type: 'password', value: '12345'}]
    ]);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username" class="form-control is-invalid">
        <div data-feedbacks="0">
          <div data-feedback="0.3" class="invalid-feedback">Username 'john' already taken, choose another</div>
        </div>
        <input type="password" name="password" class="form-control is-warning">
        <div data-feedbacks="1">
          <div data-feedback="1.3" class="warning-feedback">Should contain small letters</div>
          <div data-feedback="1.4" class="warning-feedback">Should contain capital letters</div>
          <div data-feedback="1.5" class="warning-feedback">Should contain special characters</div>
          <div data-feedback="1.6" class="valid-feedback">Looks good!</div>
        </div>
        <input type="password" name="passwordConfirm" class="form-control is-invalid">
        <div data-feedbacks="2">
          <div data-feedback="2.0" class="invalid-feedback">Not the same password</div>
        </div>
      </form>`
    );

    wrapper.unmount();
  });

  test('reset()', async () => {
    const wrapper = mount(<SignUp />);
    const signUp = wrapper.instance() as SignUp;

    signUp.username!.value = 'john';
    signUp.password!.value = '123456';
    signUp.passwordConfirm!.value = '12345';

    await signUp.form!.validateFields();

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username" class="form-control is-invalid">
        <div data-feedbacks="0">
          <div data-feedback="0.3" class="invalid-feedback">Username 'john' already taken, choose another</div>
        </div>
        <input type="password" name="password" class="form-control is-warning">
        <div data-feedbacks="1">
          <div data-feedback="1.3" class="warning-feedback">Should contain small letters</div>
          <div data-feedback="1.4" class="warning-feedback">Should contain capital letters</div>
          <div data-feedback="1.5" class="warning-feedback">Should contain special characters</div>
          <div data-feedback="1.6" class="valid-feedback">Looks good!</div>
        </div>
        <input type="password" name="passwordConfirm" class="form-control is-invalid">
        <div data-feedbacks="2">
          <div data-feedback="2.0" class="invalid-feedback">Not the same password</div>
        </div>
      </form>`
    );

    await signUp.form!.reset();

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username" class="form-control">
        <div data-feedbacks="0"></div>
        <input type="password" name="password" class="form-control">
        <div data-feedbacks="1"></div>
        <input type="password" name="passwordConfirm" class="form-control">
        <div data-feedbacks="2"></div>
      </form>`
    );

    signUp.username!.value = 'jimmy';
    signUp.password!.value = '12345';
    signUp.passwordConfirm!.value = '12345';

    await signUp.form!.validateFields();

    // FIXME
    // Strange bug that does not happen with core/FormWithConstraints.test.tsx
    // FieldFeedbackWhenValid render() is being called after wrapper.html() and thus the test fails
    // with `<div data-feedback="2.1" class="valid-feedback">Looks good!</div>` not being there
    // Don't fully understand why
    // Happens with React v16.3.1, Jest v22.4.3 and Enzyme v3.3.0, maybe later versions will have a different behavior
    await sleep(0);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username" class="form-control is-valid">
        <div data-feedbacks="0">
          <div data-feedback="0.4" class="info-feedback">Username 'jimmy' available</div>
          <div data-feedback="0.2" class="valid-feedback">Looks good!</div>
        </div>
        <input type="password" name="password" class="form-control is-warning">
        <div data-feedbacks="1">
          <div data-feedback="1.3" class="warning-feedback">Should contain small letters</div>
          <div data-feedback="1.4" class="warning-feedback">Should contain capital letters</div>
          <div data-feedback="1.5" class="warning-feedback">Should contain special characters</div>
          <div data-feedback="1.6" class="valid-feedback">Looks good!</div>
        </div>
        <input type="password" name="passwordConfirm" class="form-control is-valid">
        <div data-feedbacks="2">
          <div data-feedback="2.1" class="valid-feedback">Looks good!</div>
        </div>
      </form>`
    );

    wrapper.unmount();
  });
});

describe('FormWithConstraintsTooltip', () => {
  class Form extends React.Component {
    form: FormWithConstraintsTooltip | null = null;

    render() {
      return (
        <FormWithConstraintsTooltip ref={formWithConstraints => this.form = formWithConstraints} />
      );
    }
  }

  test('render()', async () => {
    const wrapper = mount(<Form />);
    const form = wrapper.instance() as Form;
    expect(form.form!.props.fieldFeedbackClassNames).toEqual({
      error: 'invalid-tooltip',
      warning: 'warning-tooltip',
      info: 'info-tooltip',
      valid: 'valid-tooltip'
    });
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
    // with `<div data-feedback="2.1" class="valid-feedback">Looks good!</div>` not being there
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
      [{name: 'username', type: 'text', value: 'jimmy'}],
      [{name: 'password', type: 'password', value: '12345'}],
      [{name: 'passwordConfirm', type: 'password', value: '12345'}]
    ]);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username" class="form-control is-valid">
        <div data-feedbacks="0">
          <div data-feedback="0.3" class="info-feedback">Username 'jimmy' available</div>
          <div data-feedback="0.2" class="valid-feedback">Looks good!</div>
        </div>
        <input type="password" name="password" class="form-control is-warning">
        <div data-feedbacks="1">
          <div data-feedback="1.3" class="warning-feedback">Should contain small letters</div>
          <div data-feedback="1.4" class="warning-feedback">Should contain capital letters</div>
          <div data-feedback="1.5" class="warning-feedback">Should contain special characters</div>
          <div data-feedback="1.6" class="valid-feedback">Looks good!</div>
        </div>
        <input type="password" name="passwordConfirm" class="form-control is-valid">
        <div data-feedbacks="2">
          <div data-feedback="2.1" class="valid-feedback">Looks good!</div>
        </div>
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
      [{name: 'username', type: 'text', value: 'error'}],
      [{name: 'password', type: 'password', value: '123456'}],
      [{name: 'passwordConfirm', type: 'password', value: '12345'}]
    ]);

    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username" class="form-control is-invalid">
        <div data-feedbacks="0">
          <div data-feedback="0.3" class="invalid-feedback">Something wrong with username 'error'</div>
        </div>
        <input type="password" name="password" class="form-control is-warning">
        <div data-feedbacks="1">
          <div data-feedback="1.3" class="warning-feedback">Should contain small letters</div>
          <div data-feedback="1.4" class="warning-feedback">Should contain capital letters</div>
          <div data-feedback="1.5" class="warning-feedback">Should contain special characters</div>
          <div data-feedback="1.6" class="valid-feedback">Looks good!</div>
        </div>
        <input type="password" name="passwordConfirm" class="form-control is-invalid">
        <div data-feedbacks="2">
          <div data-feedback="2.0" class="invalid-feedback">Not the same password</div>
        </div>
      </form>`
    );

    wrapper.unmount();
  });
});
