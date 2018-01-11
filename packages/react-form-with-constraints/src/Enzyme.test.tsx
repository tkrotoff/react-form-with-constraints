import * as React from 'react';
import { shallow } from 'enzyme';

import { FieldFeedbacks, FieldFeedback } from './index';
import { getFieldFeedbacksMessages } from './Enzyme';

test('with matching FieldFeedbacks', () => {
  const wrapper = shallow(
    <div>
      <input name="username" value="" required />
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
      </FieldFeedbacks>
    </div>
  );

  const inputs = wrapper.find('input');
  expect(inputs).toHaveLength(1);
  expect(inputs.props().value).toEqual('');
  expect(getFieldFeedbacksMessages(inputs)).toEqual(['Please fill out this field.']);
});

test('children with <div> inside hierarchy', () => {
  const wrapper = shallow(
    <div>
      <input type="password" name="password" value="1234" required pattern=".{5,}" />
      <FieldFeedbacks for="password" stop="no">
        <div>
          <FieldFeedback when="valueMissing" />
          <FieldFeedback when="patternMismatch">Should be at least 5 characters long</FieldFeedback>
        </div>
        <div>
          <FieldFeedback when={value => !/\d/.test(value)} warning>Should contain numbers</FieldFeedback>
          <FieldFeedback when={value => !/[a-z]/.test(value)} warning>Should contain small letters</FieldFeedback>
          <FieldFeedback when={value => !/[A-Z]/.test(value)} warning>Should contain capital letters</FieldFeedback>
          <FieldFeedback when={value => !/\W/.test(value)} warning>Should contain special characters</FieldFeedback>
        </div>
      </FieldFeedbacks>
    </div>
  );

  const inputs = wrapper.find('input');
  expect(inputs).toHaveLength(1);
  expect(inputs.props().value).toEqual('1234');
  expect(getFieldFeedbacksMessages(inputs)).toEqual([
    'Should be at least 5 characters long',
    'Should contain small letters',
    'Should contain capital letters',
    'Should contain special characters'
  ]);
});

test('no matching FieldFeedbacks', () => {
  expect.assertions(3);

  const wrapper = shallow(
    <div>
      <input name="username" />
      <FieldFeedbacks for="invalid">
        <FieldFeedback when="*" />
      </FieldFeedbacks>
    </div>
  );

  const inputs = wrapper.find('input');
  expect(inputs).toHaveLength(1);
  expect(inputs.props().value).toEqual(undefined);
  expect(() => getFieldFeedbacksMessages(inputs)).toThrow('At least 1 FieldFeedbacks should match');
});

test('multiple matching FieldFeedbacks', () => {
  const wrapper = shallow(
    <div>
      <input name="username" value="" required />
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
        <FieldFeedback when="valueMissing" />
      </FieldFeedbacks>
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
        <FieldFeedback when="valueMissing" />
      </FieldFeedbacks>
    </div>
  );

  const inputs = wrapper.find('input');
  expect(inputs).toHaveLength(1);
  expect(inputs.props().value).toEqual('');
  expect(getFieldFeedbacksMessages(inputs)).toEqual(['Please fill out this field.', 'Please fill out this field.', 'Please fill out this field.', 'Please fill out this field.']);
});

test('multiple inputs', () => {
  const wrapper = shallow(
    <div>
      <input name="username" value="" required />
      <FieldFeedbacks for="username">
        <FieldFeedback when="*" />
      </FieldFeedbacks>
      <input type="password" name="password" value="1234" required pattern=".{5,}" />
      <FieldFeedbacks for="password">
        <FieldFeedback when="*" />
      </FieldFeedbacks>
    </div>
  );

  const inputs = wrapper.find('input');
  expect(inputs).toHaveLength(2);
  expect(getFieldFeedbacksMessages(inputs)).toEqual(['Please fill out this field.', 'Please match the requested format.']);
  expect(getFieldFeedbacksMessages(inputs.at(0))).toEqual(['Please fill out this field.']);
  expect(getFieldFeedbacksMessages(inputs.at(1))).toEqual(['Please match the requested format.']);
});

