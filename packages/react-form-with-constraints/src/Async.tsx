import * as React from 'react';
import { instanceOf } from 'prop-types';

import { assert } from './assert';
import { FieldFeedbacks, FieldFeedbacksChildContext } from './FieldFeedbacks';
import { FieldFeedbackValidation } from './FieldFeedbackValidation';
import { FormWithConstraints, FormWithConstraintsChildContext } from './FormWithConstraints';
import { InputElement } from './InputElement';
import { withValidateFieldEventEmitter } from './withValidateFieldEventEmitter';

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

interface AsyncState<T> {
  status: Status;
  value?: T | unknown /* Error */;
}

export interface AsyncChildContext {
  async: Async<any>;
}

export type AsyncContext = FormWithConstraintsChildContext & FieldFeedbacksChildContext;

// [Asynchronous form errors and messages in AngularJS](https://jaysoo.ca/2014/10/14/async-form-errors-and-messages-in-angularjs/)
// [Support for asynchronous values (like Promises and Observables)](https://github.com/facebook/react/issues/6481)
// https://github.com/capaj/react-promise
// [How to render promises in React](https://gist.github.com/hex13/6d46f8b54631871ea8bf87576b635c49)
// Cannot be inside a separated npm package since FieldFeedback needs to attach itself to Async
class AsyncComponent<T = any> extends React.PureComponent<AsyncProps<T>, AsyncState<T>> {}
export class Async<T>
  extends withValidateFieldEventEmitter<
    // FieldFeedback returns FieldFeedbackValidation
    FieldFeedbackValidation,
    typeof AsyncComponent
  >(AsyncComponent)
  implements React.ChildContextProvider<AsyncChildContext>
{
  static contextTypes: React.ValidationMap<AsyncContext> = {
    form: instanceOf(FormWithConstraints).isRequired,
    fieldFeedbacks: instanceOf(FieldFeedbacks).isRequired
  };
  context!: AsyncContext;

  static childContextTypes: React.ValidationMap<AsyncChildContext> = {
    async: instanceOf(Async).isRequired
  };
  getChildContext(): AsyncChildContext {
    return {
      async: this
    };
  }

  state: AsyncState<T> = {
    status: Status.None
  };

  componentDidMount() {
    this.context.fieldFeedbacks.addValidateFieldEventListener(this.validate);
  }

  componentWillUnmount() {
    this.context.fieldFeedbacks.removeValidateFieldEventListener(this.validate);
  }

  validate = (input: InputElement) => {
    const { form, fieldFeedbacks } = this.context;

    let validations;

    const field = form.fieldsStore.getField(input.name)!;

    if (
      (fieldFeedbacks.props.stop === 'first' && field.hasFeedbacks(fieldFeedbacks.key)) ||
      (fieldFeedbacks.props.stop === 'first-error' && field.hasErrors(fieldFeedbacks.key)) ||
      (fieldFeedbacks.props.stop === 'first-warning' && field.hasWarnings(fieldFeedbacks.key)) ||
      (fieldFeedbacks.props.stop === 'first-info' && field.hasInfos(fieldFeedbacks.key))
    ) {
      // Reset UI
      this.setState({ status: Status.None });
    } else {
      validations = this._validate(input);
    }

    return validations;
  };

  // FIXME
  // With React 18, we have to wait for setState() to finish
  // This way FieldFeedback is mounted and thus FieldFeedback.validate() is called thx to the event
  async setStateSync(state: AsyncState<T>) {
    return new Promise<void>(resolve => {
      this.setState(state, resolve);
    });
  }

  async _validate(input: InputElement) {
    let state: AsyncState<T> = {
      status: Status.Pending
    };

    this.setState(state);

    try {
      const value = await this.props.promise(input.value);
      state = { status: Status.Resolved, value };
    } catch (e) {
      state = { status: Status.Rejected, value: e };
    }

    await this.setStateSync(state);

    // FIXME
    // With React 18, we have to wait for setState() to finish
    // This way FieldFeedback is mounted and thus FieldFeedback.validate() is called thx to the event
    // We could also "await wait(1)"
    return this.emitValidateFieldEvent(input);
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
      default:
        assert(false, `Unknown status: '${state.status}'`);
    }

    return element;
  }
}
