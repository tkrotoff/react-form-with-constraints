// @ts-check

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { FormWithConstraints, FieldFeedback } from '../../src/index';
import { FieldFeedbacks, FormGroup, FormControlLabel, FormControlInput } from '../../src/Bootstrap4';

import './index.html';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      passwordConfirm: '',
      submitButtonDisabled: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const target = e.currentTarget;

    this.form.validateFields(target);

    this.setState({
      [target.name]: target.value,
      submitButtonDisabled: !this.form.isValid()
    });
  }

  handlePasswordChange(e) {
    this.form.validateFields('passwordConfirm');

    this.handleChange(e);
  }

  handleSubmit(e) {
    e.preventDefault();

    this.form.validateFields();

    this.setState({submitButtonDisabled: !this.form.isValid()});

    if (this.form.isValid()) {
      alert(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
    }
  }

  render() {
    return (
      <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}
                           onSubmit={this.handleSubmit} noValidate>
        <FormGroup for="username">
          <FormControlLabel htmlFor="username">Username</FormControlLabel>
          <FormControlInput type="email" id="username" name="username"
                            value={this.state.username} onChange={this.handleChange}
                            required minLength={3} />
          <FieldFeedbacks for="username">
            <FieldFeedback when="tooShort">Too short</FieldFeedback>
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </FormGroup>

        <FormGroup for="password">
          <FormControlLabel htmlFor="password">Password</FormControlLabel>
          <FormControlInput type="password" id="password" name="password"
                            innerRef={password => this.password = password}
                            value={this.state.password} onChange={this.handlePasswordChange}
                            required pattern=".{5,}" />
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
                            value={this.state.passwordConfirm} onChange={this.handleChange} />
          <FieldFeedbacks for="passwordConfirm">
            <FieldFeedback when={value => value !== this.password.value}>Not the same password</FieldFeedback>
          </FieldFeedbacks>
        </FormGroup>

        <button disabled={this.state.submitButtonDisabled} className="btn btn-primary">Submit</button>
      </FormWithConstraints>
    );
  }
}

const App = () => (
  <div className="container">
    <p>
      Inspired by <a href="http://moduscreate.com/reactjs-form-validation-approaches/">Modus Create - ReactJS Form Validation Approaches</a>
      <br />
      Fixed version: <a href="https://codepen.io/tkrotoff/pen/MEeNvO">https://codepen.io/tkrotoff/pen/MEeNvO</a>
    </p>
    <Form />
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));
