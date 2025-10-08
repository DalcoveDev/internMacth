const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4001/api'

async function request(path: string, opts?: RequestInit) {
  // Get token from localStorage
  const token = localStorage.getItem('token')
  
  // Add authorization header if token exists
  const headers = {
    ...(opts?.headers || {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
  
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers
  })
  
  if (!res.ok) {
    // Try to get error message from response
    let errorMessage = `Request failed ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      // If we can't parse the error response, use the status code
    }
    throw new Error(errorMessage);
  }
  return res.json()
}

export async function listInternships() {
  return request('/internships')
}

export async function getInternship(id: number) {
  return request(`/internships/${id}`)
}

export async function postInternship(data: any) {
  return request('/internships', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
}

export async function approveInternship(id: number) {
  return request(`/internships/${id}/approve`, { method: 'POST' })
}

export async function rejectInternship(id: number, reason = '') {
  return request(`/internships/${id}/reject`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }) })
}

export async function deleteInternship(id: number) {
  return request(`/internships/${id}`, { method: 'DELETE' })
}

export async function createUser(data: any) {
  return request('/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
}

export async function listUsers() {
  return request('/users')
}

export async function listApplications() {
  return request('/applications')
}

export async function getApplication(id: number) {
  return request(`/applications/${id}`)
}

export async function updateApplicationStatus(id: number, status: 'pending'|'approved'|'rejected') {
  return request(`/applications/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
}

export async function signup(data: any) {
  return request('/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
}

export async function login(data: any) {
  return request('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
}

export async function createApplication(data: any) {
  return request('/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
}

export async function updateUser(id: number, data: any) {
  return request(`/users/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
}

export async function toggleUserStatus(id: number, status: 'active' | 'inactive') {
  return request(`/users/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
}