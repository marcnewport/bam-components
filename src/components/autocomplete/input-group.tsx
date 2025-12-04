import { Icon } from '@/components/icon/icon'
import { forwardRef } from 'preact/compat'

type Props = {
  value: string
  onInput: (event: Event) => void
  onClear: (event: Event) => void
}

export const InputGroup = forwardRef(
  ({ onInput, value, onClear }: Props, ref: preact.Ref<HTMLInputElement>) => {
    return (
      <div className="flex items-center border border-gray-300">
        <label htmlFor="autocomplete" className="p-2 text-gray-300">
          <Icon name="search" />
          <span className="sr-only">Search</span>
        </label>
        <input
          type="text"
          placeholder="Search suburb or postcode..."
          name="autocomplete"
          id="autocomplete"
          onInput={onInput}
          value={value}
          autoComplete="off"
          spellcheck={false}
          className="flex-1 focus:outline-none p-2 placeholder:text-gray-400"
          ref={ref}
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="p-2 text-gray-300 hover:text-gray-600"
          >
            <Icon name="x" />
            <span className="sr-only">Clear</span>
          </button>
        )}
      </div>
    )
  }
)
