'use client'

import { useCallback, useRef, useState } from 'react'
import type { UseSliderGestureOptions, UseSliderGestureReturn } from './useSliderGesture.types'

/**
 * One pointer and keyboard gesture for every slider in the player.
 *
 * Rules this follows (see .agents/skills/apple-design):
 * - Answer on pointer down, and keep answering 1:1 for the whole gesture.
 * - Respect where the pointer grabbed. Pressing the thumb does not teleport the
 *   value; pressing the empty track does seek to that point, which is what a bar
 *   made of track looks like it should do.
 * - Capture the pointer, so the drag survives leaving the element and a cancelled
 *   gesture ends cleanly instead of latching.
 * - No inertia after release. A playhead has nowhere to coast to, and momentum on
 *   a seek control fights the audio position it is reporting.
 *
 * Geometry stays tied to the rendered fill, which is left-anchored. In an RTL
 * locale the fill itself still grows from the left, so flipping only the pointer
 * mapping would make the thumb move opposite to the bar. Fix the fill first.
 */
const THUMB_HIT_PX = 10
const DEFAULT_STEP = 0.02

export function useSliderGesture({
  value,
  onChange,
  step = DEFAULT_STEP,
  disabled = false,
}: UseSliderGestureOptions): UseSliderGestureReturn {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragValue, setDragValue] = useState<number | null>(null)
  // 'relative' when the gesture started on the thumb, 'absolute' when it started
  // on the track and therefore already jumped.
  const gesture = useRef<{ mode: 'relative' | 'absolute'; grabValue: number; grabX: number } | null>(null)

  const clamp = (n: number) => Math.min(1, Math.max(0, n))

  const ratioAt = useCallback((clientX: number): number => {
    const el = ref.current
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    if (rect.width === 0) return 0
    return clamp((clientX - rect.left) / rect.width)
  }, [])

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return
    const el = event.currentTarget
    el.setPointerCapture(event.pointerId)

    const rect = el.getBoundingClientRect()
    const ratio = ratioAt(event.clientX)
    const onThumb = rect.width > 0 && Math.abs(ratio - value) * rect.width <= THUMB_HIT_PX

    if (onThumb) {
      gesture.current = { mode: 'relative', grabValue: value, grabX: event.clientX }
      setDragValue(value)
    } else {
      gesture.current = { mode: 'absolute', grabValue: ratio, grabX: event.clientX }
      setDragValue(ratio)
      onChange(ratio)
    }

    setIsDragging(true)
    event.preventDefault()
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const active = gesture.current
    if (!active || !ref.current) return
    const width = ref.current.getBoundingClientRect().width
    if (width === 0) return

    const next =
      active.mode === 'relative'
        ? clamp(active.grabValue + (event.clientX - active.grabX) / width)
        : ratioAt(event.clientX)

    setDragValue(next)
    onChange(next)
  }

  const endGesture = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    gesture.current = null
    setDragValue(null)
    setIsDragging(false)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    const coarse = step * 5
    let next: number | null = null
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = value + step
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        next = value - step
        break
      case 'PageUp':
        next = value + coarse
        break
      case 'PageDown':
        next = value - coarse
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = 1
        break
    }
    if (next === null) return
    event.preventDefault()
    onChange(clamp(next))
  }

  const displayValue = dragValue ?? value

  return {
    ref,
    displayValue,
    isDragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endGesture,
      onPointerCancel: endGesture,
      onLostPointerCapture: endGesture,
      onKeyDown,
    },
    a11y: {
      role: 'slider',
      tabIndex: disabled ? -1 : 0,
      'aria-valuemin': 0,
      'aria-valuemax': 100,
      'aria-valuenow': Math.round(disabled ? 0 : value * 100),
      'aria-disabled': disabled || undefined,
    },
  }
}
