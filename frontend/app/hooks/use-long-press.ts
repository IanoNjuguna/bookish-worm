'use client'

import React from 'react'

const LONG_PRESS_MS = 500

export function useLongPress() {
  const [isLongPressed, setIsLongPressed] = React.useState(false)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)
  const hasLongPressedRef = React.useRef(false)

  const clearTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handleTouchStart = React.useCallback(() => {
    hasLongPressedRef.current = false
    timerRef.current = setTimeout(() => {
      setIsLongPressed(true)
      hasLongPressedRef.current = true
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50)
      }
    }, LONG_PRESS_MS)
  }, [])

  const handleTouchEnd = React.useCallback((e: React.TouchEvent) => {
    clearTimer()
    if (hasLongPressedRef.current) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsLongPressed(false)
  }, [clearTimer])

  const handleTouchCancel = React.useCallback(() => {
    clearTimer()
    setIsLongPressed(false)
  }, [clearTimer])

  const handleTouchMove = React.useCallback(() => {
    clearTimer()
  }, [clearTimer])

  React.useEffect(() => {
    return () => {
      clearTimer()
    }
  }, [clearTimer])

  return {
    isLongPressed,
    hasLongPressedRef,
    bind: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchCancel,
      onTouchMove: handleTouchMove,
    },
  }
}
