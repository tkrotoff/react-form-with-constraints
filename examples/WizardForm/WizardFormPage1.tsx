import React from 'react';

import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';

export interface Props {
  firstName: string;
  lastName: string;
  onChange: (input: HTMLInputElement) => void;
  nextPage: () => void;
}

class WizardFormPage1 extends React.Component<Props> {
  form: FormWithConstraints | null = null;

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;

    this.props.onChange(target);

    this.form!.validateFields(target);
  }

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await this.form!.validateForm();
    if (this.form!.isValid()) {
      this.props.nextPage();
    }
  }

  render() {
    const { firstName, lastName } = this.props;

    return (
      <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints}
                           onSubmit={this.handleSubmit} noValidate>
        <div>
          <label htmlFor="first-name">First Name</label>
          <input name="firstName" id="first-name"
                 value={firstName} onChange={this.handleChange}
                 required minLength={3} />
          <FieldFeedbacks for="firstName">
            <FieldFeedback when="tooShort">Too short</FieldFeedback>
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </div>

        <div>
          <label htmlFor="last-name">Last Name</label>
          <input name="lastName" id="last-name"
                 value={lastName} onChange={this.handleChange}
                 required minLength={3} />
          <FieldFeedbacks for="lastName">
            <FieldFeedback when="tooShort">Too short</FieldFeedback>
            <FieldFeedback when="*" />
          </FieldFeedbacks>
        </div>

        <button>Next</button>
      </FormWithConstraints>
    );
  }
}

export default WizardFormPage1;
