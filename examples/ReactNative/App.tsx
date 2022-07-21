import * as React from 'react';
import { isEqual, omit } from 'lodash-es';
import {
  Async,
  FieldFeedback as _FieldFeedback,
  FieldFeedbackProps,
  FieldFeedbacks,
  FormWithConstraints,
  TextInput
} from 'react-form-with-constraints-native';
import { DisplayFields } from 'react-form-with-constraints-tools';
import {
  ActivityIndicator,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

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

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginHorizontal: 10
  },
  input: {
    borderWidth: 1
  }
});

function Separator() {
  return <View style={{ marginBottom: 10 }} />;
}

// [React Native - how to set fixed width to individual characters (number, letter, etc)](https://stackoverflow.com/q/38933459)
function TextFixedWidth({ children }: { children: React.ReactNode }) {
  const fontFamily = Platform.OS === 'ios' ? 'Courier' : 'monospace';
  return <Text style={{ fontFamily }}>{children}</Text>;
}

export interface Props {}

export interface State {
  username: string;
  password: string;
  passwordConfirm: string;
  signUpButtonDisabled: boolean;
  resetButtonDisabled: boolean;
}

const fieldFeedbackTheme = StyleSheet.create({
  error: { color: 'red' },
  warning: { color: 'orange' },
  info: { color: 'blue' },
  whenValid: { color: 'green' }
});

class FieldFeedback extends React.PureComponent<FieldFeedbackProps> {
  render() {
    return <_FieldFeedback theme={fieldFeedbackTheme} {...this.props} />;
  }
}

export default class App extends React.Component<Props, State> {
  form: FormWithConstraints | null = null;
  username: TextInput | null = null;
  password: TextInput | null = null;
  passwordConfirm: TextInput | null = null;

  state: State = this.getInitialState();

  getInitialState() {
    return {
      username: '',
      password: '',
      passwordConfirm: '',
      signUpButtonDisabled: false,
      resetButtonDisabled: true
    };
  }

  handleUsernameChange = (text: string) => {
    this.setState({ username: text }, async () => {
      // or this.form!.validateFields('username')
      await this.form!.validateFields(this.username!);

      this.setState(prevState => ({
        signUpButtonDisabled: !this.form!.isValid(),
        resetButtonDisabled: this.shouldDisableResetButton(prevState)
      }));
    });
  };

  handlePasswordChange = (text: string) => {
    this.setState({ password: text }, async () => {
      // or this.form!.validateFields('password', 'passwordConfirm')
      await this.form!.validateFields(this.password!, this.passwordConfirm!);

      this.setState(prevState => ({
        signUpButtonDisabled: !this.form!.isValid(),
        resetButtonDisabled: this.shouldDisableResetButton(prevState)
      }));
    });
  };

  handlePasswordConfirmChange = (text: string) => {
    this.setState({ passwordConfirm: text }, async () => {
      // or this.form!.validateFields('passwordConfirm')
      await this.form!.validateFields(this.passwordConfirm!);

      this.setState(prevState => ({
        signUpButtonDisabled: !this.form!.isValid(),
        resetButtonDisabled: this.shouldDisableResetButton(prevState)
      }));
    });
  };

  handleSubmit = async () => {
    await this.form!.validateForm();
    const formIsValid = this.form!.isValid();

    this.setState(prevState => ({
      signUpButtonDisabled: !formIsValid,
      resetButtonDisabled: this.shouldDisableResetButton(prevState)
    }));

    if (formIsValid) {
      alert(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
    }
  };

  handleReset = () => {
    this.setState(this.getInitialState());
    this.form!.resetFields();
    this.setState({ resetButtonDisabled: true });
  };

  shouldDisableResetButton(state: State) {
    const omitList = ['signUpButtonDisabled', 'resetButtonDisabled'];
    return (
      isEqual(omit(this.getInitialState(), omitList), omit(state, omitList)) &&
      !this.form!.hasFeedbacks()
    );
  }

  render() {
    const { username, password, passwordConfirm, signUpButtonDisabled, resetButtonDisabled } =
      this.state;

    return (
      <ScrollView style={styles.container}>
        <FormWithConstraints ref={formWithConstraints => (this.form = formWithConstraints)}>
          <Text>
            Username{' '}
            <Text style={{ fontSize: 11 }}>(already taken: john, paul, george, ringo)</Text>
          </Text>
          <TextInput
            name="username"
            ref={input => (this.username = input)}
            value={username}
            onChangeText={this.handleUsernameChange}
            style={styles.input}
          />
          <FieldFeedbacks for="username">
            <FieldFeedback when={value => value.length === 0}>Cannot be empty</FieldFeedback>
            <Async
              promise={checkUsernameAvailability}
              pending={<ActivityIndicator size="small" color="blue" />}
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

          <Separator />

          <Text>Password</Text>
          <TextInput
            secureTextEntry
            name="password"
            ref={input => (this.password = input)}
            value={password}
            onChangeText={this.handlePasswordChange}
            style={styles.input}
          />
          <FieldFeedbacks for="password">
            <FieldFeedback when={value => value.length === 0}>Cannot be empty</FieldFeedback>
            <FieldFeedback when={value => value.length > 0 && value.length < 5}>
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

          <Separator />

          <Text>Confirm Password</Text>
          <TextInput
            secureTextEntry
            name="passwordConfirm"
            ref={input => (this.passwordConfirm = input)}
            value={passwordConfirm}
            onChangeText={this.handlePasswordConfirmChange}
            style={styles.input}
          />
          <FieldFeedbacks for="passwordConfirm">
            <FieldFeedback when={value => value !== password}>Not the same password</FieldFeedback>
          </FieldFeedbacks>

          <Separator />

          <Button title="Sign Up" onPress={this.handleSubmit} disabled={signUpButtonDisabled} />

          <Separator />

          <Button title="Reset" onPress={this.handleReset} disabled={resetButtonDisabled} />

          <Separator />

          <TextFixedWidth>
            Fields = <DisplayFields />
          </TextFixedWidth>
        </FormWithConstraints>
      </ScrollView>
    );
  }
}
