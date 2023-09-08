/* eslint-disable */
export default {
  displayName: 'ng-query',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: [
    '<rootDir>/src/test-setup.ts',
    '../../node_modules/@hirez_io/observer-spy/dist/setup-auto-unsubscribe.js',
  ],
  globals: {},
  coverageDirectory: '../../coverage/packages/ng-query',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
