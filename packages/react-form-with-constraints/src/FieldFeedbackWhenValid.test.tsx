import React from 'react';
import { shallow as _shallow } from 'enzyme';

import {
  FormWithConstraints, Field,
  FieldWillValidateEvent, FieldDidValidateEvent, ResetEvent,
  FieldFeedbackWhenValid, FieldFeedbackWhenValidProps, FieldFeedbackWhenValidContext
} from './index';
import FieldFeedbacks from './FieldFeedbacksEnzymeFix';

const shallow = (node: React.ReactElement<FieldFeedbackWhenValidProps>, options: {context: FieldFeedbackWhenValidContext}) =>
  _shallow<FieldFeedbackWhenValidProps>(node, options);

let form_username: FormWithConstraints;
let fieldFeedbacks_username: FieldFeedbacks;

beforeEach(() => {
  form_username = new FormWithConstraints({});
  fieldFeedbacks_username = new FieldFeedbacks({for: 'username', stop: 'no'}, {form: form_username});
});

test('constructor()', () => {
  const wrapper = shallow(
    <FieldFeedbackWhenValid />,
    {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
  );
  const fieldFeedbackWhenValid = wrapper.instance() as FieldFeedbackWhenValid;
  expect(fieldFeedbackWhenValid.state.fieldIsValid).toEqual(undefined);
});

test('componentWillMount() componentWillUnmount()', () => {
  const addFieldWillValidateEventListenerSpy = jest.spyOn(form_username, 'addFieldWillValidateEventListener');
  const addFieldDidValidateEventListenerSpy = jest.spyOn(form_username, 'addFieldDidValidateEventListener');
  const addResetEventListenerSpy = jest.spyOn(form_username, 'addResetEventListener');
  const removeFieldWillValidateEventListenerSpy = jest.spyOn(form_username, 'removeFieldWillValidateEventListener');
  const removeFieldDidValidateEventListenerSpy = jest.spyOn(form_username, 'removeFieldDidValidateEventListener');
  const removeResetEventListenerSpy = jest.spyOn(form_username, 'removeResetEventListener');

  const wrapper = shallow(
    <FieldFeedbackWhenValid />,
    {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
  );
  expect(addFieldWillValidateEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(addFieldDidValidateEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(removeFieldWillValidateEventListenerSpy).toHaveBeenCalledTimes(0);
  expect(removeFieldDidValidateEventListenerSpy).toHaveBeenCalledTimes(0);
  expect(form_username.fieldWillValidateEventEmitter.listeners.get(FieldWillValidateEvent)).toHaveLength(1);
  expect(form_username.fieldDidValidateEventEmitter.listeners.get(FieldDidValidateEvent)).toHaveLength(1);
  expect(addResetEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(removeResetEventListenerSpy).toHaveBeenCalledTimes(0);
  expect(form_username.resetEventEmitter.listeners.get(ResetEvent)).toHaveLength(1);

  wrapper.unmount();
  expect(addFieldWillValidateEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(addFieldDidValidateEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(removeFieldWillValidateEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(removeFieldDidValidateEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(form_username.fieldWillValidateEventEmitter.listeners.get(FieldWillValidateEvent)).toEqual(undefined);
  expect(form_username.fieldDidValidateEventEmitter.listeners.get(FieldDidValidateEvent)).toEqual(undefined);
  expect(addResetEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(removeResetEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(form_username.resetEventEmitter.listeners.get(ResetEvent)).toEqual(undefined);
});

test('fieldWillValidate() fieldDidValidate()', async () => {
  const wrapper = shallow(
    <FieldFeedbackWhenValid />,
    {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
  );
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

test('reset()', async () => {
  const wrapper = shallow(
    <FieldFeedbackWhenValid />,
    {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
  );
  const fieldFeedbackWhenValid = wrapper.instance() as FieldFeedbackWhenValid;

  await form_username.emitFieldDidValidateEvent(new Field('username'));
  expect(fieldFeedbackWhenValid.state.fieldIsValid).toEqual(true);

  const noReturn = await form_username.emitResetEvent();
  expect(noReturn).toEqual([undefined]);
  expect(fieldFeedbackWhenValid.state.fieldIsValid).toEqual(undefined);
});

test('render()', () => {
  let wrapper = shallow(
    <FieldFeedbackWhenValid>Looks good!</FieldFeedbackWhenValid>,
    {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
  );

  expect(wrapper.html()).toEqual(null);

  wrapper.setState({fieldIsValid: undefined});
  expect(wrapper.html()).toEqual(null);

  wrapper.setState({fieldIsValid: true});
  expect(wrapper.html()).toEqual(
    '<span style="display:block">Looks good!</span>'
  );

  wrapper.setState({fieldIsValid: false});
  expect(wrapper.html()).toEqual(null);

  // With className
  wrapper = shallow(
    <FieldFeedbackWhenValid className="hello">Looks good!</FieldFeedbackWhenValid>,
    {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
  );
  wrapper.setState({fieldIsValid: true});
  expect(wrapper.html()).toEqual(
    '<span class="hello" style="display:block">Looks good!</span>'
  );

  // With div props
  wrapper = shallow(
    <FieldFeedbackWhenValid style={{color: 'green'}}>Looks good!</FieldFeedbackWhenValid>,
    {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
  );
  wrapper.setState({fieldIsValid: true});
  expect(wrapper.html()).toEqual(
    '<span style="display:block;color:green">Looks good!</span>'
  );
});
