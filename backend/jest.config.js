export default {
  // Use ES Modules
  testEnvironment: 'node',

  // Transform files
  transform: {},

  // Module file extensions
  moduleFileExtensions: ['js', 'json'],

  // Test match patterns
  testMatch: ['**/__test__/**/*.test.js', '**/__tests__/**/*.test.js', '**/*.test.js'],

  // Coverage configuration
  collectCoverageFrom: [
    'controllers/**/*.js',
    'services/**/*.js',
    'middlewares/**/*.js',
    '!**/__test__/**',
    '!**/__tests__/**',
    '!**/node_modules/**',
  ],

  // Coverage thresholds (optional)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Ignore patterns
  testPathIgnorePatterns: ['/node_modules/'],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,
};
