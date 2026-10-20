/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test';
import { resolveTheme } from './theme';

describe('resolveTheme', () => {
  test('defaults to dark when nothing is stored', () => {
    expect(resolveTheme(null)).toBe('dark');
  });

  test('treats an unknown value as dark rather than guessing', () => {
    expect(resolveTheme('sepia')).toBe('dark');
  });

  test('honours an explicit light choice', () => {
    expect(resolveTheme('light')).toBe('light');
  });

  test('honours an explicit dark choice', () => {
    expect(resolveTheme('dark')).toBe('dark');
  });
});
