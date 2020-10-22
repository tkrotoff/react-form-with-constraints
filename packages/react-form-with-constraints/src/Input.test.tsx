import * as React from 'react';
import { shallow as _shallow } from 'enzyme';

import {
  Field,
  FieldFeedbackType,
  FieldFeedbackValidation,
  FormWithConstraints,
  Input,
  InputContext,
  InputProps
} from './index';

function shallow(node: React.ReactElement<InputProps>, options: { context: InputContext }) {
  return _shallow<InputProps>(node, options);
}

test('fieldWillValidate() fieldDidValidate()', () => {
  const wrapper = shallow(<Input name="username" />, {
    context: { form: new FormWithConstraints({}) }
  });
  const input = wrapper.instance() as Input;

  expect(wrapper.state()).toEqual({ field: undefined });

  const field = new Field('username');
  input.fieldDidValidate(field);
  expect(wrapper.state()).toEqual({ field });
  input.fieldWillValidate('unknown');
  expect(wrapper.state()).toEqual({ field });
  input.fieldWillValidate('username');
  expect(wrapper.state()).toEqual({ field: 'pending' });

  const unknownField = new Field('unknown');
  input.fieldDidValidate(field);
  expect(wrapper.state()).toEqual({ field });
  input.fieldDidValidate(unknownField);
  expect(wrapper.state()).toEqual({ field });

  wrapper.unmount();
});

