import * as React from 'react';
import { View } from 'react-native';

import { FieldFeedbacks } from '.';

// FIXME [React 16 Fragments unsupported](https://github.com/airbnb/enzyme/issues/1213)
export class FieldFeedbacksEnzymeFix extends FieldFeedbacks {
  render() {
    return <View data-feedbacks={this.key}>{super.render()}</View>;
  }
}
