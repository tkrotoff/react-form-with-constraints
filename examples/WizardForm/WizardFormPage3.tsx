import * as React from 'react';

import { Input, FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';

import { Color, colorKeys } from './Color';

export interface Props {
  favoriteColor: '' | Color;
  employed?: boolean;
  notes?: string;
  previousPage: () => void;
  onChange: (input: Input) => void;
  onSubmit: () => void;
}

class WizardFormPage3 extends React.Component<Props> {
  form: FormWithConstraints | null | undefined;

  constructor(props: Props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.currentTarget;

    this.props.onChange(target);

    this.form!.validateFields(target);
  }

  async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await this.form!.validateForm();
    if (this.form!.isValid()) {
      this.props.onSubmit();
    }
  }

  render() {
    const { favoriteColor, employed, notes, previousPage } = this.props;

    return (
      <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}
                           onSubmit={this.handleSubmit} noValidate>
        <div>
          <label htmlFor="favorite-color">Favorite Color</label>
          <select name="favoriteColor" id="favorite-color"
                  value={favoriteColor} onChange={this.handleChange}
                  required>
            <option value="" disabled>Select a color...</option>
            {colorKeys.map(colorKey => <option value={Color[colorKey as any]} key={colorKey}>{colorKey}</option>)}
          </select>
          <FieldFeedbacks for="favoriteColor">
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </div>

        <div>
          <label>
            <input type="checkbox" name="employed"
                   checked={employed ? employed : false} onChange={this.handleChange} />
            Employed
          </label>
        </div>

        <div>
          <label htmlFor="notes">Notes</label>
          <textarea name="notes" id="notes"
                    value={notes} onChange={this.handleChange} />
        </div>

        <button type="button" onClick={previousPage}>Previous</button>
        &nbsp;
        <button>Submit</button>
      </FormWithConstraints>
    );
  }
}

export default WizardFormPage3;
