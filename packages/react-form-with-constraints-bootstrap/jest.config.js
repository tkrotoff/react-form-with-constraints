// @ts-check

/** @type Partial<import('@jest/types').Config.InitialOptions> */
const config = {
  setupFiles: ['../react-form-with-constraints/jest.setup.ts'],
  preset: 'ts-jest',

  globals: {
    'ts-jest': {
      // See https://github.com/kulshekhar/ts-jest/issues/748#issuecomment-423528659
      //
      // Ignore ts-jest error (false positive):
      // "message TS151001: If you have issues related to imports, you should consider setting `esModuleInterop` to `true` in your TypeScript configuration file (usually `tsconfig.json`).
      // See https://blogs.msdn.microsoft.com/typescript/2018/01/31/announcing-typescript-2-7/#easier-ecmascript-module-interoperability for more information."
      diagnostics: {
        ignoreCodes: [151001]
      }
    }
  }
};

module.exports = config;
