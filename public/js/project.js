const API = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api';
const token = localStorage.getItem('token');
const params = new URLSearchParams(window.location.search);
const projectId = params.get('id');

let editingTaskId = null;

if (!token) window.location.href = 'login.html';
if (!projectId) window.location.href = 'projects.html';

const tasksDiv = document.getElementById('tasks');
const emptyDiv = document.getElementById('empty');

async function loadTasks() {
  const res = await fetch(`${API}/projects/${projectId}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) return logout();

  const data = await res.json();

  tasksDiv.innerHTML = '';

  if (!data.data || data.data.length === 0) {
    emptyDiv.innerText = 'No tasks yet.';
    return;
  }

  emptyDiv.innerText = '';

  data.data.forEach((t) => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <h3>${t.title}</h3>
      <div>
        <span class="badge ${t.status}">${t.status}</span>
        <span class="badge ${t.priority}">${t.priority}</span>
      </div>
      <div class="actions">
        <button class="edit" onclick="editTask(${t.task_id}, '${t.title}', '${t.status}', '${t.priority}')">Edit</button>
        <button class="danger" onclick="deleteTask(${t.task_id})">Delete</button>
      </div>
    `;

    tasksDiv.appendChild(card);
  });
}

function openModal() {
  editingTaskId = null;
  document.getElementById('modalTitle').innerText = 'Create Task';
  document.getElementById('saveBtn').innerText = 'Create';
  document.getElementById('taskTitle').value = '';
  document.getElementById('modalOverlay').style.display = 'flex';
}

function editTask(id, title, status, priority) {
  editingTaskId = id;
  document.getElementById('modalTitle').innerText = 'Edit Task';
  document.getElementById('saveBtn').innerText = 'Update';
  document.getElementById('taskTitle').value = title;
  document.getElementById('taskStatus').value = status;
  document.getElementById('taskPriority').value = priority;
  document.getElementById('modalOverlay').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
}

async function saveTask() {
  const title = document.getElementById('taskTitle').value;
  const status = document.getElementById('taskStatus').value;
  const priority = document.getElementById('taskPriority').value;

  if (!title) return;

  if (editingTaskId) {
    await fetch(`${API}/projects/${projectId}/tasks/${editingTaskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, status, priority }),
    });
  } else {
    await fetch(`${API}/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, status, priority }),
    });
  }

  closeModal();
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${API}/projects/${projectId}/tasks/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  loadTasks();
}

function back() {
  window.location.href = 'projects.html';
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

loadTasks();
