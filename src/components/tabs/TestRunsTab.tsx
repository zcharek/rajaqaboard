// @ts-nocheck
import React from "react";
import { TestRun, TestCase } from "../../context/QATouchContext";
import TestRunsTable from "../TestRunsTable";
import {
  AlertCircle,
  RefreshCw,
  Bot,
  FileText,
  Target,
  Activity,
} from "lucide-react";

interface TestRunsTabProps {
  testRuns: TestRun[];
  testCases: TestCase[];
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

const TestRunsTab: React.FC<TestRunsTabProps> = ({
  testRuns,
  testCases,
  loading,
  error,
  refreshData,
}) => {
  // Calculs des métriques
  const totalCases = testCases.length;
  const automatedCases = testCases.filter(
    (tc) => tc.mode === "automation"
  ).length;
  const manualCases = testCases.filter((tc) => tc.mode === "manual").length;
  const totalTestRuns = testRuns.length;

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={refreshData}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Métriques rapides */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-pulse"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Cas */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Cas
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalCases.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Test Runs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Test Runs
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalTestRuns}
                </p>
              </div>
            </div>
          </div>

          {/* Automatisés */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Bot className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Automatisés
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {automatedCases.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Manuels */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Manuels
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {manualCases.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Runs Table */}
      {testRuns.length === 0 && !loading ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Aucun Test Run
            </h2>
            <p className="text-gray-600">
              Aucun test run n'a été trouvé pour ce projet.
            </p>
          </div>
        </div>
      ) : (
        <TestRunsTable testRuns={testRuns} />
      )}
    </div>
  );
};

export default TestRunsTab;
