import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bitintegrated.propertyconnect',
  appName: 'Property Connect',
  webDir: 'dist/spa',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    Filesystem: {
      directory: 'DOCUMENTS', // Or use 'DATA' if preferred
      androidPermissions: [
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
};

export default config;
