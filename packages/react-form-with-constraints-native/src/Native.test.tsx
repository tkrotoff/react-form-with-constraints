import React from 'react';
import { shallow } from 'enzyme';
import { StyleSheet } from 'react-native';
import renderer from 'react-test-renderer';

import { FormWithConstraints, FieldFeedbacks, FieldFeedback, FieldFeedbackWhenValid, TextInput } from './index';
import SignUp from './SignUp';
import beautifyHtml from '../../react-form-with-constraints/src/beautifyHtml';
import { input_username_valueMissing, input_username_valid } from '../../react-form-with-constraints/src/InputElementMock';

// Taken and adapted from FormWithConstraints.test.tsx
describe('FormWithConstraints', () => {
  describe('validate', () => {
    describe('validateFields()', () => {
      test('inputs', async () => {
        const wrapper = renderer.create(<SignUp />);
        const signUp = wrapper.getInstance() as any as SignUp;
        const emitValidateFieldEventSpy = jest.spyOn(signUp.form!, 'emitValidateFieldEvent');

        signUp.setState({username: 'john'});
        signUp.setState({password: '123456'});
        signUp.setState({passwordConfirm: '12345'});

        const fields = await signUp.form!.validateFields(signUp.username!, signUp.password!, signUp.passwordConfirm!);
        expect(fields).toEqual([
          {
            name: 'username',
            validations: [
              {key: '0.0', type: 'error', show: false},
              {key: '0.1', type: 'error', show: false},
              {key: '0.3', type: 'error', show: true},
              {key: '0.2', type: 'whenValid', show: undefined}
            ]
          },
          {
            name: 'password',
            validations: [
              {key: '1.0', type: 'error', show: false},
              {key: '1.1', type: 'error', show: false},
              {key: '1.2', type: 'warning', show: false},
              {key: '1.3', type: 'warning', show: true},
              {key: '1.4', type: 'warning', show: true},
              {key: '1.5', type: 'warning', show: true},
              {key: '1.6', type: 'whenValid', show: undefined}
            ]
          },
          {
            name: 'passwordConfirm',
            validations: [
              {key: '2.0', type: 'error', show: true},
              {key: '2.1', type: 'whenValid', show: undefined}
            ]
          }
        ]);
        expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
        expect(emitValidateFieldEventSpy.mock.calls).toEqual([
          [{name: 'username', value: 'john'}],
          [{name: 'password', value: '123456'}],
          [{name: 'passwordConfirm', value: '12345'}]
        ]);

        wrapper.unmount();
      });

      test('field names', async () => {
        const wrapper = renderer.create(<SignUp />);
        const signUp = wrapper.getInstance() as any as SignUp;
        const emitValidateFieldEventSpy = jest.spyOn(signUp.form!, 'emitValidateFieldEvent');

        signUp.setState({username: 'john'});
        signUp.setState({password: '123456'});
        signUp.setState({passwordConfirm: '12345'});

        const fields = await signUp.form!.validateFields('username', 'password', 'passwordConfirm');
        expect(fields).toEqual([
          {
            name: 'username',
            validations: [
              {key: '0.0', type: 'error', show: false},
              {key: '0.1', type: 'error', show: false},
              {key: '0.3', type: 'error', show: true},
              {key: '0.2', type: 'whenValid', show: undefined}
            ]
          },
          {
            name: 'password',
            validations: [
              {key: '1.0', type: 'error', show: false},
              {key: '1.1', type: 'error', show: false},
              {key: '1.2', type: 'warning', show: false},
              {key: '1.3', type: 'warning', show: true},
              {key: '1.4', type: 'warning', show: true},
              {key: '1.5', type: 'warning', show: true},
              {key: '1.6', type: 'whenValid', show: undefined}
            ]
          },
          {
            name: 'passwordConfirm',
            validations: [
              {key: '2.0', type: 'error', show: true},
              {key: '2.1', type: 'whenValid', show: undefined}
            ]
          }
        ]);
        expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
        expect(emitValidateFieldEventSpy.mock.calls).toEqual([
          [{name: 'username', value: 'john'}],
          [{name: 'password', value: '123456'}],
          [{name: 'passwordConfirm', value: '12345'}]
        ]);

        wrapper.unmount();
      });

      test('inputs + field names', async () => {
        const wrapper = renderer.create(<SignUp />);
        const signUp = wrapper.getInstance() as any as SignUp;
        const emitValidateFieldEventSpy = jest.spyOn(signUp.form!, 'emitValidateFieldEvent');

        signUp.setState({username: 'john'});
        signUp.setState({password: '123456'});
        signUp.setState({passwordConfirm: '12345'});

        const fields = await signUp.form!.validateFields(signUp.username!, 'password', signUp.passwordConfirm!);
        expect(fields).toEqual([
          {
            name: 'username',
            validations: [
              {key: '0.0', type: 'error', show: false},
              {key: '0.1', type: 'error', show: false},
              {key: '0.3', type: 'error', show: true},
              {key: '0.2', type: 'whenValid', show: undefined}
            ]
          },
          {
            name: 'password',
            validations: [
              {key: '1.0', type: 'error', show: false},
              {key: '1.1', type: 'error', show: false},
              {key: '1.2', type: 'warning', show: false},
              {key: '1.3', type: 'warning', show: true},
              {key: '1.4', type: 'warning', show: true},
              {key: '1.5', type: 'warning', show: true},
              {key: '1.6', type: 'whenValid', show: undefined}
            ]
          },
          {
            name: 'passwordConfirm',
            validations: [
              {key: '2.0', type: 'error', show: true},
              {key: '2.1', type: 'whenValid', show: undefined}
            ]
          }
        ]);
        expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
        expect(emitValidateFieldEventSpy.mock.calls).toEqual([
          [{name: 'username', value: 'john'}],
          [{name: 'password', value: '123456'}],
          [{name: 'passwordConfirm', value: '12345'}]
        ]);

        wrapper.unmount();
      });

      test('without arguments', async () => {
        const wrapper = renderer.create(<SignUp />);
        const signUp = wrapper.getInstance() as any as SignUp;
        const emitValidateFieldEventSpy = jest.spyOn(signUp.form!, 'emitValidateFieldEvent');

        signUp.setState({username: 'john'});
        signUp.setState({password: '123456'});
        signUp.setState({passwordConfirm: '12345'});

        const fields = await signUp.form!.validateFields();
        expect(fields).toEqual([
          {
            name: 'username',
            validations: [
              {key: '0.0', type: 'error', show: false},
              {key: '0.1', type: 'error', show: false},
              {key: '0.3', type: 'error', show: true},
              {key: '0.2', type: 'whenValid', show: undefined}
            ]
          },
          {
            name: 'password',
            validations: [
              {key: '1.0', type: 'error', show: false},
              {key: '1.1', type: 'error', show: false},
              {key: '1.2', type: 'warning', show: false},
              {key: '1.3', type: 'warning', show: true},
              {key: '1.4', type: 'warning', show: true},
              {key: '1.5', type: 'warning', show: true},
              {key: '1.6', type: 'whenValid', show: undefined}
            ]
          },
          {
            name: 'passwordConfirm',
            validations: [
              {key: '2.0', type: 'error', show: true},
              {key: '2.1', type: 'whenValid', show: undefined}
            ]
          }
        ]);
        expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
        expect(emitValidateFieldEventSpy.mock.calls).toEqual([
          [{name: 'username', value: 'john'}],
          [{name: 'password', value: '123456'}],
          [{name: 'passwordConfirm', value: '12345'}]
        ]);

        wrapper.unmount();
      });

      test('change inputs', async () => {
        const wrapper = renderer.create(<SignUp />);
        const signUp = wrapper.getInstance() as any as SignUp;
        const emitValidateFieldEventSpy = jest.spyOn(signUp.form!, 'emitValidateFieldEvent');

        signUp.setState({username: ''});
        signUp.setState({password: ''});
        signUp.setState({passwordConfirm: ''});

        let fields = await signUp.form!.validateFields();
        expect(fields).toEqual([
          {
            name: 'username',
            validations: [
              {key: '0.0', type: 'error', show: true},
              {key: '0.1', type: 'error', show: undefined},
              {key: '0.2', type: 'whenValid', show: undefined}
            ]
          },
          {
            name: 'password',
            validations: [
              {key: '1.0', type: 'error', show: true},
              {key: '1.1', type: 'error', show: undefined},
              {key: '1.2', type: 'warning', show: undefined},
              {key: '1.3', type: 'warning', show: undefined},
              {key: '1.4', type: 'warning', show: undefined},
              {key: '1.5', type: 'warning', show: undefined},
              {key: '1.6', type: 'whenValid', show: undefined}
            ]
          },
          {
            name: 'passwordConfirm',
            validations: [
              {key: '2.0', type: 'error', show: false},
              {key: '2.1', type: 'whenValid', show: undefined}
            ]
          }
        ]);
        expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
        expect(emitValidateFieldEventSpy.mock.calls).toEqual([
          [{name: 'username', value: ''}],
          [{name: 'password', value: ''}],
          [{name: 'passwordConfirm', value: ''}]
        ]);

        emitValidateFieldEventSpy.mockClear();

        signUp.setState({username: 'john'});
        signUp.setState({password: '123456'});
        signUp.setState({passwordConfirm: '12345'});

        fields = await signUp.form!.validateFields();
        expect(fields).toEqual([
          {
            name: 'username',
            validations: [
              {key: '0.0', type: 'error', show: false},
              {key: '0.1', type: 'error', show: false},
              {key: '0.3', type: 'error', show: true},
              {key: '0.2', type: 'whenValid', show: undefined}
            ]
          },
          {
            name: 'password',
            validations: [
              {key: '1.0', type: 'error', show: false},
              {key: '1.1', type: 'error', show: false},
              {key: '1.2', type: 'warning', show: false},
              {key: '1.3', type: 'warning', show: true},
              {key: '1.4', type: 'warning', show: true},
              {key: '1.5', type: 'warning', show: true},
              {key: '1.6', type: 'whenValid', show: undefined}
            ]
          },
          {
            name: 'passwordConfirm',
            validations: [
              {key: '2.0', type: 'error', show: true},
              {key: '2.1', type: 'whenValid', show: undefined}
            ]
          }
        ]);
        expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
        expect(emitValidateFieldEventSpy.mock.calls).toEqual([
          [{name: 'username', value: 'john'}],
          [{name: 'password', value: '123456'}],
          [{name: 'passwordConfirm', value: '12345'}]
        ]);

        wrapper.unmount();
      });
    });

    test('validateForm()', async () => {
      const wrapper = renderer.create(<SignUp />);
      const signUp = wrapper.getInstance() as any as SignUp;
      const emitValidateFieldEventSpy = jest.spyOn(signUp.form!, 'emitValidateFieldEvent');

      signUp.setState({username: 'john'});
      signUp.setState({password: '123456'});
      signUp.setState({passwordConfirm: '12345'});

      const fields1 = await signUp.form!.validateForm();
      expect(fields1).toEqual([
        {
          name: 'username',
          validations: [
            {key: '0.0', type: 'error', show: false},
            {key: '0.1', type: 'error', show: false},
            {key: '0.3', type: 'error', show: true},
            {key: '0.2', type: 'whenValid', show: undefined}
          ]
        },
        {
          name: 'password',
          validations: [
            {key: '1.0', type: 'error', show: false},
            {key: '1.1', type: 'error', show: false},
            {key: '1.2', type: 'warning', show: false},
            {key: '1.3', type: 'warning', show: true},
            {key: '1.4', type: 'warning', show: true},
            {key: '1.5', type: 'warning', show: true},
            {key: '1.6', type: 'whenValid', show: undefined}
          ]
        },
        {
          name: 'passwordConfirm',
          validations: [
            {key: '2.0', type: 'error', show: true},
            {key: '2.1', type: 'whenValid', show: undefined}
          ]
        }
      ]);
      expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
      expect(emitValidateFieldEventSpy.mock.calls).toEqual([
        [{name: 'username', value: 'john'}],
        [{name: 'password', value: '123456'}],
        [{name: 'passwordConfirm', value: '12345'}]
      ]);

      // Fields are already dirty so calling validateForm() again won't do anything

      emitValidateFieldEventSpy.mockClear();

      signUp.setState({username: 'jimmy'});
      signUp.setState({password: '12345'});
      signUp.setState({passwordConfirm: '12345'});

      const fields2 = await signUp.form!.validateForm();
      expect(fields2).toEqual(fields1);
      expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(0);
      expect(emitValidateFieldEventSpy.mock.calls).toEqual([]);

      wrapper.unmount();
    });

    describe('normalizeInputs', () => {
      test('Multiple elements matching', async () => {
        const wrapper = renderer.create(
          <FormWithConstraints>
            <TextInput name="username" />
            <FieldFeedbacks for="username" />

            <TextInput secureTextEntry name="password" />
            <TextInput secureTextEntry name="password" />
            <TextInput secureTextEntry name="password" />
            <FieldFeedbacks for="password" />
          </FormWithConstraints>
        );
        const form = wrapper.getInstance() as any as FormWithConstraints;

        // See async/await toThrow is not working https://github.com/facebook/jest/issues/1700

        await expect(form.validateFields('username')).resolves.toEqual([{name: 'username', validations: []}]);
        await expect(form.validateFields()).rejects.toEqual(new Error(`Multiple elements matching '[name="password"]' inside the form`));
        await expect(form.validateFields('password')).rejects.toEqual(new Error(`Multiple elements matching '[name="password"]' inside the form`));

        wrapper.unmount();
      });

      test('Could not find field', async () => {
        const wrapper = renderer.create(
          <FormWithConstraints>
            <TextInput name="username" />
          </FormWithConstraints>
        );
        const form = wrapper.getInstance() as any as FormWithConstraints;

        await expect(form.validateFields()).resolves.toEqual([]); // Ignore input without FieldFeedbacks
        await expect(form.validateFields('unknown')).rejects.toEqual(new Error(`Could not find field '[name="unknown"]' inside the form`));

        wrapper.unmount();
      });

      test('Could not find field - child with props undefined', async () => {
        const wrapper = renderer.create(
          <FormWithConstraints>
            ChildWithPropsUndefined
          </FormWithConstraints>
        );
        const form = wrapper.getInstance() as any as FormWithConstraints;

        await expect(form.validateFields()).resolves.toEqual([]);
        await expect(form.validateFields('unknown')).rejects.toEqual(new Error(`Could not find field '[name="unknown"]' inside the form`));

        wrapper.unmount();
      });
    });
  });

  describe('Async', () => {
    test('then', async () => {
      const wrapper = renderer.create(<SignUp />);
      const signUp = wrapper.getInstance() as any as SignUp;
      const emitValidateFieldEventSpy = jest.spyOn(signUp.form!, 'emitValidateFieldEvent');

      signUp.setState({username: 'jimmy'});
      signUp.setState({password: '12345'});
      signUp.setState({passwordConfirm: '12345'});

      const fields = await signUp.form!.validateFields();
      expect(fields).toEqual([
        {
          name: 'username',
          validations: [
            {key: '0.0', type: 'error', show: false},
            {key: '0.1', type: 'error', show: false},
            {key: '0.3', type: 'info', show: true},
            {key: '0.2', type: 'whenValid', show: undefined}
          ]
        },
        {
          name: 'password',
          validations: [
            {key: '1.0', type: 'error', show: false},
            {key: '1.1', type: 'error', show: false},
            {key: '1.2', type: 'warning', show: false},
            {key: '1.3', type: 'warning', show: true},
            {key: '1.4', type: 'warning', show: true},
            {key: '1.5', type: 'warning', show: true},
            {key: '1.6', type: 'whenValid', show: undefined}
          ]
        },
        {
          name: 'passwordConfirm',
          validations: [
            {key: '2.0', type: 'error', show: false},
            {key: '2.1', type: 'whenValid', show: undefined}
          ]
        }
      ]);
      expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
      expect(emitValidateFieldEventSpy.mock.calls).toEqual([
        [{name: 'username', value: 'jimmy'}],
        [{name: 'password', value: '12345'}],
        [{name: 'passwordConfirm', value: '12345'}]
      ]);

      wrapper.unmount();
    });

    test('catch', async () => {
      const wrapper = renderer.create(<SignUp />);
      const signUp = wrapper.getInstance() as any as SignUp;
      const emitValidateFieldEventSpy = jest.spyOn(signUp.form!, 'emitValidateFieldEvent');

      signUp.setState({username: 'error'});
      signUp.setState({password: '123456'});
      signUp.setState({passwordConfirm: '12345'});

      const fields = await signUp.form!.validateFields();
      expect(fields).toEqual([
        {
          name: 'username',
          validations: [
            {key: '0.0', type: 'error', show: false},
            {key: '0.1', type: 'error', show: false},
            {key: '0.3', type: 'error', show: true},
            {key: '0.2', type: 'whenValid', show: undefined}
          ]
        },
        {
          name: 'password',
          validations: [
            {key: '1.0', type: 'error', show: false},
            {key: '1.1', type: 'error', show: false},
            {key: '1.2', type: 'warning', show: false},
            {key: '1.3', type: 'warning', show: true},
            {key: '1.4', type: 'warning', show: true},
            {key: '1.5', type: 'warning', show: true},
            {key: '1.6', type: 'whenValid', show: undefined}
          ]
        },
        {
          name: 'passwordConfirm',
          validations: [
            {key: '2.0', type: 'error', show: true},
            {key: '2.1', type: 'whenValid', show: undefined}
          ]
        }
      ]);
      expect(emitValidateFieldEventSpy).toHaveBeenCalledTimes(3);
      expect(emitValidateFieldEventSpy.mock.calls).toEqual([
        [{name: 'username', value: 'error'}],
        [{name: 'password', value: '123456'}],
        [{name: 'passwordConfirm', value: '12345'}]
      ]);

      wrapper.unmount();
    });
  });
});

