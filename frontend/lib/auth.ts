/**
 * Sanctum SPA Authentication Utilities
 */

// IMPORTANT (Sanctum SPA): browser requests should use same-origin URLs so
// the XSRF-TOKEN cookie is readable/sent and CSRF validation passes.
// We therefore force same-origin (empty base URL) in the browser.
// Server-side usage (if any) may still use NEXT_PUBLIC_API_URL.
const CONFIGURED_API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_URL = typeof window === 'undefined' ? CONFIGURED_API_URL : '';

// Cache CSRF cookie to avoid duplicate requests
let csrfCookieCached = false;

/**
 * Get CSRF cookie before making authenticated requests
 * This is required for Sanctum SPA authentication
 */
export async function getCsrfCookie(): Promise<void> {
  if (csrfCookieCached) return; // Skip if already obtained

  const res = await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to get CSRF cookie (status ${res.status})`);
  }

  // Only mark cached if we successfully reached the endpoint.
  csrfCookieCached = true;
}

/**
 * Reset CSRF cache (called on logout)
 */
export function resetCsrfCache() {
  csrfCookieCached = false;
}

function isApiErrorLike(error: unknown): error is { status?: number; errors?: unknown; message?: string } {
  return typeof error === 'object' && error !== null && ('status' in error || 'errors' in error);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  try {
    return typeof error === 'string' ? error : JSON.stringify(error);
  } catch {
    return String(error);
  }
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
  apellido: string;
  email: string;
  pais: string;
  whatsapp?: string;
  telefono?: string;
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
  } catch (error: unknown) {
    // If it's already our formatted error, re-throw it
    if (isApiErrorLike(error)) {
      throw error;
    }

    // Network or other error
    throw {
      status: 0,
      message: 'Error de conexión. Por favor, verifica que el servidor esté en ejecución.',
      errors: {},
      originalError: getErrorMessage(error),
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
  } catch (error: unknown) {
    if (isApiErrorLike(error)) {
      throw error;
    }

    throw {
      status: 0,
      message: 'Error de conexión. Por favor, verifica que el servidor esté en ejecución.',
      errors: {},
      originalError: getErrorMessage(error),
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
  } catch (error: unknown) {
    if (isApiErrorLike(error)) {
      throw error;
    }

    throw {
      status: 0,
      message: 'Error de conexión',
      errors: {},
      originalError: getErrorMessage(error),
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
  } catch (error: unknown) {
    if (isApiErrorLike(error)) {
      throw error;
    }

    throw {
      status: 0,
      message: 'Error de conexión',
      errors: {},
      originalError: getErrorMessage(error),
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

    // Logout may return 204 No Content or non-JSON responses depending on backend.
    let responseData: unknown = null;
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }

    if (!response.ok) {
      const dataObj = (typeof responseData === 'object' && responseData !== null)
        ? (responseData as Record<string, unknown>)
        : {};

      throw {
        status: response.status,
        message: (dataObj.message as string) || 'Error al cerrar sesión',
        errors: (dataObj.errors as unknown) || {},
        ...dataObj,
      };
    }

    return responseData;
  } catch (error: unknown) {
    if (isApiErrorLike(error)) {
      throw error;
    }

    throw {
      status: 0,
      message: 'Error de conexión',
      errors: {},
      originalError: getErrorMessage(error),
    };
  } finally {
    // Even if the request fails, we still want the client to consider the session cleared.
    resetCsrfCache();
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

    return responseData.data;
  } catch (error: unknown) {
    if (isApiErrorLike(error)) {
      throw error;
    }

    throw {
      status: 0,
      message: 'Error de conexión',
      errors: {},
      originalError: getErrorMessage(error),
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
    return data;
  } catch {
    return null;
  }
}
