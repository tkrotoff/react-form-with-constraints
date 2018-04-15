## 0.8.0 (2018/01/10)

### Features

- Async support
- Rewrite to allow nested `FieldFeedbacks`
- Strip console.* in production thanks to rollup-plugin-strip

### Breaking Changes

- `FieldFeedbacks` `show` attribute replaced by `stop`
- `validateFields()` now returns a list of promises
- Add `validateForm()`: does not re-validate fields already validated contrary to `validateFields()`
- Improve typings, see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/16318#issuecomment-362060939

### Fixes

- Fix `computeFieldFeedbackKey()` implementation
- Fix possible crash with React Native, see 03d72e1
- Fix form reset #22 by introducing `reset()`

## 0.7.1 (2017/11/27)

### Fixes

- Fix [CodeClimate coverage report](https://codeclimate.com/github/tkrotoff/react-form-with-constraints), see 4704370
- Expose 'react-form-with-constraints-bootstrap4/lib/Enzyme', see c4ce710

## 0.7.0 (2017/11/26)

### Features

- React Native support
