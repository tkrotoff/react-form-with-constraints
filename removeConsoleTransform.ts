import { API, FileInfo } from 'jscodeshift';

module.exports = (fileInfo: FileInfo, api: API) => {
  const { jscodeshift } = api;

  return (
    jscodeshift(fileInfo.source)
      // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
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
