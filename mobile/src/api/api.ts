const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  console.warn('EXPO_PUBLIC_API_URL is not configured.');
}

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  if (!API_URL) {
    throw new ApiError('API URL is not configured.');
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(
      'Unable to connect to the server. Please check your internet connection.',
    );
  }

  let body: ApiResponse<T> | null = null;

  try {
    body = await response.json();
  } catch {
    // Server returned no valid JSON.
  }

  if (!response.ok) {
    throw new ApiError(
      body?.message || 'Something went wrong. Please try again.',
      response.status,
    );
  }

  return body || { success: true };
}

export const api = {
  post<T>(path: string, data?: unknown) {
    return request<T>(path, {
      method: 'POST',
      body: data === undefined ? undefined : JSON.stringify(data),
    });
  },

  get<T>(path: string) {
    return request<T>(path, {
      method: 'GET',
    });
  },
};

export { ApiError };