export interface ProjectFrontmatter {
  title: string;
  date: string;
  status: 'Active' | 'Completed' | 'Archived';
  role: string;
  stack: string[];
  impact: string;
  categories: string[];
  description: string;
}
