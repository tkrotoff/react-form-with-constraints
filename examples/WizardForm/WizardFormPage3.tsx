import * as React from 'react';

import { Input, FormWithConstraints, FieldFeedbacks, FieldFeedback } from '../../src/index';

import { Color, colors } from './Color';

export interface Props {
  favoriteColor?: Color;
  employed?: boolean;
  notes?: string;
  previousPage: () => void;
  onChange: (input: Input) => void;
  onSubmit: () => void;
}

class WizardFormPage3 extends React.Component<Props> {
  form: FormWithConstraints;

  constructor(props: Props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.currentTarget;

    this.form.validateFields(target);

    this.props.onChange(target);
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    this.form.validateFields();

    if (this.form.isValid()) {
      this.props.onSubmit();
    }
  }

  render() {
    const { favoriteColor, employed, notes, previousPage } = this.props;

    return (
      <FormWithConstraints ref={(formWithConstraints: any) => this.form = formWithConstraints}
                           onSubmit={this.handleSubmit} noValidate>
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

        <div>
          <label>
            <input type="checkbox" name="employed"
                   checked={employed} onChange={this.handleChange} />
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
