import React from 'react';

import {
  FormWithConstraintsContext,
  FieldFeedbacks, FieldFeedbacksProps, FieldFeedbacksContext, FieldFeedbacksPrivate
} from './index';

const FieldFeedbacksEnzymeFix: React.SFC<FieldFeedbacksProps> = props =>
  <FormWithConstraintsContext.Consumer>
    {form =>
      <FieldFeedbacksContext.Consumer>
        {fieldFeedbacks => <FieldFeedbacksPrivate {...props} form={form!} fieldFeedbacks={fieldFeedbacks} />}
      </FieldFeedbacksContext.Consumer>
    }
  </FormWithConstraintsContext.Consumer>;

// FIXME See React 16 Fragments unsupported https://github.com/airbnb/enzyme/issues/1213
class FieldFeedbacksEnzymeFix extends FieldFeedbacks {
  render() {
    return <span data-feedbacks={this.key}>{super.render()}</span>;
  }
}

export default FieldFeedbacksEnzymeFix;
