import { useState, useEffect } from 'react'
import { Plus } from '@untitled-ui/icons-react'
import type { Todo, CreateTodoInput } from '../types/todo'

interface Props {
  initial?: Todo
  onSubmit: (data: CreateTodoInput) => Promise<void>
  onCancel?: () => void
}

export function TodoForm({ initial, onSubmit, onCancel }: Props) {
  const [title,       setTitle]       = useState(initial?.title       ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')

  useEffect(() => {
    setTitle(initial?.title       ?? '')
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

  const inputBase = [
    'w-full px-[14px] py-[10px] bg-white',
    'border border-[#d4d4d4] rounded-[8px]',
    'shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]',
    'text-[16px] font-normal text-[#171717]',
    'placeholder:text-[#737373]',
    'focus:outline-none focus:border-[#7f56d9] focus:ring-1 focus:ring-[#7f56d9]',
    'transition',
  ].join(' ')

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[10px]">

      {/* Title input */}
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className={`${inputBase} h-[44px]`}
      />

      {/* Description textarea */}
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={2}
        className={`${inputBase} resize-none`}
      />

      {error && (
        <p className="text-[12px] text-red-500 px-[2px]">{error}</p>
      )}

      {/* Button row */}
      <div className="flex items-center justify-end gap-[8px] py-[10px]">
        {isEdit && (
          <button
            type="button"
            onClick={onCancel}
            className="px-[12px] py-[8px] text-[14px] font-semibold text-[#404040] bg-white border border-[#d4d4d4] rounded-[8px] hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={[
            'flex items-center gap-[4px] px-[12px] py-[8px]',
            'bg-[#7f56d9] text-white text-[14px] font-semibold',
            'rounded-[8px] border-2 border-[rgba(255,255,255,0.12)]',
            'shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05),inset_0px_-2px_0px_0px_rgba(0,0,0,0.05),inset_0px_0px_0px_1px_rgba(0,0,0,0.18)]',
            'hover:bg-[#6941c6] disabled:opacity-50 transition',
          ].join(' ')}
        >
          {!isEdit && <Plus className="w-5 h-5 opacity-60" />}
          <span>{loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Task'}</span>
        </button>
      </div>

    </form>
  )
}
