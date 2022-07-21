// eslint-disable-next-line unicorn/prefer-node-protocol
import * as assert from 'assert';
import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// [console.assert not throwing with v22.4.0](https://github.com/facebook/jest/issues/5634)
// eslint-disable-next-line no-console
console.assert = assert;
