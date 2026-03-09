const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = async (
  endpoint: string, 
  options: RequestInit = {}
) => {
  const token = localStorage.getItem('userToken');

  // 1. Create a proper Headers object to make TypeScript happy
  const headers = new Headers(options.headers);
  
  // 2. Set default content type (only if not already set, e.g., for FormData)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // 3. Attach the token safely
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // 4. Make the fetch request
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 5. Handle errors cleanly
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.status}`);
  }

  return response.json();
};