describe('FieldFeedbacks', () => {
  let form_username: FormWithConstraints;

  beforeEach(() => {
    form_username = new FormWithConstraints({});
  });

  test('render()', () => {
    const wrapper = shallow(
      <FieldFeedbacks for="username">
        <FieldFeedback when={value => value.length === 0}>Cannot be empty</FieldFeedback>
      </FieldFeedbacks>,
      {context: {form: form_username}}
    );
    expect(beautifyHtml(wrapper.debug(), '      ')).toEqual(`\
      <View for="username" stop="first-error">
        <FieldFeedback when={[Function: when]}>
          Cannot be empty
        </FieldFeedback>
      </View>`
    );
  });
});

// Taken and adapted from FieldFeedback.test.tsx
describe('FieldFeedback', () => {
  let form_username: FormWithConstraints;
  let fieldFeedbacks_username: FieldFeedbacks;

  beforeEach(() => {
    form_username = new FormWithConstraints({});

    fieldFeedbacks_username = new FieldFeedbacks({for: 'username', stop: 'no'}, {form: form_username as any});
    fieldFeedbacks_username.componentWillMount(); // Needed because of fieldsStore.addField() inside componentWillMount()
  });

  describe('render()', () => {
    test('error', async () => {
      const wrapper = shallow(
        <FieldFeedback when={value => value.length === 0} error>Cannot be empty</FieldFeedback>,
        {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
      );
      const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valueMissing);

      expect(validations).toEqual([
        {key: '0.0', type: 'error', show: true}
      ]);
      wrapper.update();
      expect(beautifyHtml(wrapper.debug(), '        ')).toEqual(`\
        <Text data-feedback="0.0" style={[undefined]} accessible={true} allowFontScaling={true} ellipsizeMode="tail">
          Cannot be empty
        </Text>`
      );
    });

    test('warning', async () => {
    });

    test('info', async () => {
    });

    test('no error', async () => {
      const wrapper = shallow(
        <FieldFeedback when={value => value.length === 0}>Cannot be empty</FieldFeedback>,
        {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
      );
      const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valid);

      expect(validations).toEqual([
        {key: '0.0', type: 'error', show: false}
      ]);
      wrapper.update();
      expect(wrapper.debug()).toEqual('');
    });

    test('without children', async () => {
      const wrapper = shallow(
        <FieldFeedback when={value => value.length === 0} />,
        {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
      );
      const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valueMissing);

      expect(validations).toEqual([
        {key: '0.0', type: 'error', show: true}
      ]);
      wrapper.update();
      expect(wrapper.debug()).toEqual('<Text data-feedback="0.0" style={[undefined]} accessible={true} allowFontScaling={true} ellipsizeMode="tail" />');
    });

    test('with already existing class', async () => {
    });

    test('with div props', async () => {
      const wrapper = shallow(
        <FieldFeedback when={value => value.length === 0} style={{color: 'yellow'}}>Cannot be empty</FieldFeedback>,
        {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
      );
      const validations = await fieldFeedbacks_username.emitValidateFieldEvent(input_username_valueMissing);

      expect(validations).toEqual([
        {key: '0.0', type: 'error', show: true}
      ]);
      wrapper.update();
      expect(beautifyHtml(wrapper.debug(), '        ')).toEqual(`\
        <Text data-feedback="0.0" style={{...}} accessible={true} allowFontScaling={true} ellipsizeMode="tail">
          Cannot be empty
        </Text>`
      );
      expect(wrapper.props().style).toEqual({color: 'yellow'});
    });

    test('with theme', async () => {
      const fieldFeedbackTheme = StyleSheet.create({
        error: {color: 'red'},
        warning: {color: 'orange'},
        info: {color: 'blue'},
        whenValid: {color: 'green'}
      });

      const form = new FormWithConstraints({});
      const fieldFeedbacks = new FieldFeedbacks({for: 'username', stop: 'no'}, {form: form as any});
      fieldFeedbacks.componentWillMount(); // Needed because of fieldsStore.addField() inside componentWillMount()

      const wrapper = shallow(
        <FieldFeedback when={value => value.length === 0} theme={fieldFeedbackTheme}>Cannot be empty</FieldFeedback>,
        {context: {form, fieldFeedbacks}}
      );
      const validations = await fieldFeedbacks.emitValidateFieldEvent(input_username_valueMissing);

      expect(validations).toEqual([
        {key: '0.0', type: 'error', show: true}
      ]);
      wrapper.update();
      expect(beautifyHtml(wrapper.debug(), '        ')).toEqual(`\
        <Text data-feedback="0.0" style={{...}} accessible={true} allowFontScaling={true} ellipsizeMode="tail">
          Cannot be empty
        </Text>`
      );
      expect(wrapper.props().style).toEqual({color: 'red'});
    });

    test('when="valid"', async () => {
      // Cannot be implemented properly
    });
  });
});

describe('FieldFeedbackWhenValid', () => {
  let form_username: FormWithConstraints;
  let fieldFeedbacks_username: FieldFeedbacks;

  beforeEach(() => {
    form_username = new FormWithConstraints({});

    fieldFeedbacks_username = new FieldFeedbacks({for: 'username', stop: 'no'}, {form: form_username as any});
    //fieldFeedbacks_username.componentWillMount(); // Needed because of fieldsStore.addField() inside componentWillMount()
  });

  test('render()', () => {
    let wrapper = shallow(
      <FieldFeedbackWhenValid>Looks good!</FieldFeedbackWhenValid>,
      {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
    );

    expect(wrapper.html()).toEqual(null);

    wrapper.setState({fieldIsValid: undefined});
    expect(wrapper.html()).toEqual(null);

    wrapper.setState({fieldIsValid: true});
    expect(beautifyHtml(wrapper.debug(), '      ')).toEqual(`\
      <Text accessible={true} allowFontScaling={true} ellipsizeMode="tail">
        Looks good!
      </Text>`
    );

    wrapper.setState({fieldIsValid: false});
    expect(wrapper.html()).toEqual(null);

    // With div props
    wrapper = shallow(
      <FieldFeedbackWhenValid style={{color: 'green'}}>Looks good!</FieldFeedbackWhenValid>,
      {context: {form: form_username, fieldFeedbacks: fieldFeedbacks_username}}
    );
    wrapper.setState({fieldIsValid: true});
    expect(beautifyHtml(wrapper.debug(), '      ')).toEqual(`\
      <Text style={{...}} accessible={true} allowFontScaling={true} ellipsizeMode="tail">
        Looks good!
      </Text>`
    );
  });
});
