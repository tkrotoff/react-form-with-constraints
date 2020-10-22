import * as React from 'react';
import {
  /*TextField, FormControl,*/
  createMuiTheme,
  FormHelperText,
  Input
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import { checkUsernameAvailability } from '../../react-form-with-constraints/src/checkUsernameAvailability';
import { FieldFeedbacksEnzymeFix as FieldFeedbacks } from './FieldFeedbacksEnzymeFix';
import { Async, FieldFeedback, FormControl, FormWithConstraints, TextField } from './index';

const defaultTheme = createMuiTheme({});

export class SignUp extends React.Component {
  form: FormWithConstraints | null = null;
  username: HTMLInputElement | null = null;
  password: HTMLInputElement | null = null;
  passwordConfirm: HTMLInputElement | null = null;

  render() {
    return (
      // Without MuiThemeProvider we get:
      //
      // Warning: Material-UI: you are providing a theme function property to the MuiThemeProvider component:
      // <MuiThemeProvider theme={outerTheme => outerTheme} />
      // However, no outer theme is present.
      // Make sure a theme is already injected higher in the React tree or provide a theme object.
      <ThemeProvider theme={defaultTheme}>
        <FormWithConstraints ref={formWithConstraints => (this.form = formWithConstraints)}>
          <TextField
            name="username"
            inputRef={username => (this.username = username)}
            helperText={
              <FieldFeedbacks for="username">
                <FieldFeedback when={value => value.length === 0}>Cannot be empty</FieldFeedback>
                <FieldFeedback when={value => value.length < 3}>
                  Should be at least 3 characters long
                </FieldFeedback>
                <Async
                  promise={checkUsernameAvailability}
                  pending={<span style={{ display: 'block' }}>...</span>}
                  then={availability =>
                    availability.available ? (
                      <FieldFeedback key="1" info>
                        Username '{availability.value}' available
                      </FieldFeedback>
                    ) : (
                      <FieldFeedback key="2">
                        Username '{availability.value}' already taken, choose another
                      </FieldFeedback>
                    )
                  }
                  catch={e => <FieldFeedback>{e.message}</FieldFeedback>}
                />
                <FieldFeedback when="valid">Looks good!</FieldFeedback>
              </FieldFeedbacks>
            }
          />

          {/* Could be also written using <TextField> */}
          <FormControl>
            <Input
              type="password"
              id="password"
              name="password"
              inputRef={password => (this.password = password)}
            />
            <FormHelperText>
              <FieldFeedbacks for="password">
                <FieldFeedback when={value => value.length === 0}>Cannot be empty</FieldFeedback>
                <FieldFeedback when={value => value.length < 5}>
                  Should be at least 5 characters long
                </FieldFeedback>
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
            </FormHelperText>
          </FormControl>

          <TextField
            type="password"
            name="passwordConfirm"
            inputRef={passwordConfirm => (this.passwordConfirm = passwordConfirm)}
            helperText={
              <FieldFeedbacks for="passwordConfirm">
                <FieldFeedback when={value => value !== this.password!.value}>
                  Not the same password
                </FieldFeedback>
                <FieldFeedback when="valid">Looks good!</FieldFeedback>
              </FieldFeedbacks>
            }
          />
        </FormWithConstraints>
      </ThemeProvider>
    );
  }
}
