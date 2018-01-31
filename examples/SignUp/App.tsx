import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';

import { Input, FormWithConstraints, FieldFeedbacks, FieldFeedback, Async as Async_, AsyncProps } from 'react-form-with-constraints';
import { DisplayFields } from 'react-form-with-constraints-tools';

import Gender from '../WizardForm/Gender';
import { Color, colorKeys } from '../WizardForm/Color';

import Spinner from './Spinner';
import './index.html';
import '../Password/style.css';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkUsernameAvailability(value: string) {
  console.log('checkUsernameAvailability');
  await sleep(1000);
  return !['john', 'paul', 'george', 'ringo'].includes(value.toLowerCase());
}

// Async with a default React component for pending state
function Async<T>(props: AsyncProps<T>) {
  return (
    <Async_
      promise={props.promise}
      pending={<Spinner />}
      then={props.then}
      catch={props.catch}
    />
  );
}

const VALIDATE_DEBOUNCE_WAIT = 1000;

interface Props {}

interface State {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender?: Gender;
  age: string;
  phone: string;
  favoriteColor?: Color;
  isEmployed?: boolean;
  notes: string;
  hasWebsite?: boolean;
  website: string;
  password: string;
  passwordConfirm: string;
  submitButtonDisabled: boolean;
}

class Form extends React.Component<Props, State> {
  formWithConstraints: FormWithConstraints | null | undefined;
  passwordInput: HTMLInputElement | null | undefined;

  constructor(props: Props) {
    super(props);

    this.state = this.getInitialState();

    this.validateFields = _.debounce(this.validateFields, VALIDATE_DEBOUNCE_WAIT);

    this.handleChange = this.handleChange.bind(this);
    this.handleHasWebsiteChange = this.handleHasWebsiteChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  private getInitialState() {
    const state: State = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      gender: undefined,
      age: '',
      phone: '',
      favoriteColor: undefined,
      isEmployed: undefined,
      notes: '',
      hasWebsite: undefined,
      website: '',
      password: '',
      passwordConfirm: '',
      submitButtonDisabled: false
    };
    return state;
  }

  previousValidateFields: string | undefined;

  handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const target = e.currentTarget;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;

    this.setState({
      [target.name as any]: value
    });

    // Flush the previous debounce if input is not the same otherwise validateFields(input2) will overwrite validateFields(input1)
    // if the user changes input2 before validateFields(input1) is called
    if (this.previousValidateFields !== target.name) {
      (this.validateFields as ((target: Input) => Promise<void>) & _.Cancelable).flush();
    }
    this.previousValidateFields = target.name;

