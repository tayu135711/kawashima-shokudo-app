const ROLE_LABELS = {
  customer: { login: '注文する人としてログイン', register: '注文する人として登録', dest: 'screens/store-list.html' },
  store: { login: 'お店としてログイン', register: 'お店として登録', dest: 'screens/store-management.html' },
  courier: { login: '配達員としてログイン', register: '配達員として登録', dest: 'screens/courier-available.html' },
  admin: { login: '管理者としてログイン', register: '管理者として登録', dest: 'screens/admin-dashboard.html' },
};

const state = { role: 'customer', mode: 'login' };

const roleTabs = document.querySelectorAll('.role-tab');
const modeBtns = document.querySelectorAll('.mode-btn');
const nameField = document.querySelector('.name-field');
const submitBtn = document.getElementById('submit-btn');
const switchHint = document.getElementById('switch-hint');
const switchToRegister = document.getElementById('switch-to-register');
const form = document.getElementById('auth-form');
const formError = document.getElementById('form-error');

function render() {
  const labels = ROLE_LABELS[state.role];
  submitBtn.textContent = state.mode === 'login' ? labels.login : labels.register;
  nameField.hidden = state.mode !== 'register';
  document.getElementById('name').required = state.mode === 'register';

  modeBtns.forEach(b => b.classList.toggle('is-active', b.dataset.mode === state.mode));

  if (state.mode === 'login') {
    switchHint.innerHTML = 'アカウントをお持ちでない方は <button type="button" class="link-btn" id="switch-to-register">新規登録</button>';
  } else {
    switchHint.innerHTML = 'すでにアカウントをお持ちの方は <button type="button" class="link-btn" id="switch-to-register">ログイン</button>';
  }
  document.getElementById('switch-to-register').addEventListener('click', () => {
    state.mode = state.mode === 'login' ? 'register' : 'login';
    render();
  });
}

roleTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    roleTabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
    state.role = tab.dataset.role;
    render();
  });
});

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    state.mode = btn.dataset.mode;
    render();
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  formError.hidden = true;

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password || password.length < 8) {
    formError.textContent = 'メールアドレスと8文字以上のパスワードを入力してください。';
    formError.hidden = false;
    return;
  }

  // TODO: バックエンド実装後、ここをfetch('/api/auth/login' or '/api/auth/register')に差し替える
  const mockUser = {
    email,
    role: state.role,
    name: state.mode === 'register' ? document.getElementById('name').value : email.split('@')[0],
  };
  sessionStorage.setItem('kawashima_user', JSON.stringify(mockUser));

  window.location.href = ROLE_LABELS[state.role].dest;
});

render();
