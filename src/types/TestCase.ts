export interface TestCase {
  id: string;
  caseKey: string;
  title: string;
  description?: string;
  mode: string;
  moduleKey?: string;
  moduleName?: string;
  sectionKey?: string;
  sectionName?: string;
  status?: string;
  priority?: string;
  estimate?: number;
  reference?: string;
  precondition?: string;
  createdDate?: string;
  updatedDate?: string;
  assignedTo?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  type?: string; // Type du cas de test (Acceptance, Functional, etc.)
}

export interface TestCaseStats {
  total: number;
  automated: number;
  manual: number;
  byModule: Record<
    string,
    { total: number; automated: number; manual: number }
  >;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
}
