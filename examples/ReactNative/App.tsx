import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button, ActivityIndicator } from 'react-native';
import { isEqual, omit } from 'lodash';

import {
  TextInput,
  FormWithConstraints,
  FieldFeedbacks,
  Async,
  FieldFeedback as _FieldFeedback,
  FieldFeedbackProps
} from 'react-form-with-constraints-native';
import { DisplayFields } from 'react-form-with-constraints-tools';

import { TextFixedWidth } from './TextFixedWidth';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkUsernameAvailability(value: string) {
  console.log('checkUsernameAvailability');
  await sleep(1000);
  return !['john', 'paul', 'george', 'ringo'].includes(value.toLowerCase());
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10
  },
  flow: {
    marginBottom: 10
  },
  input: {
    borderWidth: 1
  }
});

export interface Props {}

export interface State {
  username: string;
  password: string;
  passwordConfirm: string;
  signUpButtonDisabled: boolean;
  resetButtonDisabled: boolean;
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
    const {
      username,
      password,
      passwordConfirm,
      signUpButtonDisabled,
      resetButtonDisabled
    } = this.state;

    return (
      <ScrollView style={styles.container}>
        <FormWithConstraints ref={formWithConstraints => (this.form = formWithConstraints)}>
          <View style={styles.flow}>
            <Text onPress={() => this.username!.focus()}>
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
          </View>

          <View style={styles.flow}>
            <Text onPress={() => this.password!.focus()}>Password</Text>
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
          </View>

          <View style={styles.flow}>
            <Text onPress={() => this.passwordConfirm!.focus()}>Confirm Password</Text>
            <TextInput
              secureTextEntry
              name="passwordConfirm"
              ref={input => (this.passwordConfirm = input)}
              value={passwordConfirm}
              onChangeText={this.handlePasswordConfirmChange}
              style={styles.input}
            />
            <FieldFeedbacks for="passwordConfirm">
              <FieldFeedback when={value => value !== password}>
                Not the same password
              </FieldFeedback>
            </FieldFeedbacks>
          </View>

          <Button title="Sign Up" onPress={this.handleSubmit} disabled={signUpButtonDisabled} />
          <Button title="Reset" onPress={this.handleReset} disabled={resetButtonDisabled} />
          <TextFixedWidth>
            Fields = <DisplayFields />
          </TextFixedWidth>
        </FormWithConstraints>
      </ScrollView>
    );
  }
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
