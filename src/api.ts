const API_BASE = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:4000/api'

async function request(path: string, opts?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, opts)
  if (!res.ok) throw new Error(`Request failed ${res.status}`)
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

export async function signup(data: any) {
  return request('/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
}

export async function login(data: any) {
  return request('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
}

export async function createApplication(data: any) {
  return request('/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
}