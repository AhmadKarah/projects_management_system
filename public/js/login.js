const API = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:3000/api'
  : '/api';

async function login() {
  const email    = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('error');

  errorDiv.innerText = '';

  if (!email || !password) {
    errorDiv.innerText = 'All fields are required';
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) { errorDiv.innerText = data.error || 'Login failed'; return; }

    localStorage.setItem('token', data.data);
    window.location.href = 'projects.html';
  } catch (err) {
    console.error(err);
    errorDiv.innerText = 'Server not reachable';
  }
}

document.addEventListener('keydown', e => { if (e.key === 'Enter') login(); });
