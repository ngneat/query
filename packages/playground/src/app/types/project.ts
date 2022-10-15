export interface Project {
  id: number;
  name: string;
}

export interface PaginatedProject {
  projects: Project[];
  hasMore: boolean;
}