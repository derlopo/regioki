import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run RegioKI-Core:serve:development',
        production: 'nx run RegioKI-Core:serve:production',
      },
      ciWebServerCommand: 'nx run RegioKI-Core:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
