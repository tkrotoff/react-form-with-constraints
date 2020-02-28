import React from 'react';

import { Color } from './Color';
import { WizardFormStep1 } from './WizardFormStep1';
import { WizardFormStep2 } from './WizardFormStep2';
import { WizardFormStep3 } from './WizardFormStep3';

interface Props {}

interface State {
  step: number;

  firstName: string;
  lastName: string;
  email: string;
  favoriteColor: '' | Color;
}

export class WizardForm extends React.Component<Props, State> {
  state: State = {
    step: 1,

    firstName: '',
    lastName: '',
    email: '',
    favoriteColor: ''
  };

  handleChange = (target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;

    // FIXME See [Computed property key names should not be widened](https://github.com/Microsoft/TypeScript/issues/13948)
    // @ts-ignore
    this.setState({
      [target.name as keyof State]: value
    });
  };

  handleSubmit = () => {
    alert(`Form submitted\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
  };

  nextStep = () => {
    this.setState(prevState => ({ step: prevState.step + 1 }));
  };

  previousStep = () => {
    this.setState(prevState => ({ step: prevState.step - 1 }));
  };

  render() {
    const { step } = this.state;

    return (
      <>
        {step === 1 && (
          <WizardFormStep1 {...this.state} onChange={this.handleChange} nextPage={this.nextStep} />
        )}
        {step === 2 && (
          <WizardFormStep2
            {...this.state}
            previousPage={this.previousStep}
            onChange={this.handleChange}
            nextPage={this.nextStep}
          />
        )}
        {step === 3 && (
          <WizardFormStep3
            {...this.state}
            previousPage={this.previousStep}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
          />
        )}

        <div>
          <pre>this.state = {JSON.stringify(this.state, null, 2)}</pre>
        </div>
      </>
    );
  }
}
