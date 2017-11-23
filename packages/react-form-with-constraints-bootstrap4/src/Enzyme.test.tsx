import * as React from 'react';
import { shallow } from 'enzyme';

import { FieldFeedback, FieldFeedbacks } from 'react-form-with-constraints';

// Cannot be '../../react-form-with-constraints/src/Enzyme' otherwise getFieldFeedbacksMessages() will fail
import { getFieldFeedbacksMessages } from 'react-form-with-constraints/lib/Enzyme';

import * as Bootstrap4 from './index';

test('with Bootstrap4', () => {
  const component = shallow(
    <div>
      <Bootstrap4.FormGroup for="username">
        <Bootstrap4.FormControlInput name="username" value="" required />
        <Bootstrap4.FieldFeedbacks for="username">
          <FieldFeedback when="*" />
        </Bootstrap4.FieldFeedbacks>
      </Bootstrap4.FormGroup>
    </div>
  );

  const inputs = component.find(Bootstrap4.FormControlInput);
  expect(inputs).toHaveLength(1);
  expect(inputs.props().value).toEqual('');
  expect(getFieldFeedbacksMessages(inputs, Bootstrap4.FieldFeedbacks)).toEqual(['Please fill out this field.']);
});

test.only('with matching FieldFeedbacks', () => {
  const component = shallow(
    <div>
      <input name="username" value="" required />
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
      </FieldFeedbacks>
    </div>
  );

  const inputs = component.find('input');
  expect(inputs).toHaveLength(1);
  expect(inputs.props().value).toEqual('');
  expect(getFieldFeedbacksMessages(inputs)).toEqual(['Please fill out this field.']);
});
