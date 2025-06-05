// config.js
import { Capacitor } from '@capacitor/core';

const platform = Capacitor.getPlatform();

// Determine correct API URL based on platform
let API_BASE_URL = '';

// You should replace this with your actual development machine's IP on the network
// This IP should be accessible from your mobile device when on the same network
const DEV_MACHINE_IP = '192.168.37.158'; // User's actual IP address

if (Capacitor.isNativePlatform()) {
  if (platform === 'android') {
    if (window.location.hostname === 'localhost') {
      // For Android emulator, 10.0.2.2 maps to host machine's localhost
      API_BASE_URL = 'http://10.0.2.2:5000';
    } else {
      // For real Android device
      API_BASE_URL = `http://${DEV_MACHINE_IP}:5000`;
    }
    console.log('Android platform detected, using URL:', API_BASE_URL);
  } else if (platform === 'ios') {
    if (window.location.hostname === 'localhost') {
      // For iOS simulator
      API_BASE_URL = 'http://localhost:5000';
    } else {
      // For real iOS device
      API_BASE_URL = `http://${DEV_MACHINE_IP}:5000`;
    }
    console.log('iOS platform detected, using URL:', API_BASE_URL);
  }
} else {
  // Web or desktop (e.g. dev in browser)
  API_BASE_URL = 'http://localhost:5000';
  console.log('Web platform detected, using URL:', API_BASE_URL);
}

// Add this debugging info
console.log('Platform:', platform);
console.log('Is native:', Capacitor.isNativePlatform());
console.log('Hostname:', window.location.hostname);
console.log('Final API URL:', API_BASE_URL);

export default {
  API_BASE_URL
};
