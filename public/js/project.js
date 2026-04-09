const API = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:3000/api'
  : '/api';

const token     = localStorage.getItem('token');
const params    = new URLSearchParams(window.location.search);
const projectId = params.get('id');

if (!token)     window.location.href = 'login.html';
if (!projectId) window.location.href = 'projects.html';

const tasksDiv = document.getElementById('tasks');
const emptyDiv = document.getElementById('empty');
let editingTaskId = null;

async function loadProjectName() {
  try {
    const res = await fetch(`${API}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const data = await res.json();
    const p = data.data?.find(x => String(x.project_id) === String(projectId));
    if (p) document.getElementById('projectName').innerText = p.title;
  } catch {}
}

async function loadTasks() {
  const res = await fetch(`${API}/projects/${projectId}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) return logout();

  const data = await res.json();
  tasksDiv.innerHTML = '';

  if (!data.data || data.data.length === 0) {
    emptyDiv.innerText = 'No tasks yet. Add your first one!';
    return;
  }

  emptyDiv.innerText = `${data.data.length} task${data.data.length !== 1 ? 's' : ''}`;

  data.data.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = `${i * 60}ms`;

    const statusLabel   = t.status === 'in-progress' ? 'In Progress' : t.status.charAt(0).toUpperCase() + t.status.slice(1);
    const priorityLabel = t.priority.charAt(0).toUpperCase() + t.priority.slice(1);

    card.innerHTML = `
      <h3>${t.title}</h3>
      <div class="badges">
        <span class="badge ${t.status}">${statusLabel}</span>
        <span class="badge ${t.priority}">${priorityLabel}</span>
      </div>
      <div class="actions">
        <button class="actions-edit"   onclick="editTask(${t.task_id}, '${t.title}', '${t.status}', '${t.priority}')">Edit</button>
        <button class="actions-delete" onclick="deleteTask(${t.task_id})">Delete</button>
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
  document.getElementById('taskStatus').value = 'pending';
  document.getElementById('taskPriority').value = 'medium';
  document.getElementById('modalOverlay').style.display = 'flex';
  setTimeout(() => document.getElementById('taskTitle').focus(), 100);
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
  const title    = document.getElementById('taskTitle').value;
  const status   = document.getElementById('taskStatus').value;
  const priority = document.getElementById('taskPriority').value;
  if (!title) return;

  const url    = editingTaskId
    ? `${API}/projects/${projectId}/tasks/${editingTaskId}`
    : `${API}/projects/${projectId}/tasks`;
  const method = editingTaskId ? 'PATCH' : 'POST';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title, status, priority }),
  });

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

function back()   { window.location.href = 'projects.html'; }
function logout() { localStorage.removeItem('token'); window.location.href = 'login.html'; }

document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});

loadProjectName();
loadTasks();
