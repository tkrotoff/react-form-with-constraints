import * as React from 'react';
import * as ReactDOM from 'react-dom';

import WizardForm from './WizardForm';

import './index.html';
import '../Password/style.css';

const App = () => (
  <div>
    <p>
      Inspired by <a href="https://redux-form.com/7.0.4/examples/wizard/">Redux Form - Wizard Form Example</a>
    </p>
    <WizardForm />
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));
