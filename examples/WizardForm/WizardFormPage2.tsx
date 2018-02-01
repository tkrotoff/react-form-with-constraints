import React from 'react';

import { Input, FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';

import Gender from './Gender';

export interface Props {
  email: string;
  gender?: Gender;
  previousPage: () => void;
  onChange: (input: Input) => void;
  nextPage: () => void;
}

class WizardFormPage2 extends React.Component<Props> {
  form: FormWithConstraints | null | undefined;

  constructor(props: Props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.currentTarget;

    this.props.onChange(target);

    this.form!.validateFields(target);
  }

  async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await this.form!.validateForm();
    if (this.form!.isValid()) {
      this.props.nextPage();
    }
  }

  render() {
    const { email, gender, previousPage } = this.props;

    return (
      <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}
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
          <label>Gender</label>
          <label>
            <input type="radio" name="gender"
                   value={Gender.Male} checked={gender === Gender.Male} onChange={this.handleChange}
                   required />
            Male
          </label>
          <label>
            <input type="radio" name="gender"
                   value={Gender.Female} checked={gender === Gender.Female} onChange={this.handleChange} />
            Female
          </label>
          <FieldFeedbacks for="gender">
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
