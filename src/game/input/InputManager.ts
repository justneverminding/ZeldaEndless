import { useEffect, useState, type RefObject } from 'react'

export type RunnerCommands = { moveLeft: () => void; moveRight: () => void; jump: () => void; slide: () => void }

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

export function useRunnerInput(enabled: boolean, commands: RefObject<RunnerCommands | null>, surface: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!enabled) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'a' || event.key === 'A' || event.key === 'ArrowLeft') { event.preventDefault(); commands.current?.moveLeft() }
      if (event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight') { event.preventDefault(); commands.current?.moveRight() }
      if (event.code === 'Space') { event.preventDefault(); commands.current?.jump() }
      if (event.key === 's' || event.key === 'S' || event.key === 'ArrowDown') { event.preventDefault(); commands.current?.slide() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [commands, enabled])

  useEffect(() => {
    const element = surface.current
    if (!enabled || !element) return
    let startX = 0
    let startY = 0
    const onStart = (event: TouchEvent) => { const touch = event.changedTouches[0]; startX = touch.clientX; startY = touch.clientY }
    const onEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0]
      const dx = touch.clientX - startX
      const dy = touch.clientY - startY
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 32) { dx < 0 ? commands.current?.moveLeft() : commands.current?.moveRight() }
      else if (dy < -32) commands.current?.jump()
      else if (dy > 32) commands.current?.slide()
    }
    const stopScroll = (event: TouchEvent) => event.preventDefault()
    element.addEventListener('touchstart', onStart, { passive: true })
    element.addEventListener('touchend', onEnd, { passive: true })
    element.addEventListener('touchmove', stopScroll, { passive: false })
    return () => { element.removeEventListener('touchstart', onStart); element.removeEventListener('touchend', onEnd); element.removeEventListener('touchmove', stopScroll) }
  }, [commands, enabled, surface])
}

export function useInputCapability() {
  const [capability] = useState(getInputCapability)
  return capability
}
