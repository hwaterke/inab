type Props = {
  checked: boolean
  onChange: (checked: boolean) => void
}

export const Checkbox = ({checked, onChange}: Props) => {
  return (
    <div>
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600"
        checked={checked}
        onChange={() => onChange(!checked)}
      />
    </div>
  )
}
