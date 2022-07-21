import * as React from 'react';

import { FieldFeedbacks } from './FieldFeedbacks';

// FIXME [React 16 Fragments unsupported](https://github.com/airbnb/enzyme/issues/1213)
export class FieldFeedbacksEnzymeFix extends FieldFeedbacks {
  render() {
    return <span data-feedbacks={this.key}>{super.render()}</span>;
  }
}
