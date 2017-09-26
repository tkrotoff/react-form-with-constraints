import * as React from 'react';
import * as PropTypes from 'prop-types';

import { FormWithConstraintsChildContext } from './FormWithConstraints';
import { IValidateEventEmitter, withValidateEventEmitter } from './withValidateEventEmitter';
import { EventEmitter } from './EventEmitter'; // FIXME See https://github.com/Microsoft/TypeScript/issues/9944#issuecomment-309903027
import Input from './Input';
import { FieldEvent } from './FieldsStore';

export interface FieldFeedbacksProps extends React.AllHTMLAttributes<HTMLDivElement> {
  for: string;

  /**
   * first => shows only the first error or warning (if no error) encountered, infos are always displayed
   * all => shows everything
   */
  show?: 'first' | 'all';
}

export interface FieldFeedbacksChildContext {
  fieldFeedbacks: IFieldFeedbacks;
}

export interface IFieldFeedbacks extends IValidateEventEmitter {
  props: FieldFeedbacksProps;
  key: number;
  computeFieldFeedbackKey(): number;
}

export class FieldFeedbacksComponent extends React.Component<FieldFeedbacksProps> {}
export class FieldFeedbacks extends withValidateEventEmitter(FieldFeedbacksComponent) {
  static defaultProps: Partial<FieldFeedbacksProps> = {
    show: 'first'
  };

  static contextTypes = {
    form: PropTypes.object.isRequired
  };
  context: FormWithConstraintsChildContext;

  static childContextTypes = {
    fieldFeedbacks: PropTypes.object.isRequired
  };
  getChildContext(): FieldFeedbacksChildContext {
    return {
      fieldFeedbacks: this
    };
  }

  key: number;

  constructor(props: FieldFeedbacksProps, context: FormWithConstraintsChildContext) {
    super(props);

    this.validate = this.validate.bind(this);
    this.reRender = this.reRender.bind(this);

    this.key = context.form.computeFieldFeedbacksKey();
  }

  // FieldFeedback key = FieldFeedbacks key + increment
  // Examples:
  // 0.0, 0.1, 0.2 with 0 being the FieldFeedbacks key
  // 1.0, 1.1, 1.2 with 1 being the FieldFeedbacks key
  //
  // This solves the problem when having multiple FieldFeedbacks with the same for attribute:
  // <FieldFeedbacks for="username" show="first"> key=0
  //   <FieldFeedback ...> key=0.0
  //   <FieldFeedback ...> key=0.1
  // </FieldFeedbacks>
  // <FieldFeedbacks for="username" show="all"> key=1
  //   <FieldFeedback ...> key=1.0
  //   <FieldFeedback ...> key=1.1
  //   <FieldFeedback ...> key=1.2
  // </FieldFeedbacks>
  //
  // We could use a string here instead of a number
  private fieldFeedbackKey = 0;
  computeFieldFeedbackKey() {
    // Example: this.key = 5, this.fieldFeedbackKey = 2 => 5 + 2 / 10 = 5 + 0.2 = 5.2
    return this.key + this.fieldFeedbackKey++ / 10;
  }

  componentWillMount() {
    const fieldName = this.props.for;
    this.context.form.fieldsStore.addField(fieldName);

    this.context.form.addValidateEventListener(this.validate);
    this.context.form.fieldsStore.addListener(FieldEvent.Updated, this.reRender);
  }

  componentWillUnmount() {
    const fieldName = this.props.for;
    this.context.form.fieldsStore.removeField(fieldName);

    this.context.form.removeValidateEventListener(this.validate);
    this.context.form.fieldsStore.removeListener(FieldEvent.Updated, this.reRender);
  }

  validate(input: Input) {
    const { for: fieldName } = this.props;

    if (input.name === fieldName) { // Ignore the event if it's not for us
      // Clear the errors/warnings/infos each time we re-validate the input
      this.context.form.fieldsStore.removeFieldFor(fieldName, this.key);

      this.emitValidateEvent(input);
    }
  }

  reRender(_fieldName: string) {
    const { for: fieldName } = this.props;
    if (fieldName === _fieldName) { // Ignore the event if it's not for us
      this.forceUpdate();
    }
  }

  render() {
    const { for: fieldName, show, children, ...divProps } = this.props;
    return <div {...divProps}>{children}</div>;
  }
}
