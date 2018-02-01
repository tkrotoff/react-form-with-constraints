import React from 'react';
import PropTypes from 'prop-types';

import { FormWithConstraintsChildContext } from './FormWithConstraints';
import { FieldFeedbacksChildContext, ListenerReturnType } from './FieldFeedbacks';
import { withValidateEventEmitter } from './withValidateEventEmitter';
// @ts-ignore
// TS6133: 'FieldFeedbackValidation' is declared but its value is never read.
// FIXME See https://github.com/Microsoft/TypeScript/issues/9944#issuecomment-309903027
import FieldFeedbackValidation from './FieldFeedbackValidation';
// @ts-ignore
// TS6133: 'EventEmitter' is declared but its value is never read.
// FIXME See https://github.com/Microsoft/TypeScript/issues/9944#issuecomment-309903027
import { EventEmitter } from './EventEmitter';
import Input from './Input';

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

export interface AsyncState<T> {
  status: Status;
  value?: T;
}

export interface AsyncChildContext {
  async: Async<any>;
}

export type AsyncContext = FormWithConstraintsChildContext & FieldFeedbacksChildContext;

export type AsyncComponentType = AsyncComponent<any>;

// See Asynchronous form errors and messages in AngularJS https://jaysoo.ca/2014/10/14/async-form-errors-and-messages-in-angularjs/
// See Support for asynchronous values (like Promises and Observables) https://github.com/facebook/react/issues/6481
// See https://github.com/capaj/react-promise
// See How to render promises in React https://gist.github.com/hex13/6d46f8b54631871ea8bf87576b635c49
// Cannot be inside a separated npm package since FieldFeedback needs to attach itself to Async
export class AsyncComponent<T = any> extends React.Component<AsyncProps<T>, AsyncState<T>> {}
export class Async<T> extends withValidateEventEmitter<ListenerReturnType, typeof AsyncComponent>(AsyncComponent)
                      implements React.ChildContextProvider<AsyncChildContext> {
  static contextTypes: React.ValidationMap<AsyncContext> = {
    form: PropTypes.object.isRequired,
    fieldFeedbacks: PropTypes.object.isRequired
  };
  context!: AsyncContext;

  static childContextTypes: React.ValidationMap<AsyncChildContext> = {
    async: PropTypes.object.isRequired
  };
  getChildContext(): AsyncChildContext {
    return {
      async: this
    };
  }

  constructor(props: AsyncProps<T>) {
    super(props);

    this.state = {
      status: Status.None
    };

    this.validate = this.validate.bind(this);
  }

  componentWillMount() {
    this.context.form.addValidateEventListener(this.validate);
  }

  componentWillUnmount() {
    this.context.form.removeValidateEventListener(this.validate);
  }

  validate(input: Input) {
    const { fieldFeedbacks } = this.context;
    const fieldName = fieldFeedbacks.props.for;

    let validationsPromise;

    if (input.name === fieldName) { // Ignore the event if it's not for us
      if (fieldFeedbacks.props.stop === 'first-error' && fieldFeedbacks.hasErrors()) {
        // No need to perform validation if another FieldFeedback is already invalid
      }
      else {
        this.setState({status: Status.Pending});

        validationsPromise = this.props.promise(input.value)

          // See Make setState return a promise https://github.com/facebook/react/issues/2642
          // The Promise returned is Promise<undefined>
          .then(value =>
                                                                                                // Instead of Promise<{}> given by TypeScript 2.6.2, verified inside vscode debugguer
            new Promise(resolve => this.setState({status: Status.Resolved, value}, resolve)) as Promise<undefined>
          )

          // setState() wrapped inside a promise so validate() Promise is done when setState() is done
          // The Promise returned is Promise<undefined>
          .catch(e =>
                                                                                                   // Instead of Promise<{}> given by TypeScript 2.6.2, verified inside vscode debugguer
            new Promise(resolve => this.setState({status: Status.Rejected, value: e}, resolve)) as Promise<undefined>
          )

          // See Promises: Execute something regardless of resolve/reject? https://stackoverflow.com/q/38830314
          // Instead of componentDidUpdate()
          // The Promise returned is Promise<FieldFeedbackValidation[]> (Promise<{key: number, isValid: boolean}[]>)
          .then(() => this.emitValidateEvent(input));
      }
    }

    return validationsPromise;
  }

  render() {
    const { props, state } = this;
    let element = null;

    switch (state.status) {
      case Status.None:
        break;
      case Status.Pending:
        if (props.pending) element = props.pending;
        break;
      case Status.Resolved:
        if (props.then) element = props.then(state.value);
        break;
      case Status.Rejected:
        if (props.catch) element = props.catch(state.value);
        break;
    }

    return element;
  }
}
