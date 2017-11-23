import * as React from 'react';
import { Text, View } from 'react-native';
import { TextInput } from './react-native-TextInput-fix'; // Specific to TypeScript

import {
  FormWithConstraints as _FormWithConstraints,
  FieldFeedback as _FieldFeedback,
  FieldFeedbacks as _FieldFeedbacks
} from 'react-form-with-constraints';

// Recursive React.Children.forEach()
// Taken from https://github.com/fernandopasik/react-children-utilities/blob/v0.2.2/src/index.js#L68
function deepForEach(children: React.ReactNode, fn: (child: React.ReactElement<any>) => void) {
  React.Children.forEach(children, child => {
    const element = child as React.ReactElement<any>;
    if (element.props && element.props.children && typeof element.props.children === 'object') {
      deepForEach(element.props.children, fn);
    }
    fn(element);
  });
}

// Overrides Input and remove type, validity and validationMessage properties
export interface Input {
  name: string;

  // Tested: TextInput props.value is always a string and never undefined (empty string instead)
  // Still need to make it optional
  value?: string;
}

// FIXME
// @ts-ignore
// TypeScript fix for:
// error TS2415: Class 'FormWithConstraints' incorrectly extends base class 'FormWithConstraints'.
//  Types of property 'validateFields' are incompatible.
export class FormWithConstraints extends _FormWithConstraints {
  validateFields(...inputsOrNames: Array<TextInput | string>) {
    const inputs = inputsOrNames.filter(inputOrName => typeof inputOrName !== 'string') as any as React.ReactElement<Input>[];
    const fieldNames = inputsOrNames.filter(inputOrName => typeof inputOrName === 'string') as string[];

    const otherInputs: React.ReactElement<Input>[] = [];

    if (inputsOrNames.length === 0) {
      // Find all children with a name
      deepForEach(this.props.children, (child: React.ReactElement<Input>) => {
        const fieldName = child.props.name;
        if (fieldName !== undefined && fieldName.length > 0) {
          otherInputs.push(child);
        }
      });
    }
    if (fieldNames.length > 0) {
      deepForEach(this.props.children, (child: React.ReactElement<Input>) => {
        const fieldName = child.props.name;
        const matches = fieldNames.filter(_fieldName => _fieldName === fieldName);

        console.assert(matches.length === 0 || matches.length === 1, `Multiple matches for ${fieldName}`);

        if (matches.length === 1) {
          otherInputs.push(child);
        }
      });
    }

    [
      ...inputs,
      ...otherInputs
    ].forEach(input => this.emitValidateEvent({
      name: input.props.name,
      type: undefined as any,
      value: input.props.value!, // Tested: TextInput props.value is always a string and never undefined (empty string instead)
      validity: undefined as any,
      validationMessage: undefined as any
    }));
  }

  render() {
    const { children } = this.props;
    return <View>{children}</View>;
  }
}

export class FieldFeedbacks extends _FieldFeedbacks {
  render() {
    const { children } = this.props;
    return <View>{children}</View>;
  }
}


export class FieldFeedback extends _FieldFeedback {
  render() {
    const { children } = this.props;
                      // React Native implementation needs to access props thus the cast
    const { style } = (this.context.form as FormWithConstraints).props;

    const className = this.className();

    let feedback = null;
    if (className !== undefined) { // Means the FieldFeedback should be displayed
      const tmp = style !== undefined ? style[className] : undefined;
      feedback = children !== undefined ? <Text style={tmp}>{children}</Text> : null;
    }

    return feedback;
  }
}
