import { useRef } from 'react';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import { Gender } from './Gender';

interface Props {
  email: string;
  gender?: Gender;
  previousPage: () => void;
  onChange: (input: HTMLInputElement) => void;
  nextPage: () => void;
}

export function WizardFormStep2({ email, gender, previousPage, onChange, nextPage }: Props) {
  const form = useRef<FormWithConstraints>(null);

  async function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    onChange(target);

    await form.current!.validateFields(target);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await form.current!.validateForm();
    if (form.current!.isValid()) {
      nextPage();
    }
  }

  return (
    <FormWithConstraints ref={form} onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={handleChange}
          required
        />
        <FieldFeedbacks for="email">
          <FieldFeedback when="*" />
        </FieldFeedbacks>
      </div>
      <div>
        <label>Gender</label>
        <label>
          <input
            type="radio"
            name="gender"
            value={Gender.Male}
            checked={gender === Gender.Male}
            onChange={handleChange}
            required
          />
          Male
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value={Gender.Female}
            checked={gender === Gender.Female}
            onChange={handleChange}
          />
          Female
        </label>
        <FieldFeedbacks for="gender">
          <FieldFeedback when="*" />
        </FieldFeedbacks>
      </div>
      <button type="button" onClick={previousPage}>
        Previous
      </button>
      &nbsp;
      <button type="submit">Next</button>
    </FormWithConstraints>
  );
}
