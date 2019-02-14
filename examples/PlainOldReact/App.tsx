import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

import './index.html';
import './style.css';

// Inspired by
// - Validating a React form upon submit https://goshakkk.name/submit-time-validation-react/
// - How to do Simple Form Validation in #Reactjs https://learnetto.com/blog/how-to-do-simple-form-validation-in-reactjs

interface Errors {
  email: string[];
  password: string[];
  passwordConfirm: string[];
}

function validateEmail(email: string) {
  const errors = [] as string[];
  if (email.length === 0) errors.push("Can't be empty");
  if (!email.includes('@')) errors.push('Should contain @');
  return errors;
}

function validatePassword(password: string) {
  const errors = [] as string[];
  if (password.length === 0) errors.push("Can't be empty");
  if (password.length < 5) errors.push('Should be at least 5 characters long');
  return errors;
}

function validatePasswordConfirm(password: string, passwordConfirm: string) {
  const errors = [] as string[];
  if (passwordConfirm !== password) errors.push('Not the same password');
  return errors;
}

function hasErrors(errors: Errors) {
  return errors.email.length > 0 || errors.password.length > 0 || errors.passwordConfirm.length > 0;
}

function Form() {
  const email = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);
  const passwordConfirm = useRef<HTMLInputElement | null>(null);

  const [errors, setErrors] = useState<Errors>({
    email: [],
    password: [],
    passwordConfirm: []
  });

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setErrors(prevState => {
      return {
        ...prevState,
        email: validateEmail(value)
      };
    });
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setErrors(prevState => {
      return {
        ...prevState,
        password: validatePassword(value),
        passwordConfirm: validatePasswordConfirm(value, passwordConfirm.current!.value)
      };
    });
  }

  function handlePasswordConfirmChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setErrors(prevState => {
      return {
        ...prevState,
        passwordConfirm: validatePasswordConfirm(password.current!.value, value)
      };
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrors(prevState => {
      return {
        ...prevState,
        email: validateEmail(email.current!.value),
        password: validatePassword(password.current!.value),
        passwordConfirm: validatePasswordConfirm(password.current!.value, passwordConfirm.current!.value)
      };
    });
    setIsSubmitted(true);
  }

  // FIXME See [SetStateAction returned from useState hook does not accept a second callback argument](https://github.com/facebook/react/issues/14174)
  const [isSubmitted, setIsSubmitted] = useState(false);
  useEffect(() => {
    if (isSubmitted) {
      if (!hasErrors(errors)) {
        alert('Valid form');
      } else {
        alert('Invalid form');
      }
      setIsSubmitted(false);
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email"
               ref={email}
               onChange={handleEmailChange} />
        <div className="error">
          {errors.email.map(error => <div key={error}>{error}</div>)}
        </div>
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password"
               ref={password}
               onChange={handlePasswordChange} />
        <div className="error">
          {errors.password.map(error => <div key={error}>{error}</div>)}
        </div>
      </div>

      <div>
        <label htmlFor="password-confirm">Confirm Password</label>
        <input type="password" id="password-confirm"
               ref={passwordConfirm}
               onChange={handlePasswordConfirmChange} />
        <div className="error">
          {errors.passwordConfirm.map(error => <div key={error}>{error}</div>)}
        </div>
      </div>

      <button>Sign Up</button>
    </form>
  );
}

ReactDOM.render(<Form />, document.getElementById('app'));
