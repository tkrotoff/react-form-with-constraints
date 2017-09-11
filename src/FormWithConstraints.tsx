import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as ReactDOM from 'react-dom';

// See Form data validation https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation
// See ReactJS Form Validation Approaches http://moduscreate.com/reactjs-form-validation-approaches/

/*
FormWithConstraints
  - input
  - FieldFeedbacks
    - FieldFeedback
    - FieldFeedback
    - ...
  - input
  - FieldFeedbacks
    - FieldFeedback
    - FieldFeedback
    - ...
  - ...

FieldFeedback:
  - no intelligence
  - renders based on Field structure

FieldFeedbacks
  - is intelligent
  - state is the Field structure
  - change the state when the proper input changes (computeFeedbacks())

FormWithConstraints
  - no intelligence
  - needs to keep track of all the fields
  - notifies FieldFeedbacks when an input changes thanks to the context

An input changes => FormWithConstraints.handleChange()
 => notifies all FieldFeedbacks.computeFeedbacks() => FieldFeedbacks.setState()
 => FieldFeedbacks.render() => FieldFeedback.render()
*/

// See How do I empty an array in JavaScript? https://stackoverflow.com/a/17306971/990356
function clearArray(array: any[]) {
  while (array.length) {
    array.pop();
  }
}

export interface Input {
  name: string;
  value: string;
  validity: ValidityState;
  validationMessage: string;
}

// Field is a better name than Input, see Django Form fields https://docs.djangoproject.com/en/1.11/ref/forms/fields/
export interface Field {
  dirty: boolean;

  // List of FieldFeedback index to display
  errors: number[];
  warnings: number[];
  infos: number[];

  // Copy of input.validationMessage
  // See https://developer.mozilla.org/en/docs/Web/API/HTMLInputElement
  // See https://www.w3.org/TR/html51/sec-forms.html#the-constraint-validation-api
  validationMessage: string;
}

export type WhenString =
  | '*'
  | 'badInput'        // input type="number"
  | 'patternMismatch' // pattern attribute
  | 'rangeOverflow'   // max attribute
  | 'rangeUnderflow'  // min attribute
  | 'stepMismatch'    // step attribute
  | 'tooLong'         // maxlength attribute
  | 'tooShort'        // minlength attribute
  | 'typeMismatch'    // input type="email" or input type="url"
  | 'valueMissing';   // required attribute

export type WhenFn = (value: string) => boolean;

export type When = WhenString | WhenFn;

type PropsWithChildren<T> = T & {children?: React.ReactNode};

export interface FieldFeedbackProps extends React.HTMLProps<HTMLDivElement> {
  when: When;
  error?: boolean;
  warning?: boolean;
  info?: boolean;
}

export interface FieldFeedbackInternalProps extends FieldFeedbackProps {
  index: number;
  field: Field;
}

export class FieldFeedback extends React.Component<FieldFeedbackProps> {
  render() {
    const { index, when, error, warning, info, field, children, ...divProps } = this.props as FieldFeedbackInternalProps;

    let show = false;
    let className = '';
    if (field.errors.includes(index)) {
      show = true;
      className = 'error';
    }
    else if (field.warnings.includes(index)) {
      show = true;
      className = 'warning';
    }
    else if (field.infos.includes(index)) {
      show = true;
      className = 'info';
    }

    let feedback = null;
    if (show) {
      divProps.className = divProps.className !== undefined ? className + ' ' + divProps.className : className;
      feedback = children !== undefined ? children : field.validationMessage;
    }

    return feedback !== null ? <div {...divProps}>{feedback}</div> : null;
  }
}

// FIXME See Add tooShort to ValidityState https://github.com/Microsoft/TSJS-lib-generator/pull/259
export interface ValidityState_fix extends ValidityState {
  readonly tooShort: boolean;
}

export interface FieldFeedbacksProps extends React.HTMLProps<HTMLDivElement> {
  for: string;
  show?: 'first' | 'all';
}

export class FieldFeedbacks extends React.Component<FieldFeedbacksProps, Field> {
  static defaultProps: Partial<FieldFeedbacksProps> = {
    show: 'first'
  };

  static contextTypes = {
    form: PropTypes.object.isRequired
  };

  context: FormWithConstraintsContext;

  constructor(props: FieldFeedbacksProps, context: FormWithConstraintsContext) {
    super(props);

    this.state = {
      dirty: false,
      errors: [],
      warnings: [],
      infos: [],
      validationMessage: ''
    };

    const fieldName = this.props.for;
    context.form.fields[fieldName] = this.state;

    this.computeFeedbacks = this.computeFeedbacks.bind(this);
  }

  componentDidMount() {
    this.context.form.addInputChangeOrFormSubmitEventListener(this.computeFeedbacks);
  }

  componentWillUnmount() {
    this.context.form.removeInputChangeOrFormSubmitEventListener(this.computeFeedbacks);
  }

