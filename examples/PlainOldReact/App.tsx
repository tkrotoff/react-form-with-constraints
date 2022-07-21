import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

import './index.html';
import './style.css';

// Inspired by
// - [Validating a React form upon submit](https://goshakkk.name/submit-time-validation-react/)
// - [How to do Simple Form Validation in #Reactjs](https://learnetto.com/blog/how-to-do-simple-form-validation-in-reactjs)

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
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const passwordConfirm = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Errors>({
    email: [],
    password: [],
    passwordConfirm: []
  });

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
    const { value } = target;
    setErrors(prevState => {
      return {
        ...prevState,
        email: validateEmail(value)
      };
    });
  }

  function handlePasswordChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    const { value } = target;
    setErrors(prevState => {
      return {
        ...prevState,
        password: validatePassword(value),
        passwordConfirm: validatePasswordConfirm(value, passwordConfirm.current!.value)
      };
    });
  }

  function handlePasswordConfirmChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    const { value } = target;
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
        passwordConfirm: validatePasswordConfirm(
          password.current!.value,
          passwordConfirm.current!.value
        )
      };
    });
    setIsSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" ref={email} onChange={handleEmailChange} />
        <div className="error">
          {errors.email.map(error => (
            <div key={error}>{error}</div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={password} onChange={handlePasswordChange} />
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

      <button type="submit">Sign Up</button>
    </form>
  );
}

const root = createRoot(document.getElementById('app')!);
root.render(<Form />);
