// @ts-check

import 'core-js';
import 'regenerator-runtime/runtime';
import 'raf/polyfill';

import React, { useRef, useState } from 'react';
import { isEqual } from 'lodash-es';
import ReactDOM from 'react-dom';
import {
  Async,
  FieldFeedback,
  FieldFeedbacks,
  FormWithConstraints,
  Input
} from 'react-form-with-constraints-bootstrap4';
import { DisplayFields } from 'react-form-with-constraints-tools';

import './index.html';
import './App.scss';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkUsernameAvailability(value) {
  console.log('checkUsernameAvailability');
  await sleep(1000);
  return !['john', 'paul', 'george', 'ringo'].includes(value.toLowerCase());
}

function getInitialInputsState() {
  return {
    username: '',
    password: '',
    passwordConfirm: ''
  };
}

function Form() {
  const form = useRef(null);
  const password = useRef(null);

  const [inputs, setInputs] = useState(getInitialInputsState());
  const [signUpButtonDisabled, setSignUpButtonDisabled] = useState(false);
  const [resetButtonDisabled, setResetButtonDisabled] = useState(true);

  function shouldDisableResetButton(state) {
    return isEqual(getInitialInputsState(), state) && !form.current.hasFeedbacks();
  }

  async function handleChange({ target }) {
    setInputs(prevState => {
      return { ...prevState, [target.name]: target.value };
    });

    await form.current.validateFields(target);

    setSignUpButtonDisabled(!form.current.isValid());
    setResetButtonDisabled(shouldDisableResetButton(inputs));
  }

  async function handlePasswordChange({ target }) {
    setInputs(prevState => {
      return { ...prevState, [target.name]: target.value };
    });

    await form.current.validateFields(target, 'passwordConfirm');

    setSignUpButtonDisabled(!form.current.isValid());
    setResetButtonDisabled(shouldDisableResetButton(inputs));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    await form.current.validateForm();
    const formIsValid = form.current.isValid();

    setSignUpButtonDisabled(!form.current.isValid());
    setResetButtonDisabled(shouldDisableResetButton(inputs));

    if (formIsValid) {
      alert(`Valid form\n\ninputs =\n${JSON.stringify(inputs, null, 2)}`);
    }
  }

  function handleReset() {
    setInputs(getInitialInputsState());
    form.current.resetFields();
    setSignUpButtonDisabled(false);
    setResetButtonDisabled(true);
  }

  return (
    <FormWithConstraints ref={form} onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="username">
          Username <small>(already taken: john, paul, george, ringo)</small>
        </label>
        <Input
          id="username"
          name="username"
          value={inputs.username}
          onChange={handleChange}
          required
          minLength={3}
          className="form-control is-pending-sm"
        />
        <span className="spinner-border spinner-border-sm" />
        <FieldFeedbacks for="username">
          <FieldFeedback when="tooShort">Too short</FieldFeedback>
          <FieldFeedback when="*" />
          <Async
            promise={checkUsernameAvailability}
            pending={<span className="d-block">...</span>}
            then={available =>
              available ? (
                <FieldFeedback key="1" info style={{ color: '#28a745' }}>
                  Username available
                </FieldFeedback>
              ) : (
                <FieldFeedback key="2">Username already taken, choose another</FieldFeedback>
              )
            }
          />
          <FieldFeedback when="valid">Looks good!</FieldFeedback>
        </FieldFeedbacks>
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <Input
          type="password"
          id="password"
          name="password"
          innerRef={password}
          value={inputs.password}
          onChange={handlePasswordChange}
          required
          pattern=".{5,}"
          className="form-control"
        />
        <FieldFeedbacks for="password">
          <FieldFeedback when="valueMissing" />
          <FieldFeedback when="patternMismatch">Should be at least 5 characters long</FieldFeedback>
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
      </div>
      <div className="form-group">
        <label htmlFor="password-confirm">Confirm Password</label>
        <Input
          type="password"
          id="password-confirm"
          name="passwordConfirm"
          value={inputs.passwordConfirm}
          onChange={handleChange}
          required
          className="form-control"
        />
        <FieldFeedbacks for="passwordConfirm">
          <FieldFeedback when="*" />
          <FieldFeedback when={value => value !== password.current.value}>
            Not the same password
          </FieldFeedback>
          <FieldFeedback when="valid">Looks good!</FieldFeedback>
        </FieldFeedbacks>
      </div>
      <button type="submit" disabled={signUpButtonDisabled} className="btn btn-primary">
        Sign Up
      </button>{' '}
      <button
        type="button"
        onClick={handleReset}
        disabled={resetButtonDisabled}
        className="btn btn-secondary"
      >
        Reset
      </button>
      <pre>
        <small>
          Fields = <DisplayFields />
        </small>
      </pre>
    </FormWithConstraints>
  );
}

function App() {
  return (
    <div className="container">
      <p>
        Inspired by{' '}
        <a href="https://moduscreate.com/blog/reactjs-form-validation-approaches/">
          Modus Create - ReactJS Form Validation Approaches
        </a>
        <br />
        Fixed version:{' '}
        <a href="https://codepen.io/tkrotoff/pen/MEeNvO">https://codepen.io/tkrotoff/pen/MEeNvO</a>
      </p>
      <Form />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
