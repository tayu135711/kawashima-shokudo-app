function requireSession(expectedRole) {
  const raw = sessionStorage.getItem('kawashima_user');
  if (!raw) {
    window.location.href = '../index.html';
    return null;
  }
  const user = JSON.parse(raw);
  if (expectedRole && user.role !== expectedRole) {
    window.location.href = '../index.html';
    return null;
  }
  return user;
}

function bindLogout(buttonId) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  btn.addEventListener('click', () => {
    sessionStorage.removeItem('kawashima_user');
    window.location.href = '../index.html';
  });
}
