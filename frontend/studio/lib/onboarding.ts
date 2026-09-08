// Minimal onboarding event log — localStorage now, backend seam later.
// Buffer is capped at 100 events; flushToBackend() is the future handoff point.

import { DISMISS_KEY, SEEN_KEY } from '@/components/onboarding-checklist/OnboardingChecklist.constants'

const KEY = 'doba_onboarding_events'

export type OnboardingEventName =
  | 'checklist_seen'
  | 'wallet_connected'
  | 'checklist_dismissed'
  | 'first_collect_detected'

export interface OnboardingEvent {
  name: OnboardingEventName
  at: number
}

export function getOnboardingEvents(): OnboardingEvent[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function logOnboardingEvent(name: OnboardingEventName) {
  if (typeof window === 'undefined') return
  try {
    const events = getOnboardingEvents()
    events.push({ name, at: Date.now() })
    localStorage.setItem(KEY, JSON.stringify(events.slice(-100)))
  } catch {
    // Non-critical — never break UX over analytics
  }
}

// TODO: flushToBackend() — POST buffered events to a /events endpoint when one exists.

// Instant collect signal: fired by mint-success paths so the checklist
// completes step 3 without waiting for a remount/refetch.
export const COLLECT_KEY = 'doba_has_collected'
export const COLLECT_EVENT = 'doba-collected'

export function markCollected() {
  if (typeof window === 'undefined') return
  try {
    if (localStorage.getItem(COLLECT_KEY) !== 'true') {
      localStorage.setItem(COLLECT_KEY, 'true')
      logOnboardingEvent('first_collect_detected')
    }
    window.dispatchEvent(new CustomEvent(COLLECT_EVENT))
  } catch {
    // Non-critical
  }
}

export function resetOnboarding() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(DISMISS_KEY)
    localStorage.removeItem(COLLECT_KEY)
    localStorage.removeItem(SEEN_KEY)
    window.location.reload()
  } catch {
    // Non-critical
  }
}
