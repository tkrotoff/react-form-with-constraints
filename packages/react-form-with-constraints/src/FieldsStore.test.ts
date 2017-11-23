import { fieldWithoutFeedback, FieldsStore, FieldEvent } from './index';

test('constructor()', () => {
  const store = new FieldsStore();
  expect(store.fields).toEqual({});

  // Check Object.prototype properties don't exist
  expect(store.fields.constructor).toEqual(undefined);
  expect(store.fields.toString).toEqual(undefined);
});

test('addField()', () => {
  const store = new FieldsStore();
  const emitSpy = jest.spyOn(store, 'emit');

  store.addField('username');
  expect(emitSpy).toHaveBeenCalledTimes(1);
  expect(emitSpy).toHaveBeenLastCalledWith(FieldEvent.Added, 'username', fieldWithoutFeedback);

  store.addField('password');
  expect(emitSpy).toHaveBeenCalledTimes(2);
  expect(emitSpy).toHaveBeenLastCalledWith(FieldEvent.Added, 'password', fieldWithoutFeedback);

  expect(store.fields).toEqual({
    username: fieldWithoutFeedback,
    password: fieldWithoutFeedback
  });
});

test('addField() - existing field', () => {
  const store = new FieldsStore();

  store.addField('username');
  store.addField('username');

  expect(store.fields).toEqual({
    username: fieldWithoutFeedback
  });
});

test('removeField()', () => {
  const store = new FieldsStore();
  const emitSpy = jest.spyOn(store, 'emit');

  store.addField('username');
  expect(emitSpy).toHaveBeenCalledTimes(1);
  store.addField('password');
  expect(emitSpy).toHaveBeenCalledTimes(2);
  expect(store.fields).toEqual({
    username: fieldWithoutFeedback,
    password: fieldWithoutFeedback
  });

  store.removeField('username');
  expect(emitSpy).toHaveBeenCalledTimes(3);
  expect(emitSpy).toHaveBeenLastCalledWith(FieldEvent.Removed, 'username');
  expect(store.fields).toEqual({
    password: fieldWithoutFeedback
  });

  store.removeField('password');
  expect(emitSpy).toHaveBeenCalledTimes(4);
  expect(emitSpy).toHaveBeenLastCalledWith(FieldEvent.Removed, 'password');
  expect(store.fields).toEqual({});
});

test('removeField() - unknown field', () => {
  const store = new FieldsStore();
  store.addField('username');
  expect(() => store.removeField('password')).toThrow("Unknown field 'password'");
  expect(store.fields).toEqual({
    username: fieldWithoutFeedback
  });
});

test('cloneField()', () => {
  const store = new FieldsStore();

  store.addField('username');
  expect(store.fields).toEqual({
    username: fieldWithoutFeedback
  });

  const field = store.cloneField('username');
  field.dirty = true;
  field.errors.add(1.0);
  field.warnings.add(2.0);
  field.infos.add(3.0);
  field.validationMessage = "I'm a clone";

  expect(field).toEqual({
    dirty: true,
    errors: new Set([1.0]),
    warnings: new Set([2.0]),
    infos: new Set([3.0]),
    validationMessage: "I'm a clone"
  });
  expect(store.fields).toEqual({
    username: {
      dirty: false,
      errors: new Set(),
      warnings: new Set(),
      infos: new Set(),
      validationMessage: ''
    }
  });
  expect(fieldWithoutFeedback).toEqual({
    dirty: false,
    errors: new Set(),
    warnings: new Set(),
    infos: new Set(),
    validationMessage: ''
  });
});

test('cloneField() - unknown field', () => {
  const store = new FieldsStore();
  expect(() => store.cloneField('username')).toThrow("Unknown field 'username'");
  expect(store.fields).toEqual({});
});

test('updateField()', () => {
  const store = new FieldsStore();
  store.addField('username');
  expect(store.fields).toEqual({
    username: fieldWithoutFeedback
  });

  const fieldUpdated = {
    dirty: true,
    errors: new Set([1.0, 1.1, 1.2]),
    warnings: new Set([2.0, 2.1, 2.2]),
    infos: new Set([3.0, 3.1, 3.2]),
    validationMessage: 'Field updated'
  };
  store.updateField('username', fieldUpdated);

  expect(store.fields).toEqual({
    username: {
      dirty: true,
      errors: new Set([1.0, 1.1, 1.2]),
      warnings: new Set([2.0, 2.1, 2.2]),
      infos: new Set([3.0, 3.1, 3.2]),
      validationMessage: 'Field updated'
    }
  });
});

test('updateField() - unknown field', () => {
  const store = new FieldsStore();
  store.addField('username');
  expect(store.fields).toEqual({
    username: fieldWithoutFeedback
  });

  const fieldUpdated = {
    dirty: false,
    errors: new Set(),
    warnings: new Set(),
    infos: new Set(),
    validationMessage: 'Field updated'
  };
  expect(() => store.updateField('password', fieldUpdated)).toThrow("Unknown field 'password'");

  expect(store.fields).toEqual({
    username: fieldWithoutFeedback
  });
});

test('removeFieldFor()', () => {
  const store = new FieldsStore();
  store.addField('username');

  store.updateField('username', {
    dirty: false,
    errors: new Set([0.0, 0.1, 0.2, 1.0, 1.1, 1.2, 2.0, 2.1, 2.2]),
    warnings: new Set([0.0, 0.1, 0.2, 1.0, 1.1, 1.2, 2.0, 2.1, 2.2]),
    infos: new Set([0.0, 0.1, 0.2, 1.0, 1.1, 1.2, 2.0, 2.1, 2.2]),
    validationMessage: ''
  });

  const fieldFeedbacksKey = 1;
  store.removeFieldFor('username', fieldFeedbacksKey);

  expect(store.fields).toEqual({
    username: {
      dirty: false,
      errors: new Set([0.0, 0.1, 0.2, 2.0, 2.1, 2.2]),
      warnings: new Set([0.0, 0.1, 0.2, 2.0, 2.1, 2.2]),
      infos: new Set([0.0, 0.1, 0.2, 2.0, 2.1, 2.2]),
      validationMessage: ''
    }
  });
});

