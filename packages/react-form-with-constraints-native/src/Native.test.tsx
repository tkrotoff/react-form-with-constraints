import * as React from 'react';
import { shallow } from 'enzyme';
import { StyleSheet, /*TextInput,*/ View } from 'react-native';
import { TextInput } from './react-native-TextInput-fix'; // Specific to TypeScript
import * as renderer from 'react-test-renderer';

import { fieldWithoutFeedback } from 'react-form-with-constraints';

import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from './index';
import FormWithConstraintsMock from '../../react-form-with-constraints/src/FormWithConstraintsMock';
import FieldFeedbacksMock from '../../react-form-with-constraints/src/FieldFeedbacksMock';

// Taken and adapted from FormWithConstraints.test.tsx
describe('FormWithConstraints', () => {
  describe('validateFields()', () => {
    class Form extends React.Component {
      formWithConstraints: FormWithConstraints;
      username: TextInput;
      password: TextInput;

      render() {
        return (
          <FormWithConstraints ref={formWithConstraints => this.formWithConstraints = formWithConstraints!}>
            <View>
              <TextInput
                name="username"
                keyboardType="email-address"
                ref={username => this.username = username as any}
              />
              <TextInput
                name="password"
                secureTextEntry
                ref={password => this.password = password as any}
              />
            </View>
          </FormWithConstraints>
        );
      }
    }

    test('inputs', () => {
      const form = renderer.create(<Form />).getInstance() as any as Form;
      const emitValidateEventSpy = jest.spyOn(form.formWithConstraints, 'emitValidateEvent');
      form.formWithConstraints.validateFields(form.username, form.password);
      expect(emitValidateEventSpy).toHaveBeenCalledTimes(2);
      expect(emitValidateEventSpy.mock.calls).toEqual([
        [{name: 'username', type: undefined, value: undefined, validity: undefined, validationMessage: undefined}],
        [{name: 'password', type: undefined, value: undefined, validity: undefined, validationMessage: undefined}]
      ]);
    });

    test('field names', () => {
      const form = renderer.create(<Form />).getInstance() as any as Form;
      const emitValidateEventSpy = jest.spyOn(form.formWithConstraints, 'emitValidateEvent');
      form.formWithConstraints.validateFields('username', 'password');
      expect(emitValidateEventSpy).toHaveBeenCalledTimes(2);
      expect(emitValidateEventSpy.mock.calls).toEqual([
        [{name: 'username', type: undefined, value: undefined, validity: undefined, validationMessage: undefined}],
        [{name: 'password', type: undefined, value: undefined, validity: undefined, validationMessage: undefined}]
      ]);
    });

    test('inputs + field names', () => {
      const form = renderer.create(<Form />).getInstance() as any as Form;
      const emitValidateEventSpy = jest.spyOn(form.formWithConstraints, 'emitValidateEvent');
      form.formWithConstraints.validateFields(form.username, 'password');
      expect(emitValidateEventSpy).toHaveBeenCalledTimes(2);
      expect(emitValidateEventSpy.mock.calls).toEqual([
        [{name: 'username', type: undefined, value: undefined, validity: undefined, validationMessage: undefined}],
        [{name: 'password', type: undefined, value: undefined, validity: undefined, validationMessage: undefined}]
      ]);
    });

    test('without arguments', () => {
      const form = renderer.create(<Form />).getInstance() as any as Form;
      const emitValidateEventSpy = jest.spyOn(form.formWithConstraints, 'emitValidateEvent');
      form.formWithConstraints.validateFields();
      expect(emitValidateEventSpy).toHaveBeenCalledTimes(2);
      expect(emitValidateEventSpy.mock.calls).toEqual([
        [{name: 'username', type: undefined, value: undefined, validity: undefined, validationMessage: undefined}],
        [{name: 'password', type: undefined, value: undefined, validity: undefined, validationMessage: undefined}]
      ]);
    });
  });

  describe('render()', () => {
    test('children', () => {
      const component = renderer.create(
        <FormWithConstraints>
          <TextInput name="username" keyboardType="email-address" />
          <FieldFeedbacks for="username">
            <FieldFeedback when={value => value.length === 0}>Cannot be empty</FieldFeedback>
            <FieldFeedback when={value => !/\S+@\S+/.test(value)}>Invalid email address</FieldFeedback>
          </FieldFeedbacks>

          <TextInput name="password" secureTextEntry />
          <FieldFeedbacks for="password">
            <FieldFeedback when={value => value.length === 0}>Cannot be empty</FieldFeedback>
            <FieldFeedback when={value => value.length > 0 && value.length < 5}>Should be at least 5 characters long</FieldFeedback>
          </FieldFeedbacks>
        </FormWithConstraints>
      );

      expect(component.toJSON()).toEqual(
        {
          type: 'View',
          props: {},
          children: [
            { type: 'TextInput', props: { name: 'username', keyboardType: 'email-address', allowFontScaling: true }, children: null },
            { type: 'View', props: {}, children: null },
            { type: 'TextInput', props: { name: 'password', secureTextEntry: true, allowFontScaling: true }, children: null },
            { type: 'View', props: {}, children: null }
          ]
        }
      );

      const formWithConstraints = component.getInstance() as any as FormWithConstraints;
      expect(formWithConstraints.fieldsStore.fields).toEqual({
        username: fieldWithoutFeedback,
        password: fieldWithoutFeedback
      });
    });


    test('children with <View> inside hierarchy', () => {
      const component = renderer.create(
        <FormWithConstraints>
          <TextInput name="username" keyboardType="email-address" />
          <View>
            <FieldFeedbacks for="username">
              <View>
                <FieldFeedback when="*" />
              </View>
            </FieldFeedbacks>
          </View>

          <TextInput name="password" secureTextEntry />
          <View>
            <FieldFeedbacks for="password">
              <View>
                <FieldFeedback when="*" />
              </View>
            </FieldFeedbacks>
          </View>
        </FormWithConstraints>
      );

      const formWithConstraints = component.getInstance() as any as FormWithConstraints;
      expect(formWithConstraints.fieldsStore.fields).toEqual({
        username: fieldWithoutFeedback,
        password: fieldWithoutFeedback
      });
    });

    test('children with <View> inside hierarchy + multiple FieldFeedbacks', () => {
      const component = renderer.create(
        <FormWithConstraints>
          <TextInput name="username" keyboardType="email-address" />
          <View>
            <FieldFeedbacks for="username">
              <View>
                <FieldFeedback when="*" />
              </View>
            </FieldFeedbacks>
          </View>
          <View>
            <FieldFeedbacks for="username">
              <View>
                <FieldFeedback when="*" />
              </View>
            </FieldFeedbacks>
          </View>

          <TextInput name="password" secureTextEntry />
          <View>
            <FieldFeedbacks for="password">
              <View>
                <FieldFeedback when="*" />
              </View>
            </FieldFeedbacks>
          </View>
          <View>
            <FieldFeedbacks for="password">
              <View>
                <FieldFeedback when="*" />
              </View>
            </FieldFeedbacks>
          </View>
        </FormWithConstraints>
      );

      const formWithConstraints = component.getInstance() as any as FormWithConstraints;
      expect(formWithConstraints.fieldsStore.fields).toEqual({
        username: fieldWithoutFeedback,
        password: fieldWithoutFeedback
      });
    });
  });
});

