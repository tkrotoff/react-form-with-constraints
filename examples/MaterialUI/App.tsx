import { useRef, useState } from 'react';
import {
  Button,
  createStyles,
  createTheme,
  CssBaseline,
  FormControlLabel,
  /*TextField, FormControl,*/
  FormHelperText,
  Input,
  InputLabel,
  Switch,
  Theme,
  WithStyles,
  withStyles
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { isEqual } from 'lodash-es';
import { render } from 'react-dom';
import {
  Async,
  FieldFeedback,
  FieldFeedbacks,
  FormControl,
  FormWithConstraints,
  TextField
} from 'react-form-with-constraints-material-ui';
import { DisplayFields } from 'react-form-with-constraints-tools';

import './index.html';

function wait(ms: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
}

async function checkUsernameAvailability(value: string) {
  console.info('checkUsernameAvailability');
  await wait(1000);
  return !['john', 'paul', 'george', 'ringo'].includes(value.toLowerCase());
}

function styles(theme: Theme) {
  return createStyles({
    button: {
      marginTop: theme.spacing(),
      marginRight: theme.spacing()
    }
  });
}

type FormProps = WithStyles<typeof styles>;

interface InputsState {
  username: string;
  password: string;
  passwordConfirm: string;
}

function getInitialInputsState() {
  return {
    username: '',
    password: '',
    passwordConfirm: ''
  };
}

function Form({ classes }: FormProps) {
  const form = useRef<FormWithConstraints>(null);
  const password = useRef<HTMLInputElement>(null);

  const [inputs, setInputs] = useState<InputsState>(getInitialInputsState());
  const [signUpButtonDisabled, setSignUpButtonDisabled] = useState(false);
  const [resetButtonDisabled, setResetButtonDisabled] = useState(true);

  function shouldDisableResetButton(state: InputsState) {
    return isEqual(getInitialInputsState(), state) && !form.current!.hasFeedbacks();
  }

  async function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    setInputs(prevState => {
      return { ...prevState, [target.name]: target.value };
    });

    await form.current!.validateFields(target);

    setSignUpButtonDisabled(!form.current!.isValid());
    setResetButtonDisabled(shouldDisableResetButton(inputs));
  }

  async function handlePasswordChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    setInputs(prevState => {
      return { ...prevState, [target.name]: target.value };
    });

    await form.current!.validateFields(target, 'passwordConfirm');

    setSignUpButtonDisabled(!form.current!.isValid());
    setResetButtonDisabled(shouldDisableResetButton(inputs));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await form.current!.validateForm();
    const formIsValid = form.current!.isValid();

    setSignUpButtonDisabled(!form.current!.isValid());
    setResetButtonDisabled(shouldDisableResetButton(inputs));

    if (formIsValid) {
      alert(`Valid form\n\ninputs =\n${JSON.stringify(inputs, null, 2)}`);
    }
  }

  function handleReset() {
    setInputs(getInitialInputsState());
    form.current!.resetFields();
    setSignUpButtonDisabled(false);
    setResetButtonDisabled(true);
  }

  return (
    <FormWithConstraints ref={form} onSubmit={handleSubmit} noValidate>
      <TextField
        name="username"
        label={
          <>
            Username <small>(already taken: john, paul, george, ringo)</small>
          </>
        }
        value={inputs.username}
        onChange={handleChange}
        fullWidth
        margin="dense"
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
              pending={<span style={{ display: 'block' }}>...</span>}
              then={available =>
                available ? (
                  <FieldFeedback key="1" info style={{ color: 'green' }}>
                    Username available
                  </FieldFeedback>
                ) : (
                  <FieldFeedback key="2">Username already taken, choose another</FieldFeedback>
                )
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
          type="password"
          id="password"
          name="password"
          inputRef={password}
          value={inputs.password}
          onChange={handlePasswordChange}
          inputProps={{
            required: true,
            pattern: '.{5,}'
          }}
        />
        <FormHelperText>
          <FieldFeedbacks for="password">
            <FieldFeedback when="valueMissing" />
            <FieldFeedback when="patternMismatch">
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
        label="Confirm Password"
        value={inputs.passwordConfirm}
        onChange={handleChange}
        fullWidth
        margin="dense"
        helperText={
          <FieldFeedbacks for="passwordConfirm">
            <FieldFeedback when={value => value !== password.current!.value}>
              Not the same password
            </FieldFeedback>
          </FieldFeedbacks>
        }
      />

      <Button
        type="submit"
        disabled={signUpButtonDisabled}
        color="primary"
        className={classes.button}
      >
        Sign Up
      </Button>
      <Button onClick={handleReset} disabled={resetButtonDisabled} className={classes.button}>
        Reset
      </Button>

      <pre>
        <small>
          Fields = <DisplayFields />
        </small>
      </pre>
    </FormWithConstraints>
  );
}

const lightTheme = createTheme({
  palette: {
    type: 'light'
  }
});

const darkTheme = createTheme({
  palette: {
    type: 'dark'
  }
});

const App = withStyles(styles)(Form);

function AppWithTheme() {
  const [isDarkTheme, setDarkTheme] = useState(false);

  function handleChange(_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    setDarkTheme(checked);
  }

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <FormControlLabel
        control={<Switch checked={isDarkTheme} onChange={handleChange} />}
        label="Dark theme"
      />
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

render(
  <main style={{ margin: 8 }}>
    <AppWithTheme />
  </main>,
  document.getElementById('app')
);
