import type { PortalState } from './types';

export const completeCourse = (state: PortalState, courseId: string): PortalState => ({
  ...state,
  completedCourseIds: state.completedCourseIds.includes(courseId)
    ? state.completedCourseIds
    : [...state.completedCourseIds, courseId],
});

export const recordTestScore = (state: PortalState, score: number): PortalState => ({
  ...state,
  testScore: Math.max(state.testScore ?? 0, Math.min(100, Math.max(0, Math.round(score)))),
});

export const getProgressPercent = (state: PortalState, totalCourses: number): number => {
  const coursePart = totalCourses === 0 ? 0 : (state.completedCourseIds.length / totalCourses) * 80;
  const testPart = state.testScore === null ? 0 : 20;

  return Math.round(Math.min(100, coursePart + testPart));
};
