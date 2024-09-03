module.exports = {
    roots: ['<rootDir>/app'],
    testMatch: ['**/?(*.)+(test).ts?(x)'],
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    testEnvironment: 'node',
    setupFiles: ['dotenv/config'],
  };
  