    this.validateFields(target);
  }

  async validateFields(target: Input) {
    await this.formWithConstraints!.validateFields(target);
    this.setState({submitButtonDisabled: !this.formWithConstraints!.isValid()});
  }

  handleHasWebsiteChange(e: React.ChangeEvent<HTMLInputElement>) {
    const hasWebsite = e.currentTarget.checked;

    if (!hasWebsite) {
      // Reset this.state.website if it was previously filled
      this.setState({website: ''});
    }

    this.handleChange(e);
  }

  async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await this.formWithConstraints!.validateForm();
    const formIsValid = this.formWithConstraints!.isValid();
    this.setState({submitButtonDisabled: !formIsValid});
    if (formIsValid) {
      alert(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
    }
  }

  handleReset() {
    this.setState(this.getInitialState());
    this.formWithConstraints!.reset();
  }

  render() {
    const {
      firstName,
      lastName,
      username,
      email,
      gender,
      age,
      phone,
      favoriteColor,
      isEmployed,
      notes,
      hasWebsite,
      website,
      password,
      passwordConfirm,
      submitButtonDisabled
    } = this.state;

    return (
      <FormWithConstraints ref={formWithConstraints => this.formWithConstraints = formWithConstraints}
                           onSubmit={this.handleSubmit} noValidate>
        <div>
          <label htmlFor="first-name">First Name</label>
          <input name="firstName" id="first-name"
                 value={firstName} onChange={this.handleChange}
                 required minLength={3} />
          <FieldFeedbacks for="firstName">
            <FieldFeedback when="tooShort">Too short</FieldFeedback>
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </div>

        <div>
          <label htmlFor="last-name">Last Name</label>
          <input name="lastName" id="last-name"
                 value={lastName} onChange={this.handleChange}
                 required minLength={3} />
          <FieldFeedbacks for="lastName">
            <FieldFeedback when="tooShort">Too short</FieldFeedback>
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </div>

        <div>
          <label htmlFor="username">Username <small>(already taken: john, paul, george, ringo)</small></label>
          <input name="username" id="username"
                 value={username} onChange={this.handleChange}
                 required minLength={3} />
          <FieldFeedbacks for="username">
            <FieldFeedback when="tooShort">Too short</FieldFeedback>
            <FieldFeedback when="*" />
            <Async
              promise={checkUsernameAvailability}
              then={available => available ?
                <FieldFeedback info style={{color: 'green'}}>Username available</FieldFeedback> :
                <FieldFeedback>Username already taken, choose another</FieldFeedback>
              }
            />
          </FieldFeedbacks>
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email"
                 value={email} onChange={this.handleChange}
                 required minLength={3} />
          <FieldFeedbacks for="email">
            <FieldFeedback when="tooShort">Too short</FieldFeedback>
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </div>

        <div>
          <label>Gender</label>
          <label>
            <input type="radio" name="gender"
                   value={Gender.Male} checked={gender === Gender.Male} onChange={this.handleChange}
                   required />
            Male
          </label>
          <label>
            <input type="radio" name="gender"
                   value={Gender.Female} checked={gender === Gender.Female} onChange={this.handleChange} />
            Female
          </label>
          <FieldFeedbacks for="gender">
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </div>

        <div>
          <label htmlFor="age">Age</label>
          <input type="number" name="age" id="age"
                 value={age} onChange={this.handleChange}
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
                 value={phone} onChange={this.handleChange}
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
            {colorKeys.map(colorKey => <option value={Color[colorKey as any]} key={colorKey}>{colorKey}</option>)}
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
            <input type="checkbox" name="isEmployed"
                   checked={isEmployed !== undefined ? isEmployed : false} onChange={this.handleChange} />
            Employed
          </label>
        </div>

        <div>
          <label htmlFor="notes">Notes</label>
          <textarea name="notes" id="notes"
                    value={notes} onChange={this.handleChange} />
        </div>

        <div>
          <label>
            <input type="checkbox" name="hasWebsite"
                   checked={hasWebsite !== undefined ? hasWebsite : false} onChange={this.handleHasWebsiteChange} />
            Do you have a website?
          </label>
        </div>

        {hasWebsite &&
          <div>
            <label htmlFor="website">Website</label>
            <input type="url" name="website" id="website"
                   value={website} onChange={this.handleChange}
                   required minLength={3} />
            <FieldFeedbacks for="website">
              <FieldFeedback when="*" />
            </FieldFeedbacks>
          </div>
        }

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password"
                 ref={passwordInput => this.passwordInput = passwordInput}
                 value={password} onChange={this.handleChange}
                 required pattern=".{5,}" />
          <FieldFeedbacks for="password">
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
                 value={passwordConfirm} onChange={this.handleChange} />
          <FieldFeedbacks for="passwordConfirm">
            <FieldFeedback when={value => value !== this.passwordInput!.value}>Not the same password</FieldFeedback>
          </FieldFeedbacks>
        </div>

        <button disabled={submitButtonDisabled}>Sign Up</button>
        <button type="button" onClick={this.handleReset}>Reset</button>

        <div>
          <pre>this.state = {JSON.stringify(this.state, null, 2)}</pre>
        </div>

        <DisplayFields />
      </FormWithConstraints>
    );
  }
}

ReactDOM.render(<Form />, document.getElementById('app'));
