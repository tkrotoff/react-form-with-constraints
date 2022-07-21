// @ts-check

/** @type import('@jest/types').Config.InitialOptions */
const config = {
  preset: 'jest-expo',

  // https://metareal.blog/en/post/2021/01/16/setup-jest-for-expo-typescript-project/
  // https://docs.expo.dev/guides/testing-with-jest/#jest-configuration
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|lodash-es)'
  ]
};

module.exports = config;
