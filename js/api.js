const API_BASE_URL = 'http://localhost:8080/api';

async function apiFetch(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const stored = sessionStorage.getItem('kawashima_auth');
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message = typeof data === 'string' ? data : (data.message || 'エラーが発生しました');
    throw new Error(message);
  }
  return data;
}
