import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import { InputGroup } from '@/components/autocomplete/input-group'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { APIProvider } from '@vis.gl/react-google-maps'
import { useAutocompleteSuggestions } from '@/hooks/use-autocomplete-suggestions'
import register from 'preact-custom-element'
import { Icon } from '../icon/icon'
import { useLocationBias } from '@/hooks/use-location-bias.ts'
import { DropdownList } from './dropdown-list'
import { PlaceEvent } from './events'
import { debounce } from '@/utils/debounce'

export function Autocomplete() {
  // Wrap the component with the APIProvider to provide the Google Maps API key and libraries.
  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={['places']}
    >
      <AutocompleteComponent />
    </APIProvider>
  )
}

function AutocompleteComponent() {
  const inputRef = useRef<HTMLInputElement>(null)

  const places = useMapsLibrary('places')
  const locationBias = useLocationBias()

  const [inputValue, setInputValue] = useState<string>('')
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [shouldFetch, setShouldFetch] = useState<boolean>(true)
  const [hasFocus, setHasFocus] = useState<boolean>(false)

  const { suggestions, resetSession } = useAutocompleteSuggestions(
    inputValue,
    {
      includedPrimaryTypes: ['locality', 'postal_code'],
      language: 'en', // TODO : read from theme or browser?
      includedRegionCodes: ['au'], // TODO : check location listing country codes
      locationBias,
    },
    shouldFetch
  )

  useEffect(() => {
    setShouldFetch(false)
    const suggestion = suggestions[selectedIndex]
    if (suggestion) {
      setInputValue(suggestion.placePrediction.text.text)
    }
  }, [selectedIndex])

  function handleInput(event: Event) {
    const { value } = event.target as HTMLInputElement
    setShouldFetch(value.length > 1)
    setInputValue(value)
  }

  function handlePlaceSelect(place: google.maps.places.Place) {
    // Dispatch a custom event with the selected place details.
    inputRef.current?.dispatchEvent(new PlaceEvent('place:searched', { place }))
  }

  const handleSuggestionClick = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      // Ensure places library is loaded.
      if (!places || !suggestion.placePrediction) return

      setShouldFetch(false)
      const copiedText = `${suggestion.placePrediction.text?.text}`
      setInputValue(copiedText)

      const place = suggestion.placePrediction.toPlace()
      await place.fetchFields({
        fields: ['location'],
      })

      handlePlaceSelect(place)
      // calling fetchFields invalidates the session-token, so we now have to call
      // resetSession() so a new one gets created for further search
      resetSession()

      // blur the input to close the keyboard on mobile
      requestAnimationFrame(() => {
        inputRef.current?.blur()
      })
    },
    [places]
  )

  function handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
        event.preventDefault()
        handleSuggestionClick(suggestions[selectedIndex])
        break
      case 'ArrowDown':
        event.preventDefault()
        setSelectedIndex((prevIndex) =>
          Math.min(prevIndex + 1, suggestions.length - 1)
        )
        break
      case 'ArrowUp':
        event.preventDefault()
        setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0))
        break
      case 'Home':
        event.preventDefault()
        setSelectedIndex(0)
        break
      case 'End':
        event.preventDefault()
        setSelectedIndex(suggestions.length - 1)
        break
      case 'Escape':
        event.preventDefault()
        // We can't blur the container directly because it isn't focusable,
        // so just blur the input and toggle state accordingly.
        setShouldFetch(false)
        setSelectedIndex(-1)
        setHasFocus(false)
        requestAnimationFrame(() => {
          inputRef.current?.blur()
        })
        break
    }
  }

  function handleFocusIn() {
    // Show suggestions that are already loaded when the input gains focus.
    setHasFocus(true)
    setShouldFetch(inputValue.length > 1)
  }

  function handleFocusOut(event: FocusEvent) {
    // Check if focus is still within the component.
    const currentTarget = event.currentTarget as HTMLElement
    const relatedTarget = event.relatedTarget as HTMLElement
    if (currentTarget.contains(relatedTarget)) return

    setShouldFetch(false)
    setSelectedIndex(-1)
    setHasFocus(false)
  }

  function handleClear() {
    setInputValue('')
    setShouldFetch(false)
    resetSession()
    setSelectedIndex(-1)

    requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
  }

  return (
    <div
      onFocusIn={handleFocusIn}
      onFocusOut={handleFocusOut}
      onKeyDown={handleKeyDown}
      className="focus-within:outline-2 focus-within:outline-black"
    >
      <InputGroup
        onInput={debounce(handleInput)}
        value={inputValue}
        ref={inputRef}
        onClear={handleClear}
      />

      {hasFocus && suggestions.length > 0 && (
        <DropdownList
          suggestions={suggestions}
          selectedIndex={selectedIndex}
          onSelect={handleSuggestionClick}
        />
      )}
    </div>
  )
}

register(Autocomplete, 'autocomplete-root', [], { shadow: false })
