import React from 'react';
import { shallow } from 'enzyme';
import { StyleSheet, /*TextInput,*/ View } from 'react-native';
import { TextInput } from './react-native-TextInput-fix'; // Specific to TypeScript
import renderer from 'react-test-renderer';

import { fieldWithoutFeedback, FieldFeedbacksProps } from 'react-form-with-constraints';

import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from './index';

function createFieldFeedbacks(props: FieldFeedbacksProps, form: FormWithConstraints, key: number, fieldFeedbackKey: number) {
  const fieldFeedbacks = new FieldFeedbacks(props, {form} as any);
  fieldFeedbacks.key = key;
  fieldFeedbacks.fieldFeedbackKey = fieldFeedbackKey;
  return fieldFeedbacks;
}

// Taken and adapted from FormWithConstraints.test.tsx
describe('FormWithConstraints', () => {
  describe('validate', () => {
    class Form extends React.Component {
      formWithConstraints: FormWithConstraints | null | undefined;
      username: TextInput | null | undefined;
      password: TextInput | null | undefined;

      render() {
        return (
          <FormWithConstraints ref={formWithConstraints => this.formWithConstraints = formWithConstraints}>
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

    describe('validateFields()', () => {
      test('inputs', async () => {
        const form = renderer.create(<Form />).getInstance() as any as Form;
        const emitValidateEventSpy = jest.spyOn(form.formWithConstraints!, 'emitValidateEvent');
        const fieldFeedbackValidations = await form.formWithConstraints!.validateFields(form.username!, form.password!);
        expect(fieldFeedbackValidations).toEqual([
          {
            fieldName: 'username',
            isValid: expect.any(Function),
            fieldFeedbackValidations: []
          },
          {
            fieldName: 'password',
            isValid: expect.any(Function),
            fieldFeedbackValidations: []
          }
        ]);
        expect(emitValidateEventSpy).toHaveBeenCalledTimes(2);
        expect(emitValidateEventSpy.mock.calls).toEqual([
          [{name: 'username', type: undefined, value: undefined, validity: undefined, validationMessage: undefined}],
          [{name: 'password', type: undefined, value: undefined, validity: undefined, validationMessage: undefined}]
        ]);
      });

      test('field names', async () => {
        const form = renderer.create(<Form />).getInstance() as any as Form;
        const emitValidateEventSpy = jest.spyOn(form.formWithConstraints!, 'emitValidateEvent');
        const fieldFeedbackValidations = await form.formWithConstraints!.validateFields('username', 'password');
        expect(fieldFeedbackValidations).toEqual([
          {
            fieldName: 'username',
            isValid: expect.any(Function),
            fieldFeedbackValidations: []
          },
          {
            fieldName: 'password',
            isValid: expect.any(Function),
            fieldFeedbackValidations: []
          }
        ]);
        expect(emitValidateEventSpy).toHaveBeenCalledTimes(2);
        expect(emitValidateEventSpy.mock.calls).toEqual([
          [{name: 'username', type: undefined, value: undefined, validity: undefined, validationMessage: undefined}],
          [{name: 'password', type: undefined, value: undefined, validity: undefined, validationMessage: undefined}]
        ]);
      });

      test('inputs + field names', async () => {
        const form = renderer.create(<Form />).getInstance() as any as Form;
        const emitValidateEventSpy = jest.spyOn(form.formWithConstraints!, 'emitValidateEvent');
        const fieldFeedbackValidations = await form.formWithConstraints!.validateFields(form.username!, 'password');
        expect(fieldFeedbackValidations).toEqual([
          {
            fieldName: 'username',
            isValid: expect.any(Function),
            fieldFeedbackValidations: []
          },
          {
            fieldName: 'password',
            isValid: expect.any(Function),
            fieldFeedbackValidations: []
          }
        ]);
        expect(emitValidateEventSpy).toHaveBeenCalledTimes(2);
        expect(emitValidateEventSpy.mock.calls).toEqual([
          [{name: 'username', type: undefined, value: undefined, validity: undefined, validationMessage: undefined}],
          [{name: 'password', type: undefined, value: undefined, validity: undefined, validationMessage: undefined}]
        ]);
      });

      test('without arguments', async () => {
        const form = renderer.create(<Form />).getInstance() as any as Form;
        const emitValidateEventSpy = jest.spyOn(form.formWithConstraints!, 'emitValidateEvent');
        const fieldFeedbackValidations = await form.formWithConstraints!.validateFields();
        expect(fieldFeedbackValidations).toEqual([
          {
            fieldName: 'username',
            isValid: expect.any(Function),
            fieldFeedbackValidations: []
          },
          {
            fieldName: 'password',
            isValid: expect.any(Function),
            fieldFeedbackValidations: []
          }
        ]);
        expect(emitValidateEventSpy).toHaveBeenCalledTimes(2);
        expect(emitValidateEventSpy.mock.calls).toEqual([
          [{name: 'username', type: undefined, value: undefined, validity: undefined, validationMessage: undefined}],
          [{name: 'password', type: undefined, value: undefined, validity: undefined, validationMessage: undefined}]
        ]);
      });
    });

    describe('validateForm()', () => {
      test('validateDirtyFields = false', async () => {
        const form = renderer.create(<Form />).getInstance() as any as Form;
        const fieldsStore = form.formWithConstraints!.fieldsStore;
        fieldsStore.fields = {
          username: fieldWithoutFeedback,
          password: fieldWithoutFeedback
        };
        const emitValidateEventSpy = jest.spyOn(form.formWithConstraints!, 'emitValidateEvent');
        const fieldFeedbackValidations1 = await form.formWithConstraints!.validateForm();
        expect(fieldFeedbackValidations1).toEqual([
          {
            fieldName: 'username',
            isValid: expect.any(Function),
            fieldFeedbackValidations: []
          },
          {
            fieldName: 'password',
            isValid: expect.any(Function),
            fieldFeedbackValidations: []
          }
        ]);
        expect(emitValidateEventSpy).toHaveBeenCalledTimes(2);
        expect(emitValidateEventSpy.mock.calls).toEqual([
          [{name: 'username', type: undefined, value: undefined, validity: undefined, validationMessage: undefined}],
          [{name: 'password', type: undefined, value: undefined, validity: undefined, validationMessage: undefined}]
        ]);

        fieldsStore.fields.username!.dirty = true;
        fieldsStore.fields.password!.dirty = true;
        emitValidateEventSpy.mockClear();
        // Fields are dirty so calling validateForm() again won't do anything
        const fieldFeedbackValidations2 = await form.formWithConstraints!.validateForm();
        expect(fieldFeedbackValidations2).toEqual([]);
        expect(emitValidateEventSpy).toHaveBeenCalledTimes(0);
        expect(emitValidateEventSpy.mock.calls).toEqual([]);
      });
    });
  });

  describe('render()', () => {
    test('children', () => {
      const wrapper = renderer.create(
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

      expect(wrapper.toJSON()).toEqual(
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

      const formWithConstraints = wrapper.getInstance() as any as FormWithConstraints;
      expect(formWithConstraints.fieldsStore.fields).toEqual({
        username: fieldWithoutFeedback,
        password: fieldWithoutFeedback
      });
    });

    test('children with <View> inside hierarchy', () => {
      const wrapper = renderer.create(
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

      const formWithConstraints = wrapper.getInstance() as any as FormWithConstraints;
      expect(formWithConstraints.fieldsStore.fields).toEqual({
        username: fieldWithoutFeedback,
        password: fieldWithoutFeedback
      });
    });

    test('children with <View> inside hierarchy + multiple FieldFeedbacks', () => {
      const wrapper = renderer.create(
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

      const formWithConstraints = wrapper.getInstance() as any as FormWithConstraints;
      expect(formWithConstraints.fieldsStore.fields).toEqual({
        username: fieldWithoutFeedback,
        password: fieldWithoutFeedback
      });
    });
  });
});

describe('FieldFeedbacks', () => {
  test('render()', () => {
    const form = new FormWithConstraints({});
    const wrapper = shallow(
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
      </FieldFeedbacks>,
      {context: {form}}
    );
    expect(wrapper.debug()).toEqual(
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
      const form = new FormWithConstraints({});
      form.fieldsStore.fields = {
        username: {
          dirty: true,
          errors: new Set(),
          warnings: new Set(),
          infos: new Set(),
          validationMessage: ''
        }
      };
      const fieldFeedbacks = createFieldFeedbacks({for: 'username', stop: 'no'}, form, fieldFeedbacksKey1, fieldFeedbackKey11);

      const fieldFeedback = shallow(
        <FieldFeedback when="*">message</FieldFeedback>,
        {context: {form, fieldFeedbacks}}
      );

      expect(fieldFeedback.debug()).toEqual('');
    });

    test('with children', () => {
      const form = new FormWithConstraints({});
      form.fieldsStore.fields = {
        username: {
          dirty: true,
          errors: new Set([fieldFeedbackKey11]),
          warnings: new Set(),
          infos: new Set(),
          validationMessage: ''
        }
      };
      const fieldFeedbacks = createFieldFeedbacks({for: 'username', stop: 'no'}, form, fieldFeedbacksKey1, fieldFeedbackKey11);

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
      const form = new FormWithConstraints({});
      form.fieldsStore.fields = {
        username: {
          dirty: true,
          errors: new Set([fieldFeedbackKey11]),
          warnings: new Set(),
          infos: new Set(),
          validationMessage: ''
        }
      };
      const fieldFeedbacks = createFieldFeedbacks({for: 'username', stop: 'no'}, form, fieldFeedbacksKey1, fieldFeedbackKey11);

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

      const form = new FormWithConstraints({style: feedbacksStyles});
      form.fieldsStore.fields = {
        username: {
          dirty: true,
          errors: new Set([fieldFeedbackKey11]),
          warnings: new Set(),
          infos: new Set(),
          validationMessage: ''
        }
      };
      const fieldFeedbacks = createFieldFeedbacks({for: 'username', stop: 'no'}, form, fieldFeedbacksKey1, fieldFeedbackKey11);

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
