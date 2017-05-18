import * as React from 'react';
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
  - change the state when the proper input changes (handleInputChange())

FormWithConstraints
  - no intelligence
  - needs to keep track of all the fields (Field structure) for hasErrors() and hasWarnings()
  - notifies FieldFeedbacks when an input changes thanks to the context

An input changes => FormWithConstraints.handleChange()
 => notifies all FieldFeedbacks.handleInputChange() => FieldFeedbacks.setState()
 => FieldFeedbacks.render() => FieldFeedback.render()
*/

function clearArray(array: any[]) {
  while (array.length) {
    array.pop();
  }
}

// See Form-associated content https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Form-associated_content
type FormAssociatedContent =
  //HTMLButtonElement |
  //HTMLFieldSetElement |
  HTMLInputElement |
  //HTMLLabelElement |
  //HTMLMeterElement |
  //HTMLObjectElement |
  //HTMLOutputElement |
  //HTMLProgressElement |
  HTMLSelectElement |
  HTMLTextAreaElement;

// See Field is a better name than Input, see Django Form fields https://docs.djangoproject.com/en/1.11/ref/forms/fields/
interface Field {
  errors: number[]; // List of FieldFeedback index to display
  warnings: number[]; // List of FieldFeedback index to display

  // Copy from input.validationMessage
  validationMessage: string;
}

interface Fields {
  [fieldName: string]: Field | undefined;
}

type WhenStrings = '*' |
                   'badInput' | 'patternMismatch' | 'rangeOverflow' | 'rangeUnderflow' | 'stepMismatch' | 'tooLong' | 'tooShort' | 'typeMismatch' | 'valueMissing';

type When = WhenStrings | ((value: string) => boolean);

type PropsWithChildren<T> = T & {children?: React.ReactNode};

interface FieldFeedbackProps extends React.HTMLProps<HTMLDivElement> {
  when: When;
  warning?: boolean;
}

interface FieldFeedbackInternalProps extends FieldFeedbackProps {
  index: number;
  field: Field;
}

class FieldFeedback extends React.Component<FieldFeedbackProps, void> {
  render() {
    const { index, when, warning, field, children, ...divProps } = this.props as FieldFeedbackInternalProps;

    let feedback = null;

    if (field.errors.includes(index) || field.warnings.includes(index)) {
      if (children === undefined) {
        feedback = field.validationMessage;
      } else {
        feedback = children;
      }
    }

    return feedback !== null ? <div {...divProps}>{feedback}</div> : null;
  }
}


interface FieldFeedbacksProps extends React.HTMLProps<HTMLDivElement> {
  for: string;
  show?: 'first' | 'all'
}

class FieldFeedbacks extends React.Component<FieldFeedbacksProps, Field> {
  static defaultProps: Partial<FieldFeedbacksProps> = {
    show: 'first'
  };

  static contextTypes = {
    form: React.PropTypes.object
  };

  context: FormWithConstraintsContext;

  constructor(props: FieldFeedbacksProps, context: FormWithConstraintsContext) {
    super(props);

    this.state = {
      errors: [],
      warnings: [],
      validationMessage: ''
    };

    const fieldName = this.props.for;
    context.form.fields[fieldName] = this.state;

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.context.form.addListener(this.handleInputChange);
  }

  componentWillUnmount() {
    this.context.form.removeListener(this.handleInputChange);
  }

  // This is the most important method:
  // contains all the intelligence => populates the Field structure
  handleInputChange(input: FormAssociatedContent) {
    // See http://stackoverflow.com/a/40699547/990356
    const { ['for']: fieldName, show } = this.props;

    if (input.name === fieldName) { // Ignore the event if it's not for us
      const validity = input.validity;

      const field = {...this.state};
      clearArray(field.warnings);
      clearArray(field.errors);

      const feedbacks = React.Children.toArray(this.props.children) as React.ReactElement<PropsWithChildren<FieldFeedbackProps>>[];
      for (let i = 0; i < feedbacks.length; i++) {
        const feedback = feedbacks[i];
        const { when, warning } = feedback.props;

        const addToList = () => warning ? field.warnings.push(i) : field.errors.push(i);

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
    }
  }

  render() {
    // See http://stackoverflow.com/a/40699547/990356
    let { ['for']: deletedKey, show, children, ...divProps } = this.props;

    const field = this.state;

    // Pass the Field object to all the FieldFeedback
    let index = 0;
    const feedbacks = React.Children.map(children, (feedback: React.ReactElement<FieldFeedbackProps>) => {
      return React.cloneElement(feedback, {
        index: index++,
        when: feedback.props.when,
        warning: feedback.props.warning,
        field
      } as FieldFeedbackProps);
    });

    return <div {...divProps}>{feedbacks}</div>;
  }
}


interface FormWithConstraintsProps extends React.HTMLProps<HTMLFormElement> {
}

interface FormWithConstraintsContext {
  form: FormWithConstraints;
}

// See How to safely use React context https://medium.com/@mweststrate/how-to-safely-use-react-context-b7e343eff076
// See TypeScript 2.2 Support for Mix-in classes https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
class FormWithConstraints<P = {}, S = {}> extends React.Component<P & FormWithConstraintsProps, S> {
  static childContextTypes = {
    form: React.PropTypes.object
  };

  getChildContext(): FormWithConstraintsContext {
    return {
      form: this
    };
  }

  handleChange(e: React.FormEvent<FormAssociatedContent>) {
    const target = e.currentTarget;
    this.showFieldError(target);
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    this.showFormErrors();
  }

  private showFormErrors() {
    const form = ReactDOM.findDOMNode(this);
    const inputs = form.querySelectorAll('[name]');
    inputs.forEach((input: FormAssociatedContent) => this.showFieldError(input));
  }

  private showFieldError(input: FormAssociatedContent) {
    this.notifyListeners(input);
  }


  private listeners: ((input: FormAssociatedContent) => void)[] = [];

  private notifyListeners(input: FormAssociatedContent) {
    this.listeners.forEach(listener => listener(input));
  }

  addListener(listener: (input: FormAssociatedContent) => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: (input: FormAssociatedContent) => void) {
    const index = this.listeners.indexOf(listener);
    this.listeners.splice(index, 1);
  }


  // Needed for hasErrors() and hasWarnings()
  fields: Fields = {};

  hasErrors(...fieldNames: string[]) {
    return fieldNames.some(fieldName => {
      const field = this.fields[fieldName];
      return field !== undefined && field.errors.length > 0;
    });
  }

  hasWarnings(...fieldNames: string[]) {
    return fieldNames.some(fieldName => {
      const field = this.fields[fieldName];
      return field !== undefined && field.warnings.length > 0;
    });
  }

  isValid() {
    const fieldNames = Object.keys(this.fields);
    return !this.hasErrors(...fieldNames);
  }
}

export {
  FormAssociatedContent,
  FormWithConstraints, FormWithConstraintsProps, FormWithConstraintsContext,
  FieldFeedbacks, FieldFeedback
};