test('getFieldFor()', () => {
  const store = new FieldsStore();
  store.addField('username');
  store.updateField('username', {
    dirty: false,
    errors: new Set([0.0, 0.1, 0.2, 1.0, 1.1, 1.2, 2.0, 2.1, 2.2]),
    warnings: new Set([0.0, 0.1, 0.2, 1.0, 1.1, 1.2, 2.0, 2.1, 2.2]),
    infos: new Set([0.0, 0.1, 0.2, 1.0, 1.1, 1.2, 2.0, 2.1, 2.2]),
    validationMessage: ''
  });

  const fieldFeedbacksKey = 1;
  const field = store.getFieldFor('username', fieldFeedbacksKey);

  expect(field).toEqual({
    dirty: false,
    errors: new Set([1.0, 1.1, 1.2]),
    warnings: new Set([1.0, 1.1, 1.2]),
    infos: new Set([1.0, 1.1, 1.2]),
    validationMessage: ''
  });
});

test('contain*()', () => {
  const store = new FieldsStore();
  store.addField('username');
  store.updateField('username', fieldWithoutFeedback);
  store.addField('password');
  store.updateField('password', fieldWithoutFeedback);
  expect(store.containErrors('username', 'password')).toEqual(false);
  expect(store.containWarnings('username', 'password')).toEqual(false);
  expect(store.containInfos('username', 'password')).toEqual(false);

  store.updateField('username', {
    dirty: true,
    errors: new Set([1.1]),
    warnings: new Set(),
    infos: new Set(),
    validationMessage: 'Suffering from being missing'
  });
  store.updateField('password', {
    dirty: true,
    errors: new Set([1.1]),
    warnings: new Set(),
    infos: new Set(),
    validationMessage: 'Suffering from being missing'
  });
  expect(store.containErrors('username', 'password')).toEqual(true);
  expect(store.containWarnings('username', 'password')).toEqual(false);
  expect(store.containInfos('username', 'password')).toEqual(false);

  store.updateField('username', {
    dirty: true,
    errors: new Set(),
    warnings: new Set([1.1]),
    infos: new Set(),
    validationMessage: 'Suffering from being missing'
  });
  store.updateField('password', {
    dirty: true,
    errors: new Set(),
    warnings: new Set([1.1]),
    infos: new Set(),
    validationMessage: 'Suffering from being missing'
  });
  expect(store.containErrors('username', 'password')).toEqual(false);
  expect(store.containWarnings('username', 'password')).toEqual(true);
  expect(store.containInfos('username', 'password')).toEqual(false);

  store.updateField('username', {
    dirty: true,
    errors: new Set(),
    warnings: new Set(),
    infos: new Set([1.1]),
    validationMessage: 'Suffering from being missing'
  });
  store.updateField('password', {
    dirty: true,
    errors: new Set(),
    warnings: new Set(),
    infos: new Set([1.1]),
    validationMessage: 'Suffering from being missing'
  });
  expect(store.containErrors('username', 'password')).toEqual(false);
  expect(store.containWarnings('username', 'password')).toEqual(false);
  expect(store.containInfos('username', 'password')).toEqual(true);
});

test('contain*() - unknown field', () => {
  const store = new FieldsStore();

  // Ignore unknown fields
  expect(store.containErrors('email')).toEqual(false);
  expect(store.containWarnings('email')).toEqual(false);
  expect(store.containInfos('email')).toEqual(false);
  expect(store.areValidDirtyWithoutWarnings('email')).toEqual(false);
});

test('areValidDirtyWithoutWarnings()', () => {
  const store = new FieldsStore();
  store.addField('username');
  store.updateField('username', fieldWithoutFeedback);
  store.addField('password');
  store.updateField('password', fieldWithoutFeedback);
  expect(store.areValidDirtyWithoutWarnings('username', 'password')).toEqual(false);

  store.updateField('username', {
    dirty: true,
    errors: new Set(),
    warnings: new Set(),
    infos: new Set(),
    validationMessage: ''
  });
  store.updateField('password', {
    dirty: true,
    errors: new Set(),
    warnings: new Set(),
    infos: new Set(),
    validationMessage: ''
  });
  expect(store.areValidDirtyWithoutWarnings('username', 'password')).toEqual(true);

  store.updateField('username', {
    dirty: true,
    errors: new Set([1.1]),
    warnings: new Set(),
    infos: new Set(),
    validationMessage: 'Suffering from being missing'
  });
  store.updateField('password', {
    dirty: true,
    errors: new Set([1.1]),
    warnings: new Set(),
    infos: new Set(),
    validationMessage: 'Suffering from being missing'
  });
  expect(store.areValidDirtyWithoutWarnings('username', 'password')).toEqual(false);

  store.updateField('username', {
    dirty: true,
    errors: new Set(),
    warnings: new Set([1.1]),
    infos: new Set(),
    validationMessage: 'Suffering from being missing'
  });
  store.updateField('password', {
    dirty: true,
    errors: new Set(),
    warnings: new Set([1.1]),
    infos: new Set(),
    validationMessage: 'Suffering from being missing'
  });
  expect(store.areValidDirtyWithoutWarnings('username', 'password')).toEqual(false);
});
