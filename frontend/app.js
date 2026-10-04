const API_URL = '/api/users';

const form = document.getElementById('user-form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const feedback = document.getElementById('form-feedback');
const usersList = document.getElementById('users-list');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const emptyState = document.getElementById('empty-state');
const refreshBtn = document.getElementById('refresh-btn');

function showFeedback(message, isError = false) {
  feedback.textContent = message;
  feedback.className = `feedback ${isError ? 'error' : 'success'}`;
  setTimeout(() => {
    feedback.textContent = '';
    feedback.className = 'feedback';
  }, 4000);
}

async function fetchUsers() {
  loading.style.display = 'block';
  errorDiv.style.display = 'none';
  emptyState.style.display = 'none';
  usersList.innerHTML = '';

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Server returned ${res.status}: ${res.statusText}`);
    const users = await res.json();
    loading.style.display = 'none';

    if (!Array.isArray(users) || users.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
    renderUsers(users);
  } catch (err) {
    loading.style.display = 'none';
    errorDiv.style.display = 'block';
    errorDiv.textContent = `Failed to fetch users: ${err.message}`;
  }
}

function renderUsers(users) {
  usersList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.className = 'user-item';

    const info = document.createElement('div');
    info.className = 'user-info';

    const name = document.createElement('span');
    name.className = 'user-name';
    name.textContent = user.username;

    const email = document.createElement('span');
    email.className = 'user-email';
    email.textContent = user.email;

    info.appendChild(name);
    info.appendChild(email);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteUser(user.id));

    li.appendChild(info);
    li.appendChild(deleteBtn);
    usersList.appendChild(li);
  });
}

async function createUser(event) {
  event.preventDefault();
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();

  if (!username || !email) {
    showFeedback('Please fill out all fields.', true);
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create user (${res.status})`);
    }

    usernameInput.value = '';
    emailInput.value = '';
    showFeedback('User created successfully!');
    fetchUsers();
  } catch (err) {
    showFeedback(err.message, true);
  }
}

async function deleteUser(id) {
  if (!confirm('Are you sure you want to delete this user?')) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to delete user (${res.status})`);
    fetchUsers();
  } catch (err) {
    alert(err.message);
  }
}

form.addEventListener('submit', createUser);
refreshBtn.addEventListener('click', fetchUsers);
document.addEventListener('DOMContentLoaded', fetchUsers);
