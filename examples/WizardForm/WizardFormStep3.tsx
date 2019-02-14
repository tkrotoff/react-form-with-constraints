import React, { useRef } from 'react';

import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';

import { Color, colorKeys } from './Color';

interface Props {
  favoriteColor: '' | Color;
  employed?: boolean;
  notes?: string;
  previousPage: () => void;
  onChange: (input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => void;
  onSubmit: () => void;
}

export default function WizardFormStep3(props: Props) {
  const form = useRef<FormWithConstraints | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.target;

    props.onChange(target);

    form.current!.validateFields(target);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await form.current!.validateForm();
    if (form.current!.isValid()) {
      props.onSubmit();
    }
  }

  return (
    <FormWithConstraints ref={form} onSubmit={handleSubmit} noValidate>
      <div>
        <label>
          Favorite Color
          <br />
          <select name="favoriteColor"
                  value={props.favoriteColor} onChange={handleChange}
                  required>
            <option value="" disabled>Select a color...</option>
            {colorKeys.map(colorKey => <option value={Color[colorKey as any]} key={colorKey}>{colorKey}</option>)}
          </select>
        </label>
        <FieldFeedbacks for="favoriteColor">
          <FieldFeedback when="*" />
        </FieldFeedbacks>
      </div>

      <div>
        <label>
          <input type="checkbox" name="employed"
                 checked={props.employed ? props.employed : false} onChange={handleChange} />
          Employed
        </label>
      </div>

      <div>
        <label htmlFor="notes">Notes</label>
        <textarea name="notes" id="notes"
                  value={props.notes} onChange={handleChange} />
      </div>

      <button type="button" onClick={props.previousPage}>Previous</button>
      &nbsp;
      <button>Submit</button>
    </FormWithConstraints>
  );
}
