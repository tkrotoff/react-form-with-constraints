import * as React from 'react';
import { shallow } from 'enzyme';

import { FieldFeedback } from 'react-form-with-constraints';

import * as Bootstrap4 from './index';
import { getFieldFeedbacksMessages } from './Enzyme';

test('getFieldFeedbacksMessages() with Bootstrap4', () => {
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
  expect(getFieldFeedbacksMessages(inputs)).toEqual(['Please fill out this field.']);
});
