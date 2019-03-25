import React, { useRef } from 'react';

import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';

import Gender from './Gender';

interface Props {
  email: string;
  gender?: Gender;
  previousPage: () => void;
  onChange: (input: HTMLInputElement) => void;
  nextPage: () => void;
}

export default function WizardFormStep2(props: Props) {
  const form = useRef<FormWithConstraints | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target;

    props.onChange(target);

    form.current!.validateFields(target);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await form.current!.validateForm();
    if (form.current!.isValid()) {
      props.nextPage();
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
          value={props.email}
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
            checked={props.gender === Gender.Male}
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
            checked={props.gender === Gender.Female}
            onChange={handleChange}
          />
          Female
        </label>
        <FieldFeedbacks for="gender">
          <FieldFeedback when="*" />
        </FieldFeedbacks>
      </div>
      <button type="button" onClick={props.previousPage}>
        Previous
      </button>
      &nbsp;
      <button>Next</button>
    </FormWithConstraints>
  );
}
