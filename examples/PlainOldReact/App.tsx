import React from 'react';
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

const validateEmail = (email: string) => {
  const errors = [] as string[];
  if (email.length === 0) errors.push("Can't be empty");
  if (!email.includes('@')) errors.push('Should contain @');
  return errors;
};

const validatePassword = (password: string) => {
  const errors = [] as string[];
  if (password.length === 0) errors.push("Can't be empty");
  if (password.length < 5) errors.push('Should be at least 5 characters long');
  return errors;
};

const validatePasswordConfirm = (password: string, passwordConfirm: string) => {
  const errors = [] as string[];
  if (passwordConfirm !== password) errors.push('Not the same password');
  return errors;
};

const hasErrors = (errors: Errors) => {
  return errors.email.length > 0 || errors.password.length > 0 || errors.passwordConfirm.length > 0;
};


interface Props {}

interface State {
  errors: Errors;
}

class Form extends React.Component<Props, State> {
  email: HTMLInputElement | null = null;
  password: HTMLInputElement | null = null;
  passwordConfirm: HTMLInputElement | null = null;

  state: State = {
    errors: {
      email: [],
      password: [],
      passwordConfirm: []
    }
  };

  handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setState(prevState => {
      return {
        errors: {
          ...prevState.errors,
          email: validateEmail(value)
        }
      };
    });
  }

  handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setState(prevState => {
      return {
        errors: {
          ...prevState.errors,
          password: validatePassword(value),
          passwordConfirm: validatePasswordConfirm(value, this.passwordConfirm!.value)
        }
      };
    });
  }

  handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setState(prevState => {
      return {
        errors: {
          ...prevState.errors,
          passwordConfirm: validatePasswordConfirm(this.password!.value, value)
        }
      };
    });
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    this.setState(
      prevState => {
        return {
          errors: {
            ...prevState.errors,
            email: validateEmail(this.email!.value),
            password: validatePassword(this.password!.value),
            passwordConfirm: validatePasswordConfirm(this.password!.value, this.passwordConfirm!.value)
          }
        };
      },
      () => {
        if (!hasErrors(this.state.errors)) {
          alert('Valid form');
        } else {
          alert('Invalid form');
        }
      }
    );
  }

  render() {
    const { errors } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email"
                 ref={email => this.email = email}
                 onChange={this.handleEmailChange} />
          <div className="error">
            {errors.email.map(error => <div key={error}>{error}</div>)}
          </div>
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password"
                 ref={password => this.password = password}
                 onChange={this.handlePasswordChange} />
          <div className="error">
            {errors.password.map(error => <div key={error}>{error}</div>)}
          </div>
        </div>

        <div>
          <label htmlFor="password-confirm">Confirm Password</label>
          <input type="password" id="password-confirm"
                 ref={passwordConfirm => this.passwordConfirm = passwordConfirm}
                 onChange={this.handlePasswordConfirmChange} />
          <div className="error">
            {errors.passwordConfirm.map(error => <div key={error}>{error}</div>)}
          </div>
        </div>

        <button>Sign Up</button>
      </form>
    );
  }
}

ReactDOM.render(<Form />, document.getElementById('app'));
