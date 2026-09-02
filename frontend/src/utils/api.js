
const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Ambil token login dari localStorage
 */
function getToken() {
  return localStorage.getItem('token');
}

/**
 * Membuat headers request
 */
function getHeaders(hasBody = false) {
  const headers = {};

  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Memproses response API
 */
async function handleResponse(response) {
  let result;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    const message =
      result?.message ||
      `Request gagal: ${response.status} ${response.statusText}`;

    throw new Error(message);
  }

  return result;
}

/**
 * GET
 */
export async function apiGet(path) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: getHeaders(false),
  });

  return handleResponse(response);
}

/**
 * POST
 */
export async function apiPost(path, body = null) {
  const options = {
    method: 'POST',
    headers: getHeaders(body !== null),
  };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, options);

  return handleResponse(response);
}

/**
 * PUT
 */
export async function apiPut(path, body = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(body),
  });

  return handleResponse(response);
}

/**
 * PATCH
 */
export async function apiPatch(path, body = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: getHeaders(true),
    body: JSON.stringify(body),
  });

  return handleResponse(response);
}

/**
 * DELETE
 */
export async function apiDelete(path) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: getHeaders(false),
  });

  return handleResponse(response);
}

/**
 * Export BASE URL jika diperlukan
 */
export { BASE_URL };

