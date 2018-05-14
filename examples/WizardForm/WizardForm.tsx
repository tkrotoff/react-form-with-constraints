import React from 'react';

import { InputElement } from 'react-form-with-constraints';

import { Color } from './Color';
import WizardFormPage1 from './WizardFormPage1';
import WizardFormPage2 from './WizardFormPage2';
import WizardFormPage3 from './WizardFormPage3';

export interface Props {}

export interface State {
  page: number;

  firstName: string;
  lastName: string;
  email: string;
  favoriteColor: '' | Color;
}

class WizardForm extends React.Component<Props, State> {
  state: State = {
    page: 1,

    firstName: '',
    lastName: '',
    email: '',
    favoriteColor: ''
  };

  handleChange = (input: InputElement) => {
    const value = input.type === 'checkbox' ? (input as HTMLInputElement).checked : input.value;

    this.setState({[input.name as any]: value});
  }

  handleSubmit = () => {
    alert(`Form submitted\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
  }

  nextPage = () => {
    this.setState({page: this.state.page + 1});
  }

  previousPage = () => {
    this.setState({page: this.state.page - 1});
  }

  render() {
    const { page } = this.state;

    return (
      <>
        {page === 1 && <WizardFormPage1 {...this.state} onChange={this.handleChange} nextPage={this.nextPage} />}
        {page === 2 && <WizardFormPage2 {...this.state} previousPage={this.previousPage} onChange={this.handleChange} nextPage={this.nextPage} />}
        {page === 3 && <WizardFormPage3 {...this.state} previousPage={this.previousPage} onChange={this.handleChange} onSubmit={this.handleSubmit} />}

        <div>
          <pre>this.state = {JSON.stringify(this.state, null, 2)}</pre>
        </div>
      </>
    );
  }
}

export default WizardForm;
