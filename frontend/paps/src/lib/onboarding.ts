/**
 * Onboarding is shown once per browser, and never as a gate: a trader can dismiss it and
 * still swipe. The flag lives beside the ledger rather than in the profile, because it is
 * a property of this device's first visit, not of the trader's account.
 */
const KEY = 'paps.onboarded.v1';

export const hasSeenOnboarding = (): boolean => {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return true; // a blocked storage quota should not wall a trader behind a sheet
  }
};

export const markOnboarded = (): void => {
  try {
    localStorage.setItem(KEY, '1');
  } catch {
    /* nothing to do: the flag is a convenience, not state */
  }
};
