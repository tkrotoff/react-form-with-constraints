import { Fields, Field } from './Fields';
import { EventEmitter } from './EventEmitter';
import fieldWithoutFeedback from './fieldWithoutFeedback';

export enum FieldEvent {
  Added = 'FIELD_ADDED',
  Removed = 'FIELD_REMOVED',
  Updated = 'FIELD_UPDATED'
}

export class FieldsStore extends EventEmitter {
  // Why Object.create(null) insteaf of just {}? See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Objects_and_maps_compared
  fields: Fields = Object.create(null);

  addField(fieldName: string) {
    if (this.fields[fieldName] === undefined) {
      const newField = fieldWithoutFeedback;
      this.fields[fieldName] = newField;
      this.emit(FieldEvent.Added, fieldName, newField);
    }
  }

  removeField(fieldName: string) {
    console.assert(this.fields[fieldName] !== undefined, `Unknown field '${fieldName}'`);
    delete this.fields[fieldName];
    this.emit(FieldEvent.Removed, fieldName);
  }

  cloneField(fieldName: string) {
    const field = this.fields[fieldName]!;
    console.assert(field !== undefined, `Unknown field '${fieldName}'`);
    const newField: Field = {
      dirty: field.dirty,
      errors: new Set(field.errors),
      warnings: new Set(field.warnings),
      infos: new Set(field.infos),
      validationMessage: field.validationMessage
    };
    return newField;
  }

  updateField(fieldName: string, field: Field) {
    console.assert(this.fields[fieldName] !== undefined, `Unknown field '${fieldName}'`);
    this.fields[fieldName] = field;
    this.emit(FieldEvent.Updated, fieldName);
  }

  // Clear the errors/warnings/infos each time we re-validate the input,
  // this solves the problem with the errors order and show="first", example:
  // <FieldFeedbacks for="username" show="first"> key=0
  //   <FieldFeedback ...> key=0.0
  //   <FieldFeedback ...> key=0.1
  // </FieldFeedbacks>
  // We want the first FieldFeedback in the DOM that matches to be displayed
  // + we have a special case where we could have multiple FieldFeedbacks for the same field
  removeFieldFor(fieldName: string, fieldFeedbacksKey: number) {
    const field = this.fields[fieldName]!;
    console.assert(field !== undefined, `Unknown field '${fieldName}'`);

    // reject is the opposite of filter, see https://lodash.com/docs/#reject
    // Example: fieldFeedbacksKey = 5, fieldFeedbackKey = 5.2, Math.floor(5.2) = 5
    const reject = (fieldFeedbackKey: number) => fieldFeedbacksKey !== Math.floor(fieldFeedbackKey);

    field.errors = new Set([...field.errors].filter(reject));
    field.warnings = new Set([...field.warnings].filter(reject));
    field.infos = new Set([...field.infos].filter(reject));

    this.emit(FieldEvent.Updated, fieldName);
  }

  // Retrieve errors/warnings/infos only related to a given FieldFeedbacks
  getFieldFor(fieldName: string, fieldFeedbacksKey: number) {
    const field = this.fields[fieldName]!;
    console.assert(field !== undefined, `Unknown field '${fieldName}'`);

    // Example: fieldFeedbacksKey = 5, fieldFeedbackKey = 5.2, Math.floor(5.2) = 5
    const filter = (fieldFeedbackKey: number) => fieldFeedbacksKey === Math.floor(fieldFeedbackKey);

    const fieldFor: Readonly<Field> = {
      dirty: field.dirty,
      errors: new Set([...field.errors].filter(filter)),
      warnings: new Set([...field.warnings].filter(filter)),
      infos: new Set([...field.infos].filter(filter)),
      validationMessage: field.validationMessage
    };
    return fieldFor;
  }

  containErrors(...fieldNames: string[]) {
    return fieldNames.some(fieldName => {
      const field = this.fields[fieldName];
      return field !== undefined && field.errors.size > 0;
    });
  }

  containWarnings(...fieldNames: string[]) {
    return fieldNames.some(fieldName => {
      const field = this.fields[fieldName];
      return field !== undefined && field.warnings.size > 0;
    });
  }

  containInfos(...fieldNames: string[]) {
    return fieldNames.some(fieldName => {
      const field = this.fields[fieldName];
      return field !== undefined && field.infos.size > 0;
    });
  }

  areValidDirtyWithoutWarnings(...fieldNames: string[]) {
    return fieldNames.some(fieldName => {
      const field = this.fields[fieldName];
      return field !== undefined && field.dirty === true && field.errors.size === 0 && field.warnings.size === 0;
    });
  }
}
