/**
 * Sanctum SPA Authentication Utilities
 */

// Use empty string to use Next.js proxy instead of direct backend calls
// This avoids CORS issues
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Get CSRF cookie before making authenticated requests
 * This is required for Sanctum SPA authentication
 */
export async function getCsrfCookie(): Promise<void> {
  await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    },
  });
}

/**
 * Get CSRF token from cookie
 */
function getCsrfToken(): string | null {
  const name = 'XSRF-TOKEN';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const token = parts.pop()?.split(';').shift();
    return token ? decodeURIComponent(token) : null;
  }

  return null;
}

/**
 * Make an authenticated API request
 * Automatically includes credentials (cookies) and CSRF token
 */
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const csrfToken = getCsrfToken();

  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
      ...(options.headers || {}),
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  return fetch(url, mergedOptions);
}

/**
 * Register a new user
 */
export async function register(data: {
  nombre: string;
  email: string;
  pais: string;
  whatsapp?: string;
}) {
  try {
    // Get CSRF cookie first
    await getCsrfCookie();

    const response = await apiRequest('/api/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Throw with proper error structure
      throw {
        status: response.status,
        message: responseData.message || 'Error en el registro',
        errors: responseData.errors || {},
        ...responseData,
      };
    }

    return responseData;
  } catch (error: any) {
    // If it's already our formatted error, re-throw it
    if (error.status || error.errors) {
      throw error;
    }

    // Network or other error
    throw {
      status: 0,
      message: 'Error de conexión. Por favor, verifica que el servidor esté en ejecución.',
      errors: {},
      originalError: error.message,
    };
  }
}

/**
 * Login user
 */
export async function login(credentials: {
  email: string;
  password: string;
}) {
  try {
    // Get CSRF cookie first
    await getCsrfCookie();

    const response = await apiRequest('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: responseData.message || 'Error en el inicio de sesión',
        errors: responseData.errors || {},
        ...responseData,
      };
    }

    return responseData;
  } catch (error: any) {
    if (error.status || error.errors) {
      throw error;
    }

    throw {
      status: 0,
      message: 'Error de conexión. Por favor, verifica que el servidor esté en ejecución.',
      errors: {},
      originalError: error.message,
    };
  }
}

/**
 * Send OTP code
 */
export async function sendOtp(email: string) {
  try {
    // Get CSRF cookie first (important for stateful API requests)
    await getCsrfCookie();

    const response = await apiRequest('/api/otp/send', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: responseData.message || 'Error al enviar código',
        errors: responseData.errors || {},
        ...responseData,
      };
    }

    return responseData;
  } catch (error: any) {
    if (error.status || error.errors) {
      throw error;
    }

    throw {
      status: 0,
      message: 'Error de conexión',
      errors: {},
      originalError: error.message,
    };
  }
}

/**
 * Verify OTP code and login
 */
export async function verifyOtp(email: string, code: string) {
  try {
    // We already have the cookie from sendOtp, but getting it again is safe
    await getCsrfCookie();

    const response = await apiRequest('/api/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: responseData.message || 'Error al verificar código',
        errors: responseData.errors || {},
        ...responseData,
      };
    }

    return responseData;
  } catch (error: any) {
    if (error.status || error.errors) {
      throw error;
    }

    throw {
      status: 0,
      message: 'Error de conexión',
      errors: {},
      originalError: error.message,
    };
  }
}

/**
 * Logout user
 */
export async function logout() {
  try {
    const response = await apiRequest('/api/logout', {
      method: 'POST',
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: responseData.message || 'Error al cerrar sesión',
        errors: responseData.errors || {},
        ...responseData,
      };
    }

    return responseData;
  } catch (error: any) {
    if (error.status || error.errors) {
      throw error;
    }

    throw {
      status: 0,
      message: 'Error de conexión',
      errors: {},
      originalError: error.message,
    };
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  try {
    const response = await apiRequest('/api/me', {
      method: 'GET',
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: responseData.message || 'Error al obtener usuario',
        errors: responseData.errors || {},
        ...responseData,
      };
    }

    return responseData;
  } catch (error: any) {
    if (error.status || error.errors) {
      throw error;
    }

    throw {
      status: 0,
      message: 'Error de conexión',
      errors: {},
      originalError: error.message,
    };
  }
}

/**
 * Check if user is authenticated
 * Returns user data if authenticated, null otherwise
 */
export async function checkAuth() {
  try {
    const data = await getCurrentUser();
    return data.user;
  } catch (error) {
    return null;
  }
}
