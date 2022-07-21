import * as React from 'react';
import { instanceOf } from 'prop-types';

import { FieldFeedbackValidation } from './FieldFeedbackValidation';
import { FormWithConstraints, FormWithConstraintsChildContext } from './FormWithConstraints';
import { InputElement } from './InputElement';
import { Nullable } from './Nullable';
import { withValidateFieldEventEmitter } from './withValidateFieldEventEmitter';

export interface FieldFeedbacksProps {
  for?: string;

  /**
   * first-* => stops on the first * encountered
   * no => shows everything
   * Default is 'first-error'
   */
  stop: 'first' | 'first-error' | 'first-warning' | 'first-info' | 'no';

  children?: React.ReactNode;
}

// Why Nullable? https://github.com/DefinitelyTyped/DefinitelyTyped/pull/27973
export type FieldFeedbacksContext = FormWithConstraintsChildContext &
  Partial<Nullable<FieldFeedbacksChildContext>>;

export interface FieldFeedbacksChildContext {
  fieldFeedbacks: FieldFeedbacks;
}

class FieldFeedbacksComponent extends React.PureComponent<FieldFeedbacksProps> {}
export class FieldFeedbacks
  extends withValidateFieldEventEmitter<
    // FieldFeedback returns FieldFeedbackValidation
    // Async returns FieldFeedbackValidation[] | undefined
    // FieldFeedbacks returns (FieldFeedbackValidation | undefined)[]
    FieldFeedbackValidation | (FieldFeedbackValidation | undefined)[] | undefined,
    typeof FieldFeedbacksComponent
  >(FieldFeedbacksComponent)
  implements React.ChildContextProvider<FieldFeedbacksChildContext>
{
  static defaultProps: FieldFeedbacksProps = {
    stop: 'first-error'
  };

  static contextTypes: React.ValidationMap<FieldFeedbacksContext> = {
    form: instanceOf(FormWithConstraints).isRequired,
    fieldFeedbacks: instanceOf(FieldFeedbacks)
  };
  context!: FieldFeedbacksContext;

  static childContextTypes: React.ValidationMap<FieldFeedbacksChildContext> = {
    fieldFeedbacks: instanceOf(FieldFeedbacks).isRequired
  };
  getChildContext(): FieldFeedbacksChildContext {
    return {
      fieldFeedbacks: this
    };
  }

  // Tested: there is no conflict with React key prop (https://reactjs.org/docs/lists-and-keys.html)
  readonly key: string; // '0', '1', '2'...

  readonly fieldName: string; // Instead of reading props each time

  constructor(props: FieldFeedbacksProps, context: FieldFeedbacksContext) {
    super(props, context);

    const { form, fieldFeedbacks: fieldFeedbacksParent } = context;

    this.key = fieldFeedbacksParent
      ? fieldFeedbacksParent.computeFieldFeedbackKey()
      : form.computeFieldFeedbacksKey();

    if (fieldFeedbacksParent) {
      this.fieldName = fieldFeedbacksParent.fieldName;
      if (props.for !== undefined) {
        throw new Error("FieldFeedbacks cannot have a parent and a 'for' prop");
      }
    } else {
      if (props.for === undefined) {
        throw new Error("FieldFeedbacks cannot be without parent and without 'for' prop");
      } else {
        this.fieldName = props.for;
      }
    }
  }

  private fieldFeedbackKeyCounter = 0;
  computeFieldFeedbackKey() {
    return `${this.key}.${this.fieldFeedbackKeyCounter++}`;
  }

  addFieldFeedback() {
    return this.computeFieldFeedbackKey();
  }

  componentDidMount() {
    const { form, fieldFeedbacks: fieldFeedbacksParent } = this.context;

    form.fieldsStore.addField(this.fieldName);

    const parent = fieldFeedbacksParent ?? form;
    parent.addValidateFieldEventListener(this.validate);
  }

  componentWillUnmount() {
    const { form, fieldFeedbacks: fieldFeedbacksParent } = this.context;

    form.fieldsStore.removeField(this.fieldName);

    const parent = fieldFeedbacksParent ?? form;
    parent.removeValidateFieldEventListener(this.validate);
  }

  validate = async (input: InputElement) => {
    const { form, fieldFeedbacks: fieldFeedbacksParent } = this.context;

    let validations;

    // Ignore the event if it's not for us
    if (input.name === this.fieldName) {
      const field = form.fieldsStore.getField(this.fieldName)!;

      // prettier-ignore
      if (fieldFeedbacksParent && (
          fieldFeedbacksParent.props.stop === 'first' && field.hasFeedbacks(fieldFeedbacksParent.key) ||
          fieldFeedbacksParent.props.stop === 'first-error' && field.hasErrors(fieldFeedbacksParent.key) ||
          fieldFeedbacksParent.props.stop === 'first-warning' && field.hasWarnings(fieldFeedbacksParent.key) ||
          fieldFeedbacksParent.props.stop === 'first-info' && field.hasInfos(fieldFeedbacksParent.key))) {
        // Do nothing
      } else {
        validations = await this._validate(input);
      }
    }

    return validations;
  };

  async _validate(input: InputElement) {
    const arrayOfArrays = await this.emitValidateFieldEvent(input);
    const validations = arrayOfArrays.flat(Number.POSITIVE_INFINITY) as (
      | FieldFeedbackValidation
      | undefined
    )[];
    return validations;
  }

  render() {
    const { children } = this.props;
    // https://codepen.io/tkrotoff/pen/yzKKdB
    return children !== undefined ? children : null;
  }
}
