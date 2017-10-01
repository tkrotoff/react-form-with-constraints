import * as React from 'react';

import { Input, FormWithConstraints, FieldFeedbacks, FieldFeedback } from '../../src/index';

import Sex from './Sex';

export interface Props {
  email?: string;
  sex?: Sex;
  previousPage: () => void;
  onChange: (input: Input) => void;
  nextPage: () => void;
}

class WizardFormPage2 extends React.Component<Props> {
  form: FormWithConstraints;

  constructor(props: Props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.currentTarget;

    this.form.validateFields(target);

    this.props.onChange(target);
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    this.form.validateFields();

    if (this.form.isValid()) {
      this.props.nextPage();
    }
  }

  render() {
    const { email, sex, previousPage } = this.props;

    return (
      <FormWithConstraints ref={(formWithConstraints: any) => this.form = formWithConstraints}
                           onSubmit={this.handleSubmit} noValidate>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email"
                 value={email} onChange={this.handleChange}
                 required />
          <FieldFeedbacks for="email">
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </div>

        <div>
          <label>Sex</label>
          <label>
            <input type="radio" name="sex"
                   value={'male'} checked={sex === 'male'} onChange={this.handleChange}
                   required />
            Male
          </label>
          <label>
            <input type="radio" name="sex"
                   value={'female'} checked={sex === 'female'} onChange={this.handleChange} />
            Female
          </label>
          <FieldFeedbacks for="sex">
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </div>

        <button type="button" onClick={previousPage}>Previous</button>
        &nbsp;
        <button>Next</button>
      </FormWithConstraints>
    );
  }
}

export default WizardFormPage2;
