// @ts-check

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';

import './index.html';

class Form extends FormWithConstraints {
  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)} noValidate>
        <input type="email" name="username" defaultValue="John Doe" onChange={this.handleChange.bind(this)} required />
        <FieldFeedbacks for="username">
          <FieldFeedback when="*" />
        </FieldFeedbacks>

        <button>Submit</button>
      </form>
    );
  }
}

ReactDOM.render(<Form />, document.getElementById('app'));
