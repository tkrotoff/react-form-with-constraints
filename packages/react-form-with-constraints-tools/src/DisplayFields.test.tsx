import React from 'react';
import { shallow as _shallow, mount as _mount } from 'enzyme';

import {
  FormWithConstraints,
  FormWithConstraintsProps,
  FormWithConstraintsChildContext,
  FieldEvent,
  FieldFeedbackValidation,
  FieldFeedbackType
} from 'react-form-with-constraints';

import beautifyHtml from '../../react-form-with-constraints/src/beautifyHtml';

import { DisplayFields } from './index';
import { SignUp } from './SignUp';

const mount = (node: React.ReactElement<FormWithConstraintsProps>) =>
  _mount<FormWithConstraintsProps, {}>(node);

const shallow = (node: React.ReactElement<{}>, options: {context: FormWithConstraintsChildContext}) =>
  _shallow<{}>(node, options);

test('componentWillMount() componentWillUnmount()', () => {
  const form = new FormWithConstraints({});
  const fieldsStoreAddListenerSpy = jest.spyOn(form.fieldsStore, 'addListener');
  const fieldsStoreRemoveListenerSpy = jest.spyOn(form.fieldsStore, 'removeListener');

  const wrapper = shallow(
    <DisplayFields />,
    {context: {form}}
  );
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
    const wrapper = shallow(
      <DisplayFields />,
      {context: {form: form_username}}
    );

    expect(wrapper.text()).toEqual(`Fields = []`);
    expect(wrapper.html()).toEqual(`<pre style="font-size:small">Fields = []</pre>`);
  });

  test('add field', () => {
    const wrapper = shallow(
      <DisplayFields />,
      {context: {form: form_username}}
    );

    form_username.fieldsStore.addField('username');

    // See http://airbnb.io/enzyme/docs/guides/migration-from-2-to-3.html#for-mount-updates-are-sometimes-required-when-they-werent-before
    wrapper.update();

    expect(wrapper.text()).toEqual(
`Fields = [
  {
    name: "username",
    validations: []
  }
]`);

    form_username.fieldsStore.addField('password');
    wrapper.update();
    expect(wrapper.text()).toEqual(
`Fields = [
  {
    name: "username",
    validations: []
  },
  {
    name: "password",
    validations: []
  }
]`);
  });

  test('remove field', () => {
    const wrapper = shallow(
      <DisplayFields />,
      {context: {form: form_username}}
    );

    form_username.fieldsStore.addField('username');
    form_username.fieldsStore.addField('password');
    wrapper.update();
    expect(wrapper.text()).toEqual(
`Fields = [
  {
    name: "username",
    validations: []
  },
  {
    name: "password",
    validations: []
  }
]`);

    form_username.fieldsStore.removeField('password');
    wrapper.update();
    expect(wrapper.text()).toEqual(
`Fields = [
  {
    name: "username",
    validations: []
  }
]`);
  });

  test('form.emitFieldDidValidateEvent()', async () => {
    const wrapper = shallow(
      <DisplayFields />,
      {context: {form: form_username}}
    );

    form_username.fieldsStore.addField('username');
    form_username.fieldsStore.addField('password');
    const username = form_username.fieldsStore.getField('username')!;
    username.addOrReplaceValidation(validation_empty);
    await form_username.emitFieldDidValidateEvent(username);

    // See http://airbnb.io/enzyme/docs/guides/migration-from-2-to-3.html#for-mount-updates-are-sometimes-required-when-they-werent-before
    wrapper.update();

    expect(wrapper.text()).toEqual(
`Fields = [
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
]`);
  });

  test('form.reset()', async () => {
    const wrapper = shallow(
      <DisplayFields />,
      {context: {form: form_username}}
    );

    form_username.fieldsStore.addField('username');
    form_username.fieldsStore.addField('password');
    const username = form_username.fieldsStore.getField('username')!;
    username.addOrReplaceValidation(validation_empty);
    await form_username.emitFieldDidValidateEvent(username);
    wrapper.update();
    expect(wrapper.text()).toEqual(
`Fields = [
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
]`);

    await form_username.reset();
    wrapper.update();
    expect(wrapper.text()).toEqual(
`Fields = [
  {
    name: "username",
    validations: []
  },
  {
    name: "password",
    validations: []
  }
]`);
  });
});

// FIXME See Support for Element.closest() https://github.com/jsdom/jsdom/issues/1555
if (!Element.prototype.closest) {
  Element.prototype.closest = function(this: Element, selector: string) {
    // tslint:disable-next-line:no-this-assignment
    let el: Element | null = this;
    while (el) {
      if (el.matches(selector)) return el;
      el = el.parentElement;
    }
    return null;
  };
}

