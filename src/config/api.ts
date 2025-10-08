const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:8000' // Android emulator local backend
  : 'https://your-production-api.com';

export default API_BASE_URL;
