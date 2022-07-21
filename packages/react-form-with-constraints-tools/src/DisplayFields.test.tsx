import * as React from 'react';
import { mount as _mount, shallow as _shallow } from 'enzyme';
import {
  FieldEvent,
  FieldFeedbackType,
  FieldFeedbackValidation,
  FormWithConstraints,
  FormWithConstraintsChildContext,
  FormWithConstraintsProps
} from 'react-form-with-constraints';

import {
  dBlock,
  error,
  formatHTML,
  key,
  warning,
  whenValid
} from '../../react-form-with-constraints/src/formatHTML';
import { DisplayFields } from './DisplayFields';
import { SignUp } from './SignUp';

// [d-inline](https://getbootstrap.com/docs/4.5/utilities/display/)
const dInline = 'style="display: inline;"';

function mount(node: React.ReactElement<FormWithConstraintsProps>) {
  return _mount<FormWithConstraintsProps, Record<string, unknown>>(node);
}

function shallow(node: React.ReactElement, options: { context: FormWithConstraintsChildContext }) {
  return _shallow(node, options);
}

test('componentDidMount() componentWillUnmount()', () => {
  const form = new FormWithConstraints({});
  const fieldsStoreAddListenerSpy = jest.spyOn(form.fieldsStore, 'addListener');
  const fieldsStoreRemoveListenerSpy = jest.spyOn(form.fieldsStore, 'removeListener');

  const wrapper = shallow(<DisplayFields />, { context: { form } });
  const displayFields = wrapper.instance() as DisplayFields;

  expect(fieldsStoreAddListenerSpy).toHaveBeenCalledTimes(2);
  expect(fieldsStoreAddListenerSpy.mock.calls).toEqual([
    [FieldEvent.Added, displayFields.reRender],
    [FieldEvent.Removed, displayFields.reRender]
  ]);
  expect(fieldsStoreRemoveListenerSpy).toHaveBeenCalledTimes(0);

  wrapper.unmount();
  expect(fieldsStoreAddListenerSpy).toHaveBeenCalledTimes(2);
  expect(fieldsStoreRemoveListenerSpy).toHaveBeenCalledTimes(2);
  expect(fieldsStoreRemoveListenerSpy.mock.calls).toEqual([
    [FieldEvent.Added, displayFields.reRender],
    [FieldEvent.Removed, displayFields.reRender]
  ]);
});

describe('render()', () => {
  let form_username: FormWithConstraints;

  const validation_empty: FieldFeedbackValidation = {
    key: '0.0',
    type: FieldFeedbackType.Error,
    show: true
  };

  beforeEach(() => {
    form_username = new FormWithConstraints({});
  });

  test('0 field', () => {
    const wrapper = shallow(<DisplayFields />, { context: { form: form_username } });

    expect(wrapper.text()).toEqual('[]');
  });

  test('add field', () => {
    const wrapper = shallow(<DisplayFields />, { context: { form: form_username } });

    form_username.fieldsStore.addField('username');

    // https://airbnb.io/enzyme/docs/guides/migration-from-2-to-3.html#for-mount-updates-are-sometimes-required-when-they-werent-before
    wrapper.update();

    expect(wrapper.text()).toEqual(
      `[
  {
    name: "username",
    validations: []
  }
]`
    );

    form_username.fieldsStore.addField('password');
    wrapper.update();
    expect(wrapper.text()).toEqual(
      `[
  {
    name: "username",
    validations: []
  },
  {
    name: "password",
    validations: []
  }
]`
    );
  });

  test('remove field', () => {
    const wrapper = shallow(<DisplayFields />, { context: { form: form_username } });

    form_username.fieldsStore.addField('username');
    form_username.fieldsStore.addField('password');
    wrapper.update();
    expect(wrapper.text()).toEqual(
      `[
  {
    name: "username",
    validations: []
  },
  {
    name: "password",
    validations: []
  }
]`
    );

    form_username.fieldsStore.removeField('password');
    wrapper.update();
    expect(wrapper.text()).toEqual(
      `[
  {
    name: "username",
    validations: []
  }
]`
    );
  });

  test('form.emitFieldDidValidateEvent()', () => {
    const wrapper = shallow(<DisplayFields />, { context: { form: form_username } });

    form_username.fieldsStore.addField('username');
    form_username.fieldsStore.addField('password');
    const username = form_username.fieldsStore.getField('username')!;
    username.addOrReplaceValidation(validation_empty);
    form_username.emitFieldDidValidateEvent(username);

    // https://airbnb.io/enzyme/docs/guides/migration-from-2-to-3.html#for-mount-updates-are-sometimes-required-when-they-werent-before
    wrapper.update();

    expect(wrapper.text()).toEqual(
      `[
  {
    name: "username",
    validations: [
      { key: "0.0", type: "error", show: true }
    ]
  },
  {
    name: "password",
    validations: []
  }
]`
    );
  });

  test('form.emitFieldDidResetEvent()', () => {
    const wrapper = shallow(<DisplayFields />, { context: { form: form_username } });

    form_username.fieldsStore.addField('username');
    form_username.fieldsStore.addField('password');
    const username = form_username.fieldsStore.getField('username')!;
    username.addOrReplaceValidation(validation_empty);
    form_username.emitFieldDidValidateEvent(username);
    wrapper.update();
    expect(wrapper.text()).toEqual(
      `[
  {
    name: "username",
    validations: [
      { key: "0.0", type: "error", show: true }
    ]
  },
  {
    name: "password",
    validations: []
  }
]`
    );

    // Fails because "this.form.querySelectorAll()" does not work in shallow mode
    // form_username.resetFields();
    username.clearValidations();
    form_username.emitFieldDidResetEvent(username);

    wrapper.update();
    expect(wrapper.text()).toEqual(
      `[
  {
    name: "username",
    validations: []
  },
  {
    name: "password",
    validations: []
  }
]`
    );
  });
});

