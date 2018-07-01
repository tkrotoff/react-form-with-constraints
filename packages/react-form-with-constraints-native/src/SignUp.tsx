import React from 'react';

import { FormWithConstraints, Async, FieldFeedback, TextInput } from './index';
import checkUsernameAvailability from '../../react-form-with-constraints/src/checkUsernameAvailability';
import FieldFeedbacks from './FieldFeedbacksEnzymeFix';

export interface SignUpProps {
}

export interface SignUpState {
  username: string;
  password: string;
  passwordConfirm: string;
}

export class SignUp extends React.Component<SignUpProps, SignUpState> {
  form: FormWithConstraints | null = null;
  username: TextInput | null = null;
  password: TextInput | null = null;
  passwordConfirm: TextInput | null = null;

  constructor(props: SignUpProps) {
    super(props);

    this.state = {
      username: '',
      password: '',
      passwordConfirm: ''
    };
  }

  render() {
    const { username, password, passwordConfirm } = this.state;

    return (
      <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}>
        <TextInput name="username" ref={_username => this.username = _username} value={username} />
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

        <TextInput secureTextEntry name="password" ref={_password => this.password = _password} value={password} />
        <FieldFeedbacks for="password">
          <FieldFeedback when={value => value.length === 0}>Cannot be empty</FieldFeedback>
          <FieldFeedback when={value => value.length < 5}>Should be at least 5 characters long</FieldFeedback>
          <FieldFeedback when={value => !/\d/.test(value)} warning>Should contain numbers</FieldFeedback>
          <FieldFeedback when={value => !/[a-z]/.test(value)} warning>Should contain small letters</FieldFeedback>
          <FieldFeedback when={value => !/[A-Z]/.test(value)} warning>Should contain capital letters</FieldFeedback>
          <FieldFeedback when={value => !/\W/.test(value)} warning>Should contain special characters</FieldFeedback>
          <FieldFeedback when="valid">Looks good!</FieldFeedback>
        </FieldFeedbacks>

        <TextInput secureTextEntry name="passwordConfirm" ref={_passwordConfirm => this.passwordConfirm = _passwordConfirm} value={passwordConfirm} />
        <FieldFeedbacks for="passwordConfirm">
          <FieldFeedback when={value => value !== password}>Not the same password</FieldFeedback>
          <FieldFeedback when="valid">Looks good!</FieldFeedback>
        </FieldFeedbacks>
      </FormWithConstraints>
    );
  }
}
