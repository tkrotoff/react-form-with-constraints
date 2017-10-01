import * as React from 'react';
import * as PropTypes from 'prop-types';

import { FormWithConstraintsChildContext, FieldEvent } from './index';

// See JSON stringify a Set https://stackoverflow.com/q/31190885
function Set_toJSON(_key: string, value: any) {
  if (typeof value === 'object' && value instanceof Set) {
    return [...value];
  }
  return value;
}

class DisplayFields extends React.Component {
  static contextTypes = {
    form: PropTypes.object.isRequired
  };
  context: FormWithConstraintsChildContext;

  constructor() {
    super();

    this.reRender = this.reRender.bind(this);
  }

  componentWillMount() {
    this.context.form.fieldsStore.addListener(FieldEvent.Added, this.reRender);
    this.context.form.fieldsStore.addListener(FieldEvent.Removed, this.reRender);
    this.context.form.fieldsStore.addListener(FieldEvent.Updated, this.reRender);
  }

  componentWillUnmount() {
    this.context.form.fieldsStore.removeListener(FieldEvent.Added, this.reRender);
    this.context.form.fieldsStore.removeListener(FieldEvent.Removed, this.reRender);
    this.context.form.fieldsStore.removeListener(FieldEvent.Updated, this.reRender);
  }

  reRender() {
    this.forceUpdate();
  }

  render() {
    return (
      <pre>react-form-with-constraints = {JSON.stringify(this.context.form.fieldsStore.fields, Set_toJSON, 2)}</pre>
    );
  }
}

export default DisplayFields;
