import { Edit01, Trash02 } from '@untitled-ui/icons-react'
import { Checkbox } from './Checkbox'
import type { Todo } from '../types/todo'

interface Props {
  todo: Todo
  onToggle: (todo: Todo) => void
  onDelete: (id: number) => void
  onEdit: (todo: Todo) => void
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  return (
    <div className="flex items-center justify-between min-h-[70px] p-[10px] bg-white">

      {/* Left: checkbox + title/description */}
      <div className="flex items-center gap-[10px] p-[10px] min-w-0">
        <Checkbox checked={todo.completed} onChange={() => onToggle(todo)} />
        <div className="flex flex-col gap-[10px] p-[10px] min-w-0">
          <p
            className={`text-[12px] font-normal leading-normal truncate ${
              todo.completed ? 'line-through text-[#737373]' : 'text-black'
            }`}
          >
            {todo.title}
          </p>
          {todo.description && (
            <p
              className={`text-[12px] font-normal leading-normal truncate ${
                todo.completed ? 'text-[#737373]' : 'text-black'
              }`}
            >
              {todo.description}
            </p>
          )}
        </div>
      </div>

      {/* Right: action icons */}
      <div className="flex items-start gap-[10px] p-[10px] shrink-0">
        <button
          onClick={() => onEdit(todo)}
          aria-label="Edit"
          className="text-[#7f56d9] hover:opacity-70 transition-opacity"
        >
          <Edit01 className="w-6 h-6" />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          aria-label="Delete"
          className="text-[#7f56d9] hover:opacity-70 transition-opacity"
        >
          <Trash02 className="w-6 h-6" />
        </button>
      </div>

    </div>
  )
}
