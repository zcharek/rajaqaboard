// @ts-nocheck
import React, { useState, useEffect } from "react";
import { fetchAllTestCases } from "../services/QATouchTestCasesAPI";
import { fetchAllTestRuns } from "../services/QATouchRealAPI";
import { TestCase } from "../types/TestCase";
import { TestRun } from "../context/QATouchContext";

import Tabs from "./Tabs";
import AccesRapideTab from "./tabs/AccesRapideTab";
import TestRunsTab from "./tabs/TestRunsTab";
import TNRTab from "./tabs/TNRTab";
import ProductAPITab from "./tabs/ProductAPITab";

import { Play, FileText, Zap, Database } from "lucide-react";

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
      id: "product-api",
      label: "Product API",
      icon: <Database className="h-5 w-5" />,
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

      {/* Contenu des onglets */}
      {activeTab === "acces-rapide" && <AccesRapideTab />}

      {activeTab === "test-runs" && (
        <TestRunsTab
          testRuns={testRuns}
          testCases={testCases}
          loading={loading}
          error={error}
          refreshData={refreshData}
        />
      )}

      {activeTab === "product-api" && <ProductAPITab />}

      {activeTab === "tnr" && <TNRTab />}
    </div>
  );
};

export default Dashboard;
