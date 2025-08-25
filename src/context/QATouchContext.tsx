import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { fetchAllTestRuns } from "../services/QATouchRealAPI";

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
  retestTests: number;
  notRunTests: number;
  inProgressTests: number;
  automatedTests: number;
  manualTests: number;
  executionTime: number;
  lastExecuted: string;
  createdAt: string;
  updatedAt: string;
}

interface QATouchContextType {
  testRuns: TestRun[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const QATouchContext = createContext<QATouchContextType | undefined>(undefined);

export const useQATouch = () => {
  const context = useContext(QATouchContext);
  if (context === undefined) {
    throw new Error("useQATouch must be used within a QATouchProvider");
  }
  return context;
};

interface QATouchProviderProps {
  children: ReactNode;
}

export const QATouchProvider: React.FC<QATouchProviderProps> = ({
  children,
}) => {
  const [testRuns, setTestRuns] = useState<TestRun[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    setLoading(true);
    setError(null);

    try {
      const runs = await fetchAllTestRuns();
      setTestRuns(runs);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération des données"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Charger les données au démarrage
    refreshData();
  }, []);

  const value: QATouchContextType = {
    testRuns,
    loading,
    error,
    refreshData,
  };

  return (
    <QATouchContext.Provider value={value}>{children}</QATouchContext.Provider>
  );
};
