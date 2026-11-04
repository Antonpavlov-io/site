export interface PortalState {
  authenticated: boolean;
  nickname: string;
  completedCourseIds: string[];
  testScore: number | null;
  surveyChoice: string | null;
}
