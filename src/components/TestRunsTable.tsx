// @ts-nocheck
import React from "react";
import { TestRun } from "../context/QATouchContext";
import { AlertTriangle, Play } from "lucide-react";

interface TestRunsTableProps {
  testRuns: TestRun[];
}

function TestRunsTable({ testRuns }: TestRunsTableProps) {
  const getTestRunCard = (testRun: TestRun) => {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Header de la carte */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <img
              src={
                testRun.context === "JPG"
                  ? "/jpg.jpeg"
                  : testRun.context === "KALAMAZOO"
                  ? "/kalamazoo.png"
                  : testRun.context.startsWith("BERNARD")
                  ? "/bernard.jpeg"
                  : testRun.context === "MONDOFFICE"
                  ? "/mondoffice.png"
                  : testRun.context === "TEMPLATE"
                  ? "/smoke.jpg"
                  : "/raja.webp"
              }
              alt={testRun.context}
              className="w-8 h-8 rounded-full"
            />
            <h3 className="text-base font-semibold text-gray-900">
              {testRun.context}
            </h3>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="px-6 py-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4">
              {/* Tests Réussis */}
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {testRun.passedTests}
                </div>
                <div className="text-xs font-medium text-gray-600 uppercase">
                  Passed
                </div>
              </div>

              {/* Tests Échoués */}
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {testRun.failedTests}
                </div>
                <div className="text-xs font-medium text-gray-600 uppercase">
                  Failed
                </div>
              </div>

              {/* Tests Non testés */}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600 mb-1">
                  {testRun.notRunTests}
                </div>
                <div className="text-xs font-medium text-gray-600 uppercase">
                  UNTESTED
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Détails des tests */}
        <div className="px-6 py-4">
          <div className="space-y-3">
            {/* Tests Bloqués */}
            {testRun.blockedTests > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-orange-600">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Bloqués
                </span>
                <span className="font-semibold text-orange-600">
                  {testRun.blockedTests}
                </span>
              </div>
            )}

            {/* Tests à retester */}
            {testRun.retestTests > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-amber-600">
                  <Play className="h-4 w-4 mr-2" />À retester
                </span>
                <span className="font-semibold text-amber-600">
                  {testRun.retestTests}
                </span>
              </div>
            )}

            {/* Tests en cours */}
            {testRun.inProgressTests > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-blue-600">
                  <Play className="h-4 w-4 mr-2" />
                  En cours
                </span>
                <span className="font-semibold text-blue-600">
                  {testRun.inProgressTests}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer avec total des tests */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex justify-center">
            <div className="bg-gray-100 px-3 py-1 rounded-full">
              <span className="text-sm font-semibold text-gray-700">
                Total: {testRun.totalTests} tests
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête simplifié */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            📋 Détail des Test Runs
          </h3>
          <p className="text-gray-600">
            Vue en cartes de tous les test runs avec leurs métriques
          </p>
        </div>
      </div>

      {/* Grille de cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {testRuns
          .sort((a, b) => {
            // Ordre spécifique pour la première ligne
            const order = {
              JPG: 1,
              "BERNARD FR": 2,
              "BERNARD BE": 3,
              KALAMAZOO: 4,
              MONDOFFICE: 5,
            };

            const orderA =
              order[a.context] || (a.context === "TEMPLATE" ? 9999 : 100);
            const orderB =
              order[b.context] || (b.context === "TEMPLATE" ? 9999 : 100);

            // Si les deux ont la même priorité (100), trier par ordre alphabétique
            if (orderA === 100 && orderB === 100) {
              return a.context.localeCompare(b.context);
            }

            return orderA - orderB;
          })
          .map((testRun) => (
            <div key={testRun.testRunId}>{getTestRunCard(testRun)}</div>
          ))}
      </div>
    </div>
  );
}

export default TestRunsTable;
