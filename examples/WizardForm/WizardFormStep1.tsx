import { useRef } from 'react';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

interface Props {
  firstName: string;
  lastName: string;
  onChange: (input: HTMLInputElement) => void;
  nextPage: () => void;
}

export function WizardFormStep1({ firstName, lastName, onChange, nextPage }: Props) {
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
        <label htmlFor="first-name">First Name</label>
        <input
          name="firstName"
          id="first-name"
          value={firstName}
          onChange={handleChange}
          required
          minLength={3}
        />
        <FieldFeedbacks for="firstName">
          <FieldFeedback when="tooShort">Too short</FieldFeedback>
          <FieldFeedback when="*" />
        </FieldFeedbacks>
      </div>

      <div>
        <label htmlFor="last-name">Last Name</label>
        <input
          name="lastName"
          id="last-name"
          value={lastName}
          onChange={handleChange}
          required
          minLength={3}
        />
        <FieldFeedbacks for="lastName">
          <FieldFeedback when="tooShort">Too short</FieldFeedback>
          <FieldFeedback when="*" />
        </FieldFeedbacks>
      </div>

      <button type="submit">Next</button>
    </FormWithConstraints>
  );
}
