import React from 'react';
import { shallow as _shallow } from 'enzyme';

import { Input, InputProps, InputContext, FormWithConstraints, Field, FieldFeedbackValidation, FieldFeedbackType } from './index';

const shallow = (node: React.ReactElement<InputProps>, options: {context: InputContext}) =>
  _shallow<InputProps>(node, options);

test('fieldWillValidate() fieldDidValidate()', () => {
  const wrapper = shallow(
    <Input name="username" />,
    {context: {form: new FormWithConstraints({})}}
  );
  const input = wrapper.instance() as Input;

  expect(wrapper.state()).toEqual({field: undefined});

  const field = new Field('username');
  input.fieldDidValidate(field);
  expect(wrapper.state()).toEqual({field});
  input.fieldWillValidate('unknown');
  expect(wrapper.state()).toEqual({field});
  input.fieldWillValidate('username');
  expect(wrapper.state()).toEqual({field: undefined});

  const unknownField = new Field('unknown');
  input.fieldDidValidate(field);
  expect(wrapper.state()).toEqual({field});
  input.fieldDidValidate(unknownField);
  expect(wrapper.state()).toEqual({field});

  wrapper.unmount();
});

test('reset()', () => {
  const wrapper = shallow(
    <Input name="username" />,
    {context: {form: new FormWithConstraints({})}}
  );
  const input = wrapper.instance() as Input;

  expect(wrapper.state()).toEqual({field: undefined});

  const field = new Field('username');
  input.fieldDidValidate(field);
  expect(wrapper.state()).toEqual({field});

  input.reset();
  expect(wrapper.state()).toEqual({field: undefined});

  wrapper.unmount();
});

describe('render()', () => {
  const validation_error: FieldFeedbackValidation = {
    key: '0.0',
    type: FieldFeedbackType.Error,
    show: true
  };
  const validation_warning: FieldFeedbackValidation = {
    key: '0.1',
    type: FieldFeedbackType.Warning,
    show: true
  };
  const validation_info: FieldFeedbackValidation = {
    key: '0.2',
    type: FieldFeedbackType.Info,
    show: true
  };

  test('has-errors has-warnings has-infos', () => {
    const wrapper = shallow(
      <Input name="username" />,
      {context: {form: new FormWithConstraints({})}}
    );
    const input = wrapper.instance() as Input;

    const field = new Field('username');
    field.addOrReplaceValidation(validation_error);
    field.addOrReplaceValidation(validation_warning);
    field.addOrReplaceValidation(validation_info);
    input.fieldDidValidate(field);

    wrapper.update();

    expect(wrapper.html()).toEqual(
      '<input name="username" class="has-errors has-warnings has-infos"/>'
    );

    wrapper.unmount();
  });

  test('has-errors has-warnings has-infos with className props', () => {
    const wrapper = shallow(
      <Input name="username" className="form-control" />,
      {context: {form: new FormWithConstraints({})}}
    );
    const input = wrapper.instance() as Input;

    const field = new Field('username');
    field.addOrReplaceValidation(validation_error);
    field.addOrReplaceValidation(validation_warning);
    field.addOrReplaceValidation(validation_info);
    input.fieldDidValidate(field);

    wrapper.update();

    expect(wrapper.html()).toEqual(
      '<input name="username" class="form-control has-errors has-warnings has-infos"/>'
    );

    wrapper.unmount();
  });

  test('has-errors has-warnings has-infos with className and classes props', () => {
    const wrapper = shallow(
      <Input name="username" className="form-control" classes={{
        hasErrors: 'error',
        hasWarnings: 'warning',
        hasInfos: 'info',
        isValid: 'valid'
      }} />,
      {context: {form: new FormWithConstraints({})}}
    );
    const input = wrapper.instance() as Input;

    const field = new Field('username');
    field.addOrReplaceValidation(validation_error);
    field.addOrReplaceValidation(validation_warning);
    field.addOrReplaceValidation(validation_info);
    input.fieldDidValidate(field);

    wrapper.update();

    expect(wrapper.html()).toEqual(
      '<input name="username" class="form-control error warning info"/>'
    );

    wrapper.unmount();
  });

  test('has-errors has-warnings has-infos with className and incomplete classes props', () => {
    const wrapper = shallow(
      <Input name="username" className="form-control" classes={{hasErrors: 'error'}} />,
      {context: {form: new FormWithConstraints({})}}
    );
    const input = wrapper.instance() as Input;

    const field = new Field('username');
    field.addOrReplaceValidation(validation_error);
    field.addOrReplaceValidation(validation_warning);
    field.addOrReplaceValidation(validation_info);
    input.fieldDidValidate(field);

    wrapper.update();

    expect(wrapper.html()).toEqual(
      '<input name="username" class="form-control error"/>'
    );

    wrapper.unmount();
  });

  test('has-errors has-warnings has-infos without className and empty classes props', () => {
    const wrapper = shallow(
      <Input name="username" classes={{}} />,
      {context: {form: new FormWithConstraints({})}}
    );
    const input = wrapper.instance() as Input;

    const field = new Field('username');
    field.addOrReplaceValidation(validation_error);
    field.addOrReplaceValidation(validation_warning);
    field.addOrReplaceValidation(validation_info);
    input.fieldDidValidate(field);

    wrapper.update();

    expect(wrapper.html()).toEqual(
      '<input name="username"/>'
    );

    wrapper.unmount();
  });

  test('has-errors has-warnings', () => {
    const wrapper = shallow(
      <Input name="username" />,
      {context: {form: new FormWithConstraints({})}}
    );
    const input = wrapper.instance() as Input;

    const field = new Field('username');
    field.addOrReplaceValidation(validation_error);
    field.addOrReplaceValidation(validation_warning);
    input.fieldDidValidate(field);

    wrapper.update();

    expect(wrapper.html()).toEqual(
      '<input name="username" class="has-errors has-warnings"/>'
    );

    wrapper.unmount();
  });

  test('has-errors', () => {
    const wrapper = shallow(
      <Input name="username" />,
      {context: {form: new FormWithConstraints({})}}
    );
    const input = wrapper.instance() as Input;

    const field = new Field('username');
    field.addOrReplaceValidation(validation_error);
    input.fieldDidValidate(field);

    wrapper.update();

    expect(wrapper.html()).toEqual(
      '<input name="username" class="has-errors"/>'
    );

    wrapper.unmount();
  });

  test('no has-*, is-valid', () => {
    const wrapper = shallow(
      <Input name="username" />,
      {context: {form: new FormWithConstraints({})}}
    );
    const input = wrapper.instance() as Input;

    const field = new Field('username');
    input.fieldDidValidate(field);

    wrapper.update();

    expect(wrapper.html()).toEqual(
      '<input name="username" class="is-valid"/>'
    );

    wrapper.unmount();
  });
});
