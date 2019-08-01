import React, { useRef } from 'react';
import ReactDOM from 'react-dom';

import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';

import './index.html';
import './style.css';

function Form() {
  const form = useRef<FormWithConstraints | null>(null);
  const password = useRef<HTMLInputElement | null>(null);

  function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    form.current!.validateFields(target);
  }

  async function handlePasswordChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    form.current!.validateFields(target, 'passwordConfirm');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await form.current!.validateFields();
    if (form.current!.isValid()) {
      alert('Valid form');
    } else {
      alert('Invalid form');
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
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          ref={password}
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
          <FieldFeedback when="valid">Looks good!</FieldFeedback>
        </FieldFeedbacks>
      </div>

      <div>
        <label htmlFor="password-confirm">Confirm Password</label>
        <input
          type="password"
          name="passwordConfirm"
          id="password-confirm"
          onChange={handleChange}
        />
        <FieldFeedbacks for="passwordConfirm">
          <FieldFeedback when={value => value !== password.current!.value}>
            Not the same password
          </FieldFeedback>
        </FieldFeedbacks>
      </div>

      <button type="submit">Sign Up</button>
    </FormWithConstraints>
  );
}

ReactDOM.render(<Form />, document.getElementById('app'));
