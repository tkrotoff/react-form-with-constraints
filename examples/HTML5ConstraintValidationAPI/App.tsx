import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import './index.html';
import './style.css';

// Inspired by [ReactJS Form Validation Approaches](https://moduscreate.com/reactjs-form-validation-approaches/)

interface Errors {
  email: string[];
  password: string[];
  passwordConfirm: string[];
}

function validateHTML5Field(field: HTMLInputElement) {
  const errors = [];
  if (field.validationMessage !== '') errors.push(field.validationMessage);
  return errors;
}

function validatePasswordConfirm(password: HTMLInputElement, passwordConfirm: HTMLInputElement) {
  const errors = [];
  if (passwordConfirm.value !== password.value) errors.push('Not the same password');
  return errors;
}

function hasErrors(errors: Errors) {
  return errors.email.length > 0 || errors.password.length > 0 || errors.passwordConfirm.length > 0;
}

function Form() {
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const passwordConfirm = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Errors>({
    email: [],
    password: [],
    passwordConfirm: []
  });

  // FIXME [SetStateAction returned from useState hook does not accept a second callback argument](https://github.com/facebook/react/issues/14174)
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
  }, [isSubmitted, errors]);

  function handleEmailChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    setErrors(prevState => {
      return {
        ...prevState,
        email: validateHTML5Field(target)
      };
    });
  }

  function handlePasswordChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    setErrors(prevState => {
      return {
        ...prevState,
        password: validateHTML5Field(target),
        passwordConfirm: validatePasswordConfirm(target, passwordConfirm.current!)
      };
    });
  }

  function handlePasswordConfirmChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    setErrors(prevState => {
      return {
        ...prevState,
        passwordConfirm: validatePasswordConfirm(password.current!, target)
      };
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrors(prevState => {
      return {
        ...prevState,
        email: validateHTML5Field(email.current!),
        password: validateHTML5Field(password.current!),
        passwordConfirm: validatePasswordConfirm(password.current!, passwordConfirm.current!)
      };
    });
    setIsSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          ref={email}
          onChange={handleEmailChange}
          required
          minLength={5}
        />
        <div className="error">
          {errors.email.map(error => (
            <div key={error}>{error}</div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          ref={password}
          onChange={handlePasswordChange}
          required
          pattern=".{5,}"
        />
        <div className="error">
          {errors.password.map(error => (
            <div key={error}>{error}</div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="password-confirm">Confirm Password</label>
        <input
          type="password"
          name="passwordConfirm"
          id="password-confirm"
          ref={passwordConfirm}
          onChange={handlePasswordConfirmChange}
        />
        <div className="error">
          {errors.passwordConfirm.map(error => (
            <div key={error}>{error}</div>
          ))}
        </div>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

ReactDOM.render(<Form />, document.getElementById('app'));
