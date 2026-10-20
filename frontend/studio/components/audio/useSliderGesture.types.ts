import type React from 'react'

export interface UseSliderGestureOptions {
  /** Current position, 0..1. The display value is this unless a drag is in flight. */
  value: number
  /** Called on press, during the drag, and from the keyboard. */
  onChange: (value: number) => void
  /** Keyboard increment. Fine adjustment, not a visual step. */
  step?: number
  /** True when there is nothing to control (no duration, muted track). */
  disabled?: boolean
}

export interface UseSliderGestureReturn {
  ref: React.RefObject<HTMLDivElement | null>
  /** Position to render: the live drag value while dragging, else `value`. */
  displayValue: number
  isDragging: boolean
  handlers: {
    onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void
    onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void
    onPointerUp: (event: React.PointerEvent<HTMLDivElement>) => void
    onPointerCancel: (event: React.PointerEvent<HTMLDivElement>) => void
    onLostPointerCapture: (event: React.PointerEvent<HTMLDivElement>) => void
    onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void
  }
  /** Spread onto the track element for keyboard focus and screen readers. */
  a11y: {
    role: 'slider'
    tabIndex: 0 | -1
    'aria-valuemin': number
    'aria-valuemax': number
    'aria-valuenow': number
    'aria-valuetext'?: string
    'aria-disabled'?: boolean
  }
}