test('SignUp', async () => {
  const wrapper = mount(<SignUp />);
  const signUp = wrapper.instance() as SignUp;

  signUp.username!.value = 'john';
  signUp.password!.value = '123456';
  signUp.passwordConfirm!.value = '12345';

  await signUp.form!.validateFields();

  expect(formatHTML(wrapper.html(), '    ')).toEqual(`\
    <form>
      <input name="username">
      <li>key="0" for="username" stop="first-error"</li>
      <ul>
        <li>
          <span style="text-decoration: line-through;">key="0.0" type="error"</span>
        </li>
        <li>
          <span style="text-decoration: line-through;">key="0.1" type="error"</span>
        </li>
        <li class="async">
          <span style="">Async</span>
          <ul>
            <li>
              <span style="">key="0.3" type="error"</span>
              <span ${key}="0.3" ${error} ${dInline}>Username 'john' already taken, choose another</span>
            </li>
          </ul>
        </li>
        <li>
          <span style="text-decoration: line-through;">key="0.2" type="whenValid"</span>
        </li>
      </ul>
      <input type="password" name="password">
      <li>key="1" for="password" stop="first-error"</li>
      <ul>
        <li>
          <span style="text-decoration: line-through;">key="1.0" type="error"</span>
        </li>
        <li>
          <span style="text-decoration: line-through;">key="1.1" type="error"</span>
        </li>
        <li>
          <span style="text-decoration: line-through;">key="1.2" type="warning"</span>
        </li>
        <li>
          <span style="">key="1.3" type="warning"</span>
          <span ${key}="1.3" ${warning} ${dInline}>Should contain small letters</span>
        </li>
        <li>
          <span style="">key="1.4" type="warning"</span>
          <span ${key}="1.4" ${warning} ${dInline}>Should contain capital letters</span>
        </li>
        <li>
          <span style="">key="1.5" type="warning"</span>
          <span ${key}="1.5" ${warning} ${dInline}>Should contain special characters</span>
        </li>
        <li>
          <span style="text-decoration: line-through;">key="1.6" type="whenValid"</span>
          <span ${key}="1.6" ${whenValid} ${dBlock}>Looks good!</span>
        </li>
      </ul>
      <input type="password" name="passwordConfirm">
      <li>key="2" for="passwordConfirm" stop="first-error"</li>
      <ul>
        <li>
          <span style="">key="2.0" type="error"</span>
          <span ${key}="2.0" ${error} ${dInline}>Not the same password</span>
        </li>
        <li>
          <span style="text-decoration: line-through;">key="2.1" type="whenValid"</span>
        </li>
      </ul>
    </form>`);

  wrapper.unmount();
});

