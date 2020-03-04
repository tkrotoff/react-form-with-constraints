import * as React from 'react';

import { FormWithConstraintsApi, FormWithConstraintsContext } from './FormWithConstraints';
import { withValidateFieldEventEmitter } from './withValidateFieldEventEmitter';
import { InputElement } from './InputElement';
import FieldFeedbackValidation from './FieldFeedbackValidation';
import flattenDeep from './flattenDeep';
import { uniqueId } from 'lodash';

export interface FieldFeedbacksProps {
  for?: string;

  /**
   * first-* => stops on the first * encountered
   * no => shows everything
   * Default is 'first-error'
   */
  stop?: 'first' | 'first-error' | 'first-warning' | 'first-info' | 'no';

  children?: React.ReactNode;
}

export const FieldFeedbacksContext = React.createContext<FieldFeedbacksApi | undefined>(undefined);

export function FieldFeedbacks(props: FieldFeedbacksProps) {
  const form = React.useContext(FormWithConstraintsContext)!;
  const fieldFeedbacksParent = React.useContext(FieldFeedbacksContext); // Can be undefined

  const api = new FieldFeedbacksApi(props, form, fieldFeedbacksParent);

  const parent = fieldFeedbacksParent ? fieldFeedbacksParent : form;

  React.useEffect(() => {
    form.fieldsStore.addField(api.fieldName);
    parent.addValidateFieldEventListener(validate);

    return function cleanup() {
      form.fieldsStore.removeField(api.fieldName);
      parent.removeValidateFieldEventListener(validate);
    };
  }, []);

  async function validate(input: InputElement) {
    let validations;

    if (input.name === api.fieldName) { // Ignore the event if it's not for us
      const field = form.fieldsStore.getField(api.fieldName)!;

      if (fieldFeedbacksParent && (
          fieldFeedbacksParent.props.stop === 'first' && field.hasFeedbacks(fieldFeedbacksParent.id) ||
          fieldFeedbacksParent.props.stop === 'first-error' && field.hasErrors(fieldFeedbacksParent.id) ||
          fieldFeedbacksParent.props.stop === 'first-warning' && field.hasWarnings(fieldFeedbacksParent.id) ||
          fieldFeedbacksParent.props.stop === 'first-info' && field.hasInfos(fieldFeedbacksParent.id))) {
        // Do nothing
      }
      else {
        validations = await _validate(input);
      }
    }

    return validations;
  }

  async function _validate(input: InputElement) {
    const arrayOfArrays = await api.emitValidateFieldEvent(input);
    const validations = flattenDeep<FieldFeedbackValidation | undefined>(arrayOfArrays);
    return validations;
  }

  function render() {
    const { children } = props;

    return (
      <FieldFeedbacksContext.Provider value={api}>
        {
          // See https://codepen.io/tkrotoff/pen/yzKKdB
          children !== undefined ? children : null
        }
      </FieldFeedbacksContext.Provider>
    );
  }

  return render();
}

FieldFeedbacks.defaultProps = {
  stop: 'first-error'
};

export class FieldFeedbacksApi
  extends
    withValidateFieldEventEmitter<
      // FieldFeedback returns FieldFeedbackValidation
      // Async returns FieldFeedbackValidation[] | undefined
      // FieldFeedbacks returns (FieldFeedbackValidation | undefined)[]
      FieldFeedbackValidation | (FieldFeedbackValidation | undefined)[] | undefined,
      typeof Object
    >(Object) {

  public readonly id: string; // '0', '1', '2'...

  public readonly fieldName: string; // Instead of reading props each time

  uniqueId = uniqueId();

  constructor(public props: FieldFeedbacksProps, form: FormWithConstraintsApi, fieldFeedbacksParent?: FieldFeedbacksApi) {
    super();

    console.log('FieldFeedbacksApi uniqueId=', this.uniqueId);
    this.id = fieldFeedbacksParent ? fieldFeedbacksParent.computeFieldFeedbackId() : form.computeFieldFeedbacksId();

    if (fieldFeedbacksParent) {
      this.fieldName = fieldFeedbacksParent.fieldName;
      if (props.for !== undefined) throw new Error("FieldFeedbacks cannot have a parent and a 'for' prop");
    } else {
      if (props.for === undefined) throw new Error("FieldFeedbacks cannot be without parent and without 'for' prop");
      else this.fieldName = props.for;
    }
  }

  private fieldFeedbackIdCounter = 0;
  private computeFieldFeedbackId() {
    return `${this.id}.${this.fieldFeedbackIdCounter++}`;
  }

  public addFieldFeedback() {
    return this.computeFieldFeedbackId();
  }
}
