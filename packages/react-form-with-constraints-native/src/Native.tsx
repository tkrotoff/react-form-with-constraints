import React from 'react';
import { Text, TextProperties as TextProps, View } from 'react-native';
import { TextInput } from './react-native-TextInput-fix'; // Specific to TypeScript

import {
  FormWithConstraints as _FormWithConstraints,
  FieldFeedback as _FieldFeedback,
  FieldFeedbacks as _FieldFeedbacks,
  FieldFeedbacksValidation
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

export class FormWithConstraints extends _FormWithConstraints {
  // @ts-ignore
  // TS2416: Property 'validateFields' in type 'FormWithConstraints' is not assignable to the same property in base type 'FormWithConstraints'
  validateFields(...inputsOrNames: Array<TextInput | string>) {
    return this._validateFields(true /* validateDirtyFields */, ...inputsOrNames);
  }

  private _validateFields(validateDirtyFields: boolean, ...inputsOrNames: Array<TextInput | string>) {
    const fieldFeedbacksValidationPromises = new Array<Promise<FieldFeedbacksValidation>>();

    const inputs = this.normalizeInputs(...inputsOrNames);

    inputs.forEach(input => {
      const fieldName = input.props.name;

      const _input = {
        name: fieldName,
        type: undefined as any,
        value: input.props.value!, // Tested: TextInput props.value is always a string and never undefined (empty string instead)
        validity: undefined as any,
        validationMessage: undefined as any
      };

      const field = this.fieldsStore.fields[fieldName];
      if (validateDirtyFields || (field !== undefined && field.dirty === false)) {
        const fieldFeedbackValidationsPromise = this.emitValidateEvent(_input)
          .filter(fieldFeedbackValidations => fieldFeedbackValidations !== undefined) // Remove undefined results
          .map(fieldFeedbackValidations => Promise.resolve(fieldFeedbackValidations!)); // Transforms all results into Promises

        const _fieldFeedbacksValidationPromises = Promise.all(fieldFeedbackValidationsPromise)
          .then(validations =>
            // See Merge/flatten an array of arrays in JavaScript? https://stackoverflow.com/q/10865025/990356
            validations.reduce((prev, curr) => prev.concat(curr), [])
          )
          .then(fieldFeedbackValidations =>
            ({
              fieldName,
              isValid: () => fieldFeedbackValidations.every(fieldFeedbackValidation => fieldFeedbackValidation.isValid!),
              fieldFeedbackValidations
            })
          );

        fieldFeedbacksValidationPromises.push(_fieldFeedbacksValidationPromises);
      }
    });

    return Promise.all(fieldFeedbacksValidationPromises);
  }

  private normalizeInputs(...inputsOrNames: Array<TextInput | string>) {
    const inputs = inputsOrNames.filter(inputOrName => typeof inputOrName !== 'string') as any as React.ReactElement<Input>[];
    const fieldNames = inputsOrNames.filter(inputOrName => typeof inputOrName === 'string') as string[];

    const otherInputs: React.ReactElement<Input>[] = [];

    if (inputsOrNames.length === 0) {
      // Find all children with a name
      deepForEach(this.props.children, (child: React.ReactElement<Input>) => {
        if (child.props !== undefined) {
          const fieldName = child.props.name;
          if (fieldName !== undefined && fieldName.length > 0) {
            otherInputs.push(child);
          }
        }
      });
    }
    if (fieldNames.length > 0) {
      deepForEach(this.props.children, (child: React.ReactElement<Input>) => {
        if (child.props !== undefined) {
          const fieldName = child.props.name;
          const matches = fieldNames.filter(_fieldName => _fieldName === fieldName);

          console.assert(matches.length === 0 || matches.length === 1, `Multiple matches for ${fieldName}`);

          if (matches.length === 1) {
            otherInputs.push(child);
          }
        }
      });
    }

    return [
      ...inputs,
      ...otherInputs
    ];
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
    const { when, error, warning, info, className: _, children, ...textProps } = this.props;
                      // React Native implementation needs to access props thus the cast
    const { style } = (this.context.form as any as FormWithConstraints).props;

    const className = this.className();

    let feedback = null;
    if (className !== undefined) { // Means the FieldFeedback should be displayed
      const tmp = style !== undefined ? style[className] : undefined;

      // The last style property is the one applied
      feedback = children !== undefined ? <Text style={tmp} {...textProps as TextProps}>{children}</Text> : null;
    }

    return feedback;
  }
}
