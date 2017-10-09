import * as React from 'react';
import { ShallowWrapper } from 'enzyme';

import { FieldFeedback, FieldFeedbackProps, FieldFeedbacks } from './index';
import * as Bootstrap4 from './Bootstrap4';

// Return the list of FieldFeedback associated with an input name
// Algorithm: find the FieldFeedbacks that matches the input name (for prop) and then return its children
function findFieldFeedbackList(wrapper: ShallowWrapper<{}, {}>, inputName: string) {
  const fieldFeedbacksList = wrapper.findWhere(node => {
    let found = false;
    if (node.type() === FieldFeedbacks || node.type() === Bootstrap4.FieldFeedbacks) {
      if (node.prop('for') === inputName) {
        found = true;
      }
    }
    return found;
  });

  // No use of expect() otherwise it mess up with expect.assertions(N)
  console.assert(fieldFeedbacksList.length >= 1, 'At least 1 FieldFeedbacks should match');

  const fieldFeedbackList = fieldFeedbacksList.findWhere(node => {
    let found = false;
    if (node.type() === FieldFeedback) {
      found = true;
    }
    return found;
  });

  // No use of expect() otherwise it mess up with expect.assertions(N)
  console.assert(fieldFeedbacksList.length >= 1, 'At least 1 FieldFeedback');

  return fieldFeedbackList as ShallowWrapper<FieldFeedbackProps, {}>;
}

export function getFieldFeedbacksMessages(inputs: ShallowWrapper<React.InputHTMLAttributes<HTMLInputElement>, {}>) {
  const messages: string[] = [];

  inputs.forEach(input => {
    const { name, value } = input.props();

    // FIXME parent() not listing children with Enzyme 3, see https://github.com/airbnb/enzyme/issues/1235#issuecomment-335053965
    const fieldFeedbackList = findFieldFeedbackList(input.parents(), name!);
    fieldFeedbackList.forEach(fieldFeedback => {
      const { when, children } = fieldFeedback.props();

      if (typeof when === 'function') {
        const constraintViolation = when(value as string);
        if (constraintViolation) {
          messages.push(children as string);
        }
      }

      else if (typeof when === 'string') {
        const validationMessage = simulateHTML5InputValidation(input.props(), when);
        if (validationMessage !== undefined) {
          if (children === undefined) {
            messages.push(validationMessage);
          } else {
            messages.push(children as string);
          }
        }
      }

      else {
        throw new TypeError(`Invalid FieldFeedback 'when' type: ${typeof when}`);
      }
    });
  });

  return messages;
}

// See HTML5 Form Shim https://github.com/dsheiko/HTML5-Form-Shim
// See https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills#web-forms
// See https://github.com/MrSwitch/jquery.form.js/blob/48e576db6c0114fe997ac549d074f87be06f54f3/src/jquery.checkValidity.js
function simulateHTML5InputValidation(input: React.InputHTMLAttributes<HTMLInputElement>, when: string) {
  // input.validationMessage
  // See https://developer.mozilla.org/en/docs/Web/API/HTMLInputElement
  // See https://www.w3.org/TR/html51/sec-forms.html#the-constraint-validation-api
  let validationMessage: string | undefined;

  switch (when) {
    case '*':
      // Order is important
      validationMessage = valueMissing(input);
      if (validationMessage === undefined) validationMessage = typeMismatch(input);
      if (validationMessage === undefined) validationMessage = tooShort(input);
      if (validationMessage === undefined) validationMessage = tooLong(input);
      if (validationMessage === undefined) validationMessage = stepMismatch(input);
      if (validationMessage === undefined) validationMessage = rangeUnderflow(input);
      if (validationMessage === undefined) validationMessage = rangeOverflow(input);
      if (validationMessage === undefined) validationMessage = patternMismatch(input);
      if (validationMessage === undefined) validationMessage = badInput(input);
      break;
    case 'badInput':
      validationMessage = badInput(input);
      break;
    case 'patternMismatch':
      validationMessage = patternMismatch(input);
      break;
    case 'rangeOverflow':
      validationMessage = rangeOverflow(input);
      break;
    case 'rangeUnderflow':
      validationMessage = rangeUnderflow(input);
      break;
    case 'stepMismatch':
      validationMessage = stepMismatch(input);
      break;
    case 'tooLong':
      validationMessage = tooLong(input);
      break;
    case 'tooShort':
      validationMessage = tooShort(input);
      break;
    case 'typeMismatch':
      validationMessage = typeMismatch(input);
      break;
    case 'valueMissing':
      validationMessage = valueMissing(input);
      break;
    default:
      throw new Error(`Invalid FieldFeedback 'when' value: ${when}`);
  }

  return validationMessage;
}

function badInput(input: React.InputHTMLAttributes<HTMLInputElement>) {
  let validationMessage: string | undefined;
  if (input.type === 'number' && isNaN(input.value as any)) {
    validationMessage = 'Please enter a number.';
  }
  return validationMessage;
}

function patternMismatch(input: React.InputHTMLAttributes<HTMLInputElement>) {
  const value = input.value as string;
  let validationMessage: string | undefined;
  if (input.pattern !== undefined && !new RegExp('^' + input.pattern + '$').test(value)) {
    validationMessage = 'Please match the requested format.';
  }
  return validationMessage;
}

function rangeOverflow(input: React.InputHTMLAttributes<HTMLInputElement>) {
  const value = input.value as number;
  const max = input.max;
  let validationMessage: string | undefined;
  if (max !== undefined && value > max) {
    validationMessage = `Value must be less than or equal to ${max}.`;
  }
  return validationMessage;
}

function rangeUnderflow(input: React.InputHTMLAttributes<HTMLInputElement>) {
  const value = input.value as number;
  const min = input.min;
  let validationMessage: string | undefined;
  if (min !== undefined && value < min) {
    validationMessage = `Value must be greater than or equal to ${min}.`;
  }
  return validationMessage;
}

function stepMismatch(input: React.InputHTMLAttributes<HTMLInputElement>) {
  const value = input.value as number;
  const step = input.step as number;
  let validationMessage: string | undefined;
  if (step !== undefined && value % step) {
    validationMessage = 'Please enter a valid value.';
  }
  return validationMessage;
}

function tooLong(input: React.InputHTMLAttributes<HTMLInputElement>) {
  const value = input.value as string;
  const maxLength = input.maxLength;
  let validationMessage: string | undefined;
  if (maxLength !== undefined && value.length > maxLength) {
    validationMessage = `Please lengthen this text to ${maxLength} characters or less.`;
  }
  return validationMessage;
}

function tooShort(input: React.InputHTMLAttributes<HTMLInputElement>) {
  const value = input.value as string;
  const minLength = input.minLength;
  let validationMessage: string | undefined;
  if (minLength !== undefined && value.length < minLength) {
    validationMessage = `Please lengthen this text to ${minLength} characters or more.`;
  }
  return validationMessage;
}

function typeMismatch(input: React.InputHTMLAttributes<HTMLInputElement>) {
  const value = input.value as string;
  let validationMessage: string | undefined;
  if (input.type === 'email' && !/\S+@\S+/.test(value)) {
    validationMessage = 'Please enter an email address.';
  }
  else if (input.type === 'url' && !/^https?\:\/\/[a-z0-9]+/i.test(value)) {
    validationMessage = 'Please enter a URL.';
  }
  return validationMessage;
}

function valueMissing(input: React.InputHTMLAttributes<HTMLInputElement>) {
  const value = input.value as string;
  let validationMessage: string | undefined;
  if (input.required === true && value.length === 0) {
    validationMessage = 'Please fill out this field.';
  }
  return validationMessage;
}