test('SignUp', async () => {
  const wrapper = mount(<SignUp />);
  const signUp = wrapper.instance() as SignUp;

  signUp.username!.value = 'john';
  signUp.password!.value = '123456';
  signUp.passwordConfirm!.value = '12345';

  await signUp.form!.validateFields();

  expect(beautifyHtml(wrapper.html(), '    ')).toEqual(`\
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
              <span data-feedback="0.3" class="error" style="display: inline;">Username 'john' already taken, choose another</span>
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
          <span data-feedback="1.3" class="warning" style="display: inline;">Should contain small letters</span>
        </li>
        <li>
          <span style="">key="1.4" type="warning"</span>
          <span data-feedback="1.4" class="warning" style="display: inline;">Should contain capital letters</span>
        </li>
        <li>
          <span style="">key="1.5" type="warning"</span>
          <span data-feedback="1.5" class="warning" style="display: inline;">Should contain special characters</span>
        </li>
        <li>
          <span style="text-decoration: line-through;">key="1.6" type="whenValid"</span>
          <span data-feedback="1.6" class="when-valid" style="display: block;">Looks good!</span>
        </li>
      </ul>
      <input type="password" name="passwordConfirm">
      <li>key="2" for="passwordConfirm" stop="first-error"</li>
      <ul>
        <li>
          <span style="">key="2.0" type="error"</span>
          <span data-feedback="2.0" class="error" style="display: inline;">Not the same password</span>
        </li>
        <li>
          <span style="text-decoration: line-through;">key="2.1" type="whenValid"</span>
        </li>
      </ul>
    </form>`
  );

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
    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
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
                <span data-feedback="0.3" class="info" style="display: inline;">Username 'jimmy' available</span>
              </li>
            </ul>
          </li>
          <li>
            <span style="text-decoration: line-through;">key="0.2" type="whenValid"</span>
            <span data-feedback="0.2" class="when-valid" style="display: block;">Looks good!</span>
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
            <span data-feedback="1.3" class="warning" style="display: inline;">Should contain small letters</span>
          </li>
          <li>
            <span style="">key="1.4" type="warning"</span>
            <span data-feedback="1.4" class="warning" style="display: inline;">Should contain capital letters</span>
          </li>
          <li>
            <span style="">key="1.5" type="warning"</span>
            <span data-feedback="1.5" class="warning" style="display: inline;">Should contain special characters</span>
          </li>
          <li>
            <span style="text-decoration: line-through;">key="1.6" type="whenValid"</span>
            <span data-feedback="1.6" class="when-valid" style="display: block;">Looks good!</span>
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
            <span data-feedback="2.1" class="when-valid" style="display: block;">Looks good!</span>
          </li>
        </ul>
      </form>`
    );

    wrapper.unmount();
  });

  test('catch', async () => {
    const wrapper = mount(<SignUp />);
    const signUp = wrapper.instance() as SignUp;

    signUp.username!.value = 'error';
    signUp.password!.value = '123456';
    signUp.passwordConfirm!.value = '12345';

    await signUp.form!.validateFields();
    expect(beautifyHtml(wrapper.html(), '      ')).toEqual(`\
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
                <span data-feedback="0.3" class="error" style="display: inline;">Something wrong with username 'error'</span>
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
            <span data-feedback="1.3" class="warning" style="display: inline;">Should contain small letters</span>
          </li>
          <li>
            <span style="">key="1.4" type="warning"</span>
            <span data-feedback="1.4" class="warning" style="display: inline;">Should contain capital letters</span>
          </li>
          <li>
            <span style="">key="1.5" type="warning"</span>
            <span data-feedback="1.5" class="warning" style="display: inline;">Should contain special characters</span>
          </li>
          <li>
            <span style="text-decoration: line-through;">key="1.6" type="whenValid"</span>
            <span data-feedback="1.6" class="when-valid" style="display: block;">Looks good!</span>
          </li>
        </ul>
        <input type="password" name="passwordConfirm">
        <li>key="2" for="passwordConfirm" stop="first-error"</li>
        <ul>
          <li>
            <span style="">key="2.0" type="error"</span>
            <span data-feedback="2.0" class="error" style="display: inline;">Not the same password</span>
          </li>
          <li>
            <span style="text-decoration: line-through;">key="2.1" type="whenValid"</span>
          </li>
        </ul>
      </form>`
    );

    wrapper.unmount();
  });
});
