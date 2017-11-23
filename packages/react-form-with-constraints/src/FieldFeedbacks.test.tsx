import * as React from 'react';
import { mount as _mount, shallow as _shallow } from 'enzyme';

import { FormWithConstraintsChildContext, fieldWithoutFeedback, FieldFeedback, FieldFeedbacksProps, FieldFeedbacks, ValidateEvent } from './index';
import FormWithConstraintsMock from './FormWithConstraintsMock';
import InputMock from './InputMock';

function shallow(node: React.ReactElement<FieldFeedbacksProps>, options: {context: FormWithConstraintsChildContext}) {
  return _shallow<FieldFeedbacksProps>(node, options);
}
function mount(node: React.ReactElement<FieldFeedbacksProps>, options: {context: FormWithConstraintsChildContext}) {
  return _mount<FieldFeedbacksProps>(node, options);
}

test('constructor() - computeFieldFeedbackKey()', () => {
  const component = shallow(
    <FieldFeedbacks for="username" />,
    {context: {form: new FormWithConstraintsMock()}}
  );
  const fieldFeedbacks = component.instance() as FieldFeedbacks;
  expect(fieldFeedbacks.key).toEqual(0.0);
});

describe('componentWillMount()', () => {
  test('initialize FieldsStore', () => {
    const form = new FormWithConstraintsMock();
    expect(form.fieldsStore.fields).toEqual({});

    const component = shallow(
      <FieldFeedbacks for="username" />,
      {context: {form}}
    );
    expect(form.fieldsStore.fields).toEqual({
      username: fieldWithoutFeedback
    });

    component.unmount();
    expect(form.fieldsStore.fields).toEqual({});
  });

  test('componentWillUnmount()', () => {
    const form = new FormWithConstraintsMock();
    const addValidateEventListenerSpy = jest.spyOn(form, 'addValidateEventListener');
    const fieldsStoreAddListenerSpy = jest.spyOn(form.fieldsStore, 'addListener');
    const removeValidateEventListenerSpy = jest.spyOn(form, 'removeValidateEventListener');
    const fieldsStoreRemoveListenerSpy = jest.spyOn(form.fieldsStore, 'removeListener');

    const component = shallow(
      <FieldFeedbacks for="username" />,
      {context: {form}}
    );
    expect(addValidateEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeValidateEventListenerSpy).toHaveBeenCalledTimes(0);
    expect(form.validateEventEmitter.listeners.get(ValidateEvent)).toHaveLength(1);
    expect(fieldsStoreAddListenerSpy).toHaveBeenCalledTimes(1);
    expect(fieldsStoreRemoveListenerSpy).toHaveBeenCalledTimes(0);

    component.unmount();
    expect(addValidateEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeValidateEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(form.validateEventEmitter.listeners.get(ValidateEvent)).toEqual(undefined);
    expect(fieldsStoreAddListenerSpy).toHaveBeenCalledTimes(1);
    expect(fieldsStoreRemoveListenerSpy).toHaveBeenCalledTimes(1);
  });
});

describe('validate()', () => {
  test('known input name - emitValidateEvent', () => {
    const form = new FormWithConstraintsMock();
    const fieldFeedbacks = shallow(
      <FieldFeedbacks for="username" />,
      {context: {form}}
    ).instance() as FieldFeedbacks;
    const emitValidateEventSpy = jest.spyOn(fieldFeedbacks, 'emitValidateEvent');

    expect(emitValidateEventSpy).toHaveBeenCalledTimes(0);
    const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    form.emitValidateEvent(input);
    expect(emitValidateEventSpy).toHaveBeenCalledTimes(1);
    expect(emitValidateEventSpy).toHaveBeenLastCalledWith(input);
  });

  test('known input name', () => {
    const form = new FormWithConstraintsMock();
    mount(
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
      </FieldFeedbacks>,
      {context: {form}}
    );
    const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    form.emitValidateEvent(input);

    expect(form.fieldsStore.fields).toEqual({
      username: {
        dirty: true,
        errors: new Set([0]),
        warnings: new Set(),
        infos: new Set(),
        validationMessage: 'Suffering from being missing'
      }
    });
  });

  test('unknown input name - emitValidateEvent', () => {
    const form = new FormWithConstraintsMock();
    const fieldFeedbacks = shallow(
      <FieldFeedbacks for="username" />,
      {context: {form}}
    ).instance() as FieldFeedbacks;
    const emitValidateEventSpy = jest.spyOn(fieldFeedbacks, 'emitValidateEvent');

    expect(emitValidateEventSpy).toHaveBeenCalledTimes(0);
    const input = new InputMock('unknown', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    form.emitValidateEvent(input);
    expect(emitValidateEventSpy).toHaveBeenCalledTimes(0);
  });

  test('unknown input name', () => {
    const form = new FormWithConstraintsMock();
    mount(
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
      </FieldFeedbacks>,
      {context: {form}}
    );
    const input = new InputMock('unknown', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    form.emitValidateEvent(input);

    expect(form.fieldsStore.fields).toEqual({
      username: fieldWithoutFeedback
    });
  });

  test('remove', () => {
    const form = new FormWithConstraintsMock({
      username: {
        dirty: true,
        errors: new Set([1.1, 0.0, 0.1]),
        warnings: new Set([1.1, 0.0, 0.1]),
        infos: new Set([1.1, 0.0, 0.1]),
        validationMessage: 'Suffering from being missing'
      }
    });

    shallow(
      <FieldFeedbacks for="username" />,
      {context: {form}}
    );
    const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    form.emitValidateEvent(input);

    expect(form.fieldsStore.fields).toEqual({
      username: {
        dirty: true,
        errors: new Set([1.1]),
        warnings: new Set([1.1]),
        infos: new Set([1.1]),
        validationMessage: 'Suffering from being missing'
      }
    });
  });
});

describe('render()', () => {
  test('children', () => {
    const form = new FormWithConstraintsMock();
    const component = mount(
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
      </FieldFeedbacks>,
      {context: {form}}
    );
    const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    form.emitValidateEvent(input);

    expect(form.fieldsStore.fields).toEqual({
      username: {
        dirty: true,
        errors: new Set([0.0]),
        warnings: new Set(),
        infos: new Set(),
        validationMessage: 'Suffering from being missing'
      }
    });
    expect(component.html()).toEqual(
      '<div><div class="error">Suffering from being missing</div></div>'
    );
  });

  test('children with <div> inside hierarchy', () => {
    const form = new FormWithConstraintsMock();
    const component = mount(
      <FieldFeedbacks for="username">
        <div>
          <FieldFeedback when="*" />
        </div>
      </FieldFeedbacks>,
      {context: {form}}
    );
    const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    form.emitValidateEvent(input);

    expect(form.fieldsStore.fields).toEqual({
      username: {
        dirty: true,
        errors: new Set([0.0]),
        warnings: new Set(),
        infos: new Set(),
        validationMessage: 'Suffering from being missing'
      }
    });
    expect(component.html()).toEqual(
      '<div><div><div class="error">Suffering from being missing</div></div></div>'
    );
  });

  test('unknown input name', () => {
    const form = new FormWithConstraintsMock();
    const component = mount(
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
      </FieldFeedbacks>,
      {context: {form}}
    );
    const input = new InputMock('unknown', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    form.emitValidateEvent(input);

    expect(form.fieldsStore.fields).toEqual({
      username: fieldWithoutFeedback
    });
    expect(component.html()).toEqual(
      '<div></div>'
    );
  });

  describe('show prop', () => {
    test('show="all" multiple FieldFeedback', () => {
      const form = new FormWithConstraintsMock();
      const component = mount(
        <FieldFeedbacks for="username" show="all">
          <FieldFeedback when="*" />
          <FieldFeedback when="*" />
          <FieldFeedback when="*" />
        </FieldFeedbacks>,
        {context: {form}}
      );
      const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
      form.emitValidateEvent(input);

      expect(form.fieldsStore.fields).toEqual({
        username: {
          dirty: true,
          errors: new Set([0.0, 0.1, 0.2]),
          warnings: new Set(),
          infos: new Set(),
          validationMessage: 'Suffering from being missing'
        }
      });

      expect(component.html()).toEqual(
        '<div><div class="error">Suffering from being missing</div><div class="error">Suffering from being missing</div><div class="error">Suffering from being missing</div></div>'
      );
    });

    test('show="first" multiple FieldFeedback', () => {
      const form = new FormWithConstraintsMock();
      const component = mount(
        <FieldFeedbacks for="username" show="first">
          <FieldFeedback when="*" />
          <FieldFeedback when="*" />
          <FieldFeedback when="*" />
        </FieldFeedbacks>,
        {context: {form}}
      );
      const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
      form.emitValidateEvent(input);

      expect(form.fieldsStore.fields).toEqual({
        username: {
          dirty: true,
          errors: new Set([0.0, 0.1, 0.2]),
          warnings: new Set(),
          infos: new Set(),
          validationMessage: 'Suffering from being missing'
        }
      });

      expect(component.html()).toEqual(
        '<div><div class="error">Suffering from being missing</div></div>'
      );
    });

    test('show="first" multiple FieldFeedback with error, warning, info', () => {
      const form = new FormWithConstraintsMock();
      const component = mount(
        <FieldFeedbacks for="username" show="first">
          <FieldFeedback when="*" error />
          <FieldFeedback when="*" warning />
          <FieldFeedback when="*" info />
        </FieldFeedbacks>,
        {context: {form}}
      );
      const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
      form.emitValidateEvent(input);

      expect(form.fieldsStore.fields).toEqual({
        username: {
          dirty: true,
          errors: new Set([0.0]),
          warnings: new Set([0.1]),
          infos: new Set([0.2]),
          validationMessage: 'Suffering from being missing'
        }
      });

      expect(component.html()).toEqual(
        '<div><div class="error">Suffering from being missing</div><div class="info">Suffering from being missing</div></div>'
      );
    });
  });
});

describe('reRender()', () => {
  test('known field updated', () => {
    const form = new FormWithConstraintsMock();
    const component = mount(
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
      </FieldFeedbacks>,
      {context: {form}}
    );
    const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    form.emitValidateEvent(input);

    expect(form.fieldsStore.fields).toEqual({
      username: {
        dirty: true,
        errors: new Set([0.0]),
        warnings: new Set(),
        infos: new Set(),
        validationMessage: 'Suffering from being missing'
      }
    });
    expect(component.html()).toEqual(
      '<div><div class="error">Suffering from being missing</div></div>'
    );

    form.fieldsStore.updateField('username', fieldWithoutFeedback);
    expect(component.html()).toEqual(
      '<div></div>'
    );
  });

  test('unknown field updated', () => {
    const form = new FormWithConstraintsMock();
    const component = mount(
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
      </FieldFeedbacks>,
      {context: {form}}
    );
    const input = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
    form.emitValidateEvent(input);

    expect(form.fieldsStore.fields).toEqual({
      username: {
        dirty: true,
        errors: new Set([0.0]),
        warnings: new Set(),
        infos: new Set(),
        validationMessage: 'Suffering from being missing'
      }
    });
    expect(component.html()).toEqual(
      '<div><div class="error">Suffering from being missing</div></div>'
    );

    const assert = console.assert;
    console.assert = jest.fn();
    form.fieldsStore.updateField('unknown', fieldWithoutFeedback);
    expect(console.assert).toHaveBeenCalledTimes(2);
    expect((console.assert as jest.Mock<{}>).mock.calls).toEqual([
      [ false, "Unknown field 'unknown'" ],
      [ true, "No listener for event 'FIELD_UPDATED'" ]
    ]);
    console.assert = assert;

    expect(component.html()).toEqual(
      '<div><div class="error">Suffering from being missing</div></div>'
    );
  });
});
