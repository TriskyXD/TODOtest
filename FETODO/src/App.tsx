import { useState, useEffect, useCallback } from 'react'
import { api } from './services/api'
import { TodoItem } from './components/TodoItem'
import { TodoForm } from './components/TodoForm'
import type { Todo, CreateTodoInput } from './types/todo'

type Filter = 'all' | 'active' | 'completed'

const FILTER_LABELS: Record<Filter, string> = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
}

export default function App() {
  const [todos,       setTodos]       = useState<Todo[]>([])
  const [editTarget,  setEditTarget]  = useState<Todo | null>(null)
  const [filter,      setFilter]      = useState<Filter>('all')
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')

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

  return (
    <div className="min-h-screen py-[10px] px-[10px]">
      <div className="flex flex-col md:flex-row gap-[10px] max-w-[936px] mx-auto">

        {/* Left panel — heading + form */}
        <div className="md:w-[332px] shrink-0 flex flex-col gap-[10px] pt-6 pb-[29px] px-[10px] bg-white rounded-[20px]">
          <h1 className="text-[36px] font-bold text-[#171717] tracking-[-0.02em] leading-[44px] whitespace-nowrap">
            My Tasks
          </h1>
          <TodoForm
            key={editTarget?.id ?? 'new'}
            initial={editTarget ?? undefined}
            onSubmit={editTarget ? handleUpdate : handleCreate}
            onCancel={() => setEditTarget(null)}
          />
        </div>

        {/* Right panel — filter + task list */}
        <div className="flex-1 flex flex-col gap-[10px] p-[10px] bg-white">

          {/* Filter button group */}
          <div className="flex items-stretch self-start border border-[#d4d4d4] rounded-[8px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] overflow-hidden shrink-0">
            {(['all', 'active', 'completed'] as Filter[]).map((f, i) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={[
                  'px-[16px] py-[10px] text-[14px] font-semibold text-[#404040] transition-colors',
                  i < 2 ? 'border-r border-[#d4d4d4]' : '',
                  filter === f
                    ? 'bg-[rgba(212,212,212,0.26)]'
                    : 'bg-white hover:bg-[rgba(212,212,212,0.1)]',
                ].join(' ')}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>

          {/* Status messages */}
          {loading && (
            <p className="text-center text-[14px] text-[#737373] py-8">Loading…</p>
          )}
          {error && (
            <p className="text-center text-[14px] text-red-500 py-4">{error}</p>
          )}
          {!loading && !error && visible.length === 0 && (
            <p className="text-center text-[14px] text-[#737373] py-8">
              {filter === 'all' ? 'No tasks yet — add one!' : `No ${filter} tasks.`}
            </p>
          )}

          {/* Task list */}
          <div className="flex flex-col">
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
    </div>
  )
}
