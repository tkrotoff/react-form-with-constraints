import * as React from 'react';
import { shallow as _shallow } from 'enzyme';

import { FormWithConstraints, FormWithConstraintsChildContext, fieldWithoutFeedback, FieldEvent } from 'react-form-with-constraints';
import { DisplayFields } from './index';

function shallow(node: React.ReactElement<{}>, options: {context: FormWithConstraintsChildContext}) {
  return _shallow<{}>(node, options);
}

let form_username_empty: FormWithConstraints;

beforeEach(() => {
  form_username_empty = new FormWithConstraints({});
  form_username_empty.fieldsStore.fields = {
    username: fieldWithoutFeedback
  };
});

test('componentWillMount() componentWillUnmount()', () => {
  const form = new FormWithConstraints({});
  const fieldsStoreAddListenerSpy = jest.spyOn(form.fieldsStore, 'addListener');
  const fieldsStoreRemoveListenerSpy = jest.spyOn(form.fieldsStore, 'removeListener');

  const wrapper = shallow(
    <DisplayFields />,
    {context: {form}}
  );
  const reRender = (wrapper.instance() as DisplayFields).reRender;

  expect(fieldsStoreAddListenerSpy).toHaveBeenCalledTimes(3);
  expect(fieldsStoreAddListenerSpy.mock.calls).toEqual([
    [FieldEvent.Added, reRender],
    [FieldEvent.Removed, reRender],
    [FieldEvent.Updated, reRender],
  ]);
  expect(fieldsStoreRemoveListenerSpy).toHaveBeenCalledTimes(0);

  wrapper.unmount();
  expect(fieldsStoreAddListenerSpy).toHaveBeenCalledTimes(3);
  expect(fieldsStoreRemoveListenerSpy).toHaveBeenCalledTimes(3);
  expect(fieldsStoreRemoveListenerSpy.mock.calls).toEqual([
    [FieldEvent.Added, reRender],
    [FieldEvent.Removed, reRender],
    [FieldEvent.Updated, reRender],
  ]);
});

test('render()', () => {
  const wrapper = shallow(
    <DisplayFields />,
    {context: {form: form_username_empty}}
  );

  expect(wrapper.text()).toEqual(
`react-form-with-constraints = {
  "username": {
    "dirty": false,
    "errors": [],
    "warnings": [],
    "infos": [],
    "validationMessage": ""
  }
}`);

  expect(wrapper.html()).toEqual(
`<pre>react-form-with-constraints = {
  &quot;username&quot;: {
    &quot;dirty&quot;: false,
    &quot;errors&quot;: [],
    &quot;warnings&quot;: [],
    &quot;infos&quot;: [],
    &quot;validationMessage&quot;: &quot;&quot;
  }
}</pre>`
  );
});

describe('reRender()', () => {
  test('adding field', () => {
    const wrapper = shallow(
      <DisplayFields />,
      {context: {form: form_username_empty}}
    );

    form_username_empty.fieldsStore.addField('password');

    // See http://airbnb.io/enzyme/docs/guides/migration-from-2-to-3.html#for-mount-updates-are-sometimes-required-when-they-werent-before
    wrapper.update();

    expect(wrapper.text()).toEqual(
`react-form-with-constraints = {
  "username": {
    "dirty": false,
    "errors": [],
    "warnings": [],
    "infos": [],
    "validationMessage": ""
  },
  "password": {
    "dirty": false,
    "errors": [],
    "warnings": [],
    "infos": [],
    "validationMessage": ""
  }
}`);
  });

  test('removing field', () => {
    const wrapper = shallow(
      <DisplayFields />,
      {context: {form: form_username_empty}}
    );

    form_username_empty.fieldsStore.removeField('username');

    wrapper.update();

    expect(wrapper.text()).toEqual('react-form-with-constraints = {}');
  });

  test('updating field', () => {
    const wrapper = shallow(
      <DisplayFields />,
      {context: {form: form_username_empty}}
    );

    const field = form_username_empty.fieldsStore.cloneField('username');
    field.dirty = true;
    field.errors.add(1.0);
    field.warnings.add(2.0);
    field.infos.add(3.0);
    field.validationMessage = "I'm a clone";
    form_username_empty.fieldsStore.updateField('username', field);

    wrapper.update();

    expect(wrapper.text()).toEqual(
`react-form-with-constraints = {
  "username": {
    "dirty": true,
    "errors": [
      1
    ],
    "warnings": [
      2
    ],
    "infos": [
      3
    ],
    "validationMessage": "I'm a clone"
  }
}`);
  });

  test('updating unknown field', () => {
    const wrapper = shallow(
      <DisplayFields />,
      {context: {form: form_username_empty}}
    );

    const field = form_username_empty.fieldsStore.cloneField('username');
    field.dirty = true;
    field.errors.add(1.0);
    field.warnings.add(2.0);
    field.infos.add(3.0);
    field.validationMessage = "I'm a clone";
    expect(() => form_username_empty.fieldsStore.updateField('unknown', field)).toThrow("Unknown field 'unknown'");

    expect(wrapper.text()).toEqual(
`react-form-with-constraints = {
  "username": {
    "dirty": false,
    "errors": [],
    "warnings": [],
    "infos": [],
    "validationMessage": ""
  }
}`);
  });
});
