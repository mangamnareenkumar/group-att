const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5050/api';

export async function createGroup(name, rolls) {
  const resp = await fetch(`${API_BASE}/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, rolls })
  });
  return resp.json();
}

export async function fetchGroups() {
  const resp = await fetch(`${API_BASE}/groups`);
  return resp.json();
}

export async function fetchGroupAttendance(name) {
  const resp = await fetch(`${API_BASE}/groups/${encodeURIComponent(name)}/attendance`);
  return resp.json();
}
