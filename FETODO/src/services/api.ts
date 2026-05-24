import type { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo'

// In dev, Vite proxies /todos → http://localhost:8080/todos
// In production, set VITE_API_URL to your backend URL
const BASE = import.meta.env.VITE_API_URL ?? ''

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  // 204 No Content (DELETE) has no body
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  getAll:   ()                            => request<Todo[]>('/todos'),
  getOne:   (id: number)                  => request<Todo>(`/todos/${id}`),
  create:   (body: CreateTodoInput)       => request<Todo>('/todos', { method: 'POST', body: JSON.stringify(body) }),
  update:   (id: number, body: UpdateTodoInput) => request<Todo>(`/todos/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  complete: (id: number, completed: boolean)    => request<Todo>(`/todos/${id}/complete`, { method: 'PATCH', body: JSON.stringify({ completed }) }),
  delete:   (id: number)                  => request<void>(`/todos/${id}`, { method: 'DELETE' }),
}
