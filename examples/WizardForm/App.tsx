import React from 'react';
import ReactDOM from 'react-dom';

import WizardForm from './WizardForm';

import './index.html';
import '../Password/style.css';

const App = () => (
  <>
    <p>
      Inspired by <a href="https://redux-form.com/7.0.4/examples/wizard/">Redux Form - Wizard Form Example</a>
    </p>
    <WizardForm />
  </>
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app')
);