test('fieldDidReset()', () => {
  const wrapper = shallow(<Input name="username" />, {
    context: { form: new FormWithConstraints({}) }
  });
  const input = wrapper.instance() as Input;

  expect(wrapper.state()).toEqual({ field: undefined });

  const field = new Field('username');
  input.fieldDidValidate(field);
  expect(wrapper.state()).toEqual({ field });

  const unknownField = new Field('unknown');
  input.fieldDidReset(unknownField);
  expect(wrapper.state()).toEqual({ field });

  input.fieldDidReset(field);
  expect(wrapper.state()).toEqual({ field: undefined });

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

  test('is-pending has-errors has-warnings has-infos', () => {
    const wrapper = shallow(<Input name="username" />, {
      context: { form: new FormWithConstraints({}) }
    });
    const input = wrapper.instance() as Input;

    const field = new Field('username');
    field.addOrReplaceValidation(validation_error);
    field.addOrReplaceValidation(validation_warning);
    field.addOrReplaceValidation(validation_info);

    input.fieldWillValidate('username');
    wrapper.update();
    expect(wrapper.html()).toEqual('<input name="username" class="is-pending"/>');

    input.fieldDidValidate(field);
    wrapper.update();
    expect(wrapper.html()).toEqual(
      '<input name="username" class="has-errors has-warnings has-infos"/>'
    );

    wrapper.unmount();
  });

  test('is-pending has-errors has-warnings has-infos with className props', () => {
    const wrapper = shallow(<Input name="username" className="form-control" />, {
      context: { form: new FormWithConstraints({}) }
    });
    const input = wrapper.instance() as Input;

    const field = new Field('username');
    field.addOrReplaceValidation(validation_error);
    field.addOrReplaceValidation(validation_warning);
    field.addOrReplaceValidation(validation_info);

    input.fieldWillValidate('username');
    wrapper.update();
    expect(wrapper.html()).toEqual('<input name="username" class="form-control is-pending"/>');

    input.fieldDidValidate(field);
    wrapper.update();
    expect(wrapper.html()).toEqual(
      '<input name="username" class="form-control has-errors has-warnings has-infos"/>'
    );

    wrapper.unmount();
  });

  test('is-pending has-errors has-warnings has-infos with className and classes props', () => {
    const wrapper = shallow(
      <Input
        name="username"
        className="form-control"
        classes={{
          isPending: 'pending',
          hasErrors: 'error',
          hasWarnings: 'warning',
          hasInfos: 'info',
          isValid: 'valid'
        }}
      />,
      { context: { form: new FormWithConstraints({}) } }
    );
    const input = wrapper.instance() as Input;

    const field = new Field('username');
    field.addOrReplaceValidation(validation_error);
    field.addOrReplaceValidation(validation_warning);
    field.addOrReplaceValidation(validation_info);

    input.fieldWillValidate('username');
    wrapper.update();
    expect(wrapper.html()).toEqual('<input name="username" class="form-control pending"/>');

    input.fieldDidValidate(field);
    wrapper.update();
    expect(wrapper.html()).toEqual(
      '<input name="username" class="form-control error warning info"/>'
    );

    wrapper.unmount();
  });

  test('is-pending has-errors has-warnings has-infos with className and incomplete classes props', () => {
    const wrapper = shallow(
      <Input name="username" className="form-control" classes={{ hasErrors: 'error' }} />,
      { context: { form: new FormWithConstraints({}) } }
    );
    const input = wrapper.instance() as Input;

    const field = new Field('username');
    field.addOrReplaceValidation(validation_error);
    field.addOrReplaceValidation(validation_warning);
    field.addOrReplaceValidation(validation_info);

    input.fieldWillValidate('username');
    wrapper.update();
    expect(wrapper.html()).toEqual('<input name="username" class="form-control"/>');

    input.fieldDidValidate(field);
    wrapper.update();
    expect(wrapper.html()).toEqual('<input name="username" class="form-control error"/>');

    wrapper.unmount();
  });

  test('is-pending has-errors has-warnings has-infos without className and empty classes props', () => {
    const wrapper = shallow(<Input name="username" classes={{}} />, {
      context: { form: new FormWithConstraints({}) }
    });
    const input = wrapper.instance() as Input;

    const field = new Field('username');
    field.addOrReplaceValidation(validation_error);
    field.addOrReplaceValidation(validation_warning);
    field.addOrReplaceValidation(validation_info);

    input.fieldWillValidate('username');
    wrapper.update();
    expect(wrapper.html()).toEqual('<input name="username"/>');

    input.fieldDidValidate(field);
    wrapper.update();
    expect(wrapper.html()).toEqual('<input name="username"/>');

    wrapper.unmount();
  });

  test('is-pending has-errors has-warnings', () => {
    const wrapper = shallow(<Input name="username" />, {
      context: { form: new FormWithConstraints({}) }
    });
    const input = wrapper.instance() as Input;

    const field = new Field('username');
    field.addOrReplaceValidation(validation_error);
    field.addOrReplaceValidation(validation_warning);

    input.fieldWillValidate('username');
    wrapper.update();
    expect(wrapper.html()).toEqual('<input name="username" class="is-pending"/>');

    input.fieldDidValidate(field);
    wrapper.update();
    expect(wrapper.html()).toEqual('<input name="username" class="has-errors has-warnings"/>');

    wrapper.unmount();
  });

  test('is-pending has-errors', () => {
    const wrapper = shallow(<Input name="username" />, {
      context: { form: new FormWithConstraints({}) }
    });
    const input = wrapper.instance() as Input;

    const field = new Field('username');
    field.addOrReplaceValidation(validation_error);

    input.fieldWillValidate('username');
    wrapper.update();
    expect(wrapper.html()).toEqual('<input name="username" class="is-pending"/>');

    input.fieldDidValidate(field);
    wrapper.update();
    expect(wrapper.html()).toEqual('<input name="username" class="has-errors"/>');

    wrapper.unmount();
  });

  test('is-pending no has-*, is-valid', () => {
    const wrapper = shallow(<Input name="username" />, {
      context: { form: new FormWithConstraints({}) }
    });
    const input = wrapper.instance() as Input;

    input.fieldWillValidate('username');
    wrapper.update();
    expect(wrapper.html()).toEqual('<input name="username" class="is-pending"/>');

    const field = new Field('username');
    input.fieldDidValidate(field);
    wrapper.update();
    expect(wrapper.html()).toEqual('<input name="username" class="is-valid"/>');

    wrapper.unmount();
  });
});
