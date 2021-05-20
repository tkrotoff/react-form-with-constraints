import React, { useRef, useState } from 'react';
import {
  Async,
  FieldFeedback,
  FieldFeedbacks,
  FormWithConstraints
} from 'react-form-with-constraints';
import { DisplayFields } from 'react-form-with-constraints-tools';

// Copy-pasted from Password/App.tsx example

function wait(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

// https://en.wikipedia.org/wiki/List_of_the_most_common_passwords
async function isACommonPassword(password: string) {
  console.log('isACommonPassword');
  await wait(1000);
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
}

function Form() {
  const form = useRef<FormWithConstraints>(null);
  const password = useRef<HTMLInputElement>(null);

  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [signUpButtonDisabled, setSignUpButtonDisabled] = useState(false);

  async function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    setInputs(prevState => {
      return { ...prevState, [target.name]: target.value };
    });

    // Validates only the given field and returns the related FieldValidation structures
    const fields = await form.current!.validateFields(target);

    const fieldIsValid = fields.every(fieldFeedbacksValidation =>
      fieldFeedbacksValidation.isValid()
    );
    if (fieldIsValid) console.log(`Field '${target.name}' is valid`);
    else console.log(`Field '${target.name}' is invalid`);

    if (form.current!.isValid()) console.log('The form is valid');
    else console.log('The form is invalid');

    setSignUpButtonDisabled(!form.current!.isValid());
  }

  async function handlePasswordChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    setInputs(prevState => {
      return { ...prevState, [target.name]: target.value };
    });

    const fields = await form.current!.validateFields(target, 'passwordConfirm');

    const fieldsAreValid = fields.every(field => field.isValid());
    if (fieldsAreValid) console.log(`Fields '${target.name}' and 'passwordConfirm' are valid`);
    else console.log(`Fields '${target.name}' and/or 'passwordConfirm' are invalid`);

    if (form.current!.isValid()) console.log('The form is valid');
    else console.log('The form is invalid');

    setSignUpButtonDisabled(!form.current!.isValid());
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validates the non-dirty fields and returns the related FieldValidation structures
    const fields = await form.current!.validateForm();

    // or simply use form.current.isValid()
    const formIsValid = fields.every(field => field.isValid());

    if (formIsValid) console.log('The form is valid');
    else console.log('The form is invalid');

    setSignUpButtonDisabled(!form.current!.isValid());
    if (formIsValid) {
      alert(`Valid form\n\ninputs =\n${JSON.stringify(inputs, null, 2)}`);
    }
  }

  return (
    <FormWithConstraints ref={form} onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={inputs.email}
          onChange={handleChange}
          required
          minLength={5}
        />
        <FieldFeedbacks for="email">
          <FieldFeedback when="tooShort">Too short</FieldFeedback>
          <FieldFeedback when="*" />
          <FieldFeedback when="valid">Looks good!</FieldFeedback>
        </FieldFeedbacks>
      </div>

      <div>
        <label htmlFor="password">
          Password <small>(common passwords: 123456, password, 12345678, qwerty...)</small>
        </label>
        <input
          type="password"
          name="password"
          id="password"
          ref={password}
          value={inputs.password}
          onChange={handlePasswordChange}
          required
          pattern=".{5,}"
        />
        <FieldFeedbacks for="password">
          <FieldFeedback when="valueMissing" />
          <FieldFeedback when="patternMismatch">Should be at least 5 characters long</FieldFeedback>
          <FieldFeedback when={value => !/\d/.test(value)} warning>
            Should contain numbers
          </FieldFeedback>
          <FieldFeedback when={value => !/[a-z]/.test(value)} warning>
            Should contain small letters
          </FieldFeedback>
          <FieldFeedback when={value => !/[A-Z]/.test(value)} warning>
            Should contain capital letters
          </FieldFeedback>
          <FieldFeedback when={value => !/\W/.test(value)} warning>
            Should contain special characters
          </FieldFeedback>
          <Async
            promise={isACommonPassword}
            pending={<span style={{ display: 'block' }}>...</span>}
            then={commonPassword =>
              commonPassword ? (
                <FieldFeedback warning>This password is very common</FieldFeedback>
              ) : null
            }
          />
          <FieldFeedback when="valid">Looks good!</FieldFeedback>
        </FieldFeedbacks>
      </div>

      <div>
        <label htmlFor="password-confirm">Confirm Password</label>
        <input
          type="password"
          name="passwordConfirm"
          id="password-confirm"
          value={inputs.passwordConfirm}
          onChange={handleChange}
        />
        <FieldFeedbacks for="passwordConfirm">
          <FieldFeedback when={value => value !== password.current!.value}>
            Not the same password
          </FieldFeedback>
        </FieldFeedbacks>
      </div>

      <button type="submit" disabled={signUpButtonDisabled}>
        Sign Up
      </button>

      <pre>
        <small>
          Fields = <DisplayFields />
        </small>
      </pre>
    </FormWithConstraints>
  );
}

export function App() {
  return <Form />;
}
