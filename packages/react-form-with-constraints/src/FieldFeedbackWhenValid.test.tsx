import * as React from 'react';
import { shallow as _shallow } from 'enzyme';

import {
  FormWithConstraints,
  Field,
  FieldWillValidateEvent,
  FieldDidValidateEvent,
  FieldDidResetEvent,
  FieldFeedbackWhenValid,
  FieldFeedbackWhenValidProps,
  FieldFeedbackWhenValidContext
} from './index';
import { FieldFeedbacksEnzymeFix as FieldFeedbacks } from './FieldFeedbacksEnzymeFix';

function shallow(
  node: React.ReactElement<FieldFeedbackWhenValidProps>,
  options: { context: FieldFeedbackWhenValidContext }
) {
  return _shallow<FieldFeedbackWhenValidProps>(node, options);
}

let form_username: FormWithConstraints;
let fieldFeedbacks_username: FieldFeedbacks;

beforeEach(() => {
  form_username = new FormWithConstraints({});
  fieldFeedbacks_username = new FieldFeedbacks(
    { for: 'username', stop: 'no' },
    { form: form_username }
  );
});

test('constructor()', () => {
  const wrapper = shallow(<FieldFeedbackWhenValid />, {
    context: { form: form_username, fieldFeedbacks: fieldFeedbacks_username }
  });
  const fieldFeedbackWhenValid = wrapper.instance() as FieldFeedbackWhenValid;
  expect(fieldFeedbackWhenValid.state.fieldIsValid).toEqual(undefined);
});

test('componentDidMount() componentWillUnmount()', () => {
  const addFieldWillValidateEventListenerSpy = jest.spyOn(
    form_username,
    'addFieldWillValidateEventListener'
  );
  const addFieldDidValidateEventListenerSpy = jest.spyOn(
    form_username,
    'addFieldDidValidateEventListener'
  );
  const addFieldDidResetEventListenerSpy = jest.spyOn(
    form_username,
    'addFieldDidResetEventListener'
  );
  const removeFieldWillValidateEventListenerSpy = jest.spyOn(
    form_username,
    'removeFieldWillValidateEventListener'
  );
  const removeFieldDidValidateEventListenerSpy = jest.spyOn(
    form_username,
    'removeFieldDidValidateEventListener'
  );
  const removeFieldDidResetEventListenerSpy = jest.spyOn(
    form_username,
    'removeFieldDidResetEventListener'
  );

  const wrapper = shallow(<FieldFeedbackWhenValid />, {
    context: { form: form_username, fieldFeedbacks: fieldFeedbacks_username }
  });
  expect(addFieldWillValidateEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(addFieldDidValidateEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(removeFieldWillValidateEventListenerSpy).toHaveBeenCalledTimes(0);
  expect(removeFieldDidValidateEventListenerSpy).toHaveBeenCalledTimes(0);
  expect(
    form_username.fieldWillValidateEventEmitter.listeners.get(FieldWillValidateEvent)
  ).toHaveLength(1);
  expect(
    form_username.fieldDidValidateEventEmitter.listeners.get(FieldDidValidateEvent)
  ).toHaveLength(1);
  expect(addFieldDidResetEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(removeFieldDidResetEventListenerSpy).toHaveBeenCalledTimes(0);
  expect(form_username.fieldDidResetEventEmitter.listeners.get(FieldDidResetEvent)).toHaveLength(1);

  wrapper.unmount();
  expect(addFieldWillValidateEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(addFieldDidValidateEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(removeFieldWillValidateEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(removeFieldDidValidateEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(form_username.fieldWillValidateEventEmitter.listeners.get(FieldWillValidateEvent)).toEqual(
    undefined
  );
  expect(form_username.fieldDidValidateEventEmitter.listeners.get(FieldDidValidateEvent)).toEqual(
    undefined
  );
  expect(addFieldDidResetEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(removeFieldDidResetEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(form_username.fieldDidResetEventEmitter.listeners.get(FieldDidResetEvent)).toEqual(
    undefined
  );
});

test('fieldWillValidate() fieldDidValidate()', async () => {
  const wrapper = shallow(<FieldFeedbackWhenValid />, {
    context: { form: form_username, fieldFeedbacks: fieldFeedbacks_username }
  });
  const fieldFeedbackWhenValid = wrapper.instance() as FieldFeedbackWhenValid;

  expect(fieldFeedbackWhenValid.state.fieldIsValid).toEqual(undefined);

  let noReturn = await form_username.emitFieldWillValidateEvent('username');
  expect(noReturn).toEqual([undefined]);
  expect(fieldFeedbackWhenValid.state.fieldIsValid).toEqual(undefined);

  noReturn = await form_username.emitFieldDidValidateEvent(new Field('username'));
  expect(noReturn).toEqual([undefined]);
  expect(fieldFeedbackWhenValid.state.fieldIsValid).toEqual(true);

  noReturn = await form_username.emitFieldWillValidateEvent('unknown');
  expect(noReturn).toEqual([undefined]);
  expect(fieldFeedbackWhenValid.state.fieldIsValid).toEqual(true); // Untouched
});

test('resetFields()', async () => {
  const wrapper = shallow(<FieldFeedbackWhenValid />, {
    context: { form: form_username, fieldFeedbacks: fieldFeedbacks_username }
  });
  const fieldFeedbackWhenValid = wrapper.instance() as FieldFeedbackWhenValid;

  const field = new Field('username');
  await form_username.emitFieldDidValidateEvent(field);
  expect(fieldFeedbackWhenValid.state.fieldIsValid).toEqual(true);

  const noReturn = await form_username.emitFieldDidResetEvent(field);
  expect(noReturn).toEqual([undefined]);
  expect(fieldFeedbackWhenValid.state.fieldIsValid).toEqual(undefined);
});

test('render()', () => {
  let wrapper = shallow(<FieldFeedbackWhenValid>Looks good!</FieldFeedbackWhenValid>, {
    context: { form: form_username, fieldFeedbacks: fieldFeedbacks_username }
  });

  expect(wrapper.html()).toEqual(null);

  wrapper.setState({ fieldIsValid: undefined });
  expect(wrapper.html()).toEqual(null);

  wrapper.setState({ fieldIsValid: true });
  expect(wrapper.html()).toEqual('<span style="display:block">Looks good!</span>');

  wrapper.setState({ fieldIsValid: false });
  expect(wrapper.html()).toEqual(null);

  // With className
  wrapper = shallow(
    <FieldFeedbackWhenValid className="hello">Looks good!</FieldFeedbackWhenValid>,
    { context: { form: form_username, fieldFeedbacks: fieldFeedbacks_username } }
  );
  wrapper.setState({ fieldIsValid: true });
  expect(wrapper.html()).toEqual('<span class="hello" style="display:block">Looks good!</span>');

  // With div props
  wrapper = shallow(
    <FieldFeedbackWhenValid style={{ color: 'green' }}>Looks good!</FieldFeedbackWhenValid>,
    { context: { form: form_username, fieldFeedbacks: fieldFeedbacks_username } }
  );
  wrapper.setState({ fieldIsValid: true });
  expect(wrapper.html()).toEqual('<span style="display:block;color:green">Looks good!</span>');
});
