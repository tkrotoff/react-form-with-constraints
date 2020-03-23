import React from 'react';
import ReactDOM from 'react-dom';
import { debounce, isEqual, omit } from 'lodash';
import { Trans, withTranslation, WithTranslation } from 'react-i18next';

import {
  FormWithConstraints,
  FieldFeedbacks,
  FieldFeedback,
  Async as _Async,
  AsyncProps
} from 'react-form-with-constraints';
import { DisplayFields } from 'react-form-with-constraints-tools';

import './i18n';
import { Loader } from './Loader';
import { Gender } from './Gender';
import './index.html';
import './style.css';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkUsernameAvailability(value: string) {
  console.log('checkUsernameAvailability');
  await sleep(1000);
  return !['john', 'paul', 'george', 'ringo'].includes(value.toLowerCase());
}

// Async with a default React component for pending state
function Async<T>({ promise, then, catch: _catch }: AsyncProps<T>) {
  return <_Async promise={promise} pending={<Loader />} then={then} catch={_catch} />;
}

const VALIDATE_DEBOUNCE_WAIT = 1000;

interface Props extends WithTranslation {}

interface State {
  language: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender?: Gender;
  age: string;
  phone: string;
  favoriteColor?: string;
  isEmployed?: boolean;
  notes: string;
  hasWebsite?: boolean;
  website: string;
  password: string;
  passwordConfirm: string;
  signUpButtonDisabled: boolean;
  resetButtonDisabled: boolean;
}

class SignUp extends React.Component<Props, State> {
  form: FormWithConstraints | null = null;
  passwordInput: HTMLInputElement | null = null;

  state: State = this.getInitialState();

  private getInitialState() {
    return {
      // en-US => en, fr-FR => fr
      // eslint-disable-next-line react/destructuring-assignment
      language: this.props.i18n.language.substring(0, 2),

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
      signUpButtonDisabled: false,
      resetButtonDisabled: true
    };
  }

  // eslint-disable-next-line react/sort-comp
  handleChange = async (
    { target }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    _debounce = true
  ) => {
    await this._handleChange(target, _debounce, true);
  };

  _handleChange = async (
    target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
    _debounce: boolean,
    forceValidateFields: boolean
  ) => {
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;

    // FIXME [Computed property key names should not be widened](https://github.com/Microsoft/TypeScript/issues/13948)
    // @ts-ignore
    this.setState({
      [target.name as keyof State]: value
    });

    await this.validateFields(target, _debounce, forceValidateFields);
  };

  handleBlur = async ({
    target
  }: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    await this._handleChange(target, false, false);
  };

  handleLanguageChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.i18n.changeLanguage(target.value);

