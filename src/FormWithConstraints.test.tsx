import * as React from 'react';
import { shallow } from 'enzyme';

import {
  FormWithConstraints, FormFields, Input, ValidityState_fix,
  FieldFeedbacks, FieldFeedbacksProps,
  FieldFeedback, FieldFeedbackInternalProps,
  Fields, Field
} from './FormWithConstraints';

describe('FormWithConstraints', () => {
  test('isValid() + FormFields', () => {
    const form = new FormWithConstraints();

    form.fields = {
      username: {
        dirty: false,
        errors: [],
        warnings: [],
        infos: [],
        validationMessage: ''
      },
      password: {
        dirty: false,
        errors: [],
        warnings: [],
        infos: [],
        validationMessage: ''
      }
    };
    expect(form.isValid()).toEqual(true);
    expect(FormFields.containErrors(form, 'username', 'password')).toEqual(false);
    expect(FormFields.containWarnings(form, 'username', 'password')).toEqual(false);
    expect(FormFields.containInfos(form, 'username', 'password')).toEqual(false);

    form.fields = {
      username: {
        dirty: false,
        errors: [0],
        warnings: [],
        infos: [],
        validationMessage: 'Suffering from being missing'
      },
      password: {
        dirty: false,
        errors: [0],
        warnings: [],
        infos: [],
        validationMessage: 'Suffering from being missing'
      }
    };
    expect(form.isValid()).toEqual(false);
    expect(FormFields.containErrors(form, 'username', 'password')).toEqual(true);
    expect(FormFields.containWarnings(form, 'username', 'password')).toEqual(false);
    expect(FormFields.containInfos(form, 'username', 'password')).toEqual(false);

    form.fields = {
      username: {
        dirty: false,
        errors: [],
        warnings: [0],
        infos: [],
        validationMessage: ''
      },
      password: {
        dirty: false,
        errors: [],
        warnings: [0],
        infos: [],
        validationMessage: ''
      }
    };
    expect(form.isValid()).toEqual(true);
    expect(FormFields.containErrors(form, 'username', 'password')).toEqual(false);
    expect(FormFields.containWarnings(form, 'username', 'password')).toEqual(true);
    expect(FormFields.containInfos(form, 'username', 'password')).toEqual(false);

    form.fields = {
      username: {
        dirty: false,
        errors: [],
        warnings: [],
        infos: [0],
        validationMessage: ''
      },
      password: {
        dirty: false,
        errors: [],
        warnings: [],
        infos: [0],
        validationMessage: ''
      }
    };
    expect(form.isValid()).toEqual(true);
    expect(FormFields.containErrors(form, 'username', 'password')).toEqual(false);
    expect(FormFields.containWarnings(form, 'username', 'password')).toEqual(false);
    expect(FormFields.containInfos(form, 'username', 'password')).toEqual(true);
  });

  test('FormFields - unknown field', () => {
    const form = new FormWithConstraints();

    form.fields = {
      username: {
        dirty: false,
        errors: [],
        warnings: [],
        infos: [],
        validationMessage: ''
      },
      password: {
        dirty: false,
        errors: [],
        warnings: [],
        infos: [],
        validationMessage: ''
      }
    };

    console.assert = jest.fn();

    // Ignore unknown fields
    expect(FormFields.containErrors(form, 'email')).toEqual(false);
    expect(FormFields.containWarnings(form, 'email')).toEqual(false);
    expect(FormFields.containInfos(form, 'email')).toEqual(false);
    expect(FormFields.areValidDirtyWithoutWarnings(form, 'email')).toEqual(false);
  });

  test('FormFields.areValidDirtyWithoutWarnings()', () => {
    const form = new FormWithConstraints();

    form.fields = {
      username: {
        dirty: false,
        errors: [],
        warnings: [],
        infos: [],
        validationMessage: ''
      },
      password: {
        dirty: false,
        errors: [],
        warnings: [],
        infos: [],
        validationMessage: ''
      }
    };
    expect(FormFields.areValidDirtyWithoutWarnings(form, 'username', 'password')).toEqual(false);

    form.fields = {
      username: {
        dirty: true,
        errors: [],
        warnings: [],
        infos: [],
        validationMessage: ''
      },
      password: {
        dirty: true,
        errors: [],
        warnings: [],
        infos: [],
        validationMessage: ''
      }
    };
    expect(FormFields.areValidDirtyWithoutWarnings(form, 'username', 'password')).toEqual(true);

    form.fields = {
      username: {
        dirty: true,
        errors: [0],
        warnings: [],
        infos: [],
        validationMessage: 'Suffering from being missing'
      },
      password: {
        dirty: true,
        errors: [0],
        warnings: [],
        infos: [],
        validationMessage: 'Suffering from being missing'
      }
    };
    expect(FormFields.areValidDirtyWithoutWarnings(form, 'username', 'password')).toEqual(false);

    form.fields = {
      username: {
        dirty: true,
        errors: [],
        warnings: [0],
        infos: [],
        validationMessage: 'Suffering from being missing'
      },
      password: {
        dirty: true,
        errors: [],
        warnings: [0],
        infos: [],
        validationMessage: 'Suffering from being missing'
      }
    };
    expect(FormFields.areValidDirtyWithoutWarnings(form, 'username', 'password')).toEqual(false);
  });

  describe('TODO DOM', () => {
    test('TODO handleChange()', () => {
      class Form extends FormWithConstraints {
        constructor(props: {}) {
          super(props);
          this.handleChange = this.handleChange.bind(this);
          this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleChange(e: React.FormEvent<HTMLInputElement>) {
          super.handleChange(e);
        }

        render() {
          return (
            <form noValidate>
              <input type="email" name="username" onChange={this.handleChange} required />
              <FieldFeedbacks for="username">
                <FieldFeedback when="*" />
              </FieldFeedbacks>
            </form>
          );
        }
      }

      //const form = mount(<Form />);
      const form = shallow(<Form />);

      const input = form.find('input');
      input.simulate('change', {currentTarget: {value: 'johndoe'}});

      // TODO
      // Jest relies on Enzyme for testing React components, see [Testing React Apps](https://facebook.github.io/jest/docs/en/tutorial-react.html).
      // Enzyme does [full DOM rendering thanks to jsdom](http://airbnb.io/enzyme/docs/api/mount.html).
      // jsdom does not support HTML5 form validation, see [HTML5 Form Validation #544](https://github.com/tmpvar/jsdom/issues/544)
      // Jest only works with jsdom, see [Running tests in the browser #139](https://github.com/facebook/jest/issues/139), [Targeting more than JSDOM #848](https://github.com/facebook/jest/issues/848)
      // Chrome 59 features [headless mode](https://news.ycombinator.com/item?id=14101233).
      // => things will probably move in the future: Jest/Enzyme support for Chrome headless mode
    });

    test('TODO handleSubmit()', () => {
      // TODO
    });
  });
});

describe('FieldFeedback', () => {
  function createFieldFeedback(message: string, props: FieldFeedbackInternalProps) {
    return shallow<FieldFeedbackInternalProps>(
      <FieldFeedback {...props as /*FieldFeedbackProps*/any}>{message}</FieldFeedback>,
      {lifecycleExperimental: true}
    );
  }

  function createFieldFeedbackNoMessage(props: FieldFeedbackInternalProps) {
    return shallow<FieldFeedbackInternalProps>(
      <FieldFeedback {...props as /*FieldFeedbackProps*/any} />,
      {lifecycleExperimental: true}
    );
  }

  describe('render()', () => {
    test('render error matching', () => {
      const fieldFeedback = createFieldFeedback(
        'message',
        {
          index: 0,
          when: '*',
          field: {
            dirty: false,
            errors: [0],
            warnings: [],
            infos: [],
            validationMessage: 'Suffering from being missing'
          }
        }
      );

      expect(fieldFeedback.text()).toEqual('message');
    });

    test('render error matching - HTML5 validationMessage', () => {
      const fieldFeedback = createFieldFeedbackNoMessage(
        {
          index: 0,
          when: '*',
          field: {
            dirty: false,
            errors: [0],
            warnings: [],
            infos: [],
            validationMessage: 'Suffering from being missing'
          }
        }
      );

      expect(fieldFeedback.text()).toEqual('Suffering from being missing');
    });

    test('render warning matching', () => {
      const fieldFeedback = createFieldFeedback(
        'message',
        {
          index: 0,
          when: '*',
          warning: true,
          field: {
            dirty: false,
            errors: [],
            warnings: [0],
            infos: [],
            validationMessage: ''
          }
        }
      );

      expect(fieldFeedback.text()).toEqual('message');
    });

    test('render info matching', () => {
      const fieldFeedback = createFieldFeedback(
        'message',
        {
          index: 0,
          when: '*',
          info: true,
          field: {
            dirty: false,
            errors: [],
            warnings: [],
            infos: [0],
            validationMessage: ''
          }
        }
      );

      expect(fieldFeedback.text()).toEqual('message');
    });

    test('render not matching', () => {
      const fieldFeedback = createFieldFeedback(
        'message',
        {
          index: 0,
          when: '*',
          field: {
            dirty: false,
            errors: [],
            warnings: [],
            infos: [],
            validationMessage: ''
          }
        }
      );

      expect(fieldFeedback.text()).toEqual('');
    });
  });

  describe('div props className', () => {
    test('className="error"', () => {
      const fieldFeedback = createFieldFeedback(
        'message',
        {
          index: 0,
          when: '*',
          field: {
            dirty: false,
            errors: [0],
            warnings: [],
            infos: [],
            validationMessage: ''
          }
        }
      );

      const div = fieldFeedback.find('div');
      expect(div.hasClass('error')).toBe(true);
      expect(div.hasClass('warning')).toBe(false);
      expect(div.hasClass('info')).toBe(false);
    });

    test('className="warning"', () => {
      const fieldFeedback = createFieldFeedback(
        'message',
        {
          index: 0,
          when: '*',
          warning: true,
          field: {
            dirty: false,
            errors: [],
            warnings: [0],
            infos: [],
            validationMessage: ''
          }
        }
      );

      const div = fieldFeedback.find('div');
      expect(div.hasClass('error')).toBe(false);
      expect(div.hasClass('warning')).toBe(true);
      expect(div.hasClass('info')).toBe(false);
    });

    test('className="info"', () => {
      const fieldFeedback = createFieldFeedback(
        'message',
        {
          index: 0,
          when: '*',
          info: true,
          field: {
            dirty: false,
            errors: [],
            warnings: [],
            infos: [0],
            validationMessage: ''
          }
        }
      );

      const div = fieldFeedback.find('div');
      expect(div.hasClass('error')).toBe(false);
      expect(div.hasClass('warning')).toBe(false);
      expect(div.hasClass('info')).toBe(true);
    });

    test('with already existing className', () => {
      const fieldFeedback = createFieldFeedback(
        'message',
        {
          index: 0,
          when: '*',
          field: {
            dirty: false,
            errors: [0],
            warnings: [],
            infos: [],
            validationMessage: ''
          },
          className: 'alreadyExistingClassName'
        }
      );

      const div = fieldFeedback.find('div');
      expect(div.hasClass('alreadyExistingClassName')).toBe(true);
      expect(div.hasClass('error')).toBe(true);
    });
  });
});


class FakeFormWithConstraints {
  inputChangeOrFormSubmitEventListeners: ((input: Input) => void)[] = [];

  emitInputChangeOrFormSubmitEvent(input: Input) {
    this.inputChangeOrFormSubmitEventListeners.forEach(listener => listener(input));
  }

  addInputChangeOrFormSubmitEventListener(listener: (input: Input) => void) {
    this.inputChangeOrFormSubmitEventListeners.push(listener);
  }

  removeInputChangeOrFormSubmitEventListener(listener: (input: Input) => void) {
    const index = this.inputChangeOrFormSubmitEventListeners.indexOf(listener);
    this.inputChangeOrFormSubmitEventListeners.splice(index, 1);
  }

  fields: Fields = {};
}

class FakeInput implements Input {
  validity: ValidityState_fix;

  constructor(public name: string, public value: string, validity: Partial<ValidityState_fix>, public validationMessage: string) {
    const defaultValidity = {
      valid: true,
      badInput: false,
      customError: false,
      patternMismatch: false,
      rangeOverflow: false,
      rangeUnderflow: false,
      stepMismatch: false,
      tooLong: false,
      tooShort: false,
      typeMismatch: false,
      valueMissing: false
    };
    if (validationMessage !== '') {
      defaultValidity.customError = true;
    }
    this.validity = {...defaultValidity, ...validity};
  }
}

describe('FieldFeedbacks', () => {
  let form: FakeFormWithConstraints;

  beforeEach(() => {
    form = new FakeFormWithConstraints();
  });

  function createFieldFeedbacks(node: React.ReactElement<FieldFeedbacksProps>) {
    const context = {form};
    return shallow<FieldFeedbacksProps, Field>(node, {context, lifecycleExperimental: true});
  }

  test('componentDidMount() componentWillUnmount()', () => {
    const addInputChangeOrFormSubmitEventListenerSpy = jest.spyOn(form, 'addInputChangeOrFormSubmitEventListener');
    const removeInputChangeOrFormSubmitEventListenerSpy = jest.spyOn(form, 'removeInputChangeOrFormSubmitEventListener');

    const fieldFeedbacks = createFieldFeedbacks(
      <FieldFeedbacks for="username" />
    );
    expect(addInputChangeOrFormSubmitEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeInputChangeOrFormSubmitEventListenerSpy).toHaveBeenCalledTimes(0);
    expect(form.inputChangeOrFormSubmitEventListeners).toHaveLength(1);

    fieldFeedbacks.unmount();
    expect(addInputChangeOrFormSubmitEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeInputChangeOrFormSubmitEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(form.inputChangeOrFormSubmitEventListeners).toHaveLength(0);
  });

  test('state and form.fields are equal', () => {
    const fieldFeedbacks = createFieldFeedbacks(
      <FieldFeedbacks for="username" show="all">
        <FieldFeedback when="*">0</FieldFeedback>
        <FieldFeedback when="*">1</FieldFeedback>
        <FieldFeedback when="*">2</FieldFeedback>
      </FieldFeedbacks>
    );

    expect(fieldFeedbacks.state()).toEqual({
      dirty: false,
      errors: [],
      warnings: [],
      infos: [],
      validationMessage: ''
    });
    expect(form.fields.username).toEqual(fieldFeedbacks.state());

    const input = new FakeInput('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    form.emitInputChangeOrFormSubmitEvent(input);

    expect(fieldFeedbacks.state()).toEqual({
      dirty: true,
      errors: [0, 1, 2],
      warnings: [],
      infos: [],
      validationMessage: 'Suffering from being missing'
    });
    expect(form.fields.username).toEqual(fieldFeedbacks.state());
  });

  test('pass field to children', () => {
    const fieldFeedbacks = createFieldFeedbacks(
      <FieldFeedbacks for="username" show="all">
        <FieldFeedback when="*">0</FieldFeedback>
        <FieldFeedback when="*">1</FieldFeedback>
      </FieldFeedbacks>
    );

    const input = new FakeInput('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    form.emitInputChangeOrFormSubmitEvent(input);

    const field = {
      dirty: true,
      errors: [0, 1],
      warnings: [],
      infos: [],
      validationMessage: 'Suffering from being missing'
    };

    expect(fieldFeedbacks.state()).toEqual(field);

    const children = fieldFeedbacks.children();
    expect(children).toHaveLength(2);
    expect(children.at(0).props().field).toEqual(field);
    expect(children.at(1).props().field).toEqual(field);
  });

  test('unknown input name', () => {
    const fieldFeedbacks = createFieldFeedbacks(
      <FieldFeedbacks for="username">
        <FieldFeedback when="*">0</FieldFeedback>
      </FieldFeedbacks>
    );

    const input = new FakeInput('unknownInputName', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    form.emitInputChangeOrFormSubmitEvent(input);

    const field = {
      dirty: false,
      errors: [],
      warnings: [],
      infos: [],
      validationMessage: ''
    };

    expect(fieldFeedbacks.state()).toEqual(field);
  });

  describe('FieldFeedback when prop', () => {
    test('*', () => {
      const fieldFeedbacks = createFieldFeedbacks(
        <FieldFeedbacks for="username">
          <FieldFeedback when="*">0</FieldFeedback>
        </FieldFeedbacks>
      );

      const input = new FakeInput('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
      form.emitInputChangeOrFormSubmitEvent(input);

      expect(fieldFeedbacks.state()).toEqual({
        dirty: true,
        errors: [0],
        warnings: [],
        infos: [],
        validationMessage: 'Suffering from being missing'
      });
    });

    test('valueMissing', () => {
      const fieldFeedbacks = createFieldFeedbacks(
        <FieldFeedbacks for="username">
          <FieldFeedback when="valueMissing">0</FieldFeedback>
        </FieldFeedbacks>
      );

      const input = new FakeInput('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
      form.emitInputChangeOrFormSubmitEvent(input);

      expect(fieldFeedbacks.state()).toEqual({
        dirty: true,
        errors: [0],
        warnings: [],
        infos: [],
        validationMessage: 'Suffering from being missing'
      });
    });

    test('function', () => {
      const fieldFeedbacks = createFieldFeedbacks(
        <FieldFeedbacks for="username">
          <FieldFeedback when={value => value.length === 0}>0</FieldFeedback>
        </FieldFeedbacks>
      );

      const input = new FakeInput('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
      form.emitInputChangeOrFormSubmitEvent(input);

      expect(fieldFeedbacks.state()).toEqual({
        dirty: true,
        errors: [0],
        warnings: [],
        infos: [],
        validationMessage: 'Suffering from being missing'
      });
    });
  });

  describe('FieldFeedbacks show prop', () => {
    test('default', () => {
      const fieldFeedbacks = createFieldFeedbacks(
        <FieldFeedbacks for="username">
          <FieldFeedback when="*">0</FieldFeedback>
          <FieldFeedback when="*">1</FieldFeedback>
        </FieldFeedbacks>
      );

      const input = new FakeInput('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
      form.emitInputChangeOrFormSubmitEvent(input);

      expect(fieldFeedbacks.state()).toEqual({
        dirty: true,
        errors: [0],
        warnings: [],
        infos: [],
        validationMessage: 'Suffering from being missing'
      });
    });

    test('first', () => {
      const fieldFeedbacks = createFieldFeedbacks(
        <FieldFeedbacks for="username" show="first">
          <FieldFeedback when="*">0</FieldFeedback>
          <FieldFeedback when="*">1</FieldFeedback>
        </FieldFeedbacks>
      );

      const input = new FakeInput('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
      form.emitInputChangeOrFormSubmitEvent(input);

      expect(fieldFeedbacks.state()).toEqual({
        dirty: true,
        errors: [0],
        warnings: [],
        infos: [],
        validationMessage: 'Suffering from being missing'
      });
    });

    test('all', () => {
      const fieldFeedbacks = createFieldFeedbacks(
        <FieldFeedbacks for="username" show="all">
          <FieldFeedback when="*">0</FieldFeedback>
          <FieldFeedback when="*">1</FieldFeedback>
        </FieldFeedbacks>
      );

      const input = new FakeInput('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
      form.emitInputChangeOrFormSubmitEvent(input);

      expect(fieldFeedbacks.state()).toEqual({
        dirty: true,
        errors: [0, 1],
        warnings: [],
        infos: [],
        validationMessage: 'Suffering from being missing'
      });
    });
  });

  describe('FieldFeedback error prop', () => {
    test('specify error prop', () => {
      const fieldFeedbacks = createFieldFeedbacks(
        <FieldFeedbacks for="username" show="all">
          <FieldFeedback when="valueMissing" error>0</FieldFeedback>
          <FieldFeedback when={value => value.length === 0}>1</FieldFeedback>
        </FieldFeedbacks>
      );

      const input = new FakeInput('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
      form.emitInputChangeOrFormSubmitEvent(input);

      expect(fieldFeedbacks.state()).toEqual({
        dirty: true,
        errors: [0, 1],
        warnings: [],
        infos: [],
        validationMessage: 'Suffering from being missing'
      });
    });
  });

  describe('FieldFeedback warning prop', () => {
    test('first error matching', () => {
      const fieldFeedbacks = createFieldFeedbacks(
        <FieldFeedbacks for="username" show="all">
          <FieldFeedback when="valueMissing">0</FieldFeedback>
          <FieldFeedback when={value => value.length === 0} warning>1</FieldFeedback>
        </FieldFeedbacks>
      );

      const input = new FakeInput('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
      form.emitInputChangeOrFormSubmitEvent(input);

      expect(fieldFeedbacks.state()).toEqual({
        dirty: true,
        errors: [0],
        warnings: [],
        infos: [],
        validationMessage: 'Suffering from being missing'
      });
    });

    test('first warning matching', () => {
      const fieldFeedbacks = createFieldFeedbacks(
        <FieldFeedbacks for="password" show="first">
          <FieldFeedback when="valueMissing">0</FieldFeedback>
          <FieldFeedback when="patternMismatch">1</FieldFeedback>
          <FieldFeedback when={value => !/\d/.test(value)} warning>2 Should contain numbers</FieldFeedback>
          <FieldFeedback when={value => !/[a-z]/.test(value)} warning>3 Should contain small letters</FieldFeedback>
          <FieldFeedback when={value => !/[A-Z]/.test(value)} warning>4 Should contain capital letters</FieldFeedback>
          <FieldFeedback when={value => !/\W/.test(value)} warning>5 Should contain special characters</FieldFeedback>
        </FieldFeedbacks>
      );

      const input = new FakeInput('password', '12345', {valid: true}, '');
      form.emitInputChangeOrFormSubmitEvent(input);

      expect(fieldFeedbacks.state()).toEqual({
        dirty: true,
        errors: [],
        warnings: [3],
        infos: [],
        validationMessage: ''
      });
    });

    test('multiple warning matching', () => {
      const fieldFeedbacks = createFieldFeedbacks(
        <FieldFeedbacks for="password" show="all">
          <FieldFeedback when="valueMissing">0</FieldFeedback>
          <FieldFeedback when="patternMismatch">1</FieldFeedback>
          <FieldFeedback when={value => !/\d/.test(value)} warning>2 Should contain numbers</FieldFeedback>
          <FieldFeedback when={value => !/[a-z]/.test(value)} warning>3 Should contain small letters</FieldFeedback>
          <FieldFeedback when={value => !/[A-Z]/.test(value)} warning>4 Should contain capital letters</FieldFeedback>
          <FieldFeedback when={value => !/\W/.test(value)} warning>5 Should contain special characters</FieldFeedback>
        </FieldFeedbacks>
      );

      const input = new FakeInput('password', '12345', {valid: true}, '');
      form.emitInputChangeOrFormSubmitEvent(input);

      expect(fieldFeedbacks.state()).toEqual({
        dirty: true,
        errors: [],
        warnings: [3, 4, 5],
        infos: [],
        validationMessage: ''
      });
    });
  });

  describe('FieldFeedback info prop', () => {
    test('always display infos matching', () => {
      const fieldFeedbacks = createFieldFeedbacks(
        <FieldFeedbacks for="username" show="all">
          <FieldFeedback when="valueMissing">0</FieldFeedback>
          <FieldFeedback when={value => true} info>1</FieldFeedback>
          <FieldFeedback when={value => false} info>2</FieldFeedback>
        </FieldFeedbacks>
      );

      const input = new FakeInput('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
      form.emitInputChangeOrFormSubmitEvent(input);

      expect(fieldFeedbacks.state()).toEqual({
        dirty: true,
        errors: [0],
        warnings: [],
        infos: [1],
        validationMessage: 'Suffering from being missing'
      });
    });
  });
});
