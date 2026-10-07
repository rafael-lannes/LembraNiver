import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lembraniver.app',
  appName: 'LembraNiver',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
