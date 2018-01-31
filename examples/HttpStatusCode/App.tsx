import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';

import './index.html';
import '../Password/style.css';

interface Props {}

interface State {
  [name: string]: string;

  httpStatusCode: string;
}

class Form extends React.Component<Props, State> {
  form: FormWithConstraints;

  constructor(props: Props) {
    super(props);

    this.state = {
      httpStatusCode: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.currentTarget;

    this.setState({[target.name]: target.value});

    this.form.validateFields(target);
  }

  async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await this.form.validateForm();
    if (this.form.isValid()) {
      alert(`Valid form\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);
    } else {
      alert('Invalid form');
    }
  }

  render() {
    return (
      <FormWithConstraints ref={formWithConstraints => this.form = formWithConstraints!}
                           onSubmit={this.handleSubmit} noValidate>
        <div>
          <label htmlFor="http-status-code">HTTP Status code (enter 200, 404, 500, 503)</label>
          {/* onChange() does not work properly with <input type="number">, see https://github.com/facebook/react/issues/11142 */}
          <input type="number" name="httpStatusCode" id="http-status-code"
                 value={this.state.httpStatusCode} onInput={this.handleChange}
                 min={100} max={599} required />
          <FieldFeedbacks for="httpStatusCode">
            <FieldFeedback when="*" />
            <FieldFeedback when={value => value === '200'} info>{this.state.httpStatusCode} OK</FieldFeedback>
            <FieldFeedback when={value => value === '404'} info>{this.state.httpStatusCode} Not Found</FieldFeedback>
            <FieldFeedback when={value => value === '500'} info>{this.state.httpStatusCode} Internal Server Error</FieldFeedback>
            <FieldFeedback when={value => value === '503'} info>{this.state.httpStatusCode} Service Unavailable</FieldFeedback>
          </FieldFeedbacks>
        </div>

        <button>Submit</button>
      </FormWithConstraints>
    );
  }
}

const App = () => (
  <div>
    <p>
      Inspired by <a href="http://codepen.io/nukos/pen/RPwxBp">http://codepen.io/nukos/pen/RPwxBp</a>
    </p>
    <Form />
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));
