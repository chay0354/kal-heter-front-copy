// Shared API utility functions
// Normalize API base URL to remove trailing slashes
const getApiBaseUrl = () => {
  const url = import.meta.env.VITE_API_BASE_URL || 'https://kal-heter-back.vercel.app';
  // Remove all trailing slashes
  return url.replace(/\/+$/, '');
};

const API_BASE_URL = getApiBaseUrl();

// Helper function to construct API URLs safely (prevents double slashes)
export const buildApiUrl = (path) => {
  // Ensure base has no trailing slash
  const base = API_BASE_URL.replace(/\/+$/, '');
  // Remove leading slashes from path and ensure it starts with /
  const cleanPath = path.replace(/^\/+/, '');
  // Combine with exactly one slash
  return `${base}/${cleanPath}`;
};

export { API_BASE_URL };
