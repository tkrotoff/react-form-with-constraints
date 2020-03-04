import React from 'react';
import ReactDOM from 'react-dom';

import { useFormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';

import './index.html';
import './style.css';

export function Form() {
  const { form, FormWithConstraints } = useFormWithConstraints();

  const [signUpButtonDisabled/*, setSignUpButtonDisabled*/] = React.useState(false);
  const [email, setEmail] = React.useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validates the non-dirty fields and returns the related FieldValidation structures
    const fields = await form.validateForm();

    // or simply use form.isValid()
    const formIsValid = fields.every(field => field.isValid());

    if (formIsValid) console.log('The form is valid');
    else console.log('The form is invalid');

    //setSignUpButtonDisabled(!formIsValid);
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target;
    const value = target.value;

    // Validates only the given field and returns the related FieldValidation structures
    const fields = await form.validateFields(target);

    setEmail(value);

    const fieldIsValid = fields.every(fieldFeedbacksValidation => fieldFeedbacksValidation.isValid());
    if (fieldIsValid) console.log(`Field '${target.name}' is valid`);
    else console.log(`Field '${target.name}' is invalid`);

    if (form.isValid()) console.log('The form is valid');
    else console.log('The form is invalid');

    //setSignUpButtonDisabled(!form.isValid());
  }

  function render() {
    return (
      <FormWithConstraints key={1} onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email"
                 value={email} onChange={handleChange}
                 required minLength={5} />
          <FieldFeedbacks key={11} for="email">
            <FieldFeedback key={111} when="tooShort">Too short</FieldFeedback>
            <FieldFeedback key={112} when="*" />
            {/* <FieldFeedback key={113} when="valid">Looks good!</FieldFeedback> */}
          </FieldFeedbacks>
        </div>

        <button disabled={signUpButtonDisabled}>Sign Up</button>
      </FormWithConstraints>
    );
  }

  return render();
}

ReactDOM.render(<Form />, document.getElementById('app'));
