import React from 'react';

import { FormWithConstraints, FieldFeedbacks, FieldFeedback, Async } from './index';

import checkUsernameAvailability from '../../react-form-with-constraints/src/checkUsernameAvailability';

export interface SignUpProps {
}

export class SignUp extends React.Component<SignUpProps> {
  form: FormWithConstraints | null = null;
  username: HTMLInputElement | null = null;
  password: HTMLInputElement | null = null;
  passwordConfirm: HTMLInputElement | null = null;

  render() {
    return (
      <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}>
        <input name="username" ref={username => this.username = username} />
        <FieldFeedbacks for="username">
          <FieldFeedback when={value => value.length === 0}>Cannot be empty</FieldFeedback>
          <FieldFeedback when={value => value.length < 3}>Should be at least 3 characters long</FieldFeedback>
          <Async
            promise={checkUsernameAvailability}
            pending={<span style={{display: 'block'}}>...</span>}
            then={availability => availability.available ?
              <FieldFeedback key="1" info>Username '{availability.value}' available</FieldFeedback> :
              <FieldFeedback key="2">Username '{availability.value}' already taken, choose another</FieldFeedback>
            }
            catch={e => <FieldFeedback>{e.message}</FieldFeedback>}
          />
          <FieldFeedback when="valid">Looks good!</FieldFeedback>
        </FieldFeedbacks>

        <input type="password" name="password" ref={password => this.password = password} />
        <FieldFeedbacks for="password">
          <FieldFeedback when={value => value.length === 0}>Cannot be empty</FieldFeedback>
          <FieldFeedback when={value => value.length < 5}>Should be at least 5 characters long</FieldFeedback>
          <FieldFeedback when={value => !/\d/.test(value)} warning>Should contain numbers</FieldFeedback>
          <FieldFeedback when={value => !/[a-z]/.test(value)} warning>Should contain small letters</FieldFeedback>
          <FieldFeedback when={value => !/[A-Z]/.test(value)} warning>Should contain capital letters</FieldFeedback>
          <FieldFeedback when={value => !/\W/.test(value)} warning>Should contain special characters</FieldFeedback>
          <FieldFeedback when="valid">Looks good!</FieldFeedback>
        </FieldFeedbacks>

        <input type="password" name="passwordConfirm" ref={passwordConfirm => this.passwordConfirm = passwordConfirm} />
        <FieldFeedbacks for="passwordConfirm">
          <FieldFeedback when={value => value !== this.password!.value}>Not the same password</FieldFeedback>
          <FieldFeedback when="valid">Looks good!</FieldFeedback>
        </FieldFeedbacks>
      </FormWithConstraints>
    );
  }
}
