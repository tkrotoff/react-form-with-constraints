import React from 'react';
import { StyleSheet, Text, /*TextInput,*/ View, Button, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-form-with-constraints-native/lib/react-native-TextInput-fix'; // Specific to TypeScript

import { Async } from 'react-form-with-constraints';
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints-native';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkUsernameAvailability(value: string) {
  console.log('checkUsernameAvailability');
  await sleep(1000);
  return !['john@beatles', 'paul@beatles', 'george@beatles', 'ringo@beatles'].includes(value.toLowerCase());
}

export interface Props {}

export interface State {
  username: string;
  password: string;
  passwordConfirm: string;
  submitButtonDisabled: boolean;
}

export default class App extends React.Component<Props, State> {
  form: FormWithConstraints | null | undefined;
  username: TextInput | null | undefined;
  password: TextInput | null | undefined;
  passwordConfirm: TextInput | null | undefined;

  constructor(props: Props) {
    super(props);

    this.state = this.getInitialState();

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  private getInitialState() {
    const state: State = {
      username: '',
      password: '',
      passwordConfirm: '',
      submitButtonDisabled: false
    };
    return state;
  }

  handleUsernameChange(text: string) {
    this.setState(
      {username: text},
      async () => {
        // or this.form!.validateFields('username')
        await this.form!.validateFields(this.username!);
        this.setState({submitButtonDisabled: !this.form!.isValid()});
      }
    );
  }

  handlePasswordChange(text: string) {
    this.setState(
      {password: text},
      async () => {
        // or this.form!.validateFields('password', 'passwordConfirm')
        await this.form!.validateFields(this.password!, this.passwordConfirm!);
        this.setState({submitButtonDisabled: !this.form!.isValid()});
      }
    );
  }

  handlePasswordConfirmChange(text: string) {
    this.setState(
      {passwordConfirm: text},
      async () => {
        // or this.form!.validateFields('passwordConfirm')
        await this.form!.validateFields(this.passwordConfirm!);
        this.setState({submitButtonDisabled: !this.form!.isValid()});
      }
    );
  }

  async handleSubmit() {
    await this.form!.validateForm();
    const formIsValid = this.form!.isValid();
    this.setState({submitButtonDisabled: !formIsValid});
    if (formIsValid) {
      alert(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
    }
  }

  handleReset() {
    this.setState(this.getInitialState());
    this.form!.reset();
  }

  render() {
    return (
      <View style={styles.container}>
        <FormWithConstraints
          ref={formWithConstraints => this.form = formWithConstraints}
          style={feedbacksStyles}>

          <View style={styles.flow}>
            <Text onPress={() => this.username!.focus()}>
              Username <Text style={{fontSize: 11}}>(already taken: john@beatles, paul@beatles, george@beatles, ringo@beatles)</Text>
            </Text>
            <TextInput
              name="username"
              keyboardType="email-address"
              ref={input => this.username = input as any}
              value={this.state.username}
              onChangeText={this.handleUsernameChange}
              style={styles.input}
            />
            <FieldFeedbacks for="username">
              <FieldFeedback when={value => value.length === 0}>Cannot be empty</FieldFeedback>
              <FieldFeedback when={value => !/\S+@\S+/.test(value)}>Invalid email address</FieldFeedback>
              <Async
                promise={checkUsernameAvailability}
                pending={<ActivityIndicator size="small" color="blue" />}
                then={available => available ?
                  <FieldFeedback info style={{color: 'green'}}>Username available</FieldFeedback> :
                  <FieldFeedback>Username already taken, choose another</FieldFeedback>
                }
              />
            </FieldFeedbacks>
          </View>

          <View style={styles.flow}>
            <Text onPress={() => this.password!.focus()}>Password</Text>
            <TextInput
              name="password"
              secureTextEntry
              ref={input => this.password = input as any}
              value={this.state.password}
              onChangeText={this.handlePasswordChange}
              style={styles.input}
            />
            <FieldFeedbacks for="password">
              <FieldFeedback when={value => value.length === 0}>Cannot be empty</FieldFeedback>
              <FieldFeedback when={value => value.length > 0 && value.length < 5}>Should be at least 5 characters long</FieldFeedback>
              <FieldFeedback when={value => !/\d/.test(value)} warning>Should contain numbers</FieldFeedback>
              <FieldFeedback when={value => !/[a-z]/.test(value)} warning>Should contain small letters</FieldFeedback>
              <FieldFeedback when={value => !/[A-Z]/.test(value)} warning>Should contain capital letters</FieldFeedback>
              <FieldFeedback when={value => !/\W/.test(value)} warning>Should contain special characters</FieldFeedback>
            </FieldFeedbacks>
          </View>

          <View style={styles.flow}>
            <Text onPress={() => this.passwordConfirm!.focus()}>Confirm Password</Text>
            <TextInput
              name="passwordConfirm"
              secureTextEntry
              ref={input => this.passwordConfirm = input as any}
              value={this.state.passwordConfirm}
              onChangeText={this.handlePasswordConfirmChange}
              style={styles.input}
            />
            <FieldFeedbacks for="passwordConfirm">
              <FieldFeedback when={value => value !== this.state.password}>Not the same password</FieldFeedback>
            </FieldFeedbacks>
          </View>
        </FormWithConstraints>

        <Button
          title="Sign Up"
          disabled={this.state.submitButtonDisabled}
          onPress={this.handleSubmit}
        />
        <Button
          title="Reset"
          onPress={this.handleReset}
        />

      </View>
    );
  }
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

const feedbacksStyles = StyleSheet.create({
  error: {
    color: 'red'
  },
  warning: {
    color: 'orange'
  },
  info: {
    color: 'blue'
  }
});
