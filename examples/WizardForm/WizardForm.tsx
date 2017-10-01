import * as React from 'react';

import { Input } from '../../src/index';

import WizardFormPage1 from './WizardFormPage1';
import WizardFormPage2 from './WizardFormPage2';
import WizardFormPage3 from './WizardFormPage3';

export interface Props {}

export interface State {
  page: number;
}

class WizardForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);

    this.state = {
      page: 1
    };
  }

  handleChange(input: Input) {
    const value = input.type === 'checkbox' ? (input as HTMLInputElement).checked : input.value;

    this.setState({[input.name]: value} as any);
  }

  handleSubmit() {
    alert(`Form submitted\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
  }

  nextPage() {
    this.setState({page: this.state.page + 1});
  }

  previousPage() {
    this.setState({page: this.state.page - 1});
  }

  render() {
    const { page } = this.state;

    return (
      <div>
        {page === 1 && <WizardFormPage1 {...this.state} onChange={this.handleChange} nextPage={this.nextPage} />}
        {page === 2 && <WizardFormPage2 {...this.state} previousPage={this.previousPage} onChange={this.handleChange} nextPage={this.nextPage} />}
        {page === 3 && <WizardFormPage3 {...this.state} previousPage={this.previousPage} onChange={this.handleChange} onSubmit={this.handleSubmit} />}

        <div>
          <pre>this.state = {JSON.stringify(this.state, null, 2)}</pre>
        </div>
      </div>
    );
  }
}

export default WizardForm;
