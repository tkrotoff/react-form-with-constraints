import * as React from 'react';
import { FieldFeedbacks } from 'react-form-with-constraints';
import { View } from 'react-native';

// FIXME [React 16 Fragments unsupported](https://github.com/airbnb/enzyme/issues/1213)
export class FieldFeedbacksEnzymeFix extends FieldFeedbacks {
  render() {
    return <View data-feedbacks={this.key}>{super.render()}</View>;
  }
}
