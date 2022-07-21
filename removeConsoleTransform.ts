import { API, FileInfo } from 'jscodeshift';

export default (fileInfo: FileInfo, api: API) => {
  const { jscodeshift } = api;

  return (
    jscodeshift(fileInfo.source)
      // eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument
      .find(jscodeshift.CallExpression, {
        callee: {
          object: {
            name: 'console'
          }
        }
      })
      .remove()
      .toSource()
  );
};
