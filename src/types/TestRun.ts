export interface TestRunContext {
  context: string;
  id: string;
}

export interface TestRun {
  id: string;
  context: string;
  name: string;
  status: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  blockedTests: number;
  retestTests: number; // Tests à retester
  notRunTests: number;
  inProgressTests: number;
  automatedTests: number;
  manualTests: number;
  executionTime: number; // en secondes
  lastExecuted: string;
  createdAt: string;
  updatedAt: string;
}

// Configuration QA Touch hardcodée
export const QA_TOUCH_CONFIG = {
  domain: "raja",
  apiToken: process.env.REACT_APP_QA_TOUCH_API_TOKEN || "",
  projectKey: "bPlV",
};

// Test Run IDs réels avec contextes
export const REAL_TEST_RUN_IDS: TestRunContext[] = [
  { context: "FR", id: "DbnDx" },
  { context: "ES", id: "Z1Pjk" },
  { context: "GB", id: "bkEP8" },
  { context: "HU", id: "w9ngl" },
  { context: "IT", id: "k5xQP" },
  { context: "AT", id: "515zb" },
  { context: "DE", id: "2v564" },
  { context: "NL", id: "a0Bnv" },
  { context: "BE", id: "Qg6L6" },
  { context: "DK", id: "Bj5Dx" },
  { context: "NO", id: "8r5l2" },
  { context: "SE", id: "Db8ZL" },
  { context: "PT", id: "ekejg" },
  { context: "CZ", id: "bk8GV" },
  { context: "PL", id: "Z1gR6" },
  { context: "CH", id: "Rq7yD" },
  { context: "SK", id: "dBDNw" },
  { context: "JPG", id: "xDgE5" },
  { context: "BERNARDFR", id: "BjzRR" },
  { context: "BERNARDBE", id: "8rxDr" },
  { context: "KALAMAZOO", id: "bkmg9" },
  { context: "MONDOFFICE", id: "vwQdn" },
];
