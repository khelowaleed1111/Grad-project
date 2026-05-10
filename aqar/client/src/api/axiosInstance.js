import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Track if we're currently refreshing the token to avoid multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ── Request interceptor: attach JWT ──────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aqar_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 with token refresh ─────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token by calling /auth/me
        // This validates the current token and returns user data
        const token = localStorage.getItem('aqar_token');
        
        if (!token) {
          throw new Error('No token available');
        }

        // Verify token is still valid
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          // Token is still valid, retry the original request
          processQueue(null, token);
          isRefreshing = false;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error('Token validation failed');
        }
      } catch (refreshError) {
        // Token refresh failed, clear auth data and notify app
        processQueue(refreshError, null);
        isRefreshing = false;
        localStorage.removeItem('aqar_token');
        localStorage.removeItem('aqar_user');
        
        // Dispatch custom event for AuthContext to handle
        window.dispatchEvent(new CustomEvent('aqar:unauthorized'));
        
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
