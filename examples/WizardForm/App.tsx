import * as React from 'react';
import * as ReactDOM from 'react-dom';

import WizardForm from './WizardForm';

import './index.html';
import '../Password/style.css';

const App = () => (
  <div>
    <p>
      Taken and adapted from <a href="https://redux-form.com/7.0.4/examples/wizard/">Redux Form - Wizard Form Example</a>
      <br />
      Original code: <a href="https://codesandbox.io/s/0Qzz3843">https://codesandbox.io/s/0Qzz3843</a>
    </p>
    <WizardForm />
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));
