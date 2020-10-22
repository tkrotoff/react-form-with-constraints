import { API, FileInfo } from 'jscodeshift';

module.exports = (fileInfo: FileInfo, api: API) => {
  const j = api.jscodeshift;

  return j(fileInfo.source)
    .find(j.CallExpression, {
      callee: {
        object: {
          name: 'console'
        }
      }
    })
    .remove()
    .toSource();
};
