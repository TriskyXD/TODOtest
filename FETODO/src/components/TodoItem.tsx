import { CheckCircle, Circle, Trash01, Edit02 } from '@untitled-ui/icons-react'
import type { Todo } from '../types/todo'

interface Props {
  todo: Todo
  onToggle:  (todo: Todo) => void
  onDelete:  (id: number) => void
  onEdit:    (todo: Todo) => void
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  return (
    <div className={`flex items-start gap-3 p-4 bg-white rounded-xl border transition-colors ${
      todo.completed ? 'border-gray-100' : 'border-gray-200'
    } shadow-xs hover:shadow-sm`}>

      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo)}
        className={`mt-0.5 shrink-0 transition-colors ${
          todo.completed ? 'text-success-500' : 'text-gray-300 hover:text-brand-500'
        }`}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.completed
          ? <CheckCircle className="w-5 h-5" />
          : <Circle      className="w-5 h-5" />
        }
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {todo.title}
        </p>
        {todo.description && (
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
            {todo.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(todo)}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          aria-label="Edit"
        >
          <Edit02 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1.5 text-gray-400 hover:text-error-500 hover:bg-error-50 rounded-lg transition-colors"
          aria-label="Delete"
        >
          <Trash01 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
