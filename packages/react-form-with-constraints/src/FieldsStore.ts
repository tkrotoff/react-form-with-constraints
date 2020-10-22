import { assert } from './assert';
import { EventEmitter } from './EventEmitter';
import { Field } from './Field';

export enum FieldEvent {
  Added = 'FIELD_ADDED',
  Removed = 'FIELD_REMOVED'
}

export class FieldsStore extends EventEmitter<[Field | string], void> {
  readonly fields = new Array<Field>();

  getField(fieldName: string) {
    const fields = this.fields.filter(_field => _field.name === fieldName);
    //assert(fields.length === 1, `Unknown field '${fieldName}'`);
    return fields.length === 1 ? fields[0] : undefined;
  }

  addField(fieldName: string) {
    const fields = this.fields.filter(_field => _field.name === fieldName);
    assert(
      fields.length === 0 || fields.length === 1,
      `Cannot have more than 1 field matching '${fieldName}'`
    );

    if (fields.length === 0) {
      const newField = new Field(fieldName);
      this.fields.push(newField);
      this.emitSync(FieldEvent.Added, newField);
    } else {
      // We can have multiple FieldFeedbacks for the same field,
      // thus addField() can be called multiple times
    }
  }

  removeField(fieldName: string) {
    const fields = this.fields.filter(_field => _field.name === fieldName);

    // We can have multiple FieldFeedbacks for the same field,
    // thus removeField() can be called multiple times
    //assert(fields.length === 1, `Unknown field '${fieldName}'`);

    const index = this.fields.indexOf(fields[0]);
    if (index > -1) {
      this.fields.splice(index, 1);
      this.emitSync(FieldEvent.Removed, fieldName);
    }
  }

  isValid() {
    return this.fields.every(field => field.isValid());
  }

  hasFeedbacks() {
    return this.fields.some(field => field.hasFeedbacks());
  }
}
