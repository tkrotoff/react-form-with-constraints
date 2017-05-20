// @ts-check

// Taken and adapted from Modus Create - ReactJS Form Validation Approaches http://moduscreate.com/reactjs-form-validation-approaches/
// Original code: https://codepen.io/jmalfatto/pen/YGjmaJ

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from '../../src/FormWithConstraints';
import { FormGroup } from '../../src/Bootstrap4Helpers';

import 'file-loader?name=[path][name].[ext]!./index.html';

class Form extends FormWithConstraints {
  constructor(props) {
    super(props);

    this.state = {
      username: 'john@doe.com',
      password: '',
      passwordConfirm: ''
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
  }

  handleSubmit(e) {
    e.preventDefault();

    super.handleSubmit(e);

    console.log('state:', JSON.stringify(this.state));

    if (!this.isValid()) {
      console.log('form is invalid: do not submit');
    } else {
      console.log('form is valid: submit');
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} noValidate>
        <FormGroup for="username">
          <label htmlFor="username" className="form-control-label">Username</label>
          <input type="email" id="username" name="username"
                 value={this.state.username} onChange={this.handleChange}
                 className="form-control" required />
          <FieldFeedbacks for="username" className="form-control-feedback">
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </FormGroup>

        <FormGroup for="password">
          <label htmlFor="password" className="form-control-label">Password</label>
          <input type="password" id="password" name="password"
                 value={this.state.password} onChange={this.handleChange}
                 className="form-control"
                 pattern=".{5,}" required />
          <FieldFeedbacks for="password" className="form-control-feedback">
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </FormGroup>

        <FormGroup for="passwordConfirm">
          <label htmlFor="password-confirm" className="form-control-label">Confirm Password</label>
          <input type="password" id="password-confirm" name="passwordConfirm"
                 value={this.state.passwordConfirm} onChange={this.handleChange}
                 className="form-control"
                 required />
          <FieldFeedbacks for="passwordConfirm" className="form-control-feedback">
            <FieldFeedback when={value => value !== this.state.password}>Not the same password</FieldFeedback>
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </FormGroup>

        <button className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
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
