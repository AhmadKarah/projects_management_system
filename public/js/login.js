const API = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api';

async function login() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorDiv = document.getElementById('error');

  const email = emailInput.value;
  const password = passwordInput.value;

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

    if (!res.ok) {
      errorDiv.innerText = data.error || 'Login failed';
      return;
    }

    localStorage.setItem('token', data.data);
    window.location.href = 'projects.html';
  } catch (err) {
    errorDiv.innerText = 'Server not reachable';
  }
}
