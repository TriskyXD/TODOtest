interface CheckboxProps {
  checked: boolean
  onChange: () => void
}

export function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-label={checked ? 'Mark incomplete' : 'Mark complete'}
      className={[
        'shrink-0 w-4 h-4 rounded-[4px] border border-[#7f56d9]',
        'flex items-center justify-center overflow-hidden transition-colors',
        checked ? 'bg-white' : 'bg-[#f9f5ff] hover:bg-[#f4ebff]',
      ].join(' ')}
    >
      {checked && (
        <svg viewBox="0 0 10 8" fill="none" aria-hidden="true" className="w-[10px] h-[8px]">
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="#7f56d9"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )
}
