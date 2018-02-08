import React from 'react';

import { FieldFeedbacks } from './index';

// FIXME See React 16 Fragments unsupported https://github.com/airbnb/enzyme/issues/1213
export default class FieldFeedbacksEnzymeFix extends FieldFeedbacks {
  render() {
    return <div data-feedbacks={this.key}>{super.render()}</div>;
  }
}
