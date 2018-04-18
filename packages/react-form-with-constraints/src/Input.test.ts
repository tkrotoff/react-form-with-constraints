import { Input } from './Input';

test('constructor() HTMLInputElement', () => {
  const htmlInputElement = {
    name: 'username',
    type: 'text',
    value: 'john',
    // tslint:disable-next-line:no-object-literal-type-assertion
    validity: {valid: true} as ValidityState,
    validationMessage: ''
  };
  const input = new Input(htmlInputElement);
  expect(input).toEqual({
    name: 'username',
    type: 'text',
    value: 'john',
    validity: {valid: true},
    validationMessage: ''
  });

  // Mutates
  htmlInputElement.name = 'jimmy';
  expect(input.value).toEqual('john');
});

test('constructor() TextInput', () => {
  const textInput = {
    props: {
      name: 'username',
      value: 'john'
    }
  };
  const input = new Input(textInput);
  expect(input).toEqual({
    name: 'username',
    type: undefined,
    value: 'john',
    validity: undefined,
    validationMessage: undefined
  });

  // Mutates
  textInput.props.value = 'jimmy';
  expect(input.value).toEqual('john');
});