describe('Async', () => {
  test('then', async () => {
    const wrapper = mount(<SignUp />);
    const signUp = wrapper.instance() as SignUp;

    signUp.username!.value = 'jimmy';
    signUp.password!.value = '12345';
    signUp.passwordConfirm!.value = '12345';

    await signUp.form!.validateFields();
    expect(formatHTML(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username">
        <li>key="0" for="username" stop="first-error"</li>
        <ul>
          <li>
            <span style="text-decoration: line-through;">key="0.0" type="error"</span>
          </li>
          <li>
            <span style="text-decoration: line-through;">key="0.1" type="error"</span>
          </li>
          <li class="async">
            <span style="">Async</span>
            <ul>
              <li>
                <span style="">key="0.3" type="info"</span>
                <span ${key}="0.3" class="info" ${dInline}>Username 'jimmy' available</span>
              </li>
            </ul>
          </li>
          <li>
            <span style="text-decoration: line-through;">key="0.2" type="whenValid"</span>
            <span ${key}="0.2" ${whenValid} ${dBlock}>Looks good!</span>
          </li>
        </ul>
        <input type="password" name="password">
        <li>key="1" for="password" stop="first-error"</li>
        <ul>
          <li>
            <span style="text-decoration: line-through;">key="1.0" type="error"</span>
          </li>
          <li>
            <span style="text-decoration: line-through;">key="1.1" type="error"</span>
          </li>
          <li>
            <span style="text-decoration: line-through;">key="1.2" type="warning"</span>
          </li>
          <li>
            <span style="">key="1.3" type="warning"</span>
            <span ${key}="1.3" ${warning} ${dInline}>Should contain small letters</span>
          </li>
          <li>
            <span style="">key="1.4" type="warning"</span>
            <span ${key}="1.4" ${warning} ${dInline}>Should contain capital letters</span>
          </li>
          <li>
            <span style="">key="1.5" type="warning"</span>
            <span ${key}="1.5" ${warning} ${dInline}>Should contain special characters</span>
          </li>
          <li>
            <span style="text-decoration: line-through;">key="1.6" type="whenValid"</span>
            <span ${key}="1.6" ${whenValid} ${dBlock}>Looks good!</span>
          </li>
        </ul>
        <input type="password" name="passwordConfirm">
        <li>key="2" for="passwordConfirm" stop="first-error"</li>
        <ul>
          <li>
            <span style="text-decoration: line-through;">key="2.0" type="error"</span>
          </li>
          <li>
            <span style="text-decoration: line-through;">key="2.1" type="whenValid"</span>
            <span ${key}="2.1" ${whenValid} ${dBlock}>Looks good!</span>
          </li>
        </ul>
      </form>`);

    wrapper.unmount();
  });

  test('catch', async () => {
    const wrapper = mount(<SignUp />);
    const signUp = wrapper.instance() as SignUp;

    signUp.username!.value = 'error';
    signUp.password!.value = '123456';
    signUp.passwordConfirm!.value = '12345';

    await signUp.form!.validateFields();
    expect(formatHTML(wrapper.html(), '      ')).toEqual(`\
      <form>
        <input name="username">
        <li>key="0" for="username" stop="first-error"</li>
        <ul>
          <li>
            <span style="text-decoration: line-through;">key="0.0" type="error"</span>
          </li>
          <li>
            <span style="text-decoration: line-through;">key="0.1" type="error"</span>
          </li>
          <li class="async">
            <span style="">Async</span>
            <ul>
              <li>
                <span style="">key="0.3" type="error"</span>
                <span ${key}="0.3" ${error} ${dInline}>Something wrong with username 'error'</span>
              </li>
            </ul>
          </li>
          <li>
            <span style="text-decoration: line-through;">key="0.2" type="whenValid"</span>
          </li>
        </ul>
        <input type="password" name="password">
        <li>key="1" for="password" stop="first-error"</li>
        <ul>
          <li>
            <span style="text-decoration: line-through;">key="1.0" type="error"</span>
          </li>
          <li>
            <span style="text-decoration: line-through;">key="1.1" type="error"</span>
          </li>
          <li>
            <span style="text-decoration: line-through;">key="1.2" type="warning"</span>
          </li>
          <li>
            <span style="">key="1.3" type="warning"</span>
            <span ${key}="1.3" ${warning} ${dInline}>Should contain small letters</span>
          </li>
          <li>
            <span style="">key="1.4" type="warning"</span>
            <span ${key}="1.4" ${warning} ${dInline}>Should contain capital letters</span>
          </li>
          <li>
            <span style="">key="1.5" type="warning"</span>
            <span ${key}="1.5" ${warning} ${dInline}>Should contain special characters</span>
          </li>
          <li>
            <span style="text-decoration: line-through;">key="1.6" type="whenValid"</span>
            <span ${key}="1.6" ${whenValid} ${dBlock}>Looks good!</span>
          </li>
        </ul>
        <input type="password" name="passwordConfirm">
        <li>key="2" for="passwordConfirm" stop="first-error"</li>
        <ul>
          <li>
            <span style="">key="2.0" type="error"</span>
            <span ${key}="2.0" ${error} ${dInline}>Not the same password</span>
          </li>
          <li>
            <span style="text-decoration: line-through;">key="2.1" type="whenValid"</span>
          </li>
        </ul>
      </form>`);

    wrapper.unmount();
  });
});
