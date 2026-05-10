/**
 * Manual test file for axios instance configuration
 * This file can be used to verify the axios instance is properly configured
 * 
 * To test manually:
 * 1. Import this in your component
 * 2. Call testAxiosInstance() to verify configuration
 */

import axiosInstance from './axiosInstance.js';

export const testAxiosInstance = async () => {
  console.log('Testing Axios Instance Configuration...');
  
  // Test 1: Verify base URL
  console.log('✓ Base URL:', axiosInstance.defaults.baseURL);
  
  // Test 2: Verify timeout
  console.log('✓ Timeout:', axiosInstance.defaults.timeout, 'ms');
  
  // Test 3: Verify headers
  console.log('✓ Default Headers:', axiosInstance.defaults.headers);
  
  // Test 4: Test request interceptor (check if token is attached)
  const token = localStorage.getItem('aqar_token');
  if (token) {
    console.log('✓ JWT Token found in localStorage');
  } else {
    console.log('⚠ No JWT Token in localStorage (expected for unauthenticated users)');
  }
  
  // Test 5: Test connection to backend
  try {
    const response = await axiosInstance.get('/auth/me');
    console.log('✓ Backend connection successful:', response.data);
    return { success: true, authenticated: true };
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✓ Backend connection successful (401 expected for unauthenticated users)');
      return { success: true, authenticated: false };
    } else {
      console.error('✗ Backend connection failed:', error.message);
      return { success: false, error: error.message };
    }
  }
};

// Export for use in components
export default axiosInstance;
