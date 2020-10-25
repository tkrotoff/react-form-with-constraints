import React, { useRef } from 'react';
import { FieldFeedback, FieldFeedbacks, FormWithConstraints } from 'react-form-with-constraints';

import { Color, colorKeys } from './Color';

interface Props {
  favoriteColor: '' | Color;
  employed?: boolean;
  notes?: string;
  previousPage: () => void;
  onChange: (input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => void;
  onSubmit: () => void;
}

export function WizardFormStep3(props: Props) {
  const form = useRef<FormWithConstraints | null>(null);

  async function handleChange({
    target
  }: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) {
    props.onChange(target);

    await form.current!.validateFields(target);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await form.current!.validateForm();
    if (form.current!.isValid()) {
      props.onSubmit();
    }
  }

  const { favoriteColor, employed, notes, previousPage } = props;

  return (
    <FormWithConstraints ref={form} onSubmit={handleSubmit} noValidate>
      <div>
        <label>
          Favorite Color
          <br />
          <select name="favoriteColor" value={favoriteColor} onChange={handleChange} required>
            <option value="" disabled>
              Select a color...
            </option>
            {colorKeys.map(colorKey => (
              <option value={Color[colorKey]} key={colorKey}>
                {colorKey}
              </option>
            ))}
          </select>
        </label>
        <FieldFeedbacks for="favoriteColor">
          <FieldFeedback when="*" />
        </FieldFeedbacks>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="employed"
            checked={employed || false}
            onChange={handleChange}
          />
          Employed
        </label>
      </div>
      <div>
        <label htmlFor="notes">Notes</label>
        <textarea name="notes" id="notes" value={notes} onChange={handleChange} />
      </div>
      <button type="button" onClick={previousPage}>
        Previous
      </button>
      &nbsp;
      <button type="submit">Submit</button>
    </FormWithConstraints>
  );
}
