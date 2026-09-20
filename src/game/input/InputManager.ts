import { useEffect, useState } from 'react'

export const getInputCapability = () => ({
  hasTouch: typeof window !== 'undefined' && (navigator.maxTouchPoints > 0 || 'ontouchstart' in window),
  hasKeyboard: typeof window !== 'undefined',
})

export function usePauseInput(enabled: boolean, onPause: () => void) {
  useEffect(() => {
    if (!enabled) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onPause()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled, onPause])
}

export function useInputCapability() {
  const [capability] = useState(getInputCapability)
  return capability
}
