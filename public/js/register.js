const API = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:3000/api'
  : '/api';

async function register() {
  const usernameVal = document.getElementById('username').value;
  const emailVal    = document.getElementById('email').value;
  const passwordVal = document.getElementById('password').value;
  const errorDiv    = document.getElementById('error');

  errorDiv.innerText = '';

  if (!usernameVal || !emailVal || !passwordVal) {
    errorDiv.innerText = 'All fields are required';
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameVal, email: emailVal, password: passwordVal }),
    });

    const data = await res.json();
    if (!res.ok) { errorDiv.innerText = data.error || 'Register failed'; return; }
    window.location.href = 'login.html';
  } catch (err) {
    console.error(err);
    errorDiv.innerText = 'Server not reachable';
  }
}

document.addEventListener('keydown', e => { if (e.key === 'Enter') register(); });
