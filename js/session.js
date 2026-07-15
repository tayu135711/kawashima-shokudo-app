function requireSession(expectedRole) {
  const raw = sessionStorage.getItem('kawashima_auth');
  if (!raw) {
    window.location.href = '../index.html';
    return null;
  }
  const auth = JSON.parse(raw);
  if (expectedRole && auth.role !== expectedRole) {
    window.location.href = '../index.html';
    return null;
  }
  return auth; // { token, userId, name, role }
}

function bindLogout(buttonId) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  btn.addEventListener('click', () => {
    sessionStorage.removeItem('kawashima_auth');
    window.location.href = '../index.html';
  });
}
