import { Icon } from '@/components/icon/icon'

type Props = {
  suggestions: google.maps.places.AutocompleteSuggestion[]
  selectedIndex: number
  onSelect: (suggestion: google.maps.places.AutocompleteSuggestion) => void
}

export function DropdownList({ suggestions, selectedIndex, onSelect }: Props) {
  return (
    <div>
      <ul>
        {suggestions.map((suggestion, index) => {
          const isSelected = index === selectedIndex
          return (
            <li
              key={index}
              role="option"
              tabIndex={-1}
              aria-selected={isSelected}
              onClick={() => onSelect(suggestion)}
              className="flex items-center gap-2 cursor-pointer p-2 aria-selected:bg-gray-100 hover:bg-gray-100"
            >
              <Icon name="location" size={16} color="gray-400" />
              <span className="flex items-center gap-2">
                <span>{suggestion.placePrediction?.mainText?.text}</span>
                <span className="text-gray-400">
                  {suggestion.placePrediction?.secondaryText?.text}
                </span>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
