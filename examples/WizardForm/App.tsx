import { createRoot } from 'react-dom/client';

import { WizardForm } from './WizardForm';
import './index.html';
import './style.css';

function App() {
  return (
    <>
      <p>
        Inspired by{' '}
        <a href="https://redux-form.com/7.0.4/examples/wizard/">Redux Form - Wizard Form Example</a>
      </p>
      <WizardForm />
    </>
  );
}

const root = createRoot(document.getElementById('app')!);
root.render(<App />);
