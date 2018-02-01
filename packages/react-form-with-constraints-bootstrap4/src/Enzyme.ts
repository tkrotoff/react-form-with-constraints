import React from 'react';
import { ShallowWrapper } from 'enzyme';

import { getFieldFeedbacksMessages as _getFieldFeedbacksMessages } from 'react-form-with-constraints/lib/Enzyme';

import { FieldFeedbacks } from './index';

export function getFieldFeedbacksMessages(inputs: ShallowWrapper<React.InputHTMLAttributes<HTMLInputElement>, {}>) {
  return _getFieldFeedbacksMessages(inputs, FieldFeedbacks);
}
