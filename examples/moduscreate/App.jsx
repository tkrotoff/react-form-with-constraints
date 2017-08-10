// @ts-check

// Taken and adapted from Modus Create - ReactJS Form Validation Approaches http://moduscreate.com/reactjs-form-validation-approaches/
// Original code: https://codepen.io/jmalfatto/pen/YGjmaJ

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { FormWithConstraints, FieldFeedback, Bootstrap4 } from '../../index';
const { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } = Bootstrap4;

import 'file-loader?name=[path][name].[ext]!./index.html';

class Form extends FormWithConstraints {
  constructor(props) {
    super(props);

    this.state = {
      username: 'john@doe.com',
      password: '',
      passwordConfirm: '',
      submitButtonDisabled: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const target = e.currentTarget;

    this.setState({
      [target.name]: target.value
    });

    super.handleChange(e);

    this.setState({
      submitButtonDisabled: !this.isValid()
    });
  }

  handleSubmit(e) {
    super.handleSubmit(e);

    console.log('state:', JSON.stringify(this.state));

    if (!this.isValid()) {
      console.log('form is invalid: do not submit');
    } else {
      console.log('form is valid: submit');
    }

    this.setState({
      submitButtonDisabled: !this.isValid()
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} noValidate>
        <FormGroup for="username">
          <FormControlLabel htmlFor="username">Username</FormControlLabel>
          <FormControlInput type="email" id="username" name="username"
                            value={this.state.username} onChange={this.handleChange}
                            required />
          <FieldFeedbacks for="username">
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </FormGroup>

        <FormGroup for="password">
          <FormControlLabel htmlFor="password">Password</FormControlLabel>
          <FormControlInput type="password" id="password" name="password"
                            value={this.state.password} onChange={this.handleChange}
                            pattern=".{5,}" required />
          <FieldFeedbacks for="password" show="all">
            <FieldFeedback when="valueMissing" />
            <FieldFeedback when="patternMismatch">Should be at least 5 characters long</FieldFeedback>
            <FieldFeedback when={value => !/\d/.test(value)} warning>Should contain numbers</FieldFeedback>
            <FieldFeedback when={value => !/[a-z]/.test(value)} warning>Should contain small letters</FieldFeedback>
            <FieldFeedback when={value => !/[A-Z]/.test(value)} warning>Should contain capital letters</FieldFeedback>
            <FieldFeedback when={value => !/\W/.test(value)} warning>Should contain special characters</FieldFeedback>
          </FieldFeedbacks>
        </FormGroup>

        <FormGroup for="passwordConfirm">
          <FormControlLabel htmlFor="password-confirm">Confirm Password</FormControlLabel>
          <FormControlInput type="password" id="password-confirm" name="passwordConfirm"
                            value={this.state.passwordConfirm} onChange={this.handleChange}
                            required />
          <FieldFeedbacks for="passwordConfirm">
            <FieldFeedback when="*" />
            <FieldFeedback when={value => value !== this.state.password}>Not the same password</FieldFeedback>
          </FieldFeedbacks>
        </FormGroup>

        <button disabled={this.state.submitButtonDisabled} className="btn btn-primary">Submit</button>
      </form>
    );
  }
}

const App = () => (
  <div className="container">
    <p>
      Taken and adapted from <a href="http://moduscreate.com/reactjs-form-validation-approaches/">Modus Create - ReactJS Form Validation Approaches</a>
      <br />
      Original code: <a href="https://codepen.io/jmalfatto/pen/YGjmaJ">https://codepen.io/jmalfatto/pen/YGjmaJ</a>
    </p>
    <Form />
    <small>Note: see console for submit event logging</small>
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));