  // This is the most important method:
  // contains all the intelligence => populates the Field structure
  computeFeedbacks(input: Input) {
    const { for: fieldName, show } = this.props;

    if (input.name === fieldName) { // Ignore the event if it's not for us
      const validity = input.validity as ValidityState_fix;

      const field = {...this.state};
      field.dirty = true;
      clearArray(field.errors);
      clearArray(field.warnings);
      clearArray(field.infos);

      const feedbacks = React.Children.toArray(this.props.children) as React.ReactElement<PropsWithChildren<FieldFeedbackProps>>[];
      for (let i = 0; i < feedbacks.length; i++) {
        const feedback = feedbacks[i];
        const { when, warning, info } = feedback.props;

        const addToList = () => {
          if (info) field.infos.push(i);
          else if (warning) field.warnings.push(i);
          else field.errors.push(i); // Feedback type is error if nothing is specified
        };

        if (typeof when === 'function') {
          const constraintViolation = when(input.value);
          if (constraintViolation) {
            addToList();
          }
        }

        else if (typeof when === 'string') {
          if (!validity.valid) {
            if (when === '*') {
              addToList();
            }
            else if (
              validity.badInput && when === 'badInput' ||
              validity.patternMismatch && when === 'patternMismatch' ||
              validity.rangeOverflow && when === 'rangeOverflow' ||
              validity.rangeUnderflow && when === 'rangeUnderflow' ||
              validity.stepMismatch && when === 'stepMismatch' ||
              validity.tooLong && when === 'tooLong' ||
              validity.tooShort && when === 'tooShort' ||
              validity.typeMismatch && when === 'typeMismatch' ||
              validity.valueMissing && when === 'valueMissing') {

              addToList();
            }
          }
        }

        else {
          console.assert(false, `Invalid FieldFeedback 'when': ${when}`);
        }
      }

      if (show === 'all') {
        if (field.errors.length > 0) {
          clearArray(field.warnings);
        }
      }
      else if (show === 'first') {
        const firstError = field.errors[0];
        const firstWarning = field.warnings[0];
        clearArray(field.errors);
        clearArray(field.warnings);
        if (firstError !== undefined) {
          field.errors.push(firstError);
        } else if (firstWarning !== undefined) {
          field.warnings.push(firstWarning);
        }
      }
      else {
        console.assert(false, `Invalid FieldFeedback 'show': ${show}`);
      }

      field.validationMessage = input.validationMessage;

      this.setState({...field});
      this.context.form.fields[fieldName] = {...field};
    }
  }

  render() {
    const { for: _, show, children, ...divProps } = this.props;

    const field = this.state;

    // Pass the Field object to all the FieldFeedback
    let index = 0;
    const feedbacks = React.Children.map(children, (feedback: React.ReactElement<FieldFeedbackInternalProps>) =>
      React.cloneElement(feedback, {
        index: index++,
        field
      })
    );

    return <div {...divProps}>{feedbacks}</div>;
  }
}


export interface Fields {
  [fieldName: string]: Field | undefined;
}

export interface FormWithConstraintsContext {
  form: FormWithConstraints;
}

// See How to safely use React context https://medium.com/@mweststrate/how-to-safely-use-react-context-b7e343eff076
// See TypeScript 2.2 Support for Mix-in classes https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
export class FormWithConstraints<P = {}, S = {}> extends React.Component<P, S> {
  static childContextTypes = {
    form: PropTypes.object.isRequired
  };

  getChildContext(): FormWithConstraintsContext {
    return {
      form: this
    };
  }

  handleChange(e: React.FormEvent<Input>) {
    const target = e.currentTarget;
    this.showFieldError(target);
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Prevents the form to be submitted
    e.preventDefault();

    this.showFormErrors();
  }

  private showFormErrors() {
    const form = ReactDOM.findDOMNode(this);
    const inputs = form.querySelectorAll('[name]');
    inputs.forEach((input: any) => this.showFieldError(input));
  }

  private showFieldError(input: Input) {
    this.emitInputChangeOrFormSubmitEvent(input);
  }


  private inputChangeOrFormSubmitEventListeners: ((input: Input) => void)[] = [];

  private emitInputChangeOrFormSubmitEvent(input: Input) {
    this.inputChangeOrFormSubmitEventListeners.forEach(listener => listener(input));
  }

  addInputChangeOrFormSubmitEventListener(listener: (input: Input) => void) {
    this.inputChangeOrFormSubmitEventListeners.push(listener);
  }

  removeInputChangeOrFormSubmitEventListener(listener: (input: Input) => void) {
    const index = this.inputChangeOrFormSubmitEventListeners.indexOf(listener);
    this.inputChangeOrFormSubmitEventListeners.splice(index, 1);
  }


  /**
   * Keeps track of the fields, needed for FormFields
   */
  fields: Fields = {};

  // Lazy check => if handleSubmit() has not been called, the fields structure might be incomplete
  isValid() {
    const fieldNames = Object.keys(this.fields);
    return !FormFields.containErrors(this, ...fieldNames);
  }
}


export class FormFields {
  private constructor() {}

  static containErrors(form: FormWithConstraints, ...fieldNames: string[]) {
    return fieldNames.some(fieldName => {
      const field = form.fields[fieldName];
      return field !== undefined && field.errors.length > 0;
    });
  }

  static containWarnings(form: FormWithConstraints, ...fieldNames: string[]) {
    return fieldNames.some(fieldName => {
      const field = form.fields[fieldName];
      return field !== undefined && field.warnings.length > 0;
    });
  }

  static containInfos(form: FormWithConstraints, ...fieldNames: string[]) {
    return fieldNames.some(fieldName => {
      const field = form.fields[fieldName];
      return field !== undefined && field.infos.length > 0;
    });
  }

  static areValidDirtyWithoutWarnings(form: FormWithConstraints, ...fieldNames: string[]) {
    return fieldNames.some(fieldName => {
      const field = form.fields[fieldName];
      return field !== undefined && field.dirty === true && field.errors.length === 0 && field.warnings.length === 0;
    });
  }
}
