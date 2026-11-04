import { describe, expect, it } from 'vitest';
import { completeCourse, recordTestScore } from '../src/progress';
import { startSession } from '../src/state';

describe('learning progress', () => {
  it('records a quiz result', () => {
    expect(recordTestScore(startSession('Гость'), 40).testScore).toBe(40);
  });

  it('keeps the best quiz result', () => {
    const state = recordTestScore(recordTestScore(startSession('Гость'), 80), 40);

    expect(state.testScore).toBe(80);
  });

  it('marks the selected course as completed once', () => {
    const state = completeCourse(startSession('Гость'), 'service-basics');

    expect(state.completedCourseIds).toContain('service-basics');
    expect(completeCourse(state, 'service-basics').completedCourseIds).toHaveLength(1);
  });
});
