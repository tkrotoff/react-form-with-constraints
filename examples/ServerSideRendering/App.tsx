import React from 'react';

import { FormWithConstraints, FieldFeedbacks, Async, FieldFeedback } from 'react-form-with-constraints';
import { DisplayFields } from 'react-form-with-constraints-tools';

// Copy-pasted from Password/App.tsx example

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// See https://en.wikipedia.org/wiki/List_of_the_most_common_passwords
const isACommonPassword = async (password: string) => {
  console.log('checkPasswordHasBeenUsed');
  await sleep(1000);
  return [
    '123456',
    'password',
    '12345678',
    'qwerty',
    '12345',
    '123456789',
    'letmein',
    '1234567',
    'football',
    'iloveyou',
    'admin',
    'welcome',
    'monkey',
    'login',
    'abc123'
  ].includes(password.toLowerCase());
};

interface Props {}

interface State {
  username: string;
  password: string;
  passwordConfirm: string;
  signUpButtonDisabled: boolean;
}

class Form extends React.Component<Props, State> {
  form: FormWithConstraints | null = null;
  password: HTMLInputElement | null = null;

  state: State = {
    username: '',
    password: '',
    passwordConfirm: '',
    signUpButtonDisabled: false
  };

  handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;

    // FIXME See Computed property key names should not be widened https://github.com/Microsoft/TypeScript/issues/13948
    // @ts-ignore
    this.setState({
      [target.name as keyof State]: target.value
    });

    // Validates only the given field and returns the related FieldValidation structures
    const fields = await this.form!.validateFields(target);

    const fieldIsValid = fields.every(fieldFeedbacksValidation => fieldFeedbacksValidation.isValid());
    if (fieldIsValid) console.log(`Field '${target.name}' is valid`);
    else console.log(`Field '${target.name}' is invalid`);

    if (this.form!.isValid()) console.log('The form is valid');
    else console.log('The form is invalid');

    this.setState({signUpButtonDisabled: !this.form!.isValid()});
  }

  handlePasswordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;

    // FIXME See Computed property key names should not be widened https://github.com/Microsoft/TypeScript/issues/13948
    // @ts-ignore
    this.setState({
      [target.name as keyof State]: target.value
    });

    const fields = await this.form!.validateFields(target, 'passwordConfirm');

    const fieldsAreValid = fields.every(field => field.isValid());
    if (fieldsAreValid) console.log(`Fields '${target.name}' and 'passwordConfirm' are valid`);
    else console.log(`Fields '${target.name}' and/or 'passwordConfirm' are invalid`);

    if (this.form!.isValid()) console.log('The form is valid');
    else console.log('The form is invalid');

    this.setState({signUpButtonDisabled: !this.form!.isValid()});
  }

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validates the non-dirty fields and returns the related FieldValidation structures
    const fields = await this.form!.validateForm();

    // or simply this.form.isValid();
    const formIsValid = fields.every(field => field.isValid());

    if (formIsValid) console.log('The form is valid');
    else console.log('The form is invalid');

    this.setState({signUpButtonDisabled: !formIsValid});
    if (formIsValid) {
      alert(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
    }
  }

  render() {
    return (
      <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}
                           onSubmit={this.handleSubmit} noValidate>
        <div>
          <label htmlFor="username">Username</label>
          <input type="email" name="username" id="username"
                 value={this.state.username} onChange={this.handleChange}
                 required minLength={5} />
          <FieldFeedbacks for="username">
            <FieldFeedback when="tooShort">Too short</FieldFeedback>
            <FieldFeedback when="*" />
            <FieldFeedback when="valid">Looks good!</FieldFeedback>
          </FieldFeedbacks>
        </div>

        <div>
          <label htmlFor="password">Password <small>(common passwords: 123456, password, 12345678, qwerty...)</small></label>
          <input type="password" name="password" id="password"
                 ref={password => this.password = password}
                 value={this.state.password} onChange={this.handlePasswordChange}
                 required pattern=".{5,}" />
          <FieldFeedbacks for="password">
            <FieldFeedback when="valueMissing" />
            <FieldFeedback when="patternMismatch">Should be at least 5 characters long</FieldFeedback>
            <FieldFeedback when={value => !/\d/.test(value)} warning>Should contain numbers</FieldFeedback>
            <FieldFeedback when={value => !/[a-z]/.test(value)} warning>Should contain small letters</FieldFeedback>
            <FieldFeedback when={value => !/[A-Z]/.test(value)} warning>Should contain capital letters</FieldFeedback>
            <FieldFeedback when={value => !/\W/.test(value)} warning>Should contain special characters</FieldFeedback>
            <Async
              promise={isACommonPassword}
              pending="..."
              then={commonPassword => commonPassword ?
                <FieldFeedback warning>This password is very common</FieldFeedback> : null
              }
            />
            <FieldFeedback when="valid">Looks good!</FieldFeedback>
          </FieldFeedbacks>
        </div>

        <div>
          <label htmlFor="password-confirm">Confirm Password</label>
          <input type="password" name="passwordConfirm" id="password-confirm"
                 value={this.state.passwordConfirm} onChange={this.handleChange} />
          <FieldFeedbacks for="passwordConfirm">
            <FieldFeedback when={value => value !== this.password!.value}>Not the same password</FieldFeedback>
          </FieldFeedbacks>
        </div>

        <button disabled={this.state.signUpButtonDisabled}>Sign Up</button>

        <DisplayFields />
      </FormWithConstraints>
    );
  }
}

const App = () => <Form />;

export default App;
