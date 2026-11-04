import { describe, expect, it } from 'vitest';
import { courses, weeklyBriefs } from '../src/content';

describe('portal learning content', () => {
  it('offers a varied catalog of at least eight learning modules', () => {
    expect(courses).toHaveLength(8);
    expect(new Set(courses.map((course) => course.category))).toEqual(new Set(['Сервис', 'Команда', 'Безопасность']));
  });

  it('includes a compact weekly briefing for the dashboard', () => {
    expect(weeklyBriefs).toHaveLength(3);
  });
});
