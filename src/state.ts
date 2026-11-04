import type { PortalState } from './types';

const COOKIE_NAME = 'railway_portal_state';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const MAX_NICKNAME_LENGTH = 32;

export const createEmptyState = (): PortalState => ({
  authenticated: false,
  nickname: '',
  completedCourseIds: [],
  testScore: null,
  surveyChoice: null,
});

const normalizeNickname = (nickname: string): string => nickname.trim().replace(/\s+/g, ' ').slice(0, MAX_NICKNAME_LENGTH);

const isValidState = (value: unknown): value is PortalState => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const state = value as Partial<PortalState>;

  return (
    typeof state.authenticated === 'boolean' &&
    typeof state.nickname === 'string' &&
    Array.isArray(state.completedCourseIds) &&
    state.completedCourseIds.every((courseId) => typeof courseId === 'string') &&
    (typeof state.testScore === 'number' || state.testScore === null) &&
    (typeof state.surveyChoice === 'string' || state.surveyChoice === null)
  );
};

const readCookieValue = (cookie: string): string | null => {
  const entry = cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`));

  return entry ? entry.slice(COOKIE_NAME.length + 1) : null;
};

export const loadState = (cookie: string): PortalState => {
  const storedValue = readCookieValue(cookie);

  if (!storedValue) {
    return createEmptyState();
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(storedValue));

    if (!isValidState(parsed)) {
      return createEmptyState();
    }

    return {
      ...parsed,
      nickname: normalizeNickname(parsed.nickname),
      completedCourseIds: [...new Set(parsed.completedCourseIds)],
      testScore: parsed.testScore === null ? null : Math.min(100, Math.max(0, Math.round(parsed.testScore))),
    };
  } catch {
    return createEmptyState();
  }
};

export const saveState = (state: PortalState): string => {
  const value = encodeURIComponent(JSON.stringify(state));

  return `${COOKIE_NAME}=${value}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
};

export const startSession = (nickname: string): PortalState => {
  const normalizedNickname = normalizeNickname(nickname);

  if (!normalizedNickname) {
    return createEmptyState();
  }

  return {
    ...createEmptyState(),
    authenticated: true,
    nickname: normalizedNickname,
  };
};

export const clearSession = (): PortalState => createEmptyState();

export const getCookieName = (): string => COOKIE_NAME;