describe('when', () => {
  test('function', () => {
    const wrapper = shallow(
      <div>
        <input name="username" value="" required />
        <FieldFeedbacks for="username">
          <FieldFeedback when={value => value.length === 0}>Cannot be empty</FieldFeedback>
        </FieldFeedbacks>
      </div>
    );

    const inputs = wrapper.find('input');
    expect(inputs).toHaveLength(1);
    expect(inputs.props().value).toEqual('');
    expect(getFieldFeedbacksMessages(inputs)).toEqual(['Cannot be empty']);
  });

  test('invalid typeof', () => {
    expect.assertions(4);

    const wrapper = shallow(
      <div>
        <input name="username" />
        <FieldFeedbacks for="username">
          <FieldFeedback when={2 as any} />
        </FieldFeedbacks>
      </div>
    );

    const inputs = wrapper.find('input');
    expect(inputs).toHaveLength(1);
    expect(inputs.props().value).toEqual(undefined);
    expect(() => getFieldFeedbacksMessages(inputs)).toThrow(TypeError);
    expect(() => getFieldFeedbacksMessages(inputs)).toThrow("Invalid FieldFeedback 'when' type: number");
  });

  test('invalid string', () => {
    const wrapper = shallow(
      <div>
        <input name="username" />
        <FieldFeedbacks for="username">
          <FieldFeedback when={'unknown' as any}>Cannot be empty</FieldFeedback>
        </FieldFeedbacks>
      </div>
    );

    const inputs = wrapper.find('input');
    expect(inputs).toHaveLength(1);
    expect(inputs.props().value).toEqual(undefined);
    expect(() => getFieldFeedbacksMessages(inputs)).toThrow("Invalid FieldFeedback 'when' value: unknown");
  });

  describe('badInput', () => {
    test('type="number" + invalid value', () => {
      const wrapper = shallow(
        <div>
          <input type="number" name="age" value="invalid" />
          <FieldFeedbacks for="age">
            <FieldFeedback when="*" />
            <FieldFeedback when="badInput" />
          </FieldFeedbacks>
        </div>
      );

      const inputs = wrapper.find('input');
      expect(inputs).toHaveLength(1);
      expect(inputs.props().value).toEqual('invalid');
      expect(getFieldFeedbacksMessages(inputs)).toEqual(['Please enter a number.', 'Please enter a number.']);
    });

    test('type="number" + valid string value', () => {
      const wrapper = shallow(
        <div>
          <input type="number" name="age" value="2" />
          <FieldFeedbacks for="age">
            <FieldFeedback when="badInput" />
          </FieldFeedbacks>
        </div>
      );

      const inputs = wrapper.find('input');
      expect(inputs).toHaveLength(1);
      expect(inputs.props().value).toEqual('2');
      expect(getFieldFeedbacksMessages(inputs)).toEqual([]);
    });

    test('type="number" + valid number value', () => {
      const wrapper = shallow(
        <div>
          <input type="number" name="age" value={2} />
          <FieldFeedbacks for="age">
            <FieldFeedback when="badInput" />
          </FieldFeedbacks>
        </div>
      );

      const inputs = wrapper.find('input');
      expect(inputs).toHaveLength(1);
      expect(inputs.props().value).toEqual(2);
      expect(getFieldFeedbacksMessages(inputs)).toEqual([]);
    });
  });

  test('patternMismatch', () => {
    const wrapper = shallow(
      <div>
        <input type="password" name="password" value="1234" pattern=".{5,}" />
        <FieldFeedbacks for="password">
          <FieldFeedback when="*" />
          <FieldFeedback when="patternMismatch" />
        </FieldFeedbacks>
      </div>
    );

    const inputs = wrapper.find('input');
    expect(inputs).toHaveLength(1);
    expect(inputs.props().value).toEqual('1234');
    expect(getFieldFeedbacksMessages(inputs)).toEqual(['Please match the requested format.', 'Please match the requested format.']);
  });

  test('rangeOverflow', () => {
    const JeanneCalment = 122;
    const wrapper = shallow(
      <div>
        <input type="number" name="age" value={JeanneCalment} min={12} max={120} />
        <FieldFeedbacks for="age">
          <FieldFeedback when="*" />
          <FieldFeedback when="rangeOverflow" />
        </FieldFeedbacks>
      </div>
    );

    const inputs = wrapper.find('input');
    expect(inputs).toHaveLength(1);
    expect(inputs.props().value).toEqual(JeanneCalment);
    expect(getFieldFeedbacksMessages(inputs)).toEqual(['Value must be less than or equal to 120.', 'Value must be less than or equal to 120.']);
  });

  test('rangeUnderflow', () => {
    const wrapper = shallow(
      <div>
        <input type="number" name="age" value={10} min={12} max={120} />
        <FieldFeedbacks for="age">
          <FieldFeedback when="*" />
          <FieldFeedback when="rangeUnderflow" />
        </FieldFeedbacks>
      </div>
    );

    const inputs = wrapper.find('input');
    expect(inputs).toHaveLength(1);
    expect(inputs.props().value).toEqual(10);
    expect(getFieldFeedbacksMessages(inputs)).toEqual(['Value must be greater than or equal to 12.', 'Value must be greater than or equal to 12.']);
  });

  test('stepMismatch', () => {
    const wrapper = shallow(
      <div>
        <input type="number" name="age" value={15} min={10} max={120} step={10} />
        <FieldFeedbacks for="age">
          <FieldFeedback when="*" />
          <FieldFeedback when="stepMismatch" />
        </FieldFeedbacks>
      </div>
    );

    const inputs = wrapper.find('input');
    expect(inputs).toHaveLength(1);
    expect(inputs.props().value).toEqual(15);
    expect(getFieldFeedbacksMessages(inputs)).toEqual(['Please enter a valid value.', 'Please enter a valid value.']);
  });

  test('tooLong', () => {
    const wrapper = shallow(
      <div>
        <textarea name="text" value="This text is too long" maxLength={10} />
        <FieldFeedbacks for="text">
          <FieldFeedback when="*" />
          <FieldFeedback when="tooLong" />
        </FieldFeedbacks>
      </div>
    );

    const inputs = wrapper.find('textarea');
    expect(inputs).toHaveLength(1);
    expect(inputs.props().value).toEqual('This text is too long');
    expect(getFieldFeedbacksMessages(inputs)).toEqual(['Please lengthen this text to 10 characters or less.', 'Please lengthen this text to 10 characters or less.']);
  });

  test('tooShort', () => {
    const wrapper = shallow(
      <div>
        <textarea name="text" value="This text is too short" minLength={100} />
        <FieldFeedbacks for="text">
          <FieldFeedback when="*" />
          <FieldFeedback when="tooShort" />
        </FieldFeedbacks>
      </div>
    );

    const inputs = wrapper.find('textarea');
    expect(inputs).toHaveLength(1);
    expect(inputs.props().value).toEqual('This text is too short');
    expect(getFieldFeedbacksMessages(inputs)).toEqual(['Please lengthen this text to 100 characters or more.', 'Please lengthen this text to 100 characters or more.']);
  });

  describe('typeMismatch', () => {
    test('email', () => {
      const wrapper = shallow(
        <div>
          <input type="email" name="username" value="invalid" />
          <FieldFeedbacks for="username">
            <FieldFeedback when="*" />
            <FieldFeedback when="typeMismatch" />
          </FieldFeedbacks>
        </div>
      );

      const inputs = wrapper.find('input');
      expect(inputs).toHaveLength(1);
      expect(inputs.props().value).toEqual('invalid');
      expect(getFieldFeedbacksMessages(inputs)).toEqual(['Please enter an email address.', 'Please enter an email address.']);
    });

    test('url', () => {
      const wrapper = shallow(
        <div>
          <input type="url" name="website" value="invalid" />
          <FieldFeedbacks for="website">
            <FieldFeedback when="*" />
            <FieldFeedback when="typeMismatch" />
          </FieldFeedbacks>
        </div>
      );

      const inputs = wrapper.find('input');
      expect(inputs).toHaveLength(1);
      expect(inputs.props().value).toEqual('invalid');
      expect(getFieldFeedbacksMessages(inputs)).toEqual(['Please enter a URL.', 'Please enter a URL.']);
    });
  });

  test('valueMissing', () => {
    const wrapper = shallow(
      <div>
        <input name="username" value="" required />
        <FieldFeedbacks for="username">
          <FieldFeedback when="*" />
          <FieldFeedback when="valueMissing" />
        </FieldFeedbacks>
      </div>
    );

    const inputs = wrapper.find('input');
    expect(inputs).toHaveLength(1);
    expect(inputs.props().value).toEqual('');
    expect(getFieldFeedbacksMessages(inputs)).toEqual(['Please fill out this field.', 'Please fill out this field.']);
  });
});

test('stop="no"', () => {
  const wrapper = shallow(
    <div>
      <input type="password" name="password" value="1234" required pattern=".{5,}" />
      <FieldFeedbacks for="password" stop="no">
        <FieldFeedback when="valueMissing" />
        <FieldFeedback when="patternMismatch">Should be at least 5 characters long</FieldFeedback>
        <FieldFeedback when={value => !/\d/.test(value)} warning>Should contain numbers</FieldFeedback>
        <FieldFeedback when={value => !/[a-z]/.test(value)} warning>Should contain small letters</FieldFeedback>
        <FieldFeedback when={value => !/[A-Z]/.test(value)} warning>Should contain capital letters</FieldFeedback>
        <FieldFeedback when={value => !/\W/.test(value)} warning>Should contain special characters</FieldFeedback>
      </FieldFeedbacks>
    </div>
  );

  const inputs = wrapper.find('input');
  expect(inputs).toHaveLength(1);
  expect(inputs.props().value).toEqual('1234');
  expect(getFieldFeedbacksMessages(inputs)).toEqual([
    'Should be at least 5 characters long',
    'Should contain small letters',
    'Should contain capital letters',
    'Should contain special characters'
  ]);
});
