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
- Strip console.* in production thanks to rollup-plugin-strip
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
