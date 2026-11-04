import { describe, expect, it } from 'vitest';
import { resolveRoute } from '../src/router';

describe('portal routes', () => {
  it('redirects an anonymous visitor from protected pages to the entry page', () => {
    expect(resolveRoute('#/courses', false)).toBe('entry');
  });

  it('opens the dashboard for an authenticated visitor', () => {
    expect(resolveRoute('#/dashboard', true)).toBe('dashboard');
  });

  it('uses the dashboard for an unknown authenticated route', () => {
    expect(resolveRoute('#/unknown', true)).toBe('dashboard');
  });
});
