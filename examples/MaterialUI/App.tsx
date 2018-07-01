import React from 'react';
import ReactDOM from 'react-dom';
import { isEqual, omit } from 'lodash';

import {
  Input, InputLabel, FormHelperText,
  /*TextField, FormControl,*/
  Button,
  Theme, withStyles, WithStyles
} from '@material-ui/core';

import {
  FormWithConstraints, FieldFeedbacks, Async, FieldFeedback,
  TextField, FormControl
} from 'react-form-with-constraints-material-ui';
import { DisplayFields } from 'react-form-with-constraints-tools';

import './index.html';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const checkUsernameAvailability = async (value: string) => {
  console.log('checkUsernameAvailability');
  await sleep(1000);
  return !['john', 'paul', 'george', 'ringo'].includes(value.toLowerCase());
};

const styles = (theme: Theme) => ({
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

interface Props {}
type PropsWithStyles = Props & WithStyles<'button'>;

interface State {
  username: string;
  password: string;
  passwordConfirm: string;
  signUpButtonDisabled: boolean;
  resetButtonDisabled: boolean;
}

class Form extends React.Component<PropsWithStyles, State> {
  state = this.getInitialState();

  form: FormWithConstraints | null = null;
  password: HTMLInputElement | null = null;

  private getInitialState() {
    return {
      username: '',
      password: '',
      passwordConfirm: '',
      signUpButtonDisabled: false,
      resetButtonDisabled: true
    };
  }

  private shouldDisableResetButton(state: State) {
    const omitList = ['signUpButtonDisabled', 'resetButtonDisabled'];
    return isEqual(omit(this.getInitialState(), omitList), omit(state, omitList)) && !this.form!.hasFeedbacks();
  }

  handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;

    // FIXME See Computed property key names should not be widened https://github.com/Microsoft/TypeScript/issues/13948
    // @ts-ignore
    this.setState({
      [target.name as keyof State]: target.value
    });

    console.log(target.name, target.value);

    await this.form!.validateFields(target);

    this.setState(prevState => ({
      signUpButtonDisabled: !this.form!.isValid(),
      resetButtonDisabled: this.shouldDisableResetButton(prevState)
    }));
  }

  handlePasswordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;

    // FIXME See Computed property key names should not be widened https://github.com/Microsoft/TypeScript/issues/13948
    // @ts-ignore
    this.setState({
      [target.name as keyof State]: target.value
    });

    console.log(target.name, target.value);

    await this.form!.validateFields(target, 'passwordConfirm');

    this.setState(prevState => ({
      signUpButtonDisabled: !this.form!.isValid(),
      resetButtonDisabled: this.shouldDisableResetButton(prevState)
    }));
  }

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await this.form!.validateForm();
    const formIsValid = this.form!.isValid();

    this.setState(prevState => ({
      signUpButtonDisabled: !formIsValid,
      resetButtonDisabled: this.shouldDisableResetButton(prevState)
    }));

    if (formIsValid) {
      alert(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
    }
  }

  handleReset = () => {
    this.setState(this.getInitialState());
    this.form!.reset();
    this.setState({resetButtonDisabled: true});
  }

  render() {
    const { classes } = this.props;
    const { username, password, passwordConfirm, signUpButtonDisabled, resetButtonDisabled } = this.state;

    return (
      <FormWithConstraints
        ref={formWithConstraints => this.form = formWithConstraints}
        onSubmit={this.handleSubmit} noValidate
      >
        <TextField
          name="username" label={<>Username <small>(already taken: john, paul, george, ringo)</small></>}
          value={username} onChange={this.handleChange}
          fullWidth margin="dense"
          inputProps={{
            required: true,
            minLength: 3
          }}
          helperText={
            <FieldFeedbacks for="username">
              <FieldFeedback when="tooShort">Too short</FieldFeedback>
              <FieldFeedback when="*" />
              <Async
                promise={checkUsernameAvailability}
                pending={<span style={{display: 'block'}}>...</span>}
                then={available => available ?
                  <FieldFeedback key="1" info style={{color: 'green'}}>Username available</FieldFeedback> :
                  <FieldFeedback key="2">Username already taken, choose another</FieldFeedback>
                }
              />
              <FieldFeedback when="valid">Looks good!</FieldFeedback>
            </FieldFeedbacks>
          }
        />

        {/* Could be also written using <TextField> */}
        <FormControl fullWidth margin="dense">
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            type="password" id="password" name="password"
            inputRef={_password => this.password = _password}
            value={password} onChange={this.handlePasswordChange}
            inputProps={{
              required: true,
              pattern: '.{5,}'
            }}
          />
          <FormHelperText>
            <FieldFeedbacks for="password">
              <FieldFeedback when="valueMissing" />
              <FieldFeedback when="patternMismatch">Should be at least 5 characters long</FieldFeedback>
              <FieldFeedback when={value => !/\d/.test(value)} warning>Should contain numbers</FieldFeedback>
              <FieldFeedback when={value => !/[a-z]/.test(value)} warning>Should contain small letters</FieldFeedback>
              <FieldFeedback when={value => !/[A-Z]/.test(value)} warning>Should contain capital letters</FieldFeedback>
              <FieldFeedback when={value => !/\W/.test(value)} warning>Should contain special characters</FieldFeedback>
              <FieldFeedback when="valid">Looks good!</FieldFeedback>
            </FieldFeedbacks>
          </FormHelperText>
        </FormControl>

        <TextField
          type="password" name="passwordConfirm" label="Confirm Password"
          value={passwordConfirm} onChange={this.handleChange}
          fullWidth margin="dense"
          helperText={
            <FieldFeedbacks for="passwordConfirm">
              <FieldFeedback when={value => value !== this.password!.value}>Not the same password</FieldFeedback>
            </FieldFeedbacks>
          }
        />

        <Button
          type="submit" disabled={signUpButtonDisabled}
          color="primary" variant="raised" className={classes.button}
        >
          Sign Up
        </Button>
        <Button onClick={this.handleReset} disabled={resetButtonDisabled} variant="raised" className={classes.button}>Reset</Button>

        <DisplayFields />
      </FormWithConstraints>
    );
  }
}

const App = withStyles(styles)<Props>(Form);

ReactDOM.render(<App />, document.getElementById('app'));
