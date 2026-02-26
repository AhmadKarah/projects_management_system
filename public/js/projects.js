const API = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api';
const token = localStorage.getItem('token');

if (!token) window.location.href = 'login.html';

const projectsDiv = document.getElementById('projects');
const emptyDiv = document.getElementById('empty');

let editingProjectId = null;

async function loadProjects() {
  const res = await fetch(`${API}/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) return logout();

  const data = await res.json();

  projectsDiv.innerHTML = '';

  if (!data.data || data.data.length === 0) {
    emptyDiv.innerText = 'No projects yet.';
    return;
  }

  emptyDiv.innerText = '';

  data.data.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.description || 'No description'}</p>
      <div class="actions">
        <button class="primary" onclick="openProject(${p.project_id})">Open</button>
        <button class="edit" onclick="editProject(${p.project_id}, '${p.title}', \`${
      p.description || ''
    }\`)">Edit</button>
        <button class="danger" onclick="deleteProject(${p.project_id})">Delete</button>
      </div>
    `;

    projectsDiv.appendChild(card);
  });
}

function openModal() {
  editingProjectId = null;
  document.getElementById('modalTitle').innerText = 'Create Project';
  document.getElementById('saveBtn').innerText = 'Create';
  document.getElementById('projectTitle').value = '';
  document.getElementById('projectDesc').value = '';
  document.getElementById('modalOverlay').style.display = 'flex';
}

function editProject(id, title, description) {
  editingProjectId = id;
  document.getElementById('modalTitle').innerText = 'Edit Project';
  document.getElementById('saveBtn').innerText = 'Update';
  document.getElementById('projectTitle').value = title;
  document.getElementById('projectDesc').value = description;
  document.getElementById('modalOverlay').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
}

async function saveProject() {
  const title = document.getElementById('projectTitle').value;
  const description = document.getElementById('projectDesc').value;

  if (!title) return;

  if (editingProjectId) {
    await fetch(`${API}/projects/${editingProjectId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });
  } else {
    await fetch(`${API}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });
  }

  closeModal();
  loadProjects();
}

async function deleteProject(id) {
  await fetch(`${API}/projects/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  loadProjects();
}

function openProject(id) {
  window.location.href = `project.html?id=${id}`;
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

loadProjects();
