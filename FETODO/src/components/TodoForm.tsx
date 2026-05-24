import { useState, useEffect } from 'react'
import type { Todo, CreateTodoInput } from '../types/todo'

interface Props {
  initial?: Todo          // when set → edit mode
  onSubmit: (data: CreateTodoInput) => Promise<void>
  onCancel?: () => void
}

export function TodoForm({ initial, onSubmit, onCancel }: Props) {
  const [title,       setTitle]       = useState(initial?.title       ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')

  // keep form in sync when switching between edit targets
  useEffect(() => {
    setTitle(initial?.title ?? '')
    setDescription(initial?.description ?? '')
    setError('')
  }, [initial])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required'); return }
    setLoading(true)
    setError('')
    try {
      await onSubmit({ title: title.trim(), description: description.trim() })
      if (!initial) { setTitle(''); setDescription('') }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const isEdit = !!initial

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-3">
      <h2 className="text-sm font-semibold text-gray-700">
        {isEdit ? 'Edit task' : 'New task'}
      </h2>

      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={2}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition resize-none"
      />

      {error && <p className="text-sm text-error-500">{error}</p>}

      <div className="flex gap-2 justify-end">
        {isEdit && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-50 transition"
        >
          {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Add task'}
        </button>
      </div>
    </form>
  )
}
