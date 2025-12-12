export const getApiBaseUrl = () => {
  // For development, use localhost
  if (__DEV__) {
    return "http://localhost:3001/api";
  }
  // For production, you might want to use your production API URL
  return "https://your-production-api.com/api";
};
