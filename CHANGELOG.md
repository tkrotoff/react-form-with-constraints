## 0.8.0 (2018/01/10)

### Breaking Changes

- `show` attribute replaced by `stop`
- `validateFields()` now returns a list of promises
- Add `validateForm()`: does not re-validate fields already validated contrary to `validateFields()`

### Fixes

- Fix `computeFieldFeedbackKey()` implementation, see 2291b3b
- Fix possible crash with React Native, see 03d72e1
- Fix form reset #22 by introducing `reset()`

### Features

- Async support

## 0.7.1 (2017/11/27)

### Fixes

- Fix [CodeClimate coverage report](https://codeclimate.com/github/tkrotoff/react-form-with-constraints), see 4704370
- Expose 'react-form-with-constraints-bootstrap4/lib/Enzyme', see c4ce710

## 0.7.0 (2017/11/26)

### Features

- React Native support
