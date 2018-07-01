import React from 'react';

import {
  Input, InputLabel, FormHelperText
  /*TextField, FormControl,*/
} from '@material-ui/core';

import {
  FormWithConstraints, Async, FieldFeedback,
  TextField, FormControl
} from './index';
import checkUsernameAvailability from '../../react-form-with-constraints/src/checkUsernameAvailability';
import FieldFeedbacks from '../../react-form-with-constraints/src/FieldFeedbacksEnzymeFix';

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
        <TextField
          name="username" inputRef={username => this.username = username}
          helperText={
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
          }
        />

        {/* Could be also written using <TextField> */}
        <FormControl>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            type="password" id="password" name="password"
            inputRef={password => this.password = password}
          />
          <FormHelperText>
            <FieldFeedbacks for="password">
              <FieldFeedback when={value => value.length === 0}>Cannot be empty</FieldFeedback>
              <FieldFeedback when={value => value.length < 5}>Should be at least 5 characters long</FieldFeedback>
              <FieldFeedback when={value => !/\d/.test(value)} warning>Should contain numbers</FieldFeedback>
              <FieldFeedback when={value => !/[a-z]/.test(value)} warning>Should contain small letters</FieldFeedback>
              <FieldFeedback when={value => !/[A-Z]/.test(value)} warning>Should contain capital letters</FieldFeedback>
              <FieldFeedback when={value => !/\W/.test(value)} warning>Should contain special characters</FieldFeedback>
              <FieldFeedback when="valid">Looks good!</FieldFeedback>
            </FieldFeedbacks>
          </FormHelperText>
        </FormControl>

        <TextField
          type="password" name="passwordConfirm" inputRef={passwordConfirm => this.passwordConfirm = passwordConfirm}
          helperText={
            <FieldFeedbacks for="passwordConfirm">
              <FieldFeedback when={value => value !== this.password!.value}>Not the same password</FieldFeedback>
              <FieldFeedback when="valid">Looks good!</FieldFeedback>
            </FieldFeedbacks>
          }
        />
      </FormWithConstraints>
    );
  }
}
