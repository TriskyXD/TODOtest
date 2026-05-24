import { useState, useEffect, useCallback } from 'react'
import { CheckDone01 } from '@untitled-ui/icons-react'
import { api } from './services/api'
import { TodoItem } from './components/TodoItem'
import { TodoForm } from './components/TodoForm'
import type { Todo, CreateTodoInput } from './types/todo'

type Filter = 'all' | 'active' | 'completed'

export default function App() {
  const [todos,      setTodos]      = useState<Todo[]>([])
  const [editTarget, setEditTarget] = useState<Todo | null>(null)
  const [filter,     setFilter]     = useState<Filter>('all')
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')

  const loadTodos = useCallback(async () => {
    try {
      setError('')
      const data = await api.getAll()
      setTodos(data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadTodos() }, [loadTodos])

  async function handleCreate(data: CreateTodoInput) {
    const created = await api.create(data)
    setTodos(prev => [created, ...prev])
  }

  async function handleUpdate(data: CreateTodoInput) {
    if (!editTarget) return
    const updated = await api.update(editTarget.id, data)
    setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
    setEditTarget(null)
  }

  async function handleToggle(todo: Todo) {
    const updated = await api.complete(todo.id, !todo.completed)
    setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  async function handleDelete(id: number) {
    await api.delete(id)
    setTodos(prev => prev.filter(t => t.id !== id))
    if (editTarget?.id === id) setEditTarget(null)
  }

  const visible = todos.filter(t =>
    filter === 'all'       ? true :
    filter === 'active'    ? !t.completed :
    /* completed */           t.completed
  )
  const doneCount   = todos.filter(t => t.completed).length
  const activeCount = todos.length - doneCount

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-2">
          <CheckDone01 className="w-6 h-6 text-brand-600" />
          <h1 className="text-xl font-semibold text-gray-900">My Tasks</h1>
          <span className="ml-auto text-sm text-gray-400">
            {activeCount} remaining
          </span>
        </div>

        {/* Create / Edit form */}
        <TodoForm
          key={editTarget?.id ?? 'new'}
          initial={editTarget ?? undefined}
          onSubmit={editTarget ? handleUpdate : handleCreate}
          onCancel={() => setEditTarget(null)}
        />

        {/* Filter tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {(['all', 'active', 'completed'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
                filter === f
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        {loading && (
          <p className="text-center text-sm text-gray-400 py-8">Loading…</p>
        )}
        {error && (
          <p className="text-center text-sm text-error-500 py-4">{error}</p>
        )}
        {!loading && !error && visible.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">
            {filter === 'all' ? 'No tasks yet — add one above!' : `No ${filter} tasks.`}
          </p>
        )}
        <div className="space-y-2">
          {visible.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={setEditTarget}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
