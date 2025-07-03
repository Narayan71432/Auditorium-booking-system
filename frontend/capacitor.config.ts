import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mernapp.app',
  appName: 'MERN App',
  webDir: 'build',
  server: {
    androidScheme: 'http',
    cleartext: true,
    allowNavigation: ['*'],
    hostname: 'app',
    iosScheme: 'http'
    // Remove the URL - we want to load the built app, not the backend
  },
  cordova: {},
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
