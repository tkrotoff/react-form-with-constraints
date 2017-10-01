import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from '../../src/index';
import DisplayFields from '../../src/DisplayFields';

import './index.html';
import '../Password/style.css';

enum Color {
  Red = 'Red',
  Orange = 'Orange',
  Yellow = 'Yellow',
  Green = 'Green',
  Blue = 'Blue',
  Indigo = 'Indigo',
  Violet = 'Violet'
}
const colors = Object.keys(Color);

interface Props {}

interface State {
  favoriteColor?: Color;
  hasWebsite: boolean;
  website?: string;
  submitButtonDisabled: boolean;
}

class Form extends React.Component<Props, State> {
  form: FormWithConstraints;
  password: HTMLInputElement;

  constructor() {
    super();

    this.state = {
      hasWebsite: false,
      submitButtonDisabled: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleHasWebsiteChange = this.handleHasWebsiteChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const target = e.currentTarget;

    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;

    this.form.validateFields(target);

    this.setState({
      [target.name as any]: value,
      submitButtonDisabled: !this.form.isValid()
    });
  }

  handleHasWebsiteChange(e: React.ChangeEvent<HTMLInputElement>) {
    const hasWebsite = (e.currentTarget as HTMLInputElement).checked;

    if (!hasWebsite) {
      // Reset this.state.website if it was previously filled
      this.setState({website: undefined});
    }

    this.handleChange(e);
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    this.form.validateFields();

    this.setState({submitButtonDisabled: !this.form.isValid()});

    if (this.form.isValid()) {
      alert(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
    }
  }

  render() {
    const { favoriteColor, hasWebsite } = this.state;

    return (
      <FormWithConstraints ref={(formWithConstraints: any) => this.form = formWithConstraints}
                           onSubmit={this.handleSubmit} noValidate>
        <div>
          <label htmlFor="first-name">First Name</label>
          <input name="firstName" id="first-name"
                 onChange={this.handleChange}
                 required minLength={3} />
          <FieldFeedbacks for="firstName">
            <FieldFeedback when="tooShort">Too short</FieldFeedback>
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </div>

        <div>
          <label htmlFor="last-name">Last Name</label>
          <input name="lastName" id="last-name"
                 onChange={this.handleChange}
                 required minLength={3} />
          <FieldFeedbacks for="lastName">
            <FieldFeedback when="tooShort">Too short</FieldFeedback>
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email"
                 onChange={this.handleChange}
                 required minLength={3} />
          <FieldFeedbacks for="email">
            <FieldFeedback when="tooShort">Too short</FieldFeedback>
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </div>

        <div>
          <label>Sex</label>
          <label>
            <input type="radio" name="sex"
                   value="male" onChange={this.handleChange}
                   required />
            Male
          </label>
          <label>
            <input type="radio" name="sex"
                   value="female" onChange={this.handleChange} />
            Female
          </label>
          <FieldFeedbacks for="sex">
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </div>

        <div>
          <label htmlFor="age">Age</label>
          <input type="number" name="age" id="age"
                 onChange={this.handleChange}
                 required />
          <FieldFeedbacks for="age">
            <FieldFeedback when="*" />
            <FieldFeedback when={value => Number(value) < 18}>Sorry, you must be at least 18 years old</FieldFeedback>
            <FieldFeedback when={value => Number(value) < 19} warning>Hmm, you seem a bit young...</FieldFeedback>
          </FieldFeedbacks>
        </div>

        <div>
          <label htmlFor="phone">Phone number</label>
          <input type="tel" name="phone" id="phone"
                 onChange={this.handleChange}
                 required />
          <FieldFeedbacks for="phone">
            <FieldFeedback when="*" />
            <FieldFeedback when={value => !/^\d{10}$/.test(value)}>Invalid phone number, must be 10 digits</FieldFeedback>
          </FieldFeedbacks>
        </div>

        <div>
          <label htmlFor="favorite-color">Favorite Color</label>
          <select name="favoriteColor" id="favorite-color"
                  value={favoriteColor} defaultValue={''} onChange={this.handleChange}
                  required>
            <option value="" disabled>Select a color...</option>
            {colors.map(color => <option value={color} key={color}>{color}</option>)}
          </select>
          <FieldFeedbacks for="favoriteColor">
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </div>

        {favoriteColor &&
          <div
            style={{
              height: 80,
              width: 200,
              backgroundColor: favoriteColor
            }}
          />
        }

        <div>
          <label>
            <input type="checkbox" name="employed"
                   onChange={this.handleChange} />
            Employed
          </label>
        </div>

        <div>
          <label htmlFor="notes">Notes</label>
          <textarea name="notes" id="notes"
                    onChange={this.handleChange} />
        </div>

        <div>
          <label>
            <input type="checkbox" name="hasWebsite"
                   onChange={this.handleHasWebsiteChange} />
            Do you have a website?
          </label>
        </div>

        {hasWebsite &&
          <div>
            <label htmlFor="website">Website</label>
            <input type="url" name="website" id="website"
                   onChange={this.handleChange}
                   required minLength={3} />
            <FieldFeedbacks for="website">
              <FieldFeedback when="*" />
            </FieldFeedbacks>
          </div>
        }

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password"
                 ref={password => this.password = password!}
                 onChange={this.handleChange}
                 required pattern=".{5,}" />
          <FieldFeedbacks for="password" show="all">
            <FieldFeedback when="valueMissing" />
            <FieldFeedback when="patternMismatch">Should be at least 5 characters long</FieldFeedback>
            <FieldFeedback when={value => !/\d/.test(value)} warning>Should contain numbers</FieldFeedback>
            <FieldFeedback when={value => !/[a-z]/.test(value)} warning>Should contain small letters</FieldFeedback>
            <FieldFeedback when={value => !/[A-Z]/.test(value)} warning>Should contain capital letters</FieldFeedback>
            <FieldFeedback when={value => !/\W/.test(value)} warning>Should contain special characters</FieldFeedback>
          </FieldFeedbacks>
        </div>

        <div>
          <label htmlFor="password-confirm">Confirm Password</label>
          <input type="password" name="passwordConfirm" id="password-confirm"
                 onChange={this.handleChange} />
          <FieldFeedbacks for="passwordConfirm">
            <FieldFeedback when={value => value !== this.password.value}>Not the same password</FieldFeedback>
          </FieldFeedbacks>
        </div>

        <button disabled={this.state.submitButtonDisabled}>Sign Up</button>

        <div>
          <pre>this.state = {JSON.stringify(this.state, null, 2)}</pre>
        </div>

        <DisplayFields />
      </FormWithConstraints>
    );
  }
}

ReactDOM.render(<Form />, document.getElementById('app'));
