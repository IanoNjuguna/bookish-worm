/// <reference types="bun-types" />
import { describe, expect, test } from 'bun:test';
import { conversion, feeRate, perFan, shortenAddress } from './summary';

describe('feeRate', () => {
  test('is take over spend', () => {
    expect(feeRate(1_000_000, 10_000_000)).toBeCloseTo(0.1, 6);
  });

  test('is null when nothing was spent', () => {
    expect(feeRate(0, 0)).toBeNull();
  });

  test('is null on bad input rather than NaN', () => {
    expect(feeRate(Number.NaN, 10)).toBeNull();
  });
});

describe('perFan', () => {
  test('divides and rounds to lovelace', () => {
    expect(perFan(10_000_000, 3)).toBe(3_333_333);
  });

  test('is null with no fans, not Infinity', () => {
    expect(perFan(10_000_000, 0)).toBeNull();
  });
});

describe('conversion', () => {
  test('shows a ratio under one', () => {
    expect(conversion(3, 10)).toBeCloseTo(0.3, 6);
  });

  test('hides a ratio above one instead of rendering 200%', () => {
    expect(conversion(4, 2)).toBeNull();
  });

  test('is null with no listeners', () => {
    expect(conversion(2, 0)).toBeNull();
  });
});

describe('shortenAddress', () => {
  test('truncates a long address', () => {
    expect(shortenAddress('addr1q903wdqxjnxxf3fhesz')).toBe('addr1q…hesz');
  });

  test('leaves a short one alone', () => {
    expect(shortenAddress('0xabc')).toBe('0xabc');
  });
});
