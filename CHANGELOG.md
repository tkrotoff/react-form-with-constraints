## v0.19.1 (2022/07/22)

- Switch from CodeSandbox to StackBlitz

## v0.19.0 (2022/07/21)

- Fix React 18 types (#58)
- Use React 18 in examples
- Update most npm packages when possible
- Switch from Puppeteer to Playwright
- Remove Yarn, use npm workspaces instead
- Use Lerna only for `npm run version`

## v0.18.0 (2021/05/20)

### Breaking Changes

- Upgrade Bootstrap from v4 to v5

## v0.17.0 (2021/05/16)

### Breaking Changes

- Rename react-form-with-constraints-bootstrap4 to react-form-with-constraints-bootstrap

  I won't have the man power to maintain Bootstrap 4 & 5

## v0.16.1 (2021/05/06)

### Fixes

- Fix jscodeshift: remove console.assert() from bundle

## v0.16.0 (2020/10/22)

### Breaking Changes

- Drop IE 10 support (IE 11 still supported)
- Use Array.flat(Infinity): Node.js >= 12 required
- Use TypeScript 3.7 "asserts condition"

### Features

- Update npm packages
- More ESLint and Stylelint plugins

## v0.15.2 (2020/10/20)

### Fixes

- Set field.element as soon as possible

## v0.15.0 (2020/03/05)

### Breaking Changes

- Dissociate emitSync and emitAsync
  - resetFields() does not return a Promise anymore
  - fieldWillValidate(), fieldDidValidate() and fieldDidReset() are sync instead of async: this might affect your tests

### Features

- Improve README
- No need for downlevelIteration anymore

### Fixes

- Fix .map files

## v0.14.2 (2020/02/28)

### Features

- Enable Airbnb ESLint restricted syntax, should reduce the bundle size
- No default export, see [Avoid Export Default](https://basarat.gitbook.io/typescript/main-1/defaultisbad)

## v0.14.1 (2020/02/28)

### Features

- Update npm packages

## v0.14.0 (2019/09/25)

### Breaking Changes

- Make DisplayFields work with React Native. You will need to write:
  - HTML: `<pre>Fields = <DisplayFields /></pre>`
  - React Native: `<Text>Fields = <DisplayFields /></Text>`

### Features

- Upgrade npm packages
- componentWillMount => UNSAFE_componentWillMount => componentDidMount
- componentWillUpdate => UNSAFE_componentWillUpdate => componentDidUpdate
- Prettier + ESLint - TSLint
- Add `Field.element: HTMLInput | TextInput | undefined`, see #41

### Fixes

- Fix react-form-with-constraints-tools package.json `"main": "lib-es5/index.js"`

## v0.13.0 (2019/06/25)

### Features

- Specify npm dependencies versions instead of using "latest"
- Upgrade to Material-UI >= 4.1.1
- Upgrade to Expo SDK 33
- Remove console.\* from packages before publishing
- Prettier
- ESLint
- Stylelint
- Husky

## v0.12.0 (2019/03/21)

### Features

- Update examples to use hooks
- Remove \*.js.gz files
- Upgrade NPM packages

## v0.11.0 (2019/01/05)

### Fixes

- Disable `esModuleInterop` (`import * as React` vs `import React`) to increase compatibility with TypeScript users, see b18d61
- Fix react-form-with-constraints-bootstrap4 for IE 10: does no support inheritance with static properties, see 225cb9

## v0.10.0 (2018/10/16)

### Features

- `Input` is-pending class
- `resetFields()`
- `validateFieldsWithoutFeedback()`
- Use tree shaking and generate ES2017 files

### Breaking Changes

- `reset()` renamed to `resetFields()`

### Fixes

- Ignore HTML elements without `ValidityState` instead of `type`

## v0.9.3 (2018/09/12)

### Features

- Use `PropTypes.instanceOf()` instead of `PropTypes.object`
- Improve typings

### Fixes

- Ignore HTML elements without `type`

## v0.9.2 (2018/07/13)

### Features

- Upgrade to Bootstrap 4.1.2
- Add a README.md for every npm package

## v0.9.1 (2018/07/06)

### Features

- `<Input>` component for field styling
- Material-UI integration with `react-form-with-constraints-material-ui`
- `hasFeedbacks()` to implement reset button

### Breaking Changes

- `FieldFeedback` uses `<span style="display: block">` instead of `<div>` in order to be a child of `<p>`
- HTML: styling done on `FieldFeedback` with `classes` props instead of `FormWithConstraints.fieldFeedbackClassNames`
- React Native: styling done on `FieldFeedback` with `theme` props instead of `FormWithConstraints.fieldFeedbackStyles`
- Rename TypeScript `Input` to `InputElement`

## v0.8.0 (2018/04/26)

### Features

- Async support
- Rewrite to allow nested `FieldFeedbacks`
- Strip console.\* in production thanks to rollup-plugin-strip
- Add `reset()`, see #22

### Breaking Changes

- `FieldFeedbacks` `show` attribute replaced by `stop`
- `validateFields()` returns `Promise<Field[]>`
- Add `validateForm()`: does not re-validate fields already validated contrary to `validateFields()`
- Improve typings, see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/16318#issuecomment-362060939

### Fixes

- Fix `computeFieldFeedbackKey()` implementation
- Fix possible crash with React Native, see 03d72e1

## v0.7.1 (2017/11/27)

### Fixes

- Fix [CodeClimate coverage report](https://codeclimate.com/github/tkrotoff/react-form-with-constraints), see 4704370
- Expose 'react-form-with-constraints-bootstrap4/lib/Enzyme', see c4ce710

## v0.7.0 (2017/11/26)

### Features

- React Native support
