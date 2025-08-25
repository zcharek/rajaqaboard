// @ts-nocheck
import React, { useState, useEffect, lazy, Suspense } from "react";
import { fetchAllTestCases } from "../services/QATouchTestCasesAPI";
import { fetchAllTestRuns } from "../services/QATouchRealAPI";
import { TestCase } from "../types/TestCase";
import { TestRun } from "../context/QATouchContext";
import Tabs from "./Tabs";
import { Play, FileText, Zap, Database, Trello, Loader2 } from "lucide-react";

// Lazy loading des composants pour améliorer les performances
const AccesRapideTab = lazy(() => import("./tabs/AccesRapideTab"));
const TestRunsTab = lazy(() => import("./tabs/TestRunsTab"));
const TNRTab = lazy(() => import("./tabs/TNRTab"));
const ProductAPITab = lazy(() => import("./tabs/ProductAPITab"));
const JiraBoardsTab = lazy(() => import("./tabs/JiraBoardsTab"));

// Composant de fallback pour le chargement des onglets
const TabLoadingFallback = () => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
    <div className="text-center">
      <Loader2 className="h-12 w-12 text-orange-600 animate-spin mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Chargement de l'onglet...
      </h3>
      <p className="text-gray-600">Veuillez patienter pendant le chargement</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [testRuns, setTestRuns] = useState<TestRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(() => {
    // Récupérer l'onglet actif depuis le localStorage ou utiliser "acces-rapide" par défaut
    return localStorage.getItem("qaTouchActiveTab") || "acces-rapide";
  });

  // Charger automatiquement les données au montage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Charger les test runs (prioritaire)
      const testRunsData = await fetchAllTestRuns();
      setTestRuns(testRunsData);

      // Marquer que les test runs sont prêts
      setLoading(false);

      // 2. Charger les cas de tests en arrière-plan (plus long)
      try {
        const testCasesData = await fetchAllTestCases();
        setTestCases(testCasesData);
      } catch (testCasesError: any) {
        // Ne pas bloquer l'interface pour les cas de tests
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      // S'assurer que loading est false même en cas d'erreur
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadData();

    // Refresh des cas de tests en arrière-plan
    try {
      const testCasesData = await fetchAllTestCases();
      setTestCases(testCasesData);
    } catch (testCasesError: any) {
      // Gestion silencieuse des erreurs
    }
  };

  // Fonction pour gérer le changement d'onglet
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Sauvegarder l'onglet actif dans le localStorage
    localStorage.setItem("qaTouchActiveTab", tabId);
  };

  // Configuration des onglets - toujours disponible
  const tabs = [
    {
      id: "product-api",
      label: "Product API",
      icon: <Database className="h-5 w-5" />,
    },
    {
      id: "jira-boards",
      label: "SPRINTS",
      icon: <Trello className="h-5 w-5" />,
    },
    {
      id: "acces-rapide",
      label: "Accès rapide",
      icon: <Zap className="h-5 w-5" />,
    },
    {
      id: "test-runs",
      label: "Test Runs",
      icon: <Play className="h-5 w-5" />,
    },
    {
      id: "tnr",
      label: "TNR",
      icon: <FileText className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Onglets de navigation - toujours visibles */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Contenu des onglets avec Suspense pour le lazy loading */}
      {activeTab === "acces-rapide" && (
        <Suspense fallback={<TabLoadingFallback />}>
          <AccesRapideTab />
        </Suspense>
      )}

      {activeTab === "test-runs" && (
        <Suspense fallback={<TabLoadingFallback />}>
          <TestRunsTab
            testRuns={testRuns}
            testCases={testCases}
            loading={loading}
            error={error}
            refreshData={refreshData}
          />
        </Suspense>
      )}

      {activeTab === "jira-boards" && (
        <Suspense fallback={<TabLoadingFallback />}>
          <JiraBoardsTab />
        </Suspense>
      )}

      {activeTab === "product-api" && (
        <Suspense fallback={<TabLoadingFallback />}>
          <ProductAPITab />
        </Suspense>
      )}

      {activeTab === "tnr" && (
        <Suspense fallback={<TabLoadingFallback />}>
          <TNRTab />
        </Suspense>
      )}
    </div>
  );
};

export default Dashboard;