describe('FieldFeedbacks', () => {
  test('render()', () => {
    const form = new FormWithConstraintsMock();
    const component = shallow(
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
      </FieldFeedbacks>,
      {context: {form}}
    );
    expect(component.debug()).toEqual(
`<View>
  <FieldFeedback when="*" />
</View>`
    );
  });
});

// Taken and adapted from FieldFeedback.test.tsx
describe('FieldFeedback', () => {
  const fieldFeedbacksKey1 = 1;
  const fieldFeedbackKey11 = 1.1;

  describe('render()', () => {
    test('should not render', () => {
      const form = new FormWithConstraintsMock({
        username: {
          dirty: true,
          errors: new Set(),
          warnings: new Set(),
          infos: new Set(),
          validationMessage: ''
        }
      });
      const fieldFeedbacks = new FieldFeedbacksMock({for: 'username', show: 'all'}, fieldFeedbacksKey1, fieldFeedbackKey11);

      const fieldFeedback = shallow(
        <FieldFeedback when="*">message</FieldFeedback>,
        {context: {form, fieldFeedbacks}}
      );

      expect(fieldFeedback.debug()).toEqual('');
    });

    test('with children', () => {
      const form = new FormWithConstraintsMock({
        username: {
          dirty: true,
          errors: new Set([fieldFeedbackKey11]),
          warnings: new Set(),
          infos: new Set(),
          validationMessage: ''
        }
      });
      const fieldFeedbacks = new FieldFeedbacksMock({for: 'username', show: 'all'}, fieldFeedbacksKey1, fieldFeedbackKey11);

      const fieldFeedback = shallow(
        <FieldFeedback when="*">message</FieldFeedback>,
        {context: {form, fieldFeedbacks}}
      );

      expect(fieldFeedback.debug()).toEqual(
`<Text style={[undefined]} accessible={true} allowFontScaling={true} ellipsizeMode="tail">
  message
</Text>`
      );
    });

    test('without children', () => {
      const form = new FormWithConstraintsMock({
        username: {
          dirty: true,
          errors: new Set([fieldFeedbackKey11]),
          warnings: new Set(),
          infos: new Set(),
          validationMessage: ''
        }
      });
      const fieldFeedbacks = new FieldFeedbacksMock({for: 'username', show: 'all'}, fieldFeedbacksKey1, fieldFeedbackKey11);

      const fieldFeedback = shallow(
        <FieldFeedback when="*" />,
        {context: {form, fieldFeedbacks}}
      );

      expect(fieldFeedback.debug()).toEqual('');
    });

    test('with style', () => {
      const feedbacksStyles = StyleSheet.create({
        error: { color: 'red' },
        warning: { color: 'orange' },
        info: { color: 'blue' }
      });

      const form = new FormWithConstraintsMock({
        username: {
          dirty: true,
          errors: new Set([fieldFeedbackKey11]),
          warnings: new Set(),
          infos: new Set(),
          validationMessage: ''
        }
      });
      form.props.style = feedbacksStyles;
      const fieldFeedbacks = new FieldFeedbacksMock({for: 'username', show: 'all'}, fieldFeedbacksKey1, fieldFeedbackKey11);

      const fieldFeedback = shallow(
        <FieldFeedback when="*">message</FieldFeedback>,
        {context: {form, fieldFeedbacks}}
      );

      expect(fieldFeedback.debug()).toEqual(
`<Text style={{...}} accessible={true} allowFontScaling={true} ellipsizeMode="tail">
  message
</Text>`
      );
      expect(fieldFeedback.props().style).toEqual({color: 'red'});
    });
  });
});
