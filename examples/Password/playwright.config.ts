import { devices, PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testMatch: /.*\.test\.e2e\.ts$/,

  use: {
    headless: true
  },

  webServer: {
    command: 'npm run start',
    port: 8080
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: devices['Desktop Chrome']
    },
    {
      name: 'Desktop Firefox',
      use: devices['Desktop Firefox']
    },
    {
      name: 'Desktop Safari',
      use: devices['Desktop Safari']
    }
  ]
};

export default config;
