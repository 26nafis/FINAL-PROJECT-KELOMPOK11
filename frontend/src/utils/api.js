const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Wrapper GET request
 */
export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Request gagal: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Wrapper POST request (Diperlukan untuk Generate Deskripsi)
 */
export async function apiPost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Request gagal: ${res.status} ${res.statusText}`);
  }

  return res.json();
}