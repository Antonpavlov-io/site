import { describe, expect, it } from 'vitest';
import { loadState, startSession } from '../src/state';

describe('anonymous portal state', () => {
  it('falls back to a safe state for malformed cookies', () => {
    expect(loadState('portal_state=not-json').authenticated).toBe(false);
  });

  it('does not start a session for an empty nickname', () => {
    expect(startSession('   ').authenticated).toBe(false);
  });

  it('limits a nickname to 32 characters', () => {
    const longNickname = 'Очень длинное имя пользователя больше тридцати двух символов';

    expect(startSession(longNickname).nickname.length).toBeLessThanOrEqual(32);
  });
});
