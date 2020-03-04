import * as React from 'react';

import { FormWithConstraintsContext } from './FormWithConstraints';
import { FieldFeedbacksContext } from './FieldFeedbacks';
import { withValidateFieldEventEmitter } from './withValidateFieldEventEmitter';
import FieldFeedbackValidation from './FieldFeedbackValidation';
import { InputElement } from './InputElement';

export enum Status {
  None,
  Pending,
  Rejected,
  Resolved
}

export interface AsyncProps<T> {
  promise: (value: string) => Promise<T>;
  pending?: React.ReactNode;
  then?: (value: T) => React.ReactNode;
  catch?: (reason: any) => React.ReactNode;
}

export const AsyncContext = React.createContext<AsyncApi | undefined>(undefined);

// See Asynchronous form errors and messages in AngularJS https://jaysoo.ca/2014/10/14/async-form-errors-and-messages-in-angularjs/
// See Support for asynchronous values (like Promises and Observables) https://github.com/facebook/react/issues/6481
// See https://github.com/capaj/react-promise
// See How to render promises in React https://gist.github.com/hex13/6d46f8b54631871ea8bf87576b635c49
// Cannot be inside a separated npm package since FieldFeedback needs to attach itself to Async
export function Async<T>(props: AsyncProps<T>) {
  const form = React.useContext(FormWithConstraintsContext)!;
  const fieldFeedbacks = React.useContext(FieldFeedbacksContext)!;

  const api = new AsyncApi();

  const [status, setStatus] = React.useState<Status>(Status.None);
  const [value, setValue] = React.useState<T | undefined>(undefined);

  React.useEffect(() => {
    fieldFeedbacks.addValidateFieldEventListener(validate);

    return function cleanup() {
      fieldFeedbacks.removeValidateFieldEventListener(validate);
    };
  }, []);

  function validate(input: InputElement) {
    let validations;

    const field = form.fieldsStore.getField(input.name)!;

    if (fieldFeedbacks.props.stop === 'first' && field.hasFeedbacks(fieldFeedbacks.id) ||
        fieldFeedbacks.props.stop === 'first-error' && field.hasErrors(fieldFeedbacks.id) ||
        fieldFeedbacks.props.stop === 'first-warning' && field.hasWarnings(fieldFeedbacks.id) ||
        fieldFeedbacks.props.stop === 'first-info' && field.hasInfos(fieldFeedbacks.id)) {
      // Reset UI
      setStatus(Status.None);
    }
    else {
      validations = _validate(input);
    }

    return validations;
  }

  async function _validate(input: InputElement) {
    setStatus(Status.Pending);
    try {
      const tmp = await props.promise(input.value);
      setStatus(Status.Resolved);
      setValue(tmp);
    } catch (e) {
      setStatus(Status.Rejected);
      setValue(e);
    }

    return api.emitValidateFieldEvent(input);
  }

  function render() {
    let element = null;

    switch (status) {
      case Status.None:
        break;
      case Status.Pending:
        if (props.pending) element = props.pending;
        break;
      case Status.Resolved:
        if (props.then) element = props.then(value!);
        break;
      case Status.Rejected:
        if (props.catch) element = props.catch(value);
        break;
    }

    return (
      <AsyncContext.Provider value={api}>
        {element}
      </AsyncContext.Provider>
    );
  }

  return render();
}

export class AsyncApi
  extends
    withValidateFieldEventEmitter<
      // FieldFeedback returns FieldFeedbackValidation
      FieldFeedbackValidation,
      typeof Object
    >(Object) {
}
