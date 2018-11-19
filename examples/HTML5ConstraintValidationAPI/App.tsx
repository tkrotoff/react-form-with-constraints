import React from 'react';
import ReactDOM from 'react-dom';

import './index.html';
import './style.css';

// Inspired by ReactJS Form Validation Approaches https://moduscreate.com/reactjs-form-validation-approaches/

interface Errors {
  email: string[];
  password: string[];
  passwordConfirm: string[];
}

const validateHTML5Field = (field: HTMLInputElement) => {
  const errors = [];
  if (field.validationMessage !== '') errors.push(field.validationMessage);
  return errors;
};

const validatePasswordConfirm = (password: HTMLInputElement, passwordConfirm: HTMLInputElement) => {
  const errors = [];
  if (passwordConfirm.value !== password.value) errors.push('Not the same password');
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
    const target = e.target;
    this.setState(prevState => {
      return {
        errors: {
          ...prevState.errors,
          email: validateHTML5Field(target)
        }
      };
    });
  }

  handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    this.setState(prevState => {
      return {
        errors: {
          ...prevState.errors,
          password: validateHTML5Field(target),
          passwordConfirm: validatePasswordConfirm(target, this.passwordConfirm!)
        }
      };
    });
  }

  handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    this.setState(prevState => {
      return {
        errors: {
          ...prevState.errors,
          passwordConfirm: validatePasswordConfirm(this.password!, target)
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
            email: validateHTML5Field(this.email!),
            password: validateHTML5Field(this.password!),
            passwordConfirm: validatePasswordConfirm(this.password!, this.passwordConfirm!)
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
      <form onSubmit={this.handleSubmit} noValidate>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email"
                 ref={email => this.email = email}
                 onChange={this.handleEmailChange}
                 required minLength={5} />
          <div className="error">
            {errors.email.map(error => <div key={error}>{error}</div>)}
          </div>
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password"
                 ref={password => this.password = password}
                 onChange={this.handlePasswordChange}
                 required pattern=".{5,}" />
          <div className="error">
            {errors.password.map(error => <div key={error}>{error}</div>)}
          </div>
        </div>

        <div>
          <label htmlFor="password-confirm">Confirm Password</label>
          <input type="password" name="passwordConfirm" id="password-confirm"
                 ref={passwordConfirm => this.passwordConfirm = passwordConfirm}
                 onChange={this.handlePasswordConfirmChange} />
          <div className="error">
            {errors.passwordConfirm.map(error => <div key={error}>{error}</div>)}
          </div>
        </div>

        <button>Submit</button>
      </form>
    );
  }
}

ReactDOM.render(<Form />, document.getElementById('app'));
