export type Route = 'entry' | 'dashboard' | 'courses' | 'test' | 'survey' | 'profile';

const protectedRoutes: Route[] = ['dashboard', 'courses', 'test', 'survey', 'profile'];

export const resolveRoute = (hash: string, authenticated: boolean): Route => {
  const segment = hash.replace(/^#\/?/, '').split('/')[0];
  const requestedRoute = segment as Route;

  if (!authenticated) {
    return 'entry';
  }

  return protectedRoutes.includes(requestedRoute) ? requestedRoute : 'dashboard';
};
