import React from 'react';
import ReactDOM from 'react-dom';

import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';

import './index.html';
import '../Password/style.css';

class Form extends React.Component {
  form: FormWithConstraints | null = null;
  password: HTMLInputElement | null = null;

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    this.form!.validateFields(target);
  }

  handlePasswordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    this.form!.validateFields(target, 'passwordConfirm');
  }

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await this.form!.validateFields();
    if (this.form!.isValid()) {
      alert('Valid form');
    } else {
      alert('Invalid form');
    }
  }

  render() {
    return (
      <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}
                           onSubmit={this.handleSubmit} noValidate>
        <div>
          <label htmlFor="username">Username</label>
          <input type="email" name="username" id="username"
                 onChange={this.handleChange}
                 required minLength={5} />
          <FieldFeedbacks for="username">
            <FieldFeedback when="tooShort">Too short</FieldFeedback>
            <FieldFeedback when="*" />
            <FieldFeedback when="valid">Looks good!</FieldFeedback>
          </FieldFeedbacks>
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password"
                 ref={password => this.password = password}
                 onChange={this.handlePasswordChange}
                 required pattern=".{5,}" />
          <FieldFeedbacks for="password">
            <FieldFeedback when="valueMissing" />
            <FieldFeedback when="patternMismatch">Should be at least 5 characters long</FieldFeedback>
            <FieldFeedback when={value => !/\d/.test(value)} warning>Should contain numbers</FieldFeedback>
            <FieldFeedback when={value => !/[a-z]/.test(value)} warning>Should contain small letters</FieldFeedback>
            <FieldFeedback when={value => !/[A-Z]/.test(value)} warning>Should contain capital letters</FieldFeedback>
            <FieldFeedback when={value => !/\W/.test(value)} warning>Should contain special characters</FieldFeedback>
            <FieldFeedback when="valid">Looks good!</FieldFeedback>
          </FieldFeedbacks>
        </div>

        <div>
          <label htmlFor="password-confirm">Confirm Password</label>
          <input type="password" name="passwordConfirm" id="password-confirm"
                 onChange={this.handleChange} />
          <FieldFeedbacks for="passwordConfirm">
            <FieldFeedback when={value => value !== this.password!.value}>Not the same password</FieldFeedback>
          </FieldFeedbacks>
        </div>

        <button>Sign Up</button>
      </FormWithConstraints>
    );
  }
}

ReactDOM.render(<Form />, document.getElementById('app'));
