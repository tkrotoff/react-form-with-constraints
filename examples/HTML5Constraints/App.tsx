import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.html';
import '../Password/style.css';

interface Errors {
  username: string[];
  password: string[];
  passwordConfirm: string[];
}

function validateHTML5Field(field: HTMLInputElement) {
  const errors = [];
  if (field.validationMessage !== '') errors.push(field.validationMessage);
  return errors;
}

function validatePasswordConfirm(password: HTMLInputElement, passwordConfirm: HTMLInputElement) {
  const errors = [] as string[];
  if (passwordConfirm.value !== password.value) errors.push('Not the same password');
  return errors;
}

function containErrors(errors: Errors) {
  return errors.username.length > 0 || errors.password.length > 0 || errors.passwordConfirm.length > 0;
}


interface Props {}

interface State {
  errors: Errors;
}

class Form extends React.Component<Props, State> {
  username: HTMLInputElement;
  password: HTMLInputElement;
  passwordConfirm: HTMLInputElement;

  constructor(props: Props) {
    super(props);

    this.state = {
      errors: {
        username: [],
        password: [],
        passwordConfirm: []
      }
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameChange(e: React.FormEvent<HTMLInputElement>) {
    const target = e.currentTarget;
    this.setState(prevState => {
      return {
        errors: {
          ...prevState.errors,
          username: validateHTML5Field(target)
        }
      };
    });
  }

  handlePasswordChange(e: React.FormEvent<HTMLInputElement>) {
    const target = e.currentTarget;
    this.setState(prevState => {
      return {
        errors: {
          ...prevState.errors,
          password: validateHTML5Field(target),
          passwordConfirm: validatePasswordConfirm(target, this.passwordConfirm)
        }
      };
    });
  }

  handlePasswordConfirmChange(e: React.FormEvent<HTMLInputElement>) {
    const target = e.currentTarget;
    this.setState(prevState => {
      return {
        errors: {
          ...prevState.errors,
          passwordConfirm: validatePasswordConfirm(this.password, target)
        }
      };
    });
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    this.setState(
      prevState => {
        return {
          errors: {
            ...prevState.errors,
            username: validateHTML5Field(this.username),
            password: validateHTML5Field(this.password),
            passwordConfirm: validatePasswordConfirm(this.password, this.passwordConfirm)
          }
        };
      },
      () => {
        if (!containErrors(this.state.errors)) {
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
          <label>Username</label>
          <input type="email" name="username"
                 ref={username => this.username = username!}
                 onChange={this.handleUsernameChange}
                 required minLength={3} />
          <div className="error">
            {errors.username.map(error => <div key={error}>{error}</div>)}
          </div>
        </div>

        <div>
          <label>Password</label>
          <input type="password" name="password"
                 ref={password => this.password = password!}
                 onChange={this.handlePasswordChange}
                 required pattern=".{5,}" />
          <div className="error">
            {errors.password.map(error => <div key={error}>{error}</div>)}
          </div>
        </div>

        <div>
          <label>Confirm Password</label>
          <input type="password" name="passwordConfirm"
                 ref={passwordConfirm => this.passwordConfirm = passwordConfirm!}
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
