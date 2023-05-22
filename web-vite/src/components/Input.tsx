import {FieldPath, FieldValues, useFormContext} from 'react-hook-form'

export type HookFormTextInputProps<Values extends FieldValues = FieldValues> = {
  label: string
  name: FieldPath<Values>
  placeholder?: string
  type?: string
  required?: boolean
}

export const Input = <Values extends FieldValues = FieldValues>({
  label,
  name,
  placeholder,
  type = 'text',
  required = true,
}: HookFormTextInputProps<Values>) => {
  const {
    register,
    formState: {errors},
  } = useFormContext<Values>()

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          type={type}
          id={name}
          className={
            type !== 'checkbox'
              ? 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              : undefined
          }
          placeholder={placeholder}
          {...register(name, {required})}
        />
      </div>
      {errors[name] && (
        <p className="mt-2 text-sm text-red-600">This field is required</p>
      )}
    </div>
  )
}