    // FIXME [Computed property key names should not be widened](https://github.com/Microsoft/TypeScript/issues/13948)
    // @ts-ignore
    this.setState({
      [target.name as keyof State]: target.value
    });
  };

  private shouldDisableResetButton(state: State) {
    const omitList = ['signUpButtonDisabled', 'resetButtonDisabled'];
    return (
      isEqual(omit(this.getInitialState(), omitList), omit(state, omitList)) &&
      !this.form!.hasFeedbacks()
    );
  }

  async validateFieldsWithoutDebounce(
    target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
    forceValidateFields: boolean
  ) {
    if (forceValidateFields) {
      await this.form!.validateFields(target);
    } else {
      await this.form!.validateFieldsWithoutFeedback(target);
    }

    this.setState(prevState => ({
      signUpButtonDisabled: !this.form!.isValid(),
      resetButtonDisabled: this.shouldDisableResetButton(prevState)
    }));
  }
  validateFieldsWithDebounce = debounce(this.validateFieldsWithoutDebounce, VALIDATE_DEBOUNCE_WAIT);

  previousValidateFields: string | undefined;

  async validateFields(
    target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
    _debounce: boolean,
    forceValidateFields: boolean
  ) {
    // Flush the previous debounce if input is not the same otherwise validateFields(input2) will overwrite validateFields(input1)
    // if the user changes input2 before validateFields(input1) is called
    if (this.previousValidateFields !== target.name) {
      this.validateFieldsWithDebounce.flush();
    }
    this.previousValidateFields = target.name;

    if (forceValidateFields) this.form!.resetFields(target);

    if (_debounce) {
      await this.validateFieldsWithDebounce(target, forceValidateFields);
    } else {
      await this.validateFieldsWithoutDebounce(target, forceValidateFields);
    }
  }

  handleHasWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hasWebsite = e.target.checked;

    if (!hasWebsite) {
      // Reset this.state.website if it was previously filled
      this.setState({ website: '' });
    }

    this.handleChange(e);
  };

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await this.form!.validateForm();
    const formIsValid = this.form!.isValid();

    this.setState(prevState => ({
      signUpButtonDisabled: !formIsValid,
      resetButtonDisabled: this.shouldDisableResetButton(prevState)
    }));

    if (formIsValid) {
      alert(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
    }
  };

  handleReset = () => {
    this.setState(this.getInitialState());
    this.form!.resetFields();
    this.setState({ resetButtonDisabled: true });
  };

  render() {
    const { t } = this.props;

    const {
      language,
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
      signUpButtonDisabled,
      resetButtonDisabled
    } = this.state;

    const Color: { [index: string]: string } = {
      Red: t('Red'),
      Orange: t('Orange'),
      Yellow: t('Yellow'),
      Green: t('Green'),
      Blue: t('Blue'),
      Indigo: t('Indigo'),
      Violet: t('Violet')
    };
    const colorKeys = Object.keys(Color);

    return (
      <>
        <label>
          {t('Language:')}{' '}
          <select name="language" value={language} onChange={this.handleLanguageChange}>
            <option value="en">{t('English')}</option>
            <option value="fr">{t('French')}</option>
          </select>
        </label>

        <br />
        <br />

        <Trans>Note: each field is debounced with a 1s delay</Trans>

        <br />
        <br />

        <FormWithConstraints
          ref={formWithConstraints => (this.form = formWithConstraints)}
          onSubmit={this.handleSubmit}
          noValidate
        >
          <div>
            <label htmlFor="first-name">{t('First Name')}</label>
            <input
              name="firstName"
              id="first-name"
              value={firstName}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              required
              minLength={3}
            />
            <FieldFeedbacks for="firstName">
              <FieldFeedback when="tooShort">{t('Too short')}</FieldFeedback>
              <FieldFeedback when="*" />
              <FieldFeedback when="valid">{t('Looks good!')}</FieldFeedback>
            </FieldFeedbacks>
          </div>

          <div>
            <label htmlFor="last-name">{t('Last Name')}</label>
            <input
              name="lastName"
              id="last-name"
              value={lastName}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              required
              minLength={3}
            />
            <FieldFeedbacks for="lastName">
              <FieldFeedback when="tooShort">{t('Too short')}</FieldFeedback>
              <FieldFeedback when="*" />
              <FieldFeedback when="valid">{t('Looks good!')}</FieldFeedback>
            </FieldFeedbacks>
          </div>

          <div>
            <label htmlFor="username">
              <Trans>
                Username <small>(already taken: john, paul, george, ringo)</small>
              </Trans>
            </label>
            <input
              name="username"
              id="username"
              value={username}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              required
              minLength={3}
            />
            <FieldFeedbacks for="username">
              <FieldFeedback when="tooShort">{t('Too short')}</FieldFeedback>
              <FieldFeedback when="*" />
              <Async
                promise={checkUsernameAvailability}
                then={available =>
                  available ? (
                    <FieldFeedback key="1" info style={{ color: 'green' }}>
                      {t('Username available')}
                    </FieldFeedback>
                  ) : (
                    <FieldFeedback key="2">
                      {t('Username already taken, choose another')}
                    </FieldFeedback>
                  )
                }
              />
              <FieldFeedback when="valid">{t('Looks good!')}</FieldFeedback>
            </FieldFeedbacks>
          </div>

          <div>
            <label htmlFor="email">{t('Email')}</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              required
              minLength={5}
            />
            <FieldFeedbacks for="email">
              <FieldFeedback when="tooShort">{t('Too short')}</FieldFeedback>
              <FieldFeedback when="*" />
              <FieldFeedback when="valid">{t('Looks good!')}</FieldFeedback>
            </FieldFeedbacks>
          </div>

          <div>
            <label>{t('Gender')}</label>
            <label>
              <input
                type="radio"
                name="gender"
                value={Gender.Male}
                checked={gender === Gender.Male}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                required
              />
              {t('Male')}
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value={Gender.Female}
                checked={gender === Gender.Female}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
              />
              {t('Female')}
            </label>
            <FieldFeedbacks for="gender">
              <FieldFeedback when="*" />
            </FieldFeedbacks>
          </div>

          <div>
            <label htmlFor="age">{t('Age')}</label>
            <input
              type="number"
              name="age"
              id="age"
              value={age}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              required
            />
            <FieldFeedbacks for="age">
              <FieldFeedback when="*" />
              <FieldFeedback when={value => Number(value) < 18}>
                {t('Sorry, you must be at least 18 years old')}
              </FieldFeedback>
              <FieldFeedback when={value => Number(value) < 19} warning>
                {t('Hmm, you seem a bit young...')}
              </FieldFeedback>
              <FieldFeedback when="valid">{t('Looks good!')}</FieldFeedback>
            </FieldFeedbacks>
          </div>

          <div>
            <label htmlFor="phone">{t('Phone number')}</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={phone}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              required
            />
            <FieldFeedbacks for="phone">
              <FieldFeedback when="*" />
              <FieldFeedback when={value => !/^\d{10}$/.test(value)}>
                {t('Invalid phone number, must be 10 digits')}
              </FieldFeedback>
              <FieldFeedback when="valid">{t('Looks good!')}</FieldFeedback>
            </FieldFeedbacks>
          </div>

          <div>
            <label>
              {t('Favorite Color')}
              <br />
              {/* https://github.com/facebook/react/issues/4085#issuecomment-262990423 */}
              <select
                name="favoriteColor"
                value={favoriteColor || ''}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                required
              >
                <option value="" disabled>
                  {t('Select a color...')}
                </option>
                {colorKeys.map(colorKey => (
                  <option value={colorKey} key={colorKey}>
                    {Color[colorKey]}
                  </option>
                ))}
              </select>
            </label>
            <FieldFeedbacks for="favoriteColor">
              <FieldFeedback when="*" />
              <FieldFeedback when="valid">{t('Looks good!')}</FieldFeedback>
            </FieldFeedbacks>
          </div>

          {favoriteColor && (
            <div
              style={{
                height: 80,
                width: 200,
                backgroundColor: favoriteColor
              }}
            />
          )}

          <div>
            <label>
              <input
                type="checkbox"
                name="isEmployed"
                checked={isEmployed || false}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
              />
              {t('Employed')}
            </label>
          </div>

          <div>
            <label htmlFor="notes">{t('Notes')}</label>
            <textarea
              name="notes"
              id="notes"
              value={notes}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
            />
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                name="hasWebsite"
                checked={hasWebsite || false}
                onChange={this.handleHasWebsiteChange}
                onBlur={this.handleBlur}
              />
              {t('Do you have a website?')}
            </label>
          </div>

          {hasWebsite && (
            <div>
              <label htmlFor="website">{t('Website')}</label>
              <input
                type="url"
                name="website"
                id="website"
                value={website}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                required
                minLength={3}
              />
              <FieldFeedbacks for="website">
                <FieldFeedback when="*" />
                <FieldFeedback when="valid">{t('Looks good!')}</FieldFeedback>
              </FieldFeedbacks>
            </div>
          )}

          <div>
            <label htmlFor="password">{t('Password')}</label>
            <input
              type="password"
              name="password"
              id="password"
              ref={passwordInput => (this.passwordInput = passwordInput)}
              value={password}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              required
              pattern=".{5,}"
            />
            <FieldFeedbacks for="password">
              <FieldFeedback when="valueMissing" />
              <FieldFeedback when="patternMismatch">
                {t('Should be at least 5 characters long')}
              </FieldFeedback>
              <FieldFeedback when={value => !/\d/.test(value)} warning>
                {t('Should contain numbers')}
              </FieldFeedback>
              <FieldFeedback when={value => !/[a-z]/.test(value)} warning>
                {t('Should contain small letters')}
              </FieldFeedback>
              <FieldFeedback when={value => !/[A-Z]/.test(value)} warning>
                {t('Should contain capital letters')}
              </FieldFeedback>
              <FieldFeedback when={value => !/\W/.test(value)} warning>
                {t('Should contain special characters')}
              </FieldFeedback>
              <FieldFeedback when="valid">{t('Looks good!')}</FieldFeedback>
            </FieldFeedbacks>
          </div>

          <div>
            <label htmlFor="password-confirm">{t('Confirm Password')}</label>
            <input
              type="password"
              name="passwordConfirm"
              id="password-confirm"
              value={passwordConfirm}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
            />
            <FieldFeedbacks for="passwordConfirm">
              <FieldFeedback when={value => value !== this.passwordInput!.value}>
                {t('Not the same password')}
              </FieldFeedback>
            </FieldFeedbacks>
          </div>

          <button type="submit" disabled={signUpButtonDisabled}>
            {t('Sign Up')}
          </button>
          <button type="button" onClick={this.handleReset} disabled={resetButtonDisabled}>
            {t('Reset')}
          </button>

          <div>
            <pre>this.state = {JSON.stringify(this.state, null, 2)}</pre>
          </div>

          <pre>
            <small>
              Fields = <DisplayFields />
            </small>
          </pre>
        </FormWithConstraints>
      </>
    );
  }
}

const SignUpTranslated = withTranslation()(SignUp);
ReactDOM.render(<SignUpTranslated />, document.getElementById('app'));
