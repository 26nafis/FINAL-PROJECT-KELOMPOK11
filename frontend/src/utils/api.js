const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getToken() {
  return localStorage.getItem('token');
}

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

export async function apiGet(path) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: getHeaders(false),
  });

  return handleResponse(response);
}

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

export async function apiPut(path, body = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(body),
  });

  return handleResponse(response);
}

export async function apiPatch(path, body = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: getHeaders(true),
    body: JSON.stringify(body),
  });

  return handleResponse(response);
}

export async function apiDelete(path) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: getHeaders(false),
  });

  return handleResponse(response);
}

export async function apiUpload(path, file, fieldName = 'image') {
  const formData = new FormData();
  formData.append(fieldName, file);

  const token = getToken();
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  return handleResponse(response);
}

export function resolveImageUrl(imageUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  return `${BASE_URL}${imageUrl}`;
}

export { BASE_URL };