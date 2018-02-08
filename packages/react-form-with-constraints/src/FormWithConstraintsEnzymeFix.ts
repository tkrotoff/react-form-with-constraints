import { FormWithConstraints, FormWithConstraintsProps } from './index';

// See https://github.com/airbnb/enzyme/issues/384#issuecomment-363830335
export default function new_FormWithConstraints(props: FormWithConstraintsProps) {
  const defaultProps = {
    fieldFeedbackClassNames: {
      error: 'error',
      warning: 'warning',
      info: 'info',
      valid: 'valid'
    }
  };
  return new FormWithConstraints({...defaultProps, ...props});
